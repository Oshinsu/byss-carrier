"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onGulfPositionOpened, onGulfPositionClosed } from "@/lib/synergies";
import type {
  PolymarketEntry,
  GulfPosition,
  AnalysisResult,
  PredictionResult,
  NewPositionForm,
  PositionStats,
} from "@/types/gulf-stream";
import { fmtUsd } from "@/types/gulf-stream";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Hook
   Markets, positions, analysis, predictions, scanner.
   Single source of truth for all Gulf Stream state.
   ═══════════════════════════════════════════════════════ */

const EMPTY_FORM: NewPositionForm = {
  market_id: "",
  market_title: "",
  side: "yes",
  entry_price: "",
  size_usd: "",
  notes: "",
};

export function useGulfStream() {
  const { toast } = useToast();

  // ── Markets ──
  const [liveMarkets, setLiveMarkets] = useState<PolymarketEntry[]>([]);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [marketSearch, setMarketSearch] = useState("");
  const [marketCategory, setMarketCategory] = useState("All");
  const [selectedMarket, setSelectedMarket] = useState<PolymarketEntry | null>(null);
  const [analyses, setAnalyses] = useState<Map<string, AnalysisResult>>(new Map());
  const [predictions, setPredictions] = useState<Map<string, PredictionResult>>(new Map());

  // ── Positions ──
  const [positions, setPositions] = useState<GulfPosition[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [newPosition, setNewPosition] = useState<NewPositionForm>(EMPTY_FORM);

  // ── x402 ──
  const [x402Configured, setX402Configured] = useState(false);
  const [x402Wallet, setX402Wallet] = useState("");
  const [x402TxCount, setX402TxCount] = useState(0);

  // ── Scanner ──
  const [scannerRunning, setScannerRunning] = useState(false);
  const [scanResults, setScanResults] = useState("");

  // ── UI ──
  const [killSwitch, setKillSwitch] = useState(false);

  /* ── Fetch markets from proxy ── */
  const fetchMarkets = useCallback(async () => {
    setMarketsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "15",
        active: "true",
        closed: "false",
        order: "volume",
        ascending: "false",
      });
      if (marketCategory !== "All") {
        params.set("tag", marketCategory.toLowerCase());
      }
      const res = await fetch(`/api/polymarket?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setLiveMarkets(data);
      }
    } catch {
      /* silent */
    } finally {
      setMarketsLoading(false);
    }
  }, [marketCategory]);

  /* ── Fetch positions from Supabase ── */
  const fetchPositions = useCallback(async () => {
    setPositionsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gulf_positions")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error) setPositions(data as GulfPosition[]);
    } catch {
      /* table may not exist */
    } finally {
      setPositionsLoading(false);
    }
  }, []);

  /* ── Add position ── */
  const addPosition = async () => {
    if (!newPosition.market_title || !newPosition.entry_price || !newPosition.size_usd) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("gulf_positions").insert({
        market_id: newPosition.market_id || null,
        market_title: newPosition.market_title,
        side: newPosition.side,
        entry_price: parseFloat(newPosition.entry_price),
        current_price: parseFloat(newPosition.entry_price),
        size_usd: parseFloat(newPosition.size_usd),
        pnl: 0,
        status: "open",
        notes: newPosition.notes || null,
      }).select("id").single();
      if (error) throw error;
      toast(`Position ouverte — ${newPosition.market_title}`, "success");
      onGulfPositionOpened(data?.id || "", newPosition.market_title, parseFloat(newPosition.size_usd));
      setNewPosition(EMPTY_FORM);
      setShowAddPosition(false);
      fetchPositions();
    } catch (err) {
      console.error("Add position error:", err);
      toast("Erreur ouverture position", "error");
    }
  };

  /* ── Close position ── */
  const closePosition = async (id: string) => {
    try {
      const supabase = createClient();
      const pos = positions.find((p) => p.id === id);
      const { error } = await supabase
        .from("gulf_positions")
        .update({ status: "closed", closed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast(`Position cloturee${pos ? ` — ${pos.market_title}` : ""}`, "success");
      if (pos) {
        onGulfPositionClosed(id, pos.market_title, Number(pos.pnl || 0));
      }
      fetchPositions();
    } catch (err) {
      console.error("Close position error:", err);
      toast("Erreur cloture position", "error");
    }
  };

  /* ── Analyze market via AI ── */
  const analyzeMarket = async (market: PolymarketEntry) => {
    const id = market.id;
    setAnalyses((prev) => {
      const next = new Map(prev);
      next.set(id, { marketId: id, analysis: "", loading: true });
      return next;
    });
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "command",
          data: {
            input: `Analyse ce marche de prediction Polymarket en 3-4 phrases concises. Marche: "${market.question}". Prix Yes: ${(market.outcomePrices[0] * 100).toFixed(0)} cents. Volume: ${fmtUsd(market.volume)}. Echeance: ${market.endDate || "non specifiee"}. Donne ton evaluation du rapport risque/rendement.`,
          },
        }),
      });
      const data = await res.json();
      setAnalyses((prev) => {
        const next = new Map(prev);
        next.set(id, {
          marketId: id,
          analysis: data.result || data.error || "Analyse indisponible",
          loading: false,
        });
        return next;
      });
    } catch {
      setAnalyses((prev) => {
        const next = new Map(prev);
        next.set(id, { marketId: id, analysis: "Erreur lors de l'analyse", loading: false });
        return next;
      });
    }
  };

  /* ── Predict fair value via AI ── */
  const predictMarket = async (market: PolymarketEntry) => {
    const id = market.id;
    setPredictions((prev) => {
      const next = new Map(prev);
      next.set(id, { marketId: id, fairValue: 0, edge: 0, reasoning: "", loading: true });
      return next;
    });
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "command",
          data: {
            input: `Tu es un analyste de marches predictifs. Marche: "${market.question}". Prix actuel YES: ${(market.outcomePrices[0] * 100).toFixed(0)} cents. Donne UNIQUEMENT un JSON: {"fairValue": 0.XX, "reasoning": "explication courte"}. fairValue = ta probabilite estimee (0 a 1). Pas de texte avant ou apres le JSON.`,
          },
        }),
      });
      const data = await res.json();
      const text = data.result || "";
      let fairValue = market.outcomePrices[0];
      let reasoning = text;
      try {
        const jsonMatch = text.match(/\{[\s\S]*"fairValue"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          fairValue = parsed.fairValue || fairValue;
          reasoning = parsed.reasoning || text;
        }
      } catch {
        /* use raw text */
      }
      const edge = fairValue - market.outcomePrices[0];
      setPredictions((prev) => {
        const next = new Map(prev);
        next.set(id, { marketId: id, fairValue, edge, reasoning, loading: false });
        return next;
      });
    } catch {
      setPredictions((prev) => {
        const next = new Map(prev);
        next.set(id, { marketId: id, fairValue: 0, edge: 0, reasoning: "Erreur de prediction", loading: false });
        return next;
      });
    }
  };

  /* ── Scanner ── */
  const runScanner = async () => {
    setScannerRunning(true);
    setScanResults("");
    try {
      const params = new URLSearchParams({
        limit: "10",
        active: "true",
        closed: "false",
        order: "volume",
        ascending: "false",
      });
      const res = await fetch(`/api/polymarket?${params}`);
      if (!res.ok) throw new Error("Fetch failed");
      const markets: PolymarketEntry[] = await res.json();
      setLiveMarkets(markets);
      const topMarkets = markets.slice(0, 3);
      let results = `Scanner: ${markets.length} marches analyses.\n\n`;
      for (const m of topMarkets) {
        const yesPrice = m.outcomePrices[0];
        const deviation = Math.abs(yesPrice - 0.5);
        const potentialEdge = deviation > 0.15 ? "Fort" : deviation > 0.08 ? "Modere" : "Faible";
        results += `- ${m.question.slice(0, 60)}\n  Yes: ${(yesPrice * 100).toFixed(0)}c | Vol: ${fmtUsd(m.volume)} | Edge: ${potentialEdge}\n\n`;
      }
      setScanResults(results);
    } catch {
      setScanResults("Erreur lors du scan. Verifiez la connexion API.");
    } finally {
      setScannerRunning(false);
    }
  };

  /* ── x402 ── */
  const checkX402 = useCallback(() => {
    const wallet = typeof window !== "undefined" ? localStorage.getItem("x402_wallet") || "" : "";
    const txCount = typeof window !== "undefined" ? parseInt(localStorage.getItem("x402_tx_count") || "0") : 0;
    setX402Wallet(wallet);
    setX402TxCount(txCount);
    setX402Configured(!!wallet);
  }, []);

  const saveX402Wallet = (address: string) => {
    localStorage.setItem("x402_wallet", address);
    setX402Wallet(address);
    setX402Configured(true);
    toast("Wallet x402 sauvegarde", "success");
  };

  /* ── Init ── */
  useEffect(() => {
    fetchMarkets();
    fetchPositions();
    checkX402();
  }, [fetchMarkets, fetchPositions, checkX402]);

  /* ── Derived ── */
  const posStats: PositionStats = useMemo(() => {
    const open = positions.filter((p) => p.status === "open");
    const totalPnl = positions.reduce((s, p) => s + Number(p.pnl || 0), 0);
    const totalExposure = open.reduce((s, p) => s + Number(p.size_usd || 0), 0);
    const winners = positions.filter((p) => Number(p.pnl) > 0).length;
    const winRate = positions.length > 0 ? (winners / positions.length) * 100 : 0;
    return { totalPnl, totalExposure, openCount: open.length, closedCount: positions.filter((p) => p.status === "closed").length, winRate };
  }, [positions]);

  const filteredMarkets = useMemo(() => {
    if (liveMarkets.length === 0) return [];
    return liveMarkets.filter((m) => {
      if (marketSearch && !m.question.toLowerCase().includes(marketSearch.toLowerCase())) return false;
      return true;
    });
  }, [liveMarkets, marketSearch]);

  return {
    // Markets
    liveMarkets,
    filteredMarkets,
    marketsLoading,
    marketSearch,
    setMarketSearch,
    marketCategory,
    setMarketCategory,
    selectedMarket,
    setSelectedMarket,
    analyses,
    predictions,
    // Positions
    positions,
    positionsLoading,
    showAddPosition,
    setShowAddPosition,
    newPosition,
    setNewPosition,
    posStats,
    // x402
    x402Configured,
    x402Wallet,
    x402TxCount,
    // Scanner
    scannerRunning,
    scanResults,
    setScanResults,
    // UI
    killSwitch,
    setKillSwitch,
    // Actions
    actions: {
      fetchMarkets,
      fetchPositions,
      addPosition,
      closePosition,
      analyzeMarket,
      predictMarket,
      runScanner,
      saveX402Wallet,
    },
  };
}
