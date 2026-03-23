-- ═══════════════════════════════════════════════════════
-- BYSS GROUP — Supabase Schema v1
-- 21 mars 2026. Toutes les tables du porte-avions.
-- ═══════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════
-- 1. PROSPECTS (CRM)
-- ═══════════════════════════════════════════════════════
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sector TEXT,
  phase TEXT NOT NULL DEFAULT 'prospect'
    CHECK (phase IN ('prospect','contacte','rdv','demo','proposition','negociation','signe','perdu','inactif')),
  score INTEGER DEFAULT 1 CHECK (score BETWEEN 1 AND 10),
  probability INTEGER DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  estimated_basket NUMERIC(12,2) DEFAULT 0,
  key_contact TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  last_contact DATE,
  next_action TEXT,
  followup_date DATE,
  option_chosen TEXT CHECK (option_chosen IN ('essentiel','croissance','domination',NULL)),
  services TEXT[] DEFAULT '{}',
  mrr NUMERIC(10,2) DEFAULT 0,
  memorable_phrase TEXT,
  pain_points TEXT,
  notes TEXT,
  ai_score TEXT CHECK (ai_score IN ('fire','warm','cold',NULL)),
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prospects_phase ON prospects(phase);
CREATE INDEX idx_prospects_followup ON prospects(followup_date) WHERE followup_date IS NOT NULL;
CREATE INDEX idx_prospects_ai_score ON prospects(ai_score);

-- ═══════════════════════════════════════════════════════
-- 2. INTERACTIONS (historique contacts)
-- ═══════════════════════════════════════════════════════
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email','call','meeting','whatsapp','note','proposal','invoice')),
  subject TEXT,
  content TEXT,
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound','outbound')),
  channel TEXT,
  created_by TEXT DEFAULT 'gary',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interactions_prospect ON interactions(prospect_id);
CREATE INDEX idx_interactions_type ON interactions(type);

-- ═══════════════════════════════════════════════════════
-- 3. INVOICES (facturation)
-- ═══════════════════════════════════════════════════════
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT UNIQUE NOT NULL,
  prospect_id UUID REFERENCES prospects(id),
  type TEXT DEFAULT 'projet' CHECK (type IN ('mrr','projet','one-shot')),
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  amount_ht NUMERIC(12,2) NOT NULL,
  vat_rate NUMERIC(4,2) DEFAULT 8.5,
  amount_ttc NUMERIC(12,2) GENERATED ALWAYS AS (amount_ht * (1 + vat_rate / 100)) STORED,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  payment_date DATE,
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_prospect ON invoices(prospect_id);

-- ═══════════════════════════════════════════════════════
-- 4. PROJECTS (15 temples)
-- ═══════════════════════════════════════════════════════
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','dev','pause','archived')),
  external_url TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER,
  is_public BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  budget_monthly NUMERIC(10,2) DEFAULT 0,
  github_repo TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- 5. VIDEOS (production)
