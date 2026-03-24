"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Database,
  Loader2,
  Shield,
  Bell,
  Server,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  BarChart3,
  Filter,
  ArrowUpDown,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  type PageAnalysis,
  type Gap,
  getScoreLevel,
  getScoreColor,
  pagePathToName,
  pagePathToRoute,
  ANALYSIS_BADGES,
  FILTER_PRESETS,
  SCORE_LEVELS,
} from "@/lib/completion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════
// AUTO-COMPLETION DASHBOARD
// Le vaisseau se diagnostique. Les quick-fixes s'appliquent.
// Les features passent par les gates.
// ═══════════════════════════════════════════════════════

type SortMode = "score_asc" | "score_desc" | "name";
type FilterMode = "all" | "mockups" | "skeleton" | "functional" | "sota";

/* ── Progress Ring ─────────────────────────────────── */

function ProgressRing({
  score,
  size = 160,
  strokeWidth = 10,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const level = getScoreLevel(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.2 0.01 270)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={level.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {/* Center score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-[family-name:var(--font-display)] text-4xl font-bold"
          style={{ color: level.color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-[var(--color-text-muted)]">/100</span>
      </div>
    </div>
  );
}

/* ── Score Bar ─────────────────────────────────────── */

function ScoreBar({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

/* ── Badge Icon Map ────────────────────────────────── */

const BADGE_ICONS: Record<string, React.ElementType> = {
  database: Database,
  loader: Loader2,
  shield: Shield,
  bell: Bell,
  server: Server,
};

/* ── Page Card ─────────────────────────────────────── */

function PageCard({
  analysis,
  onAutoFix,
  index,
}: {
  analysis: PageAnalysis;
  onAutoFix: (pagePath: string, gap: Gap) => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const level = getScoreLevel(analysis.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group overflow-hidden rounded-xl border border-[var(--color-border-subtle)] transition-colors hover:border-[var(--color-gold-muted)]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
      }}
    >
      <div className="p-4">
        {/* Top: name + score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
              {analysis.pageName}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)] font-mono truncate">
              {analysis.pagePath}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="font-[family-name:var(--font-display)] text-xl font-bold"
              style={{ color: level.color }}
            >
              {analysis.score}
            </span>
            <span
              className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold uppercase", level.bgFaded, level.text)}
            >
              {level.label}
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-3">
          <ScoreBar score={analysis.score} />
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ANALYSIS_BADGES.map(({ key, label, icon }) => {
            const active = analysis[key];
            const Icon = BADGE_ICONS[icon];
            return (
              <span
                key={key}
                className={cn(
                  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)]/50"
                )}
              >
                {active ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3 opacity-40" />
                )}
                {label}
              </span>
            );
          })}
          {analysis.gaps.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
              <Zap className="h-3 w-3" />
              {analysis.gaps.length} gap{analysis.gaps.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-md py-1 text-[11px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" /> Replier
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" /> Details
            </>
          )}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border-subtle)] p-4 space-y-3">
              {/* Promises vs Reality */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                    Promesses
                  </h4>
                  <ul className="space-y-1">
                    {analysis.promises.map((p, i) => (
                      <li key={i} className="text-[11px] text-[var(--color-text-muted)] flex items-start gap-1">
                        <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                        {p}
                      </li>
                    ))}
                    {analysis.promises.length === 0 && (
                      <li className="text-[11px] text-[var(--color-text-muted)]/40 italic">Aucune</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                    Realite
                  </h4>
                  <ul className="space-y-1">
                    {analysis.reality.map((r, i) => (
                      <li key={i} className="text-[11px] text-[var(--color-text-muted)] flex items-start gap-1">
                        <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                        {r}
                      </li>
                    ))}
                    {analysis.reality.length === 0 && (
                      <li className="text-[11px] text-[var(--color-text-muted)]/40 italic">Rien</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Mockups found */}
              {analysis.mockupsFound.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                    Fake Data Detectee
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.mockupsFound.map((m, i) => (
                      <span
                        key={i}
                        className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-mono text-red-400"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {analysis.gaps.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
                    Gaps ({analysis.gaps.length})
                  </h4>
                  <div className="space-y-2">
                    {analysis.gaps.map((gap) => (
                      <div
                        key={gap.id}
                        className="flex items-start gap-2 rounded-lg border border-[var(--color-border-subtle)] p-2.5"
                      >
                        <span
                          className={cn(
                            "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                            gap.type === "quick-fix"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-purple-500/15 text-purple-400"
                          )}
                        >
                          {gap.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[var(--color-text)]">{gap.description}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Impact: +{gap.impact} pts
                          </p>
                        </div>
                        {gap.type === "quick-fix" && gap.fix && gap.status === "pending" && (
                          <button
                            onClick={() => onAutoFix(analysis.pagePath, gap)}
                            className="shrink-0 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25"
                          >
                            Auto-Fix
                          </button>
                        )}
                        {gap.status === "applied" && (
                          <span className="shrink-0 text-[10px] text-emerald-400 font-semibold">
                            Applied
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function CompletionPage() {
  const [analyses, setAnalyses] = useState<PageAnalysis[]>([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [totalGaps, setTotalGaps] = useState(0);
  const [quickFixes, setQuickFixes] = useState(0);
  const [features, setFeatures] = useState(0);
  const [costUsd, setCostUsd] = useState(0);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("score_asc");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [autoPilot, setAutoPilot] = useState(false);

  // ── Fetch latest data ──────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/completion");
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.analyses || []);
        setGlobalScore(data.globalScore || 0);
        setTotalGaps(data.totalGaps || 0);
        setQuickFixes(data.quickFixes || 0);
        setFeatures(data.features || 0);
        setCostUsd(data.costUsd || 0);
        setLastRun(data.lastRun || null);
      }
    } catch (err) {
      console.error("Failed to fetch completion data:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Launch full analysis ───────────────────────────

  const handleAnalyzeAll = useCallback(async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze_all" }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.analyses || []);
        setGlobalScore(data.globalScore || 0);
        setTotalGaps(data.totalGaps || 0);
        setQuickFixes(data.quickFixes || 0);
        setFeatures(data.features || 0);
        setCostUsd(data.costUsd || 0);
        setLastRun(new Date().toISOString());
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    }
    setScanning(false);
  }, []);

  // ── Auto-fix handler ───────────────────────────────

  const handleAutoFix = useCallback(async (pagePath: string, gap: Gap) => {
    if (!gap.fix) return;
    try {
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "auto_fix",
          pagePath,
          gapId: gap.id,
          fix: gap.fix,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        // Update local state
        setAnalyses((prev) =>
          prev.map((a) => {
            if (a.pagePath === pagePath) {
              return {
                ...a,
                gaps: a.gaps.map((g) =>
                  g.id === gap.id ? { ...g, status: result.status as "applied" | "pending" } : g
                ),
              };
            }
            return a;
          })
        );
      }
    } catch (err) {
      console.error("Auto-fix failed:", err);
    }
  }, []);

  // ── Sorting & Filtering ────────────────────────────

  const filteredAndSorted = useMemo(() => {
    let result = [...analyses];

    // Filter
    if (filterMode !== "all") {
      const preset = FILTER_PRESETS.find((f) => f.id === filterMode);
      if (preset) {
        result = result.filter((a) => a.score >= preset.min && a.score < preset.max);
      }
    }

    // Sort
    switch (sortMode) {
      case "score_asc":
        result.sort((a, b) => a.score - b.score);
        break;
      case "score_desc":
        result.sort((a, b) => b.score - a.score);
        break;
      case "name":
        result.sort((a, b) => a.pageName.localeCompare(b.pageName));
        break;
    }

    return result;
  }, [analyses, sortMode, filterMode]);

  // ── All gaps flattened ─────────────────────────────

  const allGaps = useMemo(() => {
    return analyses
      .flatMap((a) => a.gaps.map((g) => ({ ...g, pagePath: a.pagePath, pageName: a.pageName })))
      .sort((a, b) => b.impact - a.impact);
  }, [analyses]);

  // ── Score distribution ─────────────────────────────

  const distribution = useMemo(() => {
    return SCORE_LEVELS.map((level) => ({
      ...level,
      count: analyses.filter((a) => a.score >= level.min && a.score <= level.max).length,
    }));
  }, [analyses]);

  // ── Cost estimation to reach 90% ───────────────────

  const costTo90 = useMemo(() => {
    const pagesBelow90 = analyses.filter((a) => a.score < 90).length;
    // Rough: 3 iterations per page, $0.007 per scan + $0.02 per fix
    return Math.round(pagesBelow90 * 3 * 0.027 * 100) / 100;
  }, [analyses]);

  return (
    <div className="space-y-8 p-6">
      {/* ── Header ────────────────────────────────────── */}
      <PageHeader
        title="Auto-"
        titleAccent="Completion"
        subtitle="Self-Improving System — MiniMax M2.7 x Claude Sonnet"
        actions={
          <div className="flex items-center gap-3">
            {/* Auto-pilot toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--color-text-muted)]">Auto-Pilot</span>
              <button
                onClick={() => setAutoPilot(!autoPilot)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors duration-200",
                  autoPilot ? "bg-[var(--color-gold)]" : "bg-[var(--color-surface)]"
                )}
              >
                <motion.div
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md"
                  animate={{ left: autoPilot ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyzeAll}
              disabled={scanning}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                scanning
                  ? "bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-wait"
                  : "bg-[var(--color-gold)] text-[#0A0A0F] hover:brightness-110"
              )}
            >
              {scanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Lancer l&apos;analyse
                </>
              )}
            </button>
          </div>
        }
      />

      {/* ── Auto-pilot description ────────────────────── */}
      <AnimatePresence>
        {autoPilot && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[var(--color-gold)]" />
                <span className="text-sm font-semibold text-[var(--color-gold)]">
                  Mode Auto-Amelioration
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                L&apos;app s&apos;ameliore seule. Les quick-fixes s&apos;appliquent automatiquement.
                Les features passent par les gates.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global Score + KPIs ────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Progress ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-border-subtle)] p-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <ProgressRing score={globalScore} />
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-[var(--color-text)]">Score Global</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {analyses.length} pages analysees
            </p>
            {lastRun && (
              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]/60">
                <Clock className="mr-1 inline h-3 w-3" />
                {new Date(lastRun).toLocaleString("fr-FR")}
              </p>
            )}
          </div>
        </motion.div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Pages Scannees"
            value={analyses.length}
            icon={BarChart3}
            loading={loading}
            delay={0}
          />
          <StatCard
            title="Quick-Fixes"
            value={quickFixes}
            icon={Zap}
            loading={loading}
            delay={0.1}
            subtitle="Applicables auto"
          />
          <StatCard
            title="Features"
            value={features}
            icon={Sparkles}
            loading={loading}
            delay={0.2}
            subtitle="Approbation requise"
          />
          <StatCard
            title="Cout Total"
            value={`$${costUsd.toFixed(3)}`}
            icon={DollarSign}
            loading={loading}
            delay={0.3}
            subtitle={`~$${costTo90} pour atteindre 90%`}
          />
        </div>
      </div>

      {/* ── Distribution ──────────────────────────────── */}
      {analyses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Distribution</h3>
          <div className="flex items-end gap-2">
            {distribution.map((level) => {
              const maxCount = Math.max(...distribution.map((d) => d.count), 1);
              const height = Math.max(8, (level.count / maxCount) * 80);
              return (
                <div key={level.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold" style={{ color: level.color }}>
                    {level.count}
                  </span>
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{ backgroundColor: level.color, opacity: 0.7 }}
                    initial={{ height: 0 }}
                    animate={{ height }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  />
                  <span className="text-[9px] text-[var(--color-text-muted)] text-center">
                    {level.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Filters + Sort ────────────────────────────── */}
      {analyses.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter chips */}
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setFilterMode(preset.id as FilterMode)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                  filterMode === preset.id
                    ? "bg-[var(--color-gold)]/15 text-[var(--color-gold)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[var(--color-border-subtle)]" />

          {/* Sort */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            {(
              [
                { id: "score_asc", label: "Pire d'abord" },
                { id: "score_desc", label: "Meilleur d'abord" },
                { id: "name", label: "Nom" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setSortMode(s.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                  sortMode === s.id
                    ? "bg-[var(--color-gold)]/15 text-[var(--color-gold)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[11px] text-[var(--color-text-muted)]">
            {filteredAndSorted.length}/{analyses.length} pages
          </div>
        </div>
      )}

      {/* ── Page Scores Grid ──────────────────────────── */}
      {filteredAndSorted.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((analysis, i) => (
            <PageCard
              key={analysis.pagePath}
              analysis={analysis}
              onAutoFix={handleAutoFix}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && analyses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Sparkles className="h-12 w-12 text-[var(--color-gold)] mb-4 opacity-40" />
          <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
            Aucune analyse.
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Le miroir n&apos;a pas encore regarde. Lance l&apos;analyse.
          </p>
        </motion.div>
      )}

      {/* ── Gap Queue ─────────────────────────────────── */}
      {allGaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-[var(--color-border-subtle)] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <div className="border-b border-[var(--color-border-subtle)] p-4">
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-text)]">
              Gap Queue
              <span className="ml-2 text-sm text-[var(--color-text-muted)] font-normal">
                {allGaps.length} gaps — tries par impact
              </span>
            </h3>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {allGaps.slice(0, 20).map((gap, i) => (
              <div
                key={gap.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface)]/30"
              >
                <span className="text-[11px] font-mono text-[var(--color-text-muted)] w-6 shrink-0 text-right">
                  #{i + 1}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                    gap.type === "quick-fix"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-purple-500/15 text-purple-400"
                  )}
                >
                  {gap.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[var(--color-text)] truncate">{gap.description}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{gap.pageName}</p>
                </div>
                <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  +{gap.impact} pts
                </span>
                {gap.type === "quick-fix" && gap.fix && gap.status === "pending" && (
                  <button
                    onClick={() => handleAutoFix(gap.pagePath, gap)}
                    className="shrink-0 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                  >
                    Auto-Fix
                  </button>
                )}
                {gap.status === "applied" && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                )}
                {gap.status === "pending" && gap.type === "feature" && (
                  <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                    Gate
                  </span>
                )}
              </div>
            ))}
          </div>
          {allGaps.length > 20 && (
            <div className="border-t border-[var(--color-border-subtle)] p-3 text-center">
              <span className="text-[11px] text-[var(--color-text-muted)]">
                + {allGaps.length - 20} gaps supplementaires
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Cost Monitor ──────────────────────────────── */}
      {analyses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-text)] mb-4">
            Cost Monitor
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
                Cout analyse
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-gold)]">
                ${costUsd.toFixed(3)}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">MiniMax M2.7</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
                Cout vers 90%
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-amber-400">
                ~${costTo90}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Estimation iterations</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
                Repartition
              </p>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400">MiniMax M2.7</span>
                  <span className="text-[var(--color-text-muted)]">~85%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-400">Claude Sonnet</span>
                  <span className="text-[var(--color-text-muted)]">~12%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-400">Claude Opus</span>
                  <span className="text-[var(--color-text-muted)]">~3%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
