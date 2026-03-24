import { createClient as createSupabaseClient } from "@supabase/supabase-js";

async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
import type { Prospect, Project, Invoice, Activity, Trade, EveilMesure, AgentLog } from "./schema";

// ═══════════════════════════════════════════════
// BYSS GROUP — Database Queries (Server-side)
// All queries use Supabase service_role via server client
// ═══════════════════════════════════════════════

// ── PROSPECTS ──────────────────────────────────

export async function getProspects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as Prospect[];
}

export async function getProspectsByPhase(phase: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("phase", phase)
    .order("score", { ascending: false });
  if (error) throw error;
  return data as Prospect[];
}

export async function getProspect(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Prospect;
}

export async function updateProspect(id: string, updates: Partial<Prospect>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Prospect;
}

export async function createProspect(prospect: Partial<Prospect>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .insert(prospect)
    .select()
    .single();
  if (error) throw error;
  return data as Prospect;
}

// ── PIPELINE STATS ────────────────────────────

export async function getPipelineStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pipeline_stats")
    .select("*");
  if (error) throw error;
  return data;
}

export async function getPipelineKPIs() {
  const supabase = await createClient();
  const { data: prospects, error } = await supabase
    .from("prospects")
    .select("phase, estimated_basket, probability, mrr")
    .not("phase", "in", "(perdu,inactif)");
  if (error) throw error;

  const totalBasket = prospects?.reduce((s, p) => s + Number(p.estimated_basket || 0), 0) ?? 0;
  const weightedBasket = prospects?.reduce((s, p) => s + Number(p.estimated_basket || 0) * Number(p.probability || 0) / 100, 0) ?? 0;
  const totalMRR = prospects?.reduce((s, p) => s + Number(p.mrr || 0), 0) ?? 0;
  const signedCount = prospects?.filter(p => p.phase === "signe").length ?? 0;
  const activeCount = prospects?.length ?? 0;

  return { totalBasket, weightedBasket, totalMRR, signedCount, activeCount };
}

// ── PROJECTS ──────────────────────────────────

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data as Project[];
}

export async function getPublicProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_public", true)
    .eq("is_visible", true)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data as Project[];
}

// ── INVOICES ──────────────────────────────────

export async function getInvoices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, prospects(name)")
    .order("issue_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createInvoice(invoice: Partial<Invoice>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();
  if (error) throw error;
  return data as Invoice;
}

// ── ACTIVITIES ────────────────────────────────

export async function getRecentActivities(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Activity[];
}

export async function createActivity(activity: Partial<Activity>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();
  if (error) throw error;
  return data as Activity;
}

// ── TRADES (Gulf Stream) ──────────────────────

export async function getTrades() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Trade[];
}

// ── EVEIL ─────────────────────────────────────

export async function getEveilMesures() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eveil_mesures")
    .select("*")
    .order("number", { ascending: true });
  if (error) throw error;
  return data as EveilMesure[];
}

// ── AGENT LOGS ────────────────────────────────

export async function logAgentAction(log: Record<string, unknown>) {
  const supabase = createClient();
  // Map camelCase (Drizzle) to snake_case (Supabase)
  const mapped: Record<string, unknown> = {};
  const keyMap: Record<string, string> = {
    agentName: 'agent_name', inputTokens: 'input_tokens', outputTokens: 'output_tokens',
    costUsd: 'cost_usd', durationMs: 'duration_ms', createdAt: 'created_at',
  };
  for (const [k, v] of Object.entries(log)) {
    mapped[keyMap[k] || k] = v;
  }
  const { error } = await supabase.from("agent_logs").insert(mapped);
  if (error) console.error("Failed to log agent action:", error);
}

export async function getAgentCosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agent_costs")
    .select("*");
  if (error) throw error;
  return data;
}