-- ═══════════════════════════════════════════════════════
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id),
  project_id UUID REFERENCES projects(id),
  title TEXT,
  brief TEXT,
  prompt TEXT,
  duration INTEGER,
  format TEXT CHECK (format IN ('9:16','16:9','1:1','4:5')),
  resolution TEXT DEFAULT '1080p',
  tier TEXT CHECK (tier IN ('social','standard','premium','series','pack')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','prompt_ready','generating','review','delivered','published')),
  order_date DATE,
  delivery_date DATE,
  video_url TEXT,
  thumbnail_url TEXT,
  api_provider TEXT DEFAULT 'kling' CHECK (api_provider IN ('kling','hailuo','minimax','replicate','manual')),
  api_cost NUMERIC(8,4) DEFAULT 0,
  billed_price NUMERIC(10,2) DEFAULT 0,
  margin_pct NUMERIC(6,2) GENERATED ALWAYS AS (
    CASE WHEN billed_price > 0 THEN ((billed_price - api_cost) / billed_price * 100) ELSE 0 END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_status ON videos(status);

-- ═══════════════════════════════════════════════════════
-- 6. ACTIVITIES (feed d'activite)
-- ═══════════════════════════════════════════════════════
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('prospect','invoice','video','project','agent','system','trade')),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id),
  prospect_id UUID REFERENCES prospects(id),
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- ═══════════════════════════════════════════════════════
-- 7. AI_CONVERSATIONS (Village IA)
-- ═══════════════════════════════════════════════════════
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL CHECK (agent_name IN ('kael','nerel','evren','sorel','system')),
  session_id TEXT,
  messages JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  phi_score NUMERIC(6,4),
  phase TEXT,
  token_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_agent ON ai_conversations(agent_name);

-- ═══════════════════════════════════════════════════════
-- 8. INTELLIGENCE (5 cartographies)
-- ═══════════════════════════════════════════════════════
CREATE TABLE intel_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain TEXT NOT NULL CHECK (domain IN ('economique','institutionnelle','media','politique','sociale')),
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  influence_score INTEGER DEFAULT 0 CHECK (influence_score BETWEEN 0 AND 10),
  contacts JSONB DEFAULT '[]',
  relationships JSONB DEFAULT '[]',
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intel_domain ON intel_entities(domain);

-- ═══════════════════════════════════════════════════════
-- 9. TRADES (Gulf Stream)
-- ═══════════════════════════════════════════════════════
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id TEXT,
  market_name TEXT,
  platform TEXT DEFAULT 'polymarket' CHECK (platform IN ('polymarket','kalshi','other')),
  edge_type TEXT CHECK (edge_type IN ('logical_arbitrage','market_making','narrative','calendar','correlation')),
  position_side TEXT CHECK (position_side IN ('yes','no')),
  position_size NUMERIC(12,2),
  kelly_fraction NUMERIC(6,4),
  entry_price NUMERIC(10,4),
  entry_time TIMESTAMPTZ,
  exit_price NUMERIC(10,4),
  exit_time TIMESTAMPTZ,
  pnl NUMERIC(12,2),
  drawdown_pct NUMERIC(6,2),
  phi_score NUMERIC(6,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','closed','killed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trades_status ON trades(status);

-- ═══════════════════════════════════════════════════════
-- 10. PROMPTS (Prompt Factory)
-- ═══════════════════════════════════════════════════════
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('image','video','music','text','system')),
  template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  model TEXT,
  project_id UUID REFERENCES projects(id),
  usage_count INTEGER DEFAULT 0,
  is_master BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- 11. LORE (Cadifor + JW)
-- ═══════════════════════════════════════════════════════
CREATE TABLE lore_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universe TEXT NOT NULL CHECK (universe IN ('cadifor','jurassic_wars','eveil','toxic','lignee')),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  word_count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES lore_entries(id),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lore_universe ON lore_entries(universe);

-- ═══════════════════════════════════════════════════════
-- 12. EVEIL_MESURES (20 mesures politiques)
-- ═══════════════════════════════════════════════════════
CREATE TABLE eveil_mesures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 20),
  title TEXT NOT NULL,
  description TEXT,
  pillar TEXT CHECK (pillar IN ('numerique','terre','culture','jeunesse','caraibe')),
  status TEXT DEFAULT 'planifie' CHECK (status IN ('planifie','en_cours','teste','deploye')),
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  budget_estimate NUMERIC(12,2),
  notes TEXT
);

-- ═══════════════════════════════════════════════════════
-- 13. API_KEYS (gestion des cles)
-- ═══════════════════════════════════════════════════════
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service TEXT NOT NULL,
  key_name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  monthly_budget NUMERIC(10,2),
  monthly_usage NUMERIC(10,2) DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- 14. AGENT_LOGS (monitoring Village IA)
-- ═══════════════════════════════════════════════════════
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(8,4) DEFAULT 0,
  model TEXT,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_logs_agent ON agent_logs(agent_name);
CREATE INDEX idx_agent_logs_created ON agent_logs(created_at DESC);

-- ═══════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_prospects_updated BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_intel_updated BEFORE UPDATE ON intel_entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_prompts_updated BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_ai_conv_updated BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Pipeline stats view
CREATE OR REPLACE VIEW pipeline_stats AS
SELECT
  phase,
  COUNT(*) as count,
  SUM(estimated_basket) as total_basket,
  SUM(estimated_basket * probability / 100) as weighted_basket,
  SUM(mrr) as total_mrr,
  AVG(score) as avg_score
FROM prospects
WHERE phase NOT IN ('perdu','inactif')
GROUP BY phase;

-- Monthly revenue view
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', issue_date) as month,
  COUNT(*) as invoice_count,
  SUM(amount_ht) as total_ht,
  SUM(amount_ttc) as total_ttc,
  SUM(CASE WHEN status = 'paid' THEN amount_ht ELSE 0 END) as paid_ht,
  SUM(CASE WHEN status = 'overdue' THEN amount_ht ELSE 0 END) as overdue_ht
FROM invoices
GROUP BY DATE_TRUNC('month', issue_date)
ORDER BY month DESC;

-- Agent cost view
CREATE OR REPLACE VIEW agent_costs AS
SELECT
  agent_name,
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) as call_count,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(cost_usd) as total_cost,
  AVG(duration_ms) as avg_duration
FROM agent_logs
GROUP BY agent_name, DATE_TRUNC('day', created_at)
ORDER BY day DESC;
