"use client";

import { motion } from "motion/react";
import { Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Gap } from "@/lib/completion";

interface GapWithPage extends Gap {
  pagePath: string;
  pageName: string;
}

export function GapQueue({
  allGaps,
  onAutoFix,
}: {
  allGaps: GapWithPage[];
  onAutoFix: (pagePath: string, gap: Gap) => void;
}) {
  if (allGaps.length === 0) return null;

  return (
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
                onClick={() => onAutoFix(gap.pagePath, gap)}
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
  );
}
