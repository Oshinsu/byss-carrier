-- ============================================
-- BYSS EMPIRE — Migration 005
-- Feedback Timeline + Document Tracking
-- ============================================
-- Feedback timeline: post-delivery NPS tracking (J+1 to J+90)
-- Documents: proposal/contract/invoice tracking with Documenso + Papermark
-- ============================================

-- Feedback timeline for post-delivery tracking
CREATE TABLE IF NOT EXISTS feedback_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  step TEXT NOT NULL CHECK (step IN ('j1','j7','j14','j30','j60','j90')),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  nps_score INTEGER CHECK (nps_score BETWEEN 0 AND 10),
  notes TEXT,
  delivery_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document tracking (proposals, contracts, invoices, reports)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id),
  type TEXT CHECK (type IN ('proposal','invoice','contract','report')),
  title TEXT NOT NULL,
  url TEXT,
  tracking_url TEXT,
  views INTEGER DEFAULT 0,
  avg_read_time INTEGER DEFAULT 0,
  signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_feedback_prospect ON feedback_timeline(prospect_id);
CREATE INDEX idx_feedback_step ON feedback_timeline(step);
CREATE INDEX idx_documents_prospect ON documents(prospect_id);
CREATE INDEX idx_documents_type ON documents(type);

-- Enable Row Level Security
ALTER TABLE feedback_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies — admin-only access
CREATE POLICY admin_all_feedback ON feedback_timeline
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY admin_all_documents ON documents
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
