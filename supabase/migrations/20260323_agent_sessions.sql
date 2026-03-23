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
