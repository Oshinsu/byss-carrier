"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Eye,
  Layers,
  Loader2,
  Rocket,
  Scan,
  Shield,
  Target,
  X,
} from "lucide-react";
import type { PositionStats } from "@/types/gulf-stream";
import { glassCard, glassBg } from "@/types/gulf-stream";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Cercles Panel
   3 strategy circles: Intelligence, Execution, Patrimoine.
   Scanner results display.
   ═══════════════════════════════════════════════════════ */

interface CerclesPanelProps {
  liveMarketsCount: number;
  posStats: PositionStats;
  scannerRunning: boolean;
  scanResults: string;
  onClearScan: () => void;
  onRunScanner: () => void;
  onLaunchBot: () => void;
  onViewPositions: () => void;
}

export function CerclesPanel({
  liveMarketsCount,
  posStats,
  scannerRunning,
  scanResults,
  onClearScan,
  onRunScanner,
  onLaunchBot,
  onViewPositions,
}: CerclesPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={glassCard}
      style={glassBg}
    >
      <p className="mb-5 text-sm font-medium text-[var(--color-text)]">
        <Layers className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
        Les 3 Cercles — Actions Operationnelles
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Circle 1: Intelligence */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-500/10 blur-2xl" />
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Scan className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-cyan-400">
                Intelligence
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Cercle 1 — Gamma API</p>
            </div>
          </div>
          <div className="mb-4 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Marches live</span>
              <span className="font-mono text-cyan-300">{liveMarketsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">API</span>
              <span className="font-mono text-cyan-300">gamma-api.polymarket.com</span>
            </div>
          </div>
          <button
            onClick={onRunScanner}
            disabled={scannerRunning}
            className="w-full rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {scannerRunning ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              <>
                <Scan className="mr-1.5 inline h-3.5 w-3.5" />
                Scanner Polymarket
              </>
            )}
          </button>
        </motion.div>

        {/* Circle 2: Execution */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative overflow-hidden rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-5"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--color-gold)]/10 blur-2xl" />
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
              <Target className="h-5 w-5 text-[var(--color-gold)]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-gold)]">
                Execution
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Cercle 2 — CLOB API</p>
            </div>
          </div>
          <div className="mb-4 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Sizing</span>
              <span className="font-mono text-[var(--color-gold)]">Half-Kelly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Budget jour</span>
              <span className="font-semibold text-[var(--color-gold)]">$2.00</span>
            </div>
          </div>
          <button
            onClick={onLaunchBot}
            className="w-full rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-3 py-2 text-xs font-semibold text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/20"
          >
            <Rocket className="mr-1.5 inline h-3.5 w-3.5" />
            Lancer Bot
          </button>
        </motion.div>

        {/* Circle 3: Patrimoine */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-purple-500/5 p-5"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl" />
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-purple-400">
                Patrimoine
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Cercle 3 — Portfolio</p>
            </div>
          </div>
          <div className="mb-4 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Positions</span>
              <span className="font-semibold text-purple-300">{posStats.openCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Exposition</span>
              <span className="font-mono text-purple-300">${posStats.totalExposure.toFixed(0)}</span>
            </div>
          </div>
          <button
            onClick={onViewPositions}
            className="w-full rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-400 transition-all hover:bg-purple-500/20"
          >
            <Eye className="mr-1.5 inline h-3.5 w-3.5" />
            Voir Positions
          </button>
        </motion.div>
      </div>

      {/* Scanner results */}
      <AnimatePresence>
        {scanResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-lg border border-cyan-500/20 bg-black/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-cyan-400">
                  <Brain className="mr-1.5 inline h-3.5 w-3.5" />
                  Resultats du Scanner
                </p>
                <button
                  onClick={onClearScan}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[var(--color-text-muted)]">
                {scanResults}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
