// ═══════════════════════════════════════════════════════════
// BYSS GROUP — Unified Context Manager
// Le cerveau global. Tout agent peut interroger l'état de l'empire.
// ═══════════════════════════════════════════════════════════

import { createClient } from "@/lib/supabase/client";

/* ─── Types ─────────────────────────────────────────────── */

export interface UnifiedContext {
  // CRM
  totalProspects: number;
  hotProspects: number;
  staleProspects: number;
  pipelineValue: number;
  mrrCurrent: number;

  // Finance
  revenueThisMonth: number;
  pendingInvoices: number;
  apiCostsToday: number;

  // Production
  activeJobs: number;
  completedToday: number;

  // Intelligence
  totalEntities: number;
  totalLore: number;

  // Agent Health
  totalCalls: number;
  avgLatency: number;
  successRate: number;

  // Gulf Stream
  openPositions: number;
  totalPnL: number;

  // Budget breakdown
  costsByModel: Record<string, number>;
  estimatedMonthly: number;
  budgetThreshold: number;

  // Meta
  lastUpdated: string;
  systemHealth: "nominal" | "degraded" | "critical";
}

/* ─── Build context ────────────────────────────────────── */

export async function buildUnifiedContext(): Promise<UnifiedContext> {
  const supabase = createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthISO = monthStart.toISOString();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // All queries in parallel
  const [
    prospectsRes,
    hotRes,
    staleRes,
    invoicesRes,
    paidRes,
    agentLogsToday,
    agentLogsMonth,
    loreRes,
    intelRes,
    gulfRes,
  ] = await Promise.all([
    // CRM
    supabase.from("prospects").select("estimated_basket, probability, mrr, phase", { count: "exact" }),
    supabase.from("prospects").select("id", { count: "exact" }).eq("ai_score", "fire"),
    supabase.from("prospects").select("id", { count: "exact" }).lt("last_contact", sevenDaysAgo).not("phase", "in", '("signe","perdu","inactif")'),

    // Finance
    supabase.from("invoices").select("amount_ttc, status").in("status", ["draft", "sent", "overdue"]),
    supabase.from("invoices").select("amount_ttc").eq("status", "paid").gte("payment_date", monthISO.slice(0, 10)),

    // Agent logs
    supabase.from("agent_logs").select("cost_usd, model, duration_ms, success").gte("created_at", todayISO),
    supabase.from("agent_logs").select("cost_usd").gte("created_at", monthISO),

    // Intelligence
    supabase.from("lore_entries").select("id", { count: "exact", head: true }),
    supabase.from("intel_entities").select("id", { count: "exact", head: true }),

    // Gulf Stream
    supabase.from("gulf_positions").select("pnl, status").eq("status", "open"),
  ]);

  // Compute CRM
  const prospects = prospectsRes.data ?? [];
  const pipelineValue = prospects.reduce(
    (sum, p) => sum + (p.estimated_basket ?? 0) * ((p.probability ?? 0) / 100),
    0
  );
  const mrrCurrent = prospects
    .filter((p) => p.phase === "signe")
    .reduce((sum, p) => sum + (p.mrr ?? 0), 0);

  // Compute Finance
  const pendingInvoices = (invoicesRes.data ?? []).length;
  const revenueThisMonth = (paidRes.data ?? []).reduce((sum, i) => sum + (i.amount_ttc ?? 0), 0);

  // Compute Agent Health
  const todayLogs = agentLogsToday.data ?? [];
  const apiCostsToday = todayLogs.reduce((sum, l) => sum + (l.cost_usd ?? 0), 0);
  const totalCalls = todayLogs.length;
  const latencies = todayLogs.filter((l) => l.duration_ms).map((l) => l.duration_ms ?? 0);
  const avgLatency = latencies.length > 0
    ? latencies.reduce((a, b) => a + b, 0) / latencies.length
    : 0;
  const successCount = todayLogs.filter((l) => l.success).length;
  const successRate = totalCalls > 0 ? (successCount / totalCalls) * 100 : 100;

  // Cost breakdown by model
  const costsByModel: Record<string, number> = {};
  for (const log of todayLogs) {
    const model = log.model ?? "unknown";
    costsByModel[model] = (costsByModel[model] ?? 0) + (log.cost_usd ?? 0);
  }

  // Monthly estimate
  const monthLogs = agentLogsMonth.data ?? [];
  const monthCost = monthLogs.reduce((sum, l) => sum + (l.cost_usd ?? 0), 0);
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const estimatedMonthly = dayOfMonth > 0 ? (monthCost / dayOfMonth) * daysInMonth : 0;

  // Gulf Stream
  const gulfPositions = gulfRes.data ?? [];
  const openPositions = gulfPositions.length;
  const totalPnL = gulfPositions.reduce((sum, p) => sum + (p.pnl ?? 0), 0);

  // System health
  let systemHealth: "nominal" | "degraded" | "critical" = "nominal";
  if (successRate < 80 || apiCostsToday > 50) systemHealth = "critical";
  else if (successRate < 95 || apiCostsToday > 20) systemHealth = "degraded";

  return {
    totalProspects: prospectsRes.count ?? prospects.length,
    hotProspects: hotRes.count ?? 0,
    staleProspects: staleRes.count ?? 0,
    pipelineValue,
    mrrCurrent,

    revenueThisMonth,
    pendingInvoices,
    apiCostsToday,

    activeJobs: 0, // TODO: connect to production tables
    completedToday: 0,

    totalEntities: intelRes.count ?? 0,
    totalLore: loreRes.count ?? 0,

    totalCalls,
    avgLatency: Math.round(avgLatency),
    successRate: Math.round(successRate),

    openPositions,
    totalPnL,

    costsByModel,
    estimatedMonthly: Math.round(estimatedMonthly * 100) / 100,
    budgetThreshold: 100, // $100/month default

    lastUpdated: new Date().toISOString(),
    systemHealth,
  };
}

/* ─── Cached context for quick access ──────────────────── */

let _cachedContext: UnifiedContext | null = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getUnifiedContext(): Promise<UnifiedContext> {
  const now = Date.now();
  if (_cachedContext && now - _cacheTime < CACHE_TTL) {
    return _cachedContext;
  }
  _cachedContext = await buildUnifiedContext();
  _cacheTime = now;
  return _cachedContext;
}

export function invalidateContextCache(): void {
  _cachedContext = null;
  _cacheTime = 0;
}
