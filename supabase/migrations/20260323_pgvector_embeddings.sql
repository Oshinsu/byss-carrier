-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  content_hash TEXT NOT NULL,
  content_preview TEXT,
  embedding vector(1536) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_table, source_id, content_hash)
);

CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_embeddings_source ON embeddings(source_table);

-- Semantic search function
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  filter_table TEXT DEFAULT NULL,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  source_table TEXT,
  source_id UUID,
  content_preview TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.source_table, e.source_id, e.content_preview, e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  WHERE (filter_table IS NULL OR e.source_table = filter_table)
    AND 1 - (e.embedding <=> query_embedding) > similarity_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
