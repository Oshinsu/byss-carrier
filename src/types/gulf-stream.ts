/* ═══════════════════════════════════════════════════════
   GULF STREAM — Types
   Polymarket entries, positions, analysis, predictions.
   ═══════════════════════════════════════════════════════ */

export interface PolymarketEntry {
  id: string;
  question: string;
  outcomes: string[];
  outcomePrices: number[];
  volume: number;
  liquidity: number;
  category: string;
  endDate: string;
  slug?: string;
  description?: string;
}

export interface GulfPosition {
  id: string;
  market_id: string | null;
  market_title: string;
  side: "yes" | "no";
  entry_price: number;
  current_price: number;
  size_usd: number;
  pnl: number;
  status: "open" | "closed" | "pending";
  notes: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface AnalysisResult {
  marketId: string;
  analysis: string;
  loading: boolean;
}

export interface PredictionResult {
  marketId: string;
  fairValue: number;
  edge: number;
  reasoning: string;
  loading: boolean;
}

export interface KellyResult {
  fraction: number;
  halfKelly: number;
  size: number;
  edge: number;
}

export interface PositionStats {
  totalPnl: number;
  totalExposure: number;
  openCount: number;
  closedCount: number;
  winRate: number;
}

export interface NewPositionForm {
  market_id: string;
  market_title: string;
  side: "yes" | "no";
  entry_price: string;
  size_usd: string;
  notes: string;
}

export type GulfPanel = "markets" | "positions" | "x402" | "research";

/* ── Helpers ── */

export function calcKelly(
  fairValue: number,
  marketPrice: number
): KellyResult {
  const p = fairValue;
  const b = 1 / marketPrice - 1;
  const q = 1 - p;
  const kelly = Math.max(0, (p * b - q) / b);
  const halfKelly = kelly * 0.5;
  const dailyBudget = 2.0;
  return {
    fraction: kelly,
    halfKelly,
    size: +(halfKelly * dailyBudget).toFixed(2),
    edge: +(fairValue - marketPrice).toFixed(4),
  };
}

export function fmtUsd(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(0)}K`
      : `$${n.toFixed(0)}`;
}

export function fmtDate(d: string) {
  if (!d) return "N/A";
  try {
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

export const MARKET_CATEGORIES = [
  "All",
  "Politics",
  "Crypto",
  "Tech",
  "Sports",
  "Science",
  "Economics",
];

/* ── Shared style tokens ── */
export const glassCard =
  "rounded-xl border border-[var(--color-border-subtle)] p-5";

export const glassBg: React.CSSProperties = {
  background:
    "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
};

export const inputCls =
  "w-full rounded-lg border border-[var(--color-border-subtle)] bg-black/30 px-3 py-2 font-mono text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-gold)] focus:shadow-[0_0_12px_oklch(0.75_0.12_85/0.2)] placeholder:text-[var(--color-text-muted)]/50";

export const btnGold =
  "flex items-center gap-2 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-2 text-sm font-medium text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/20 hover:shadow-[0_0_20px_oklch(0.75_0.12_85/0.2)]";

export const btnSubtle =
  "flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]";
