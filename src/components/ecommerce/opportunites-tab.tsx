"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Search, Loader2, Sparkles, Globe, TrendingUp, DollarSign, Store } from "lucide-react";
import { TARGET_MARKETS, NICHES, type MarketAnalysis } from "@/lib/ecommerce";
import { ScoreBadge, CompetitionBadge, InfoCard, EmptyState } from "./shared";

export function OpportunitiesTab({
  analyses,
  setAnalyses,
}: {
  analyses: MarketAnalysis[];
  setAnalyses: (v: MarketAnalysis[] | ((p: MarketAnalysis[]) => MarketAnalysis[])) => void;
}) {
  const [niche, setNiche] = useState("");
  const [country, setCountry] = useState("ph");
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<MarketAnalysis | null>(null);

  const analyze = useCallback(async () => {
    if (!niche) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ecommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze_market", niche, country }),
      });
      const json = await res.json();
      if (json.data) {
        setCurrentResult(json.data);
        setAnalyses((prev) => [json.data, ...prev.slice(0, 19)]);
      }
    } catch (err) {
      console.error("[ecom] analyze error:", err);
    } finally {
      setLoading(false);
    }
  }, [niche, country, setAnalyses]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Search className="h-4 w-4 text-cyan-400" />
          Analyse de marche
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Niche</label>
            <div className="relative">
              <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
                <option value="">Choisir une niche...</option>
                {NICHES.map((n) => (<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
          </div>
          <div className="w-48">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Marche</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              {TARGET_MARKETS.map((m) => (<option key={m.id} value={m.id}>{m.flag} {m.name}</option>))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={analyze} disabled={loading || !niche} className="flex items-center gap-2 rounded-lg bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:opacity-40">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyser le marche
            </button>
          </div>
        </div>
      </div>

      {currentResult && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              {currentResult.niche} — {TARGET_MARKETS.find((m) => m.id === currentResult.country)?.name || currentResult.country}
            </h3>
            <div className="flex items-center gap-3">
              <ScoreBadge score={currentResult.score} />
              <CompetitionBadge level={currentResult.competitionLevel} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <InfoCard label="Taille du marche" value={currentResult.marketSize} icon={Globe} />
            <InfoCard label="Marges estimees" value={currentResult.estimatedMargins} icon={TrendingUp} />
            <InfoCard label="Cout de demarrage" value={currentResult.startupCost} icon={DollarSign} />
            <InfoCard label="Plateformes" value={currentResult.recommendedPlatforms.join(", ")} icon={Store} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Produits tendance</p>
              <div className="flex flex-wrap gap-1.5">
                {currentResult.trendingProducts.map((p, i) => (
                  <span key={i} className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] text-cyan-400">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Strategie Ads</p>
              <p className="text-xs text-[var(--color-text-muted)]">{currentResult.adStrategy}</p>
            </div>
          </div>
        </motion.div>
      )}

      {analyses.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Historique ({analyses.length})</h3>
          <div className="grid grid-cols-3 gap-3">
            {analyses.map((a, i) => (
              <motion.div key={`${a.niche}-${a.country}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => setCurrentResult(a)} className="cursor-pointer rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all hover:border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[var(--color-text)]">{a.niche}</p>
                  <ScoreBadge score={a.score} small />
                </div>
                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                  {TARGET_MARKETS.find((m) => m.id === a.country)?.flag} {TARGET_MARKETS.find((m) => m.id === a.country)?.name || a.country}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {analyses.length === 0 && !currentResult && (
        <EmptyState text="Le marche attend. Lance la premiere analyse." />
      )}
    </div>
  );
}
