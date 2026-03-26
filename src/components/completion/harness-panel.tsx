"use client";

import { motion, AnimatePresence } from "motion/react";
import { Bot, Target, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageAnalysis } from "@/lib/completion";
import type { EvaluationResult } from "@/lib/harness/engine";

export function HarnessPanel({
  analyses,
  harnessEvals,
  harnessRunning,
  harnessResult,
  onHarnessFullRun,
  onHarnessEval,
}: {
  analyses: PageAnalysis[];
  harnessEvals: Record<string, { evaluation: EvaluationResult; loading: boolean }>;
  harnessRunning: boolean;
  harnessResult: {
    success: boolean;
    final_score: number;
    iterations: number;
    pivoted: boolean;
    cost_usd: number;
    evaluations: EvaluationResult[];
  } | null;
  onHarnessFullRun: () => void;
  onHarnessEval: (pagePath: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-xl border border-[var(--color-border-subtle)] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.02 200 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
      }}
    >
      <div className="border-b border-[var(--color-border-subtle)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-400" />
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-text)]">
            GAN Harness
          </h3>
          <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-400">
            Generator vs Evaluator
          </span>
        </div>
        <button
          onClick={onHarnessFullRun}
          disabled={harnessRunning}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            harnessRunning
              ? "bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-wait"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30",
          )}
        >
          {harnessRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Harness en cours...
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Lancer le Harness
            </>
          )}
        </button>
      </div>

      {/* Harness result summary */}
      <AnimatePresence>
        {harnessResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[var(--color-border-subtle)] p-4"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">Score Final</p>
                <p
                  className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold"
                  style={{ color: harnessResult.final_score >= 75 ? "#10b981" : "#ef4444" }}
                >
                  {harnessResult.final_score}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">Pages</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-cyan-400">
                  {harnessResult.iterations}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">Verdict</p>
                <p className={cn(
                  "mt-1 font-[family-name:var(--font-display)] text-lg font-bold",
                  harnessResult.success ? "text-emerald-400" : "text-red-400",
                )}>
                  {harnessResult.success ? "PASS" : "FAIL"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">Pivot</p>
                <p className="mt-1 flex items-center gap-1 text-sm">
                  {harnessResult.pivoted ? (
                    <><RotateCcw className="h-4 w-4 text-amber-400" /><span className="text-amber-400 font-bold">OUI</span></>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">Non</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">Cout</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-gold)]">
                  ${harnessResult.cost_usd.toFixed(3)}
                </p>
              </div>
            </div>

            {/* Per-evaluation breakdown */}
            {harnessResult.evaluations.length > 0 && (
              <div className="mt-4 space-y-2">
                {harnessResult.evaluations.map((ev, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] p-3"
                  >
                    <span className="text-[11px] font-mono text-[var(--color-text-muted)] w-4 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex gap-3 text-[11px]">
                        <span className="text-cyan-400">Fonc: {ev.criteria?.fonctionnalite ?? "?"}/25</span>
                        <span className="text-purple-400">Code: {ev.criteria?.qualite_code ?? "?"}/25</span>
                        <span className="text-amber-400">Design: {ev.criteria?.design ?? "?"}/25</span>
                        <span className="text-emerald-400">Integ: {ev.criteria?.integration ?? "?"}/25</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-[family-name:var(--font-display)] text-lg font-bold",
                        ev.score >= 75 ? "text-emerald-400" : "text-red-400",
                      )}
                    >
                      {ev.score}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                        ev.passed ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
                      )}
                    >
                      {ev.passed ? "PASS" : "FAIL"}
                    </span>
                    {ev.issues?.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        {ev.issues.length}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Per-page harness eval buttons */}
      {analyses.length > 0 && (
        <div className="p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Evaluer par page (Evaluateur Sceptique)
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.slice(0, 12).map((a) => {
              const hev = harnessEvals[a.pagePath];
              return (
                <div
                  key={a.pagePath}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] p-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[var(--color-text)] truncate">
                      {a.pageName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        Gen: <span className="font-bold text-cyan-400">{a.score}</span>
                      </span>
                      {hev?.evaluation && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          Eval: <span
                            className={cn(
                              "font-bold",
                              hev.evaluation.score >= 75 ? "text-emerald-400" : "text-red-400",
                            )}
                          >
                            {hev.evaluation.score}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onHarnessEval(a.pagePath)}
                    disabled={hev?.loading}
                    className={cn(
                      "shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors",
                      hev?.loading
                        ? "bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-wait"
                        : "bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25",
                    )}
                  >
                    {hev?.loading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Evaluer"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
