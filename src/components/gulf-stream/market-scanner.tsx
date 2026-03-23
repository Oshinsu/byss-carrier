"use client";

import { motion } from "motion/react";
import {
  Brain,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type {
  PolymarketEntry,
  AnalysisResult,
  PredictionResult,
} from "@/types/gulf-stream";
import {
  fmtUsd,
  fmtDate,
  MARKET_CATEGORIES,
  glassCard,
  glassBg,
  inputCls,
} from "@/types/gulf-stream";
import { MarketAnalysis } from "./market-analysis";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Market Scanner
   Polymarket live feed: search, categories, cards grid.
   ═══════════════════════════════════════════════════════ */

interface MarketScannerProps {
  markets: PolymarketEntry[];
  marketsLoading: boolean;
  marketSearch: string;
  onSearchChange: (v: string) => void;
  marketCategory: string;
  onCategoryChange: (v: string) => void;
  selectedMarket: PolymarketEntry | null;
  onSelectMarket: (m: PolymarketEntry) => void;
  analyses: Map<string, AnalysisResult>;
  predictions: Map<string, PredictionResult>;
  onAnalyze: (m: PolymarketEntry) => void;
  onPredict: (m: PolymarketEntry) => void;
  onRefresh: () => void;
}

export function MarketScanner({
  markets,
  marketsLoading,
  marketSearch,
  onSearchChange,
  marketCategory,
  onCategoryChange,
  selectedMarket,
  onSelectMarket,
  analyses,
  predictions,
  onAnalyze,
  onPredict,
  onRefresh,
}: MarketScannerProps) {
  return (
    <div className="space-y-4">
      <div className={glassCard} style={glassBg}>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-text)]">
            <Globe className="mr-2 inline h-4 w-4 text-cyan-400" />
            Polymarket Live Feed
          </p>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-md border border-[var(--color-border-subtle)] px-2.5 py-1 text-[10px] text-[var(--color-text-muted)] hover:border-cyan-500/50"
          >
            <RefreshCw className={cn("h-3 w-3", marketsLoading && "animate-spin")} />
            Actualiser
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Rechercher un marche..."
            value={marketSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(inputCls, "pl-9")}
          />
        </div>

        {/* Categories */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[10px] font-medium transition-all",
                marketCategory === cat
                  ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-400"
                  : "border border-transparent bg-white/[0.03] text-[var(--color-text-muted)] hover:border-[var(--color-border-subtle)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Market cards */}
        {marketsLoading && markets.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        ) : markets.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2">
            <Globe className="h-8 w-8 text-[var(--color-text-muted)]/30" />
            <p className="text-xs text-[var(--color-text-muted)]">
              Aucun marche.{" "}
              <button onClick={onRefresh} className="text-cyan-400 underline">
                Charger
              </button>
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {markets.map((market, i) => {
              const analysis = analyses.get(market.id);
              const prediction = predictions.get(market.id);
              const yesPrice = market.outcomePrices[0] || 0.5;
              const noPrice = market.outcomePrices[1] || 0.5;

              return (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    selectedMarket?.id === market.id
                      ? "border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_30px_oklch(0.70_0.15_200/0.1)]"
                      : "border-[var(--color-border-subtle)] bg-white/[0.02] hover:border-cyan-500/20"
                  )}
                  onClick={() => onSelectMarket(market)}
                >
                  {/* Question */}
                  <p className="mb-2 text-xs font-medium leading-tight text-[var(--color-text)]">
                    {market.question}
                  </p>

                  {/* Prices */}
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        {(yesPrice * 100).toFixed(0)}c
                      </span>
                      <span className="text-[9px] text-[var(--color-text-muted)]">YES</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="font-mono text-sm font-bold text-red-400">
                        {(noPrice * 100).toFixed(0)}c
                      </span>
                      <span className="text-[9px] text-[var(--color-text-muted)]">NO</span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
                    <span>Vol: {fmtUsd(market.volume)}</span>
                    <span>Liq: {fmtUsd(market.liquidity)}</span>
                    <span>Fin: {fmtDate(market.endDate)}</span>
                    {market.category && (
                      <Badge variant="default" size="sm">
                        {market.category}
                      </Badge>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnalyze(market);
                      }}
                      disabled={analysis?.loading}
                      className="flex-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1.5 text-[10px] font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:opacity-50"
                    >
                      {analysis?.loading ? (
                        <Loader2 className="mx-auto h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Brain className="mr-1 inline h-3 w-3" />
                          Analyser
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPredict(market);
                      }}
                      disabled={prediction?.loading}
                      className="flex-1 rounded-md border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-2 py-1.5 text-[10px] font-semibold text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/20 disabled:opacity-50"
                    >
                      {prediction?.loading ? (
                        <Loader2 className="mx-auto h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Target className="mr-1 inline h-3 w-3" />
                          Predire
                        </>
                      )}
                    </button>
                  </div>

                  {/* Analysis result */}
                  <MarketAnalysis analysis={analysis} prediction={prediction} />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
