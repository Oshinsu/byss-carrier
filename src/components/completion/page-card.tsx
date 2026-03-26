"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, ChevronUp, Zap, Database, Loader2, Shield, Bell, Server,
  CheckCircle2, XCircle,
} from "lucide-react";
import {
  type PageAnalysis, type Gap, getScoreLevel, getScoreColor,
  ANALYSIS_BADGES,
} from "@/lib/completion";
import { cn } from "@/lib/utils";

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

export function PageCard({
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
