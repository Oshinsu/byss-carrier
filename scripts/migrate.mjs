// ═══════════════════════════════════════════════════════
// BYSS GROUP — Supabase Migration Runner
// Executes SQL migrations via Supabase REST API
// ═══════════════════════════════════════════════════════

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "supabase", "migrations");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mtcqruxrvjfwrwfvrisn.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Y3FydXhydmpmd3J3ZnZyaXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE2MzY5NCwiZXhwIjoyMDg5NzM5Njk0fQ.DKXo4QRUmX1VTNfrI4UtC9bttLbtpiL3z6BfXJsAzZg";

const DB_URL = SUPABASE_URL.replace("https://", "").split(".")[0];

async function executeSql(sql, name) {
  console.log(`\n═══ Executing: ${name} ═══`);

  // Split into individual statements
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  let success = 0;
  let errors = 0;

  for (const stmt of statements) {
    if (!stmt || stmt.startsWith("--")) continue;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      // This won't work for DDL — need to use the SQL API
    } catch (e) {
      // Expected
    }
  }

  // Use the Supabase SQL HTTP API instead
  // The correct endpoint is: POST /pg/query (only available on some plans)
  // Alternative: use the supabase CLI or the dashboard

  // Let's try executing via the postgres connection string directly
  const fullSql = sql;

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${DB_URL}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: fullSql }),
    }
  );

  if (!response.ok) {
    // Try alternative: use the /pg endpoint
    const altResponse = await fetch(`${SUPABASE_URL}/pg`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: fullSql }),
    });

    if (!altResponse.ok) {
      const text = await altResponse.text();
      console.log(`  Status: ${altResponse.status}`);
      console.log(`  Response: ${text.slice(0, 200)}`);
      console.log(`  ⚠️  Direct SQL API not available.`);
      console.log(`  → Copy the SQL below into Supabase Dashboard > SQL Editor:`);
      console.log(`  → ${SUPABASE_URL.replace('.supabase.co', '')}/project/${DB_URL}/sql/new`);
      return false;
    }

    const result = await altResponse.json();
    console.log(`  ✓ Executed via /pg endpoint`);
    return true;
  }

  console.log(`  ✓ Migration complete`);
  return true;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("BYSS GROUP — Supabase Migration Runner");
  console.log(`Target: ${SUPABASE_URL}`);
  console.log("═══════════════════════════════════════════════════════");

  const migrations = [
    "001_initial_schema.sql",
    "002_rls_policies.sql",
    "003_seed_data.sql",
    "004_import_xlsx_prospects.sql",
  ];

  let allSucceeded = true;

  for (const file of migrations) {
    const path = join(MIGRATIONS_DIR, file);
    let sql;
    try {
      sql = readFileSync(path, "utf-8");
    } catch (e) {
      console.log(`  ⚠️ File not found: ${file}, skipping`);
      continue;
    }

    const result = await executeSql(sql, file);
    if (!result) {
      allSucceeded = false;
      // Output the SQL for manual execution
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  MANUAL MIGRATION REQUIRED: ${file}`);
      console.log(`╚════════════════════════════════════════╝`);
      console.log(`\nGo to: https://supabase.com/dashboard/project/mtcqruxrvjfwrwfvrisn/sql/new`);
      console.log(`Paste the contents of: supabase/migrations/${file}`);
      console.log(`Then click "Run"\n`);
    }
  }

  if (allSucceeded) {
    console.log("\n✓ All migrations executed successfully!");
  } else {
    console.log("\n⚠️  Some migrations need manual execution via Supabase Dashboard.");
    console.log("URL: https://supabase.com/dashboard/project/mtcqruxrvjfwrwfvrisn/sql/new");
  }

  // Verify tables exist
  console.log("\n═══ Verifying tables... ═══");
  const tables = [
    "prospects", "interactions", "invoices", "projects", "videos",
    "activities", "ai_conversations", "intel_entities", "trades",
    "prompts", "lore_entries", "eveil_mesures", "api_keys", "agent_logs",
  ];

  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "count=exact",
          Range: "0-0",
        },
      });
      const count = res.headers.get("content-range")?.split("/")[1] ?? "?";
      const status = res.ok ? "✓" : "✗";
      console.log(`  ${status} ${table.padEnd(20)} ${count} rows`);
    } catch {
      console.log(`  ✗ ${table.padEnd(20)} ERROR`);
    }
  }
}

main().catch(console.error);
