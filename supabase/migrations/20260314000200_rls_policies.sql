-- ═══════════════════════════════════════════════════════
-- BYSS GROUP — Row Level Security Policies
-- Only gary@byssgroup.fr has access to everything
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE intel_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lore_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE eveil_mesures ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is Gary
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'gary@byssgroup.fr'
    OR auth.role() = 'service_role'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin has full CRUD on all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'prospects','interactions','invoices','projects','videos',
    'activities','ai_conversations','intel_entities','trades',
    'prompts','lore_entries','eveil_mesures','api_keys','agent_logs'
  ])
  LOOP
    EXECUTE format('CREATE POLICY admin_all_%s ON %I FOR ALL USING (is_admin()) WITH CHECK (is_admin())', tbl, tbl);
  END LOOP;
END;
$$;

-- Public read on projects (for landing page)
CREATE POLICY public_read_projects ON projects
  FOR SELECT USING (is_public = true AND is_visible = true);

-- Public read on lore (Cadifor public pages)
CREATE POLICY public_read_lore ON lore_entries
  FOR SELECT USING (universe IN ('cadifor','jurassic_wars'));

-- Public read on eveil_mesures
CREATE POLICY public_read_mesures ON eveil_mesures
  FOR SELECT USING (true);
