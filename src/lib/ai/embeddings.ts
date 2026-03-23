import { createClient } from "@/lib/supabase/client";
import crypto from "crypto";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;

// Use OpenAI for embeddings (cheaper: $0.02/M tokens vs $0.10 for Anthropic)
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("No embedding API key configured");

  // Use OpenRouter if no direct OpenAI key
  const baseUrl = process.env.OPENAI_API_KEY
    ? "https://api.openai.com/v1"
    : "https://openrouter.ai/api/v1";

  const res = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text.slice(0, 8000) }),
  });

  if (!res.ok) throw new Error(`Embedding API error: ${res.status}`);
  const data = await res.json();
  return data.data[0].embedding;
}

export function contentHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 32);
}

export async function upsertEmbedding(
  sourceTable: string, sourceId: string, content: string, metadata?: Record<string, unknown>
) {
  const hash = contentHash(content);
  const embedding = await generateEmbedding(content);
  const supabase = createClient();

  const { error } = await supabase.from("embeddings").upsert({
    source_table: sourceTable,
    source_id: sourceId,
    content_hash: hash,
    content_preview: content.slice(0, 200),
    embedding: JSON.stringify(embedding), // Supabase expects string for vector
    metadata: metadata || {},
  }, { onConflict: "source_table,source_id,content_hash" });

  if (error) console.error("Embedding upsert error:", error.message);
  return !error;
}

export interface SearchResult {
  id: string;
  sourceTable: string;
  sourceId: string;
  contentPreview: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

export async function semanticSearch(
  query: string,
  options?: { sourceTable?: string; limit?: number; threshold?: number }
): Promise<SearchResult[]> {
  const embedding = await generateEmbedding(query);
  const supabase = createClient();

  const { data, error } = await supabase.rpc("match_embeddings", {
    query_embedding: JSON.stringify(embedding),
    match_count: options?.limit || 5,
    filter_table: options?.sourceTable || null,
    similarity_threshold: options?.threshold || 0.7,
  });

  if (error) { console.error("Semantic search error:", error.message); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    sourceTable: r.source_table,
    sourceId: r.source_id,
    contentPreview: r.content_preview,
    metadata: r.metadata,
    similarity: r.similarity,
  }));
}

export async function indexTable(
  tableName: string,
  contentExtractor: (row: any) => string,
  metadataExtractor?: (row: any) => Record<string, unknown>
) {
  const supabase = createClient();
  const { data, error } = await supabase.from(tableName).select("*");
  if (error || !data) { console.error("Index error:", error?.message); return 0; }

  let indexed = 0;
  for (const row of data) {
    const content = contentExtractor(row);
    if (!content || content.length < 10) continue;
    const metadata = metadataExtractor?.(row) || {};
    const ok = await upsertEmbedding(tableName, row.id, content, metadata);
    if (ok) indexed++;
    // Rate limit: 60ms between calls
    await new Promise(r => setTimeout(r, 60));
  }
  return indexed;
}
