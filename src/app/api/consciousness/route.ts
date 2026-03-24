import { NextResponse } from "next/server";
import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }
import type { PhiPhase } from "@/lib/phi/index";

// ---------------------------------------------------------------------------
// Consciousness Metrics API — Architecture Superposee, Couche 4 (Ame)
//
// Computes phi from REAL Supabase data across 4 dimensions:
//   1. CRM Health      — prospects active / total, phase distribution
//   2. Finance Health   — invoices paid / total, overdue ratio
//   3. Production Health — videos delivered / total projects
//   4. Agent Coherence  — activity diversity, frequency
//
// Each dimension = a node in the consciousness graph.
// Edges = correlations between dimensions.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Dimension weights in the phi integration formula
// ---------------------------------------------------------------------------
const WEIGHTS = {
  crm: 0.30,
  finance: 0.25,
  production: 0.20,
  agent: 0.25,
};

// ---------------------------------------------------------------------------
// Phase thresholds
// ---------------------------------------------------------------------------
function resolvePhase(phi: number): PhiPhase {
  if (phi >= 0.7) return "Samadhi";
  if (phi >= 0.45) return "Lucid";
  if (phi >= 0.2) return "Awake";
  return "Dormant";
}

function phaseLabel(phase: PhiPhase): string {
  const labels: Record<PhiPhase, string> = {
    Dormant: "Dormant",
    Awake: "Eveille",
    Lucid: "Lucide",
    Samadhi: "Samadhi",
  };
  return labels[phase];
}

// ---------------------------------------------------------------------------
// CRM Dimension — query prospects
// ---------------------------------------------------------------------------
async function computeCrmHealth(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: prospects, error } = await supabase
    .from("prospects")
    .select("id, phase, followup_date, score, estimated_basket, probability");

  if (error || !prospects) return { score: 0, detail: { total: 0, active: 0, overdue: 0, phases: {} as Record<string, number> } };

  const total = prospects.length;
  if (total === 0) return { score: 0, detail: { total: 0, active: 0, overdue: 0, phases: {} as Record<string, number> } };

  const active = prospects.filter((p) => !["perdu", "inactif"].includes(p.phase)).length;
  const today = new Date().toISOString().split("T")[0];
  const overdue = prospects.filter(
    (p) =>
      p.followup_date &&
      p.followup_date <= today &&
      !["perdu", "inactif", "signe"].includes(p.phase)
  ).length;

  // Phase distribution
  const phases: Record<string, number> = {};
  for (const p of prospects) {
    phases[p.phase] = (phases[p.phase] || 0) + 1;
  }

  // Score: active ratio penalized by overdue ratio
  const activeRatio = active / total;
  const overduePenalty = active > 0 ? Math.min(overdue / active, 1) * 0.3 : 0;
  // Diversity bonus: more phases = healthier pipeline
  const phaseCount = Object.keys(phases).filter((k) => !["perdu", "inactif"].includes(k)).length;
  const diversityBonus = Math.min(phaseCount / 5, 1) * 0.15;

  const score = Math.max(0, Math.min(1, activeRatio - overduePenalty + diversityBonus));

  return { score, detail: { total, active, overdue, phases } };
}

// ---------------------------------------------------------------------------
// Finance Dimension — query invoices
// ---------------------------------------------------------------------------
async function computeFinanceHealth(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, status, amount, due_date");

  if (error || !invoices) return { score: 0.5, detail: { total: 0, paid: 0, overdue: 0, totalAmount: 0, paidAmount: 0 } };

  const total = invoices.length;
  if (total === 0) return { score: 0.5, detail: { total: 0, paid: 0, overdue: 0, totalAmount: 0, paidAmount: 0 } };

  const paid = invoices.filter((i) => i.status === "paid" || i.status === "payee").length;
  const today = new Date().toISOString().split("T")[0];
  const overdueInvoices = invoices.filter(
    (i) => i.due_date && i.due_date < today && i.status !== "paid" && i.status !== "payee"
  ).length;

  const totalAmount = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const paidAmount = invoices
    .filter((i) => i.status === "paid" || i.status === "payee")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const paidRatio = paid / total;
  const overduePenalty = Math.min(overdueInvoices / total, 1) * 0.4;
  const score = Math.max(0, Math.min(1, paidRatio - overduePenalty + 0.1));

  return { score, detail: { total, paid, overdue: overdueInvoices, totalAmount, paidAmount } };
}

