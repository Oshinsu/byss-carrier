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
