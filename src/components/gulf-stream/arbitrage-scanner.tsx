"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  scanArbitrageOpportunities,
  getArbitrageSummary,
  getHistoricalSpreads,
  type ArbitrageOpportunity,
  type HistoricalSpread,
} from "@/lib/finance/arbitrage";

// ── Helpers ──────────────────────────────────────────────────────

function spreadColor(spread: number): string {
  if (spread >= 0.05) return "text-emerald-400";
  if (spread >= 0.02) return "text-cyan-300";
  return "text-cyan-500/60";
}

function directionLabel(
  dir: ArbitrageOpportunity["direction"]
): { poly: string; kalshi: string } {
  return dir === "buy_poly_yes_kalshi_no"
    ? { poly: "YES", kalshi: "NO" }
    : { poly: "NO", kalshi: "YES" };
}

// ── Component ────────────────────────────────────────────────────

export default function ArbitrageScanner() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>(
    []
  );
  const [summary, setSummary] = useState<ReturnType<
    typeof getArbitrageSummary
  > | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoricalSpread[]>([]);
  const [alertThreshold, setAlertThreshold] = useState(3); // percent

  useEffect(() => {
    const opps = scanArbitrageOpportunities();
    setOpportunities(opps);
    setSummary(getArbitrageSummary());
  }, []);

  useEffect(() => {
    if (selectedMarket) {
      setHistory(getHistoricalSpreads(selectedMarket));
    }
  }, [selectedMarket]);

  // Detect alerts
  const alertOpps = opportunities.filter(
    (o) => o.spread * 100 >= alertThreshold
  );

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Arbitrage Scanner
          </h2>
          <p className="text-xs text-cyan-500/50">
            Polymarket &harr; Kalshi &middot; Spreads en temps reel
          </p>
        </div>
        {alertOpps.length > 0 && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-400"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            {alertOpps.length} ALERTE{alertOpps.length > 1 ? "S" : ""}
          </motion.div>
        )}
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-cyan-500/10 bg-[#0A0A14] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-cyan-500/40">
              Opportunites
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-cyan-50">
              {summary.viableOpportunities}
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/10 bg-[#0A0A14] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-cyan-500/40">
              Profit Moyen
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-emerald-400">
              {(summary.averageProfitPerDollar * 100).toFixed(2)}c/$
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/10 bg-[#0A0A14] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-cyan-500/40">
              Meilleur Spread
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-cyan-300">
              {summary.bestOpportunity
                ? `${(summary.bestOpportunity.spread * 100).toFixed(1)}%`
                : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Alert Threshold Slider */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-cyan-500/40">
          Seuil Alerte
        </span>
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(parseFloat(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-cyan-500/10 accent-cyan-400"
        />
        <span className="font-mono text-xs text-cyan-300">
          {alertThreshold}%
        </span>
      </div>

      {/* Opportunities Table */}
      <div className="mb-6 overflow-hidden rounded-xl border border-cyan-500/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-cyan-500/10 bg-cyan-500/5 text-left text-[10px] uppercase tracking-widest text-cyan-500/50">
              <th className="px-3 py-2">Marche</th>
              <th className="px-3 py-2 text-center">Direction</th>
              <th className="px-3 py-2 text-right">Poly</th>
              <th className="px-3 py-2 text-right">Kalshi</th>
              <th className="px-3 py-2 text-right">Spread</th>
              <th className="px-3 py-2 text-right">Profit Net</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {opportunities.map((opp, i) => {
                const dir = directionLabel(opp.direction);
                const isAlert = opp.spread * 100 >= alertThreshold;
                return (
                  <motion.tr
                    key={`${opp.market}-${opp.direction}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() =>
                      setSelectedMarket(
                        selectedMarket === opp.market ? null : opp.market
                      )
                    }
                    className={`cursor-pointer border-b border-cyan-500/5 transition-colors hover:bg-cyan-500/5 ${
                      isAlert ? "bg-red-500/5" : ""
                    } ${selectedMarket === opp.market ? "bg-cyan-500/10" : ""}`}
                  >
                    <td className="px-3 py-2.5 font-medium text-cyan-50">
                      {opp.market}
                      {isAlert && (
                        <span className="ml-2 text-[9px] text-red-400">
                          ALERTE
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[10px] font-bold text-emerald-400">
                        P:{dir.poly}
                      </span>
                      <span className="mx-1 text-cyan-500/30">+</span>
                      <span className="rounded bg-blue-500/10 px-1 py-0.5 text-[10px] font-bold text-blue-400">
                        K:{dir.kalshi}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-cyan-300">
                      {(opp.polymarketYesPrice * 100).toFixed(0)}c
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-cyan-300">
                      {(opp.kalshiYesPrice * 100).toFixed(0)}c
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono font-bold ${spreadColor(opp.spread)}`}
                    >
                      {(opp.spread * 100).toFixed(2)}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-400">
                      {(opp.profitPerDollar * 100).toFixed(2)}c/$
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {opportunities.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-cyan-500/40">
            Aucun spread exploitable. Les prix convergent.
          </div>
        )}
      </div>

      {/* Historical Spread Chart (bar representation) */}
      <AnimatePresence>
        {selectedMarket && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-cyan-500/10 bg-[#0A0A14] p-4"
          >
            <h3 className="mb-3 text-sm font-semibold text-cyan-50">
              Historique des Spreads{" "}
              <span className="font-normal text-cyan-500/40">
                &middot; {selectedMarket}
              </span>
            </h3>
            <div className="flex items-end gap-2">
              {history.map((day, i) => (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: day.maxSpread * 800 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="w-full rounded-t bg-cyan-500/20"
                    style={{ minHeight: 4 }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: day.averageSpread * 800 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                      className="w-full rounded-t bg-cyan-400/60"
                      style={{ minHeight: 2 }}
                    />
                  </motion.div>
                  <span className="text-[9px] text-cyan-500/40">
                    {day.date.slice(8)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-4 text-[9px] text-cyan-500/40">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm bg-cyan-400/60" />
                Spread moyen
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm bg-cyan-500/20" />
                Spread max
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fee breakdown */}
      <div className="mt-4 flex items-center gap-4 text-[10px] text-cyan-500/30">
        <span>Fees: Poly 2% winner &middot; Kalshi ~7% max</span>
        <span>&middot; Min spread viable: 0.5%</span>
      </div>
    </div>
  );
}
