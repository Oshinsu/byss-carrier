import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Seed Embeddings (pgvector RAG Pipeline)
// Indexes: lore_entries, intel_entities, prospects
// Uses OpenRouter text-embedding-3-small
// ═══════════════════════════════════════════════════════

// Load env
const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const EMBEDDING_MODEL = "text-embedding-3-small";
const API_KEY = env.OPENAI_API_KEY || env.OPENROUTER_API_KEY;
const BASE_URL = env.OPENAI_API_KEY
  ? "https://api.openai.com/v1"
  : "https://openrouter.ai/api/v1";

if (!API_KEY) {
  console.error("No OPENAI_API_KEY or OPENROUTER_API_KEY found in .env.local");
  process.exit(1);
}

async function generateEmbedding(text) {
  const res = await fetch(`${BASE_URL}/embeddings`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text.slice(0, 8000) }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.data[0].embedding;
}

function contentHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 32);
}

async function upsertEmbedding(sourceTable, sourceId, content, metadata = {}) {
  const hash = contentHash(content);
  const embedding = await generateEmbedding(content);

  const { error } = await supabase.from("embeddings").upsert({
    source_table: sourceTable,
    source_id: sourceId,
    content_hash: hash,
    content_preview: content.slice(0, 200),
    embedding: JSON.stringify(embedding),
    metadata,
  }, { onConflict: "source_table,source_id,content_hash" });

  if (error) {
    console.error(`  [ERROR] ${sourceTable}/${sourceId}: ${error.message}`);
    return false;
  }
  return true;
}

async function indexTable(tableName, contentExtractor, metadataExtractor) {
  console.log(`\n--- Indexing ${tableName} ---`);
  const { data, error } = await supabase.from(tableName).select("*");
  if (error || !data) {
    console.error(`  Failed to fetch ${tableName}: ${error?.message}`);
    return 0;
  }
  console.log(`  Found ${data.length} rows`);

  let indexed = 0;
  let skipped = 0;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const content = contentExtractor(row);
    if (!content || content.length < 10) {
      skipped++;
      continue;
    }
    const metadata = metadataExtractor ? metadataExtractor(row) : {};
    const ok = await upsertEmbedding(tableName, row.id, content, metadata);
    if (ok) indexed++;
    // Progress
    if ((i + 1) % 10 === 0 || i === data.length - 1) {
      process.stdout.write(`\r  Progress: ${i + 1}/${data.length} (indexed: ${indexed}, skipped: ${skipped})`);
    }
    // Rate limit: 80ms between calls
    await new Promise(r => setTimeout(r, 80));
  }
  console.log(`\n  Done: ${indexed} indexed, ${skipped} skipped`);
  return indexed;
}

// ── Main ──

async function main() {
  console.log("BYSS CARRIER — Embedding Seeder");
  console.log(`API: ${env.OPENAI_API_KEY ? "OpenAI direct" : "OpenRouter"}`);
  console.log(`Model: ${EMBEDDING_MODEL}`);

  let total = 0;

  // 1. lore_entries: title + " — " + content
  total += await indexTable(
    "lore_entries",
    (row) => `${row.title || ""} — ${row.content || ""}`,
    (row) => ({ universe: row.universe, category: row.category }),
  );

  // 2. intel_entities: name + " — " + description + " " + (notes || "")
  total += await indexTable(
    "intel_entities",
    (row) => `${row.name || ""} — ${row.description || ""} ${row.notes || ""}`.trim(),
    (row) => ({ type: row.type, sector: row.sector, commune: row.commune }),
  );

  // 3. prospects: name + " — " + sector + " — " + pain_points + " " + notes
  total += await indexTable(
    "prospects",
    (row) => `${row.name || ""} — ${row.sector || ""} — ${row.pain_points || ""} ${row.notes || ""}`.trim(),
    (row) => ({ phase: row.phase, sector: row.sector, ai_score: row.ai_score }),
  );

  console.log(`\n=== TOTAL: ${total} embeddings indexed ===`);
}

main().catch(console.error);
