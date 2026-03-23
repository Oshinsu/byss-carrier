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
