-- ═══════════════════════════════════════════════════════
-- Supabase Realtime — Enable on key tables
-- Tables: prospects, invoices, gulf_positions,
--         calendar_events, agent_sessions, insights
-- ═══════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE prospects;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE gulf_positions;
ALTER PUBLICATION supabase_realtime ADD TABLE calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE insights;
