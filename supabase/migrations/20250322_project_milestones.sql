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
