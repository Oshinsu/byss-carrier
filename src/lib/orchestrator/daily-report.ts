// ═══════════════════════════════════════════════════════════
// BYSS GROUP — Daily Report Generator
// Compresses the day into a single briefing.
// ═══════════════════════════════════════════════════════════

import { createClient } from "@/lib/supabase/client";

/* ─── Types ─────────────────────────────────────────────── */

interface DailyMetrics {
  agentCalls: number;
  totalCost: number;
  totalTokens: number;
  topModel: string;
  prospectChanges: Array<{ name: string; from: string; to: string }>;
  newInvoices: number;
  paidInvoices: number;
  paidAmount: number;
  approvedActions: number;
  rejectedActions: number;
}

/* ─── Generate report ──────────────────────────────────── */

export async function generateDailyReport(): Promise<string> {
  const supabase = createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  // Parallel queries
  const [agentLogs, prospects, invoices, actions] = await Promise.all([
    // 1. Agent logs today
    supabase
      .from("agent_logs")
      .select("*")
      .gte("created_at", todayISO)
      .order("created_at", { ascending: false }),

    // 2. Prospect phase changes (updated today)
    supabase
      .from("prospects")
      .select("name, phase, updated_at")
      .gte("updated_at", todayISO),

    // 3. Invoices created or paid today
    supabase
      .from("invoices")
      .select("*")
      .or(`created_at.gte.${todayISO},payment_date.gte.${todayISO}`),

    // 4. Pending actions resolved today
    supabase
      .from("pending_actions")
      .select("status, updated_at")
      .gte("updated_at", todayISO)
      .in("status", ["approved", "rejected"]),
  ]);

  // Aggregate metrics
  const logs = agentLogs.data ?? [];
  const totalCost = logs.reduce((sum, l) => sum + (l.cost_usd ?? 0), 0);
  const totalTokens = logs.reduce((sum, l) => sum + (l.input_tokens ?? 0) + (l.output_tokens ?? 0), 0);

  // Top model by call count
  const modelCounts: Record<string, number> = {};
  for (const log of logs) {
    const model = log.model ?? "unknown";
    modelCounts[model] = (modelCounts[model] ?? 0) + 1;
  }
  const topModel = Object.entries(modelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const inv = invoices.data ?? [];
  const newInvoices = inv.filter((i) => i.created_at >= todayISO).length;
  const paidInvoices = inv.filter((i) => i.payment_date && i.payment_date >= todayISO.slice(0, 10));
  const paidAmount = paidInvoices.reduce((sum, i) => sum + (i.amount_ttc ?? 0), 0);

  const acts = actions.data ?? [];
  const approved = acts.filter((a) => a.status === "approved").length;
  const rejected = acts.filter((a) => a.status === "rejected").length;

  const metrics: DailyMetrics = {
    agentCalls: logs.length,
    totalCost,
    totalTokens,
    topModel,
    prospectChanges: (prospects.data ?? []).map((p) => ({
      name: p.name,
      from: "—",
      to: p.phase,
    })),
    newInvoices,
    paidInvoices: paidInvoices.length,
    paidAmount,
    approvedActions: approved,
    rejectedActions: rejected,
  };

  // Build report text
  const report = buildReport(metrics);

  // Save as insight
  await supabase.from("insights").insert({
    type: "daily_report",
    title: `Rapport ${new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(new Date())}`,
    content: report,
    metadata: { metrics },
    created_at: new Date().toISOString(),
  }).catch(() => {
    // insights table may not exist yet — silent
  });

  return report;
}

/* ─── Build report text ────────────────────────────────── */

function buildReport(m: DailyMetrics): string {
  const lines: string[] = [];
  const date = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  lines.push(`═══ RAPPORT JOURNALIER — ${date.toUpperCase()} ═══`);
  lines.push("");

  // Agent Activity
  lines.push("▸ ACTIVITÉ IA");
  lines.push(`  ${m.agentCalls} appels | ${formatTokens(m.totalTokens)} tokens | $${m.totalCost.toFixed(4)}`);
  lines.push(`  Modèle principal: ${m.topModel}`);
  lines.push("");

  // Pipeline
  if (m.prospectChanges.length > 0) {
    lines.push("▸ PIPELINE");
    for (const pc of m.prospectChanges.slice(0, 5)) {
      lines.push(`  ${pc.name} → ${pc.to}`);
    }
    if (m.prospectChanges.length > 5) {
      lines.push(`  +${m.prospectChanges.length - 5} autres`);
    }
    lines.push("");
  }

  // Finance
  lines.push("▸ FINANCE");
  lines.push(`  ${m.newInvoices} nouvelle(s) facture(s) | ${m.paidInvoices} payée(s) (${formatEUR(m.paidAmount)})`);
  lines.push("");

  // Gates
  if (m.approvedActions > 0 || m.rejectedActions > 0) {
    lines.push("▸ GATES");
    lines.push(`  ${m.approvedActions} approuvée(s) | ${m.rejectedActions} rejetée(s)`);
    lines.push("");
  }

  // System health
  const healthStatus = m.totalCost < 5 ? "NOMINAL" : m.totalCost < 20 ? "ÉLEVÉ" : "CRITIQUE";
  lines.push(`▸ COÛT: $${m.totalCost.toFixed(2)} | STATUS: ${healthStatus}`);

  return lines.join("\n");
}

/* ─── Formatting helpers ───────────────────────────────── */

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}
