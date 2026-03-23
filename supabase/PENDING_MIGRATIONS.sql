-- BYSS CARRIER — Combined Pending Migrations
-- Run in Supabase SQL Editor

-- ========== 20250322_project_milestones.sql ==========
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug TEXT NOT NULL,
  milestone_id TEXT NOT NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'done')),
  progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_slug, milestone_id)
);

CREATE INDEX idx_pm_slug ON project_milestones(project_slug);


-- ========== 20260322001100_production_jobs.sql ==========
-- Production pipeline jobs: image & music generation tracking
-- localStorage is the current persistence layer; these tables are the future Supabase backend.

CREATE TABLE IF NOT EXISTS image_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  style TEXT,
  vertical TEXT,
  shot_type TEXT,
  status TEXT DEFAULT 'prompt_copied' CHECK (status IN ('prompt_copied', 'generating', 'generated', 'approved', 'rejected')),
  result_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS music_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  genre TEXT,
  provider TEXT DEFAULT 'minimax',
  status TEXT DEFAULT 'prompt_copied' CHECK (status IN ('prompt_copied', 'generating', 'generated', 'approved', 'published')),
  result_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);


-- ========== 20260322_notifications.sql ==========
-- ═══════════════════════════════════════════════════════
-- BYSS GROUP — Notifications System
-- Types: prospect, invoice, system, agent, alert, reminder
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('prospect', 'invoice', 'system', 'agent', 'alert', 'reminder')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_notif_read ON notifications(read);
CREATE INDEX idx_notif_created ON notifications(created_at DESC);

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;


-- ========== 20260322_calendar_events.sql ==========
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


-- ========== 20260322_gulf_positions.sql ==========
-- ═══════════════════════════════════════════════════════
-- GULF STREAM — Positions Tracking Table
-- Tracks all prediction market positions for P&L
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS gulf_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id TEXT,
  market_title TEXT NOT NULL,
  side TEXT CHECK (side IN ('yes', 'no')),
  entry_price DECIMAL(10,4),
  current_price DECIMAL(10,4),
  size_usd DECIMAL(10,2),
  pnl DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_gulf_positions_status ON gulf_positions(status);
CREATE INDEX IF NOT EXISTS idx_gulf_positions_created ON gulf_positions(created_at DESC);

-- RLS
ALTER TABLE gulf_positions ENABLE ROW LEVEL SECURITY;

-- Allow all for authenticated users (single-tenant admin app)
CREATE POLICY "gulf_positions_all" ON gulf_positions
  FOR ALL USING (true) WITH CHECK (true);


