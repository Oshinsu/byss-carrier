"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { BookOpen, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { calcKelly, glassCard, glassBg, inputCls } from "@/types/gulf-stream";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Kelly Calculator & Research
   Position sizing + academic foundations.
   ═══════════════════════════════════════════════════════ */

interface KellyResearchProps {
  kellyFair: string;
  setKellyFair: (v: string) => void;
  kellyMarket: string;
  setKellyMarket: (v: string) => void;
}

export function KellyResearch({
  kellyFair,
  setKellyFair,
  kellyMarket,
  setKellyMarket,
}: KellyResearchProps) {
  const kellyResult = useMemo(() => {
    const fv = parseFloat(kellyFair) || 0;
    const mp = parseFloat(kellyMarket) || 0;
    if (fv <= 0 || fv >= 1 || mp <= 0 || mp >= 1) return null;
    return calcKelly(fv, mp);
  }, [kellyFair, kellyMarket]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Kelly Calculator */}
      <div className={glassCard} style={glassBg}>
        <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
          <Gauge className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
          Kelly Calculator
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Fair Value (0-1)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={kellyFair}
              onChange={(e) => setKellyFair(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Market Price (0-1)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={kellyMarket}
              onChange={(e) => setKellyMarket(e.target.value)}
              className={inputCls}
            />
          </div>

          {kellyResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-4"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Edge</span>
                  <span className={cn("font-mono font-bold", kellyResult.edge > 0 ? "text-cyan-400" : "text-red-400")}>
                    {kellyResult.edge > 0 ? "+" : ""}
                    {(kellyResult.edge * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Full Kelly</span>
                  <span className="font-mono text-[var(--color-text)]">
                    {(kellyResult.fraction * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Half-Kelly</span>
                  <span className="font-mono font-bold text-[var(--color-gold)]">
                    {(kellyResult.halfKelly * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-px bg-[var(--color-border-subtle)]" />
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Taille recommandee</span>
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-gold)]">
                    ${kellyResult.size.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Sur budget $2/jour | Clamp 5% max bankroll
                </p>
              </div>
            </motion.div>
          )}

          {kellyResult && kellyResult.edge <= 0 && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center">
              <p className="text-xs font-semibold text-red-400">NO EDGE DETECTED</p>
              <p className="text-[10px] text-red-400/60">Ne pas trader.</p>
            </div>
          )}
        </div>
      </div>

      {/* Academic Foundations */}
      <div className={glassCard} style={glassBg}>
        <p className="mb-5 text-sm font-medium text-[var(--color-text)]">
          <BookOpen className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
          Academic Foundations
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-400">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  &quot;Agents of Chaos&quot; — LLM Collusion
                </p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  LLM agents develop collusive strategies in prediction markets without governance
                  constraints. Motivates phi-engine as externalized governance.
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="danger" size="sm">Agent Collusion</Badge>
                  <Badge variant="default" size="sm">Governance Required</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold)]/10 text-xs font-bold text-[var(--color-gold)]">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Kelly Criterion &amp; Optimal Betting
                </p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  f* = (bp - q) / b. Half-Kelly captures ~75% of growth with ~50% variance. Default
                  multiplier: 0.5.
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="gold" size="sm">Position Sizing</Badge>
                  <Badge variant="default" size="sm">Half-Kelly</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-400">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Prediction Market Microstructure
                </p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Polymarket CLOB architecture: GTC/GTD/FOK/FAK order types. WebSocket streaming for
                  real-time price discovery.
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="info" size="sm">CLOB Architecture</Badge>
                  <Badge variant="default" size="sm">NautilusTrader</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
