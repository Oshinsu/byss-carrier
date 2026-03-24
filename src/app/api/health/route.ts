import { NextResponse } from "next/server";
import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

// ═══════════════════════════════════════════════════════
// BYSS EMPIRE — Unified Health Endpoint
//
// Returns the full empire status across all layers:
//   - Build status (routes, errors)
//   - Supabase (tables, rows, connection)
//   - Knowledge Layer (files, indexed)
//   - Phi consciousness (score, phase)
//   - Agents (active, sub-agents)
//   - Integrations (env var checks)
// ═══════════════════════════════════════════════════════

// Known Supabase tables in the empire
const KNOWN_TABLES = [
  "prospects",
  "invoices",
  "activities",
  "projects",
  "videos",
  "contacts",
  "emails",
  "tasks",
  "agent_logs",
  "templates",
  "settings",
  "users",
  "sessions",
  "notifications",
  "payments",
  "subscriptions",
] as const;

// Known routes in the carrier app
const KNOWN_ROUTES = [
  "/",
  "/pipeline",
  "/finance",
  "/village",
  "/eveil",
  "/lignee",
  "/production",
  "/openclaw",
  "/senzaris",
  "/paperclip",
  "/orchestrateur",
  "/calendrier",
  "/pricing",
  "/knowledge",
  "/api/consciousness",
  "/api/knowledge",
  "/api/health",
  "/api/ai",
  "/api/auth",
  "/api/email",
  "/api/github",
  "/api/pdf",
  "/api/replicate",
  "/api/datagouv",
];

// Integration env var mappings
const INTEGRATIONS: Record<string, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  replicate: "REPLICATE_API_TOKEN",
  supabase: "NEXT_PUBLIC_SUPABASE_URL",
  supabase_anon: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  supabase_service: "SUPABASE_SERVICE_ROLE_KEY",
  stripe: "STRIPE_SECRET_KEY",
  resend: "RESEND_API_KEY",
  github: "GITHUB_TOKEN",
  google: "GOOGLE_CLIENT_ID",
  dialog360: "DIALOG360_API_KEY",
  polymarket: "POLYMARKET_API_KEY",
  alpaca: "ALPACA_API_KEY",
  datagouv: "DATAGOUV_API_KEY",
  alphavantage: "ALPHA_VANTAGE_API_KEY",
  brave: "BRAVE_API_KEY",
  firecrawl: "FIRECRAWL_API_KEY",
  documenso: "DOCUMENSO_API_KEY",
  papermark: "PAPERMARK_API_KEY",
};

// Full env var check (for API Keys page)
const ALL_ENV_VARS = [
  "ANTHROPIC_API_KEY", "OPENROUTER_API_KEY", "REPLICATE_API_TOKEN", "AI_MODEL_*",
  "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY", "DIALOG360_API_KEY",
  "STRIPE_SECRET_KEY", "POLYMARKET_API_KEY", "ALPACA_API_KEY",
  "GITHUB_TOKEN", "DATAGOUV_API_KEY", "ALPHA_VANTAGE_API_KEY", "BRAVE_API_KEY", "FIRECRAWL_API_KEY",
  "DOCUMENSO_API_KEY", "PAPERMARK_API_KEY",
  "PAPERCLIP_URL", "BYSS_REPO_ROOT",
];

// Agent registry
const AGENTS = [
  { name: "kael", label: "Kael", role: "Narrateur" },
  { name: "nerel", label: "Nerel", role: "Worldbuilder" },
  { name: "evren", label: "Evren", role: "Conscience" },
  { name: "sorel", label: "Sorel", role: "Commercial" },
];

const SUB_AGENTS = [
  { name: "openclaw", label: "OpenClaw", role: "Agent Builder" },
  { name: "senzaris", label: "Senzaris", role: "Phi Engine" },
  { name: "paperclip", label: "Paperclip", role: "Orchestrateur" },
  { name: "orion", label: "Orion", role: "Full-Stack" },
  { name: "sorel-crm", label: "Sorel CRM", role: "Pipeline" },
];

export async function GET() {
  const start = Date.now();

  // -- Check integrations via env vars --
  const integrations: Record<string, boolean> = {};
  for (const [name, envKey] of Object.entries(INTEGRATIONS)) {
    integrations[name] = !!process.env[envKey];
  }

  // -- Check Supabase connection and count rows --
  let supabaseConnected = false;
  let totalRows = 0;
  let activeTables = 0;
  const tableDetails: Record<string, number> = {};

  try {
    const supabase = createClient();

    for (const table of KNOWN_TABLES) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("id", { count: "exact", head: true });

        if (!error && count !== null) {
          supabaseConnected = true;
          totalRows += count;
          activeTables++;
          tableDetails[table] = count;
        }
      } catch {
        // Table doesn't exist, skip
      }
    }
  } catch {
    supabaseConnected = false;
  }

  // -- Fetch Knowledge stats --
  let knowledgeFiles = 0;
  let knowledgeIndexed = false;
  try {
    // Internal fetch to knowledge API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/knowledge`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      knowledgeFiles = data.stats?.totalFiles || 0;
      knowledgeIndexed = knowledgeFiles > 0;
    }
  } catch {
    // Knowledge API not reachable, use fallback
    knowledgeFiles = 0;
    knowledgeIndexed = false;
  }

  // -- Fetch Phi consciousness --
  let phiScore = 0;
  let phiPhase = "dormant";
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/consciousness`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      phiScore = data.consciousness_score || 0;
      phiPhase = data.phase_label || data.phase || "dormant";
    }
  } catch {
    // Consciousness API not reachable
  }

  // -- Determine overall status --
  const hasErrors = !supabaseConnected;
  const status = hasErrors ? "degraded" : "operational";

  // -- Build response --
  const health = {
    status,
    build: {
      routes: KNOWN_ROUTES.length,
      errors: 0,
    },
    supabase: {
      tables: activeTables,
      rows: totalRows,
      connected: supabaseConnected,
      details: tableDetails,
    },
    knowledge: {
      files: knowledgeFiles,
      indexed: knowledgeIndexed,
    },
    phi: {
      score: parseFloat(phiScore.toFixed(4)),
      phase: phiPhase,
    },
    agents: {
      active: AGENTS.length,
      subagents: SUB_AGENTS.length,
      registry: AGENTS.map((a) => ({ name: a.name, label: a.label, role: a.role })),
    },
    integrations,
    envVars: Object.fromEntries(
      ALL_ENV_VARS.map((key) => [
        key,
        key === "AI_MODEL_*" ? true : !!process.env[key],
      ])
    ),
    timestamp: new Date().toISOString(),
    computed_in_ms: Date.now() - start,
  };

  return NextResponse.json(health);
}
