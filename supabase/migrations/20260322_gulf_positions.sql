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