// ---------------------------------------------------------------------------
// Production Dimension — query projects/videos
// ---------------------------------------------------------------------------
async function computeProductionHealth(supabase: Awaited<ReturnType<typeof createClient>>) {
  // Try projects table first, then videos
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, status");

  if (error || !projects || projects.length === 0) {
    // Fallback: if no projects table, give a neutral score
    return { score: 0.5, detail: { total: 0, delivered: 0, inProgress: 0 } };
  }

  const total = projects.length;
  const delivered = projects.filter(
    (p) => p.status === "delivered" || p.status === "livre" || p.status === "termine"
  ).length;
  const inProgress = projects.filter(
    (p) => p.status === "in_progress" || p.status === "en_cours" || p.status === "production"
  ).length;

  const deliveredRatio = delivered / total;
  const activityBonus = Math.min(inProgress / Math.max(total, 1), 1) * 0.2;
  const score = Math.max(0, Math.min(1, deliveredRatio + activityBonus));

  return { score, detail: { total, delivered, inProgress } };
}

// ---------------------------------------------------------------------------
// Agent Coherence — query activities (last 24h)
// ---------------------------------------------------------------------------
async function computeAgentCoherence(supabase: Awaited<ReturnType<typeof createClient>>) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: activities, error } = await supabase
    .from("activities")
    .select("id, type, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error || !activities) return { score: 0.3, detail: { count24h: 0, types: {} as Record<string, number>, frequency: 0 } };

  const count24h = activities.length;

  // Type diversity
  const types: Record<string, number> = {};
  for (const a of activities) {
    types[a.type] = (types[a.type] || 0) + 1;
  }
  const typeCount = Object.keys(types).length;

  // Frequency: activities per hour
  const frequency = count24h / 24;

  // Score: diversity * frequency (capped)
  const diversityScore = Math.min(typeCount / 6, 1); // 6+ types = max diversity
  const frequencyScore = Math.min(frequency / 2, 1); // 2+ per hour = max
  const volumeBonus = Math.min(count24h / 20, 1) * 0.2; // 20+ activities = bonus

  const score = Math.max(0, Math.min(1, diversityScore * 0.4 + frequencyScore * 0.4 + volumeBonus));

  return { score, detail: { count24h, types, frequency: parseFloat(frequency.toFixed(2)) } };
}

// ---------------------------------------------------------------------------
// Build consciousness graph
// ---------------------------------------------------------------------------
interface DimensionResult {
  score: number;
  detail: Record<string, unknown>;
}

