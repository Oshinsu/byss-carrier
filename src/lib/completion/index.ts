// ═══════════════════════════════════════════════════════
// AUTO-COMPLETION ENGINE — Self-Improving System
// MiniMax M2.7 scans every page. Claude fixes gaps.
// Le vaisseau s'ameliore seul.
// ═══════════════════════════════════════════════════════

export interface PageAnalysis {
  pagePath: string;
  pageName: string;
  score: number;
  promises: string[];
  reality: string[];
  gaps: Gap[];
  hasRealData: boolean;
  hasLoading: boolean;
  hasErrorHandling: boolean;
  hasToast: boolean;
  hasSupabase: boolean;
  mockupsFound: string[];
  analyzedAt: string;
}

export interface Gap {
  id: string;
  type: "quick-fix" | "feature";
  description: string;
  impact: number; // 0-20 points
  fix?: string; // code snippet
  status: "pending" | "applied" | "rejected";
}

export interface CompletionInsight {
  id?: string;
  type: "completion";
  title: string;
  content: string;
  data: {
    analyses: PageAnalysis[];
    globalScore: number;
    totalGaps: number;
    quickFixes: number;
    features: number;
    costUsd: number;
  };
  agent_name: string;
  created_at?: string;
}

export const SCORE_LEVELS = [
  { min: 0, max: 25, label: "Mockup", color: "#FF2D2D", bg: "bg-red-500", bgFaded: "bg-red-500/15", text: "text-red-400" },
  { min: 26, max: 50, label: "Skeleton", color: "#F59E0B", bg: "bg-amber-500", bgFaded: "bg-amber-500/15", text: "text-amber-400" },
  { min: 51, max: 75, label: "Functional", color: "#00B4D8", bg: "bg-cyan-500", bgFaded: "bg-cyan-500/15", text: "text-cyan-400" },
  { min: 76, max: 90, label: "Production", color: "#22C55E", bg: "bg-emerald-500", bgFaded: "bg-emerald-500/15", text: "text-emerald-400" },
  { min: 91, max: 100, label: "SOTA", color: "#00D4FF", bg: "bg-[#00D4FF]", bgFaded: "bg-[#00D4FF]/15", text: "text-[#00D4FF]" },
] as const;

export type ScoreLevel = (typeof SCORE_LEVELS)[number];

export function getScoreLevel(score: number): ScoreLevel {
  return SCORE_LEVELS.find((l) => score >= l.min && score <= l.max) ?? SCORE_LEVELS[0];
}

export function getScoreColor(score: number): string {
  return getScoreLevel(score).color;
}

export function pagePathToName(path: string): string {
  return (
    path
      .replace("src/app/(admin)/", "")
      .replace("src/app/(public)/", "")
      .replace("/page.tsx", "")
      .replace(/\//g, " > ") || "Dashboard"
  );
}

export function pagePathToRoute(path: string): string {
  return (
    "/" +
    path
      .replace("src/app/(admin)/", "")
      .replace("src/app/(public)/", "")
      .replace("/page.tsx", "")
  );
}

/** Badges for page analysis booleans */
export const ANALYSIS_BADGES = [
  { key: "hasRealData" as const, label: "Real Data", icon: "database" },
  { key: "hasLoading" as const, label: "Loading", icon: "loader" },
  { key: "hasErrorHandling" as const, label: "Errors", icon: "shield" },
  { key: "hasToast" as const, label: "Toast", icon: "bell" },
  { key: "hasSupabase" as const, label: "Supabase", icon: "server" },
] as const;

/** Filter presets */
export const FILTER_PRESETS = [
  { id: "all", label: "Toutes", min: 0, max: 100 },
  { id: "mockups", label: "Mockups", min: 0, max: 50 },
  { id: "skeleton", label: "Skeleton", min: 50, max: 75 },
  { id: "functional", label: "Functional", min: 75, max: 90 },
  { id: "sota", label: "SOTA", min: 90, max: 100 },
] as const;

/** System prompt for MiniMax page analysis */
export const ANALYSIS_SYSTEM_PROMPT = `Tu es un analyseur de code React/Next.js. Analyse le contenu de cette page et retourne un JSON strict.

Criteres de score (0-100):
- 0-25: Mockup (fake data, aucune logique)
- 26-50: Skeleton (structure, mais data statique)
- 51-75: Functional (Supabase, loading, basic error handling)
- 76-90: Production (toast, validation, real data, error boundaries)
- 91-100: SOTA (tests, optimistic UI, real-time, edge cases)

Detecte:
- has_real_data: appels Supabase/fetch reels (pas de const MOCK_DATA)
- has_loading: etats de chargement (Skeleton, spinner, loading state)
- has_error_handling: try/catch, error states, fallbacks
- has_toast: notifications utilisateur (toast, sonner)
- has_supabase: import et usage reel de supabase client
- mockups_found: patterns de fake data (MOCK_, hardcoded arrays, placeholder text)

Reponds UNIQUEMENT en JSON valide:
{
  "score": 0-100,
  "promises": ["ce que la page promet dans son UI"],
  "reality": ["ce qui fonctionne reellement"],
  "gaps": [{"type": "quick-fix|feature", "description": "...", "impact": 0-20, "fix": "code snippet si quick-fix"}],
  "has_real_data": true/false,
  "has_loading": true/false,
  "has_error_handling": true/false,
  "has_toast": true/false,
  "has_supabase": true/false,
  "mockups_found": ["patterns detectes"]
}`;
