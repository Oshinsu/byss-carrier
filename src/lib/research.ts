// ═══════════════════════════════════════════════════════
// BYSS Research Engine
//
// Inspired by:
//   EurekaClaw — 7-stage pipeline, knowledge graph, skill distillation
//   K-Dense    — BYOK expert delegation, multi-model routing
//   AgentScope — MsgHub, A2A, memory compression
// ═══════════════════════════════════════════════════════

/* ── Research Pipeline Stages (EurekaClaw 7-stage) ───── */

export const RESEARCH_STAGES = [
  { id: "question", label: "Question", icon: "HelpCircle" },
  { id: "sources", label: "Sources", icon: "Search" },
  { id: "analysis", label: "Analyse", icon: "BarChart3" },
  { id: "synthesis", label: "Synthese", icon: "GitMerge" },
  { id: "hypothesis", label: "Hypothese", icon: "Lightbulb" },
  { id: "validation", label: "Validation", icon: "CheckCircle2" },
  { id: "report", label: "Rapport", icon: "FileText" },
] as const;

export type ResearchStageId = (typeof RESEARCH_STAGES)[number]["id"];
export type StageStatus = "pending" | "active" | "done" | "error";

/* ── Research Modes (EurekaClaw-adapted) ─────────────── */

export const RESEARCH_MODES = [
  {
    id: "explore",
    label: "Explorer",
    description: "Decouverte large d'un domaine. Input: sujet. Output: synthese.",
    icon: "Compass",
    color: "cyan",
  },
  {
    id: "papers",
    label: "Analyser",
    description: "Plongee profonde sur des sources specifiques. Input: URLs, docs. Output: analyse croisee.",
    icon: "FileSearch",
    color: "purple",
  },
  {
    id: "prove",
    label: "Valider",
    description: "Fact-check et verification. Input: hypothese. Output: preuves pour/contre.",
    icon: "ShieldCheck",
    color: "emerald",
  },
] as const;

export type ResearchMode = (typeof RESEARCH_MODES)[number]["id"];

/* ── Depth Configurations (K-Dense routing) ──────────── */

export const DEPTH_CONFIG = {
  quick: { maxTokens: 2000, model: "haiku", sources: 1, label: "Rapide", description: "1 source, reponse flash" },
  medium: { maxTokens: 4000, model: "sonnet", sources: 5, label: "Medium", description: "3-5 sources, analyse croisee" },
  deep: { maxTokens: 8000, model: "opus", sources: 10, label: "Profond", description: "10+ sources, synthese complete" },
} as const;

export type ResearchDepth = keyof typeof DEPTH_CONFIG;

/* ── Domain Filters ──────────────────────────────────── */

export const RESEARCH_DOMAINS = [
  { id: "technology", label: "Technologie", icon: "Cpu", color: "#00B4D8" },
  { id: "market", label: "Marche", icon: "TrendingUp", color: "#10B981" },
  { id: "competition", label: "Concurrence", icon: "Swords", color: "#F59E0B" },
  { id: "legal", label: "Juridique", icon: "Scale", color: "#8B5CF6" },
  { id: "finance", label: "Finance", icon: "DollarSign", color: "#EF4444" },
  { id: "geopolitics", label: "Geopolitique", icon: "Globe", color: "#EC4899" },
  { id: "culture", label: "Culture", icon: "Palette", color: "#F97316" },
] as const;

export type ResearchDomain = (typeof RESEARCH_DOMAINS)[number]["id"];

/* ── Domain → Agent Mapping (K-Dense expert delegation) ── */

export const DOMAIN_AGENTS: Record<
  ResearchDomain,
  { agent: string; model: string; avatar: string; role: string }
> = {
  technology: { agent: "evren", model: "claude-sonnet-4-6-20250514", avatar: "phi", role: "Architecte Technique" },
  market: { agent: "sorel", model: "claude-sonnet-4-6-20250514", avatar: "soso", role: "Stratege Commercial" },
  competition: { agent: "sorel", model: "claude-sonnet-4-6-20250514", avatar: "soso", role: "Stratege Commercial" },
  legal: { agent: "sorel", model: "claude-opus-4-6-20250514", avatar: "soso", role: "Analyste Juridique" },
  finance: { agent: "sorel", model: "deepseek-v3.2", avatar: "soso", role: "Analyste Finance" },
  geopolitics: { agent: "kael", model: "claude-opus-4-6-20250514", avatar: "infinity", role: "Stratege Culturel" },
  culture: { agent: "nerel", model: "claude-sonnet-4-6-20250514", avatar: "brain", role: "Createur Culturel" },
};

/* ── Multi-Model Routing (K-Dense BYOK + SOTAI v3) ──── */