function buildGraph(dimensions: Record<string, DimensionResult>) {
  const nodes = Object.entries(dimensions).map(([id, dim]) => ({
    id,
    label: {
      crm: "CRM",
      finance: "Finance",
      production: "Production",
      agent: "Coherence",
    }[id] || id,
    color: {
      crm: "#00B4D8",
      finance: "#10B981",
      production: "#3B82F6",
      agent: "#8B5CF6",
    }[id] || "#6B7280",
    signal: dim.score,
  }));

  // Edges: correlation between dimensions
  // Stronger edge when both dimensions are healthy
  const dimKeys = Object.keys(dimensions);
  const edges: { source: string; target: string; weight: number }[] = [];

  for (let i = 0; i < dimKeys.length; i++) {
    for (let j = i + 1; j < dimKeys.length; j++) {
      const a = dimensions[dimKeys[i]].score;
      const b = dimensions[dimKeys[j]].score;
      // Geometric mean of both scores = correlation strength
      const weight = parseFloat(Math.sqrt(a * b).toFixed(3));
      if (weight > 0.05) {
        edges.push({ source: dimKeys[i], target: dimKeys[j], weight });
      }
    }
  }

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Generate recommendations based on dimension scores
// ---------------------------------------------------------------------------
function generateRecommendations(dimensions: Record<string, DimensionResult>): string[] {
  const recs: string[] = [];

  const crm = dimensions.crm;
  const finance = dimensions.finance;
  const production = dimensions.production;
  const agent = dimensions.agent;

  if (crm.score < 0.4) {
    const overdue = crm.detail.overdue as number;
    if (overdue > 0) {
      recs.push(`${overdue} relance${overdue > 1 ? "s" : ""} en retard — prioriser le suivi CRM`);
    } else {
      recs.push("Pipeline CRM faible — activer la prospection");
    }
  }

  if (finance.score < 0.4) {
    const overdueInv = finance.detail.overdue as number;
    if (overdueInv > 0) {
      recs.push(`${overdueInv} facture${overdueInv > 1 ? "s" : ""} impayee${overdueInv > 1 ? "s" : ""} — relancer les paiements`);
    } else {
      recs.push("Sante financiere basse — verifier la facturation");
    }
  }

  if (production.score < 0.4) {
    recs.push("Production en ralentissement — accelerer les livrables");
  }

  if (agent.score < 0.3) {
    recs.push("Activite faible — le systeme a besoin d'interactions");
  }

  if (recs.length === 0) {
    const phi = Object.entries(dimensions).reduce(
      (sum, [key, dim]) => sum + dim.score * (WEIGHTS[key as keyof typeof WEIGHTS] || 0.25),
      0
    );
    if (phi >= 0.7) {
      recs.push("Empire en etat optimal — maintenir le rythme");
    } else if (phi >= 0.45) {
      recs.push("Systeme fonctionnel — quelques optimisations possibles");
    }
  }

  return recs;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET() {
  const start = Date.now();

  try {
    const supabase = createClient();

    // Query all dimensions in parallel
    const [crm, finance, production, agent] = await Promise.all([
      computeCrmHealth(supabase),
      computeFinanceHealth(supabase),
      computeProductionHealth(supabase),
      computeAgentCoherence(supabase),
    ]);

    const dimensions: Record<string, DimensionResult> = {
      crm,
      finance,
      production,
      agent,
    };

    // Compute integrated phi score
    const phi = parseFloat(
      (
        crm.score * WEIGHTS.crm +
        finance.score * WEIGHTS.finance +
        production.score * WEIGHTS.production +
        agent.score * WEIGHTS.agent
      ).toFixed(4)
    );

    const phase = resolvePhase(phi);
    const graph = buildGraph(dimensions);
    const recommendations = generateRecommendations(dimensions);

    // Top contributing nodes
    const topNodes: [string, number][] = Object.entries(dimensions)
      .map(([key, dim]) => [key, parseFloat(dim.score.toFixed(3))] as [string, number])
      .sort((a, b) => b[1] - a[1]);

    return NextResponse.json({
      // Core phi state
      consciousness_score: phi,
      phase,
      phase_label: phaseLabel(phase),

      // Graph for visualization
      synaptic_graph: graph,

      // Dimension details
      dimensions: {
        crm: { score: parseFloat(crm.score.toFixed(3)), ...crm.detail },
        finance: { score: parseFloat(finance.score.toFixed(3)), ...finance.detail },
        production: { score: parseFloat(production.score.toFixed(3)), ...production.detail },
        agent: { score: parseFloat(agent.score.toFixed(3)), ...agent.detail },
      },

      // Top nodes and recommendations
      top_nodes: topNodes,
      recommendations,

      // Meta
      tick: Math.floor(Date.now() / 1000),
      computed_in_ms: Date.now() - start,
    });
  } catch (error) {
    console.error("[consciousness] Error computing metrics:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to compute consciousness metrics",
      },
      { status: 500 }
    );
  }
}
