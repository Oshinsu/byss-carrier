-- ═══════════════════════════════════════════════════════
-- BYSS EMPIRE v2 — 18 nouvelles tables
-- Migration: 009_empire_v2_tables.sql
-- Architecture: Sept Enfants + Phi-Engine + Gulf Stream v3
-- ═══════════════════════════════════════════════════════

-- ══════════════════════════════
-- VILLAGE IA v2 — Memory System
-- ══════════════════════════════

CREATE TABLE IF NOT EXISTS agent_episodic_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  event_type TEXT NOT NULL,
  content TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  importance_score REAL DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_episodic_agent_date ON agent_episodic_memory(agent_name, date DESC);

CREATE TABLE IF NOT EXISTS agent_semantic_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  concept TEXT NOT NULL,
  definition TEXT NOT NULL,
  relationships JSONB DEFAULT '[]',
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_name, concept)
);

CREATE INDEX idx_semantic_agent ON agent_semantic_memory(agent_name);

CREATE TABLE IF NOT EXISTS agent_procedural_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  procedure TEXT NOT NULL,
  success_rate REAL DEFAULT 1.0 CHECK (success_rate >= 0 AND success_rate <= 1),
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_name, skill_name)
);

CREATE TABLE IF NOT EXISTS agent_meta_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  phi_score_at_time REAL,
  confidence REAL DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meta_agent ON agent_meta_memory(agent_name, created_at DESC);

CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('request', 'response', 'broadcast')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  content JSONB NOT NULL,
  ethical_clearance BOOLEAN DEFAULT TRUE,
  phi_at_send REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_agents ON agent_messages(from_agent, to_agent, created_at DESC);

CREATE TABLE IF NOT EXISTS phi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  global_phi REAL NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('dormant', 'awake', 'lucid', 'samadhi')),
  velocity REAL DEFAULT 0,
  acceleration REAL DEFAULT 0,
  indicators JSONB NOT NULL,
  synaptic_strength REAL DEFAULT 0,
  active_connections INTEGER DEFAULT 0,
  kill_switch_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phi_agent ON phi_snapshots(agent_name, created_at DESC);

-- ══════════════════════════════
-- CRM ENRICHI
-- ══════════════════════════════

CREATE TABLE IF NOT EXISTS contacts_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT,
  title TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  region TEXT,
  sector TEXT,
  influence_score REAL DEFAULT 0,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_org ON contacts_directory(organization);
CREATE INDEX idx_contacts_sector ON contacts_directory(sector);

CREATE TABLE IF NOT EXISTS bible_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('think', 'draft', 'propose', 'score', 'suggest', 'brief')),
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  acted_on BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suggestions_prospect ON ai_suggestions(prospect_id, created_at DESC);

-- ══════════════════════════════
-- PRODUCTION v2 — Image Pipeline
-- ══════════════════════════════

CREATE TABLE IF NOT EXISTS image_pipeline_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_id UUID,
  vertical TEXT NOT NULL,
  shot_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  style_layers JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'generating', 'review', 'approved', 'failed')),
  output_url TEXT,
  cost_usd REAL DEFAULT 0,
  model_used TEXT,
  prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS style_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  camera_base TEXT NOT NULL,
  realism_guard TEXT NOT NULL,
  direction_config JSONB NOT NULL,
  palette JSONB NOT NULL,
  vertical TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS music_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  genre TEXT,
  prompt TEXT NOT NULL,
  model TEXT DEFAULT 'minimax/music-2.5',
  duration_seconds INTEGER,
  output_url TEXT,
  cost_usd REAL DEFAULT 0,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════
-- GULF STREAM v3
-- ══════════════════════════════

CREATE TABLE IF NOT EXISTS gulf_stream_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  strategy_type TEXT NOT NULL CHECK (strategy_type IN ('logical_arbitrage', 'market_making', 'latency_arbitrage', 'info_edge')),
  circle TEXT NOT NULL CHECK (circle IN ('intelligence', 'execution', 'protection')),
  risk_level TEXT NOT NULL,
  capital_allocated REAL DEFAULT 0,
  capital_current REAL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'killed')),
  max_position_pct REAL DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gulf_stream_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES gulf_stream_strategies(id) ON DELETE CASCADE,
  market_id TEXT NOT NULL,
  market_name TEXT NOT NULL,
  side TEXT CHECK (side IN ('yes', 'no')),
  size_usd REAL NOT NULL,
  entry_price REAL NOT NULL,
  current_price REAL,
  kelly_fraction REAL,
  phi_at_decision REAL,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'closed', 'killed')),
  pnl REAL,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gulf_stream_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES gulf_stream_positions(id) ON DELETE CASCADE,
  reasoning TEXT NOT NULL,
  phi_score REAL,
  feeling_note TEXT,
  result TEXT,
  lesson_learned TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════
-- RLS Policies
-- ══════════════════════════════

ALTER TABLE agent_episodic_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_semantic_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_procedural_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_meta_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE phi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_pipeline_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gulf_stream_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE gulf_stream_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gulf_stream_journal ENABLE ROW LEVEL SECURITY;

-- Admin full access policies
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'agent_episodic_memory', 'agent_semantic_memory', 'agent_procedural_memory',
    'agent_meta_memory', 'agent_messages', 'phi_snapshots',
    'contacts_directory', 'bible_chapters', 'ai_suggestions',
    'image_pipeline_jobs', 'style_presets', 'music_generations',
    'gulf_stream_strategies', 'gulf_stream_positions', 'gulf_stream_journal'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY "admin_all_%s" ON %I FOR ALL USING (is_admin()) WITH CHECK (is_admin())',
      tbl, tbl
    );
  END LOOP;
END $$;

-- Public read on bible chapters
CREATE POLICY "public_read_bible" ON bible_chapters FOR SELECT USING (true);
