-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  content_hash TEXT NOT NULL,
  content_preview TEXT,
  embedding vector(1536) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_table, source_id, content_hash)
);

CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_embeddings_source ON embeddings(source_table);

-- Semantic search function
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  filter_table TEXT DEFAULT NULL,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  source_table TEXT,
  source_id UUID,
  content_preview TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.source_table, e.source_id, e.content_preview, e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  WHERE (filter_table IS NULL OR e.source_table = filter_table)
    AND 1 - (e.embedding <=> query_embedding) > similarity_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
-- ═══════════════════════════════════════════════════════
-- PHASE 2C: Agent Costs Aggregation View
-- Rollup of agent_logs by agent + day for dashboard KPIs
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE VIEW agent_costs AS
SELECT
  agent_name,
  COUNT(*) as total_calls,
  SUM(cost_usd) as total_cost,
  SUM(input_tokens) as total_input,
  SUM(output_tokens) as total_output,
  AVG(duration_ms) as avg_latency,
  COUNT(*) FILTER (WHERE success = true)::float / NULLIF(COUNT(*), 0) as success_rate,
  date_trunc('day', created_at) as day
FROM agent_logs
GROUP BY agent_name, date_trunc('day', created_at);
-- ═══════════════════════════════════════════════════════
-- PHASE 3A: Agent Session Persistence
-- Stores conversation state per agent + user for continuity
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'gary',
  state_json JSONB NOT NULL DEFAULT '{}',
  checkpoint_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '24 hours',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_agent_user ON agent_sessions(agent_name, user_id);
-- ═══════════════════════════════════════════════════════
-- PHASE 4A: Human-in-the-Loop Pending Actions
-- Gates for sensitive agent actions requiring approval
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pending_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  description TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  approved_by TEXT,
  decided_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT now() + interval '48 hours',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pending_status ON pending_actions(status);

-- Enable realtime for instant approve/reject feedback
ALTER PUBLICATION supabase_realtime ADD TABLE pending_actions;
-- ═══════════════════════════════════════════════════════
-- MEDALLION DATA ARCHITECTURE — Phase 6
-- Processed layer: materialized views + insights table
-- ═══════════════════════════════════════════════════════

-- Prospect Scores (processed layer)
CREATE MATERIALIZED VIEW IF NOT EXISTS prospect_scores AS
SELECT
  p.id, p.name, p.sector, p.phase,
  p.estimated_basket,
  p.probability,
  COALESCE(p.estimated_basket * p.probability / 100, 0) AS weighted_value,
  p.mrr,
  COUNT(i.id) AS interaction_count,
  MAX(i.created_at) AS last_interaction,
  EXTRACT(DAY FROM now() - COALESCE(MAX(i.created_at), p.created_at)) AS days_since_contact,
  CASE
    WHEN EXTRACT(DAY FROM now() - COALESCE(MAX(i.created_at), p.created_at)) > 14 THEN 'stale'
    WHEN EXTRACT(DAY FROM now() - COALESCE(MAX(i.created_at), p.created_at)) > 7 THEN 'cooling'
    ELSE 'active'
  END AS engagement_status
FROM prospects p
LEFT JOIN interactions i ON i.prospect_id = p.id
WHERE p.phase NOT IN ('perdu', 'inactif')
GROUP BY p.id;

-- Revenue Projections (processed layer)
CREATE MATERIALIZED VIEW IF NOT EXISTS revenue_projections AS
SELECT
  date_trunc('month', issue_date::date) AS month,
  SUM(CASE WHEN status = 'paid' THEN amount_ht ELSE 0 END) AS revenue_ht,
  SUM(CASE WHEN status IN ('sent', 'overdue') THEN amount_ht ELSE 0 END) AS pending_ht,
  SUM(amount_ht) AS total_ht,
  COUNT(*) AS invoice_count
FROM invoices
GROUP BY date_trunc('month', issue_date::date);

-- Insights table (insights layer)
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  agent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(type);
CREATE INDEX IF NOT EXISTS idx_insights_created ON insights(created_at DESC);