export const MODEL_DISPLAY: Record<string, { label: string; speed: string; cost: string }> = {
  haiku: { label: "Haiku 3.5", speed: "Ultra-rapide", cost: "$0.25/M" },
  sonnet: { label: "Sonnet 4.6", speed: "Equilibre", cost: "$9/M" },
  opus: { label: "Opus 4.6", speed: "Profond", cost: "$15/M" },
  "deepseek-v3.2": { label: "DeepSeek V3.2", speed: "Finance-optimise", cost: "$2.19/M" },
  "kimi-k2.5": { label: "Kimi K2.5", speed: "Code-optimise", cost: "$1.3/M" },
  "minimax-m2.7": { label: "MiniMax M2.7", speed: "Bulk-rapide", cost: "$0.30/M" },
};

/* ── Types ────────────────────────────────────────────── */

export interface ResearchRequest {
  question: string;
  mode: ResearchMode;
  depth: ResearchDepth;
  domain: ResearchDomain;
}

export interface ResearchSource {
  title: string;
  url?: string;
  type: "web" | "lore" | "local" | "api";
  confidence: number;
  snippet: string;
}

export interface ResearchFinding {
  insight: string;
  confidence: "faible" | "moyen" | "eleve";
  sources: number[];
  category: string;
}

export interface ResearchResult {
  id: string;
  question: string;
  mode: ResearchMode;
  depth: ResearchDepth;
  domain: ResearchDomain;
  findings: ResearchFinding[];
  sources: ResearchSource[];
  summary: string;
  suggestedAgent: string;
  model: string;
  tokensUsed: number;
  timestamp: string;
  stages: Record<ResearchStageId, StageStatus>;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  domain?: string;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  weight: number;
  label?: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface ResearchHistoryEntry {
  id: string;
  question: string;
  mode: ResearchMode;
  date: string;
  keyFindings: string;
  sourcesCount: number;
  domain: ResearchDomain;
}

/* ── localStorage Keys ────────────────────────────────── */

export const STORAGE_KEYS = {
  graph: "byss-research-graph",
  history: "byss-research-history",
} as const;

/* ── Helpers ──────────────────────────────────────────── */

export function getDepthModel(depth: ResearchDepth, domain: ResearchDomain): string {
  // Deep research on geopolitics/legal always gets Opus
  if (depth === "deep" && (domain === "geopolitics" || domain === "legal")) {
    return "opus";
  }
  // Finance always gets DeepSeek
  if (domain === "finance" && depth !== "quick") {
    return "deepseek-v3.2";
  }
  return DEPTH_CONFIG[depth].model;
}

export function resolveAgent(domain: ResearchDomain) {
  return DOMAIN_AGENTS[domain] ?? DOMAIN_AGENTS.market;
}

export function createStageMap(initial: StageStatus = "pending"): Record<ResearchStageId, StageStatus> {
  return Object.fromEntries(RESEARCH_STAGES.map((s) => [s.id, initial])) as Record<ResearchStageId, StageStatus>;
}

/** Save research to history (localStorage, max 20) */
export function saveToHistory(entry: ResearchHistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    const history: ResearchHistoryEntry[] = raw ? JSON.parse(raw) : [];
    history.unshift(entry);
    if (history.length > 20) history.length = 20;
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  } catch { /* silent */ }
}

/** Load research history */
export function loadHistory(): ResearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/** Save knowledge graph */
export function saveGraph(graph: KnowledgeGraph): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.graph, JSON.stringify(graph));
  } catch { /* silent */ }
}

/** Load knowledge graph */
export function loadGraph(): KnowledgeGraph {
  if (typeof window === "undefined") return { nodes: [], edges: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.graph);
    return raw ? JSON.parse(raw) : { nodes: [], edges: [] };
  } catch { return { nodes: [], edges: [] }; }
}

/** Merge new nodes/edges into existing graph */
export function mergeIntoGraph(
  existing: KnowledgeGraph,
  newNodes: KnowledgeNode[],
  newEdges: KnowledgeEdge[],
): KnowledgeGraph {
  const nodeIds = new Set(existing.nodes.map((n) => n.id));
  const edgeKeys = new Set(existing.edges.map((e) => `${e.source}-${e.target}`));

  const merged: KnowledgeGraph = {
    nodes: [...existing.nodes],
    edges: [...existing.edges],
  };

  for (const node of newNodes) {
    if (!nodeIds.has(node.id)) {
      merged.nodes.push(node);
      nodeIds.add(node.id);
    }
  }

  for (const edge of newEdges) {
    const key = `${edge.source}-${edge.target}`;
    if (!edgeKeys.has(key)) {
      merged.edges.push(edge);
      edgeKeys.add(key);
    }
  }

  return merged;
}
