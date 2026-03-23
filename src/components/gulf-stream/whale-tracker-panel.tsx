"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getTopWhales,
  getFollowedWhales,
  getWhaleConsensus,
  generateCopySignal,
  formatWhaleProfit,
  type WhaleWallet,
  type WhaleTrade,
  type CopySignal,
} from "@/lib/finance/whale-tracker";

// ── Helpers ──────────────────────────────────────────────────────

function outcomeColor(outcome?: WhaleTrade["outcome"]): string {
  if (outcome === "won") return "text-emerald-400";
  if (outcome === "lost") return "text-red-400";
  return "text-cyan-400/60";
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}j`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h`;
  return "<1h";
}

// ── Component ────────────────────────────────────────────────────

export default function WhaleTrackerPanel() {
  const [whales, setWhales] = useState<WhaleWallet[]>([]);
  const [selectedWhale, setSelectedWhale] = useState<WhaleWallet | null>(null);
  const [signals, setSignals] = useState<CopySignal[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const top = getTopWhales(10);
    setWhales(top);

    // Generate copy signals for active markets
    const markets = new Set<string>();
    top.forEach((w) => w.recentTrades.forEach((t) => markets.add(t.market)));

    const allWhales = getTopWhales(10);
    const sigs: CopySignal[] = [];
    markets.forEach((m) => {
      const signal = generateCopySignal(allWhales, m, 60);
      if (signal) sigs.push(signal);
    });
    setSignals(sigs.sort((a, b) => b.confidence - a.confidence));
  }, []);

  function handleCopySignal(signal: CopySignal) {
    navigator.clipboard.writeText(
      `${signal.market} | ${signal.direction} | ${signal.whaleAgreement.toFixed(0)}% consensus | ${signal.reasoning}`
    );
    setCopied(signal.market);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Whale Tracker
          </h2>
          <p className="text-xs text-cyan-500/50">
            {whales.length} whales suivies &middot;{" "}
            {getFollowedWhales().length} actives
          </p>
        </div>
        <div className="flex h-8 items-center rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 text-[11px] font-medium text-cyan-400">
          LIVE
          <span className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* Top Whales Table */}
      <div className="mb-6 overflow-hidden rounded-xl border border-cyan-500/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-cyan-500/10 bg-cyan-500/5 text-left text-[10px] uppercase tracking-widest text-cyan-500/50">
              <th className="px-3 py-2">Alias</th>
              <th className="px-3 py-2 text-right">Profit</th>
              <th className="px-3 py-2 text-right">Win Rate</th>
              <th className="px-3 py-2 text-right">Dernier Trade</th>
              <th className="px-3 py-2 text-center">Suivi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {whales.map((whale, i) => (
                <motion.tr
                  key={whale.address}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() =>
                    setSelectedWhale(
                      selectedWhale?.address === whale.address ? null : whale
                    )
                  }
                  className={`cursor-pointer border-b border-cyan-500/5 transition-colors hover:bg-cyan-500/5 ${
                    selectedWhale?.address === whale.address
                      ? "bg-cyan-500/10"
                      : ""
                  }`}
                >
                  <td className="px-3 py-2.5 font-medium text-cyan-50">
                    {whale.alias}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-emerald-400">
                    {formatWhaleProfit(whale.totalProfit)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-cyan-300">
                    {(whale.winRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-3 py-2.5 text-right text-cyan-500/50">
                    {whale.recentTrades[0]
                      ? `${whale.recentTrades[0].side} ${timeAgo(whale.recentTrades[0].timestamp)}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {whale.following ? (
                      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                    ) : (
                      <span className="inline-block h-2 w-2 rounded-full bg-cyan-500/20" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Selected Whale Detail */}
      <AnimatePresence>
        {selectedWhale && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4"
          >
            <h3 className="mb-3 text-sm font-semibold text-cyan-50">
              {selectedWhale.alias}{" "}
              <span className="font-normal text-cyan-500/40">
                &middot; Dernieres positions
              </span>
            </h3>
            <div className="space-y-2">
              {selectedWhale.recentTrades.map((trade, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                        trade.side === "YES"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {trade.side}
                    </span>
                    <span className="text-cyan-200">{trade.market}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-300">
                      ${(trade.amount / 1_000_000).toFixed(1)}M
                    </span>
                    <span className={outcomeColor(trade.outcome)}>
                      {trade.outcome ?? "pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Signals */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-cyan-50">
          Signaux de Copie
        </h3>
        {signals.length === 0 ? (
          <p className="text-xs text-cyan-500/40">
            Pas de consensus fort. Les baleines divergent.
          </p>
        ) : (
          <div className="space-y-2">
            {signals.map((signal) => (
              <motion.div
                key={signal.market}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-lg border border-cyan-500/10 bg-[#0A0A14] px-4 py-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                        signal.direction === "YES"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {signal.direction}
                    </span>
                    <span className="text-xs font-medium text-cyan-100">
                      {signal.market}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-cyan-500/50">
                    {signal.whaleAgreement.toFixed(0)}% consensus &middot;{" "}
                    {signal.topWhales.join(", ")}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  {/* Confidence bar */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-cyan-500/40">
                      Confiance
                    </span>
                    <div className="mt-0.5 h-1.5 w-16 overflow-hidden rounded-full bg-cyan-500/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${signal.confidence * 100}%`,
                        }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-cyan-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopySignal(signal)}
                    className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
                  >
                    {copied === signal.market ? "Copie !" : "Copier le signal"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
