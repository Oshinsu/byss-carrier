-- ═══════════════════════════════════════════════════════
-- MARCHÉS PUBLICS — Full pipeline tracking
-- BYSS GROUP tender lifecycle: detect → analyze → bid → win
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS marches_publics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boamp_id TEXT,
  title TEXT NOT NULL,
  acheteur TEXT,
  nature TEXT,
  date_publication TIMESTAMPTZ,
  date_limite TIMESTAMPTZ,
  cpv_codes TEXT[],
  description TEXT,
  url_source TEXT,
  platform TEXT DEFAULT 'boamp',

  -- BYSS tracking
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'analyzing', 'go', 'no_go', 'drafting', 'submitted', 'won', 'lost')),
  relevance_score INT DEFAULT 0,
  ai_analysis TEXT,
  go_no_go TEXT,
  assigned_to TEXT,

  -- Linked entities
  prospect_id UUID REFERENCES prospects(id),
  invoice_id UUID REFERENCES invoices(id),

  -- Budget
  budget_estimated DECIMAL(12,2),
  budget_proposed DECIMAL(12,2),

  -- Documents
  memoire_technique TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_marches_status ON marches_publics(status);
CREATE INDEX idx_marches_deadline ON marches_publics(date_limite DESC);
CREATE INDEX idx_marches_score ON marches_publics(relevance_score DESC);
