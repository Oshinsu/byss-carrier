-- ═══════════════════════════════════════════════════════
-- CALENDAR EVENTS TABLE
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time_start TIME,
  time_end TIME,
  type TEXT DEFAULT 'event' CHECK (type IN ('event', 'rdv', 'relance', 'deadline', 'production', 'meeting')),
  color TEXT DEFAULT '#00B4D8',
  prospect_id UUID REFERENCES prospects(id),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cal_date ON calendar_events(date);
CREATE INDEX idx_cal_type ON calendar_events(type);
CREATE INDEX idx_cal_prospect ON calendar_events(prospect_id) WHERE prospect_id IS NOT NULL;
