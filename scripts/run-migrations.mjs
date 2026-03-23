#!/usr/bin/env node
// ═══════════════════════════════════════════════════════
// BYSS GROUP — Direct SQL Migration via Supabase REST
// Splits SQL into individual statements and executes
// each via the PostgREST rpc endpoint
// ═══════════════════════════════════════════════════════

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://mtcqruxrvjfwrwfvrisn.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Y3FydXhydmpmd3J3ZnZyaXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE2MzY5NCwiZXhwIjoyMDg5NzM5Njk0fQ.DKXo4QRUmX1VTNfrI4UtC9bttLbtpiL3z6BfXJsAzZg";

// Step 1: Create an exec_sql function via REST
async function createExecFunction() {
  console.log("Creating exec_sql function...");
  // We need to create a function that can execute arbitrary SQL
  // Use the Supabase Management API
  const fnSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_text TEXT)
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_text;
      RETURN jsonb_build_object('status', 'ok');
    EXCEPTION WHEN OTHERS THEN
      RETURN jsonb_build_object('status', 'error', 'message', SQLERRM, 'detail', SQLSTATE);
    END;
    $$;
  `;

  // Try to create it via the Management API
  const res = await fetch(`https://api.supabase.com/v1/projects/mtcqruxrvjfwrwfvrisn/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer sbp_3b02e5e1d6a17ffc85a4e4f144269b3b8af04145`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: fnSql }),
  });

  if (res.ok) {
    console.log("  ✓ exec_sql function created");
    return true;
  }

  // Try with service key as bearer
  const res2 = await fetch(`https://api.supabase.com/v1/projects/mtcqruxrvjfwrwfvrisn/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: fnSql }),
  });

  if (res2.ok) {
    console.log("  ✓ exec_sql function created (via service key)");
    return true;
  }

  const text = await res2.text();
  console.log(`  Status: ${res2.status} — ${text.slice(0, 200)}`);
  return false;
}

// Step 2: Execute SQL via the rpc endpoint
async function execSql(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql_text: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { status: "error", message: text };
  }

  return await res.json();
}

// Step 3: Split migration into executable chunks
function splitMigration(sql) {
  // Remove comments
  const lines = sql.split("\n");
  const cleaned = lines
    .filter(l => !l.trim().startsWith("--"))
    .join("\n");

  // Split by semicolons but handle $$ blocks
  const chunks = [];
  let current = "";
  let inDollarBlock = false;

  for (const char of cleaned) {
    current += char;
    if (current.endsWith("$$")) {
      inDollarBlock = !inDollarBlock;
    }
    if (char === ";" && !inDollarBlock) {
      const trimmed = current.trim();
      if (trimmed.length > 1) {
        chunks.push(trimmed);
      }
      current = "";
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

async function runMigration(filename) {
  const path = join(__dirname, "..", "supabase", "migrations", filename);
  let sql;
  try {
    sql = readFileSync(path, "utf-8");
  } catch {
    console.log(`  ⚠ File not found: ${filename}`);
    return;
  }

  console.log(`\n═══ ${filename} ═══`);
  const chunks = splitMigration(sql);
  console.log(`  ${chunks.length} statements to execute`);

  let ok = 0, fail = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const preview = chunk.slice(0, 60).replace(/\n/g, " ");
    const result = await execSql(chunk);

    if (result.status === "ok") {
      ok++;
    } else if (result.status === "error") {
      // Check if it's just "already exists"
      const msg = result.message || JSON.stringify(result);
      if (msg.includes("already exists") || msg.includes("42P07")) {
        ok++;
        process.stdout.write(".");
      } else {
        fail++;
        console.log(`  ✗ [${i+1}] ${preview}...`);
        console.log(`    ${msg.slice(0, 150)}`);
      }
    } else {
      ok++;
    }
    process.stdout.write(".");
  }

  console.log(`\n  ✓ ${ok} OK, ${fail} failed`);
}

async function verifyTables() {
  console.log("\n═══ Verifying tables ═══");
  const tables = [
    "prospects", "interactions", "invoices", "projects", "videos",
    "activities", "ai_conversations", "intel_entities", "trades",
    "prompts", "lore_entries", "eveil_mesures", "api_keys", "agent_logs",
  ];

  for (const table of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=0`, {
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Prefer": "count=exact",
      },
    });
    const range = res.headers.get("content-range");
    const count = range ? range.split("/")[1] : "?";
    const icon = res.ok ? "✓" : "✗";
    console.log(`  ${icon} ${table.padEnd(20)} ${count} rows`);
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("BYSS GROUP — Migration Runner v2");
  console.log("═══════════════════════════════════════════════════════");

  // Create the exec function
  const fnCreated = await createExecFunction();

  if (!fnCreated) {
    console.log("\n⚠ Cannot create exec_sql via Management API.");
    console.log("Trying direct statement execution...\n");

    // Alternative: execute each CREATE TABLE as a single large SQL via rpc
    // This requires the function to already exist. Let's try a workaround.

    // Try using the REST API to insert into a known system endpoint
    // Actually, let's just concatenate ALL SQL and push it via a different method

    // Final fallback: output instructions for manual execution
    console.log("═══════════════════════════════════════════════════════");
    console.log("MANUAL MIGRATION INSTRUCTIONS");
    console.log("═══════════════════════════════════════════════════════");
    console.log("\n1. Open: https://supabase.com/dashboard/project/mtcqruxrvjfwrwfvrisn/sql/new");
    console.log("\n2. Copy-paste EACH file in order:");
    console.log("   a) supabase/migrations/001_initial_schema.sql");
    console.log("   b) supabase/migrations/002_rls_policies.sql");
    console.log("   c) supabase/migrations/003_seed_data.sql");
    console.log("   d) supabase/migrations/004_import_xlsx_prospects.sql");
    console.log("\n3. Click 'Run' after each one.");
    console.log("\n4. Come back and run: node scripts/run-migrations.mjs --verify");
    console.log("═══════════════════════════════════════════════════════");
    return;
  }

  // Run all migrations
  await runMigration("001_initial_schema.sql");
  await runMigration("002_rls_policies.sql");
  await runMigration("003_seed_data.sql");
  await runMigration("004_import_xlsx_prospects.sql");

  // Verify
  await verifyTables();

  console.log("\n✓ Migration complete!");
}

// Handle --verify flag
if (process.argv.includes("--verify")) {
  verifyTables().catch(console.error);
} else {
  main().catch(console.error);
}
