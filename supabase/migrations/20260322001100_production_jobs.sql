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
