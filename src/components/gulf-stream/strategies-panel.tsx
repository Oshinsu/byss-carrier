"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  STRATEGIES,
  scanAllStrategies,
  executeSignal,
  type Strategy,
  type TradeSignal,
  type RiskLevel,
} from "@/lib/finance/strategies";

// ── Helpers ──────────────────────────────────────────────────────

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; color: string; bg: string; border: string }
> = {
  conservative: {
    label: "Conservateur",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  moderate: {
    label: "Modere",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  aggressive: {
    label: "Agressif",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

// ── Component ────────────────────────────────────────────────────

export default function StrategiesPanel() {
  const [activeStrategies, setActiveStrategies] = useState<Set<string>>(
    new Set(STRATEGIES.map((s) => s.id))
  );
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [bankroll, setBankroll] = useState(25_000);
  const [scanning, setScanning] = useState(false);

  // Capital allocation per strategy
  const [allocations, setAllocations] = useState<Record<string, number>>({
    "high-prob-bonds": 40,
    "cross-platform-arb": 35,
    "multi-model-whale": 25,
  });

  async function runScan() {
    setScanning(true);
    try {
      const all = await scanAllStrategies();
      const filtered = all.filter((s) => activeStrategies.has(s.strategy));
      setSignals(filtered);
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    runScan();
  }, []);

  function toggleStrategy(id: string) {
    setActiveStrategies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateAllocation(id: string, value: number) {
    setAllocations((prev) => ({ ...prev, [id]: value }));
  }

  const totalAllocation = Object.values(allocations).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Strategies
          </h2>
          <p className="text-xs text-cyan-500/50">
            {STRATEGIES.length} strategies &middot;{" "}
            {activeStrategies.size} actives
          </p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:opacity-40"
        >
          {scanning ? "Scan..." : "Scanner"}
        </button>
      </div>

      {/* Bankroll */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-cyan-500/40">
          Bankroll
        </span>
        <input
          type="number"
          value={bankroll}
          onChange={(e) => setBankroll(Number(e.target.value))}
          className="w-28 rounded-lg border border-cyan-500/10 bg-[#0A0A14] px-3 py-1.5 font-mono text-xs text-cyan-50 outline-none focus:border-cyan-500/30"
        />
        <span className="text-xs text-cyan-500/40">USD</span>
        {totalAllocation !== 100 && (
          <span className="text-[10px] text-red-400">
            Allocation: {totalAllocation}% (doit etre 100%)
          </span>
        )}
      </div>

      {/* Strategy Cards */}
      <div className="mb-6 space-y-3">
        {STRATEGIES.map((strategy) => {
          const risk = RISK_CONFIG[strategy.risk];
          const isActive = activeStrategies.has(strategy.id);
          const alloc = allocations[strategy.id] ?? 0;
          const allocAmount = (bankroll * alloc) / 100;

          return (
            <motion.div
              key={strategy.id}
              layout
              className={`rounded-xl border p-4 transition-colors ${
                isActive
                  ? `${risk.border} ${risk.bg}`
                  : "border-cyan-500/5 bg-[#0A0A14] opacity-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-cyan-50">
                      {strategy.name}
                    </h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${risk.color} ${risk.bg}`}
                    >
                      {risk.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-cyan-500/50">
                    {strategy.description}
                  </p>
                  <div className="mt-2 flex gap-4 text-[10px] text-cyan-500/40">
                    <span>
                      ROI: {strategy.expectedROI.min}-
                      {strategy.expectedROI.max}%{" "}
                      {strategy.expectedROI.period}
                    </span>
                    <span>Min: ${strategy.minBankroll.toLocaleString()}</span>
                    <span>
                      {strategy.automatable ? "Automatisable" : "Manuel"}
                    </span>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleStrategy(strategy.id)}
                  className={`ml-4 mt-1 h-5 w-10 rounded-full transition-colors ${
                    isActive ? "bg-cyan-400" : "bg-cyan-500/20"
                  }`}
                >
                  <motion.div
                    animate={{ x: isActive ? 20 : 2 }}
                    className="h-4 w-4 rounded-full bg-white shadow"
                  />
                </button>
              </div>

              {/* Allocation Slider */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-center gap-3 border-t border-cyan-500/10 pt-3"
                >
                  <span className="text-[10px] text-cyan-500/40">
                    Allocation
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={alloc}
                    onChange={(e) =>
                      updateAllocation(strategy.id, Number(e.target.value))
                    }
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-cyan-500/10 accent-cyan-400"
                  />
                  <span className="font-mono text-xs text-cyan-300">
                    {alloc}%
                  </span>
                  <span className="font-mono text-[10px] text-cyan-500/40">
                    ${allocAmount.toLocaleString()}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Active Signals */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-cyan-50">
          Signaux Actifs
          {signals.length > 0 && (
            <span className="ml-2 font-mono text-xs font-normal text-cyan-500/40">
              ({signals.length})
            </span>
          )}
        </h3>
        {signals.length === 0 ? (
          <p className="text-xs text-cyan-500/40">
            {scanning ? "Scan en cours..." : "Aucun signal. La forge est froide."}
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {signals.slice(0, 8).map((signal, i) => {
                const risk = RISK_CONFIG[signal.risk];
                const alloc = allocations[signal.strategy] ?? 0;
                const strategyBankroll = (bankroll * alloc) / 100;
                const exec = executeSignal(signal, strategyBankroll);

                return (
                  <motion.div
                    key={`${signal.market}-${signal.strategy}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between rounded-lg border border-cyan-500/10 bg-[#0A0A14] px-4 py-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            signal.side === "YES"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {signal.side}
                        </span>
                        <span className="text-xs text-cyan-100">
                          {signal.market}
                        </span>
                        <span
                          className={`text-[9px] ${risk.color}`}
                        >
                          {risk.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-cyan-500/40">
                        {signal.reasoning}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-mono text-xs text-cyan-300">
                        ${exec.positionSize.toLocaleString()}
                      </p>
                      <p className="font-mono text-[10px] text-emerald-400">
                        +${exec.expectedPnL.toLocaleString()} PnL
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
