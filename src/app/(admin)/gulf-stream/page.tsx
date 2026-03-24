"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CircleDollarSign,
  Globe,
  RefreshCw,
  Shield,
  Skull,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { TabPanel } from "@/components/ui/tab-panel";
import { StatCard } from "@/components/ui/stat-card";
import { useGulfStream } from "@/hooks/use-gulf-stream";
import { CerclesPanel } from "@/components/gulf-stream/cercles-panel";
import type { GulfPanel } from "@/types/gulf-stream";
import { btnSubtle } from "@/types/gulf-stream";

/* ─── Lazy-loaded tab panels (only load when tab is active) ─── */
const MarketScanner = dynamic(
  () => import("@/components/gulf-stream/market-scanner").then((m) => m.MarketScanner),
  { ssr: false, loading: () => <div className="h-[400px] animate-pulse rounded-xl bg-[#1A1A2E]" /> }
);
const PositionsTable = dynamic(
  () => import("@/components/gulf-stream/positions-table").then((m) => m.PositionsTable),
  { ssr: false, loading: () => <div className="h-[400px] animate-pulse rounded-xl bg-[#1A1A2E]" /> }
);
const X402Panel = dynamic(
  () => import("@/components/gulf-stream/x402-panel").then((m) => m.X402Panel),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-[#1A1A2E]" /> }
);
const KellyResearch = dynamic(
  () => import("@/components/gulf-stream/kelly-research").then((m) => m.KellyResearch),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-[#1A1A2E]" /> }
);

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Operational Trading Engine Dashboard
   Polymarket live. Supabase positions. x402 ready.
   3 cercles. 1 flux. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

const TABS = [
  { id: "markets" as const, label: "Polymarket Live", icon: Globe },
  { id: "positions" as const, label: "Position Tracker", icon: BarChart3 },
  { id: "x402" as const, label: "x402 / Protocoles", icon: Zap },
  { id: "research" as const, label: "Kelly & Research", icon: BookOpen },
];

export default function GulfStreamPage() {
  const gs = useGulfStream();
  const [activePanel, setActivePanel] = useState<GulfPanel>("markets");
  const [kellyFair, setKellyFair] = useState("0.70");
  const [kellyMarket, setKellyMarket] = useState("0.55");

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <PageHeader
          title="Operation"
          titleAccent="Gulf Stream"
          subtitle="3 cercles. 1 flux. Polymarket live. x402 ready. MODE_CADIFOR."
          actions={
            <>
              <button
                onClick={() => gs.setKillSwitch((k) => !k)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                  gs.killSwitch
                    ? "border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_20px_oklch(0.60_0.20_15/0.3)]"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                )}
              >
                {gs.killSwitch ? <Skull className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                {gs.killSwitch ? "KILL SWITCH ON" : "System Active"}
              </button>
              <button onClick={gs.actions.fetchMarkets} className={btnSubtle}>
                <RefreshCw className={cn("h-4 w-4", gs.marketsLoading && "animate-spin")} />
                Refresh
              </button>
            </>
          }
        />
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ── 3 Cercles ── */}
        <CerclesPanel
          liveMarketsCount={gs.liveMarkets.length}
          posStats={gs.posStats}
          scannerRunning={gs.scannerRunning}
          scanResults={gs.scanResults}
          onClearScan={() => gs.setScanResults("")}
          onRunScanner={gs.actions.runScanner}
          onLaunchBot={() =>
            alert(
              "Bot Polymarket: En attente de configuration CLOB API keys (api_key + secret + passphrase). Voir documentation py-clob-client."
            )
          }
          onViewPositions={() => setActivePanel("positions")}
        />

        {/* ── Portfolio Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="PnL Total"
            value={`$${gs.posStats.totalPnl >= 0 ? "+" : ""}${gs.posStats.totalPnl.toFixed(2)}`}
            icon={CircleDollarSign}
            trend={gs.posStats.totalPnl >= 0 ? "up" : "down"}
            trendValue={`${gs.posStats.totalPnl >= 0 ? "+" : ""}${gs.posStats.totalPnl.toFixed(2)}`}
            delay={0.2}
          />
          <StatCard
            title="Win Rate"
            value={`${gs.posStats.winRate.toFixed(0)}%`}
            icon={TrendingUp}
            trend={gs.posStats.winRate >= 60 ? "up" : gs.posStats.winRate >= 40 ? "neutral" : "down"}
            trendValue={`${gs.posStats.winRate.toFixed(0)}%`}
            delay={0.25}
          />
          <StatCard title="Positions Ouvertes" value={gs.posStats.openCount} icon={Activity} delay={0.3} />
          <StatCard
            title="Exposition Totale"
            value={`$${gs.posStats.totalExposure.toFixed(0)}`}
            icon={AlertTriangle}
            delay={0.35}
          />
          <StatCard
            title="Marches Live"
            value={gs.liveMarkets.length}
            icon={Globe}
            subtitle="Polymarket Gamma"
            delay={0.4}
          />
        </div>

        {/* ── Tab Panels ── */}
        <TabPanel tabs={TABS} activeTab={activePanel} onTabChange={(id) => setActivePanel(id as GulfPanel)}>
          <div className="pt-4">
            {activePanel === "markets" && (
              <MarketScanner
                markets={gs.filteredMarkets}
                marketsLoading={gs.marketsLoading}
                marketSearch={gs.marketSearch}
                onSearchChange={gs.setMarketSearch}
                marketCategory={gs.marketCategory}
                onCategoryChange={gs.setMarketCategory}
                selectedMarket={gs.selectedMarket}
                onSelectMarket={gs.setSelectedMarket}
                analyses={gs.analyses}
                predictions={gs.predictions}
                onAnalyze={gs.actions.analyzeMarket}
                onPredict={gs.actions.predictMarket}
                onRefresh={gs.actions.fetchMarkets}
              />
            )}

            {activePanel === "positions" && (
              <PositionsTable
                positions={gs.positions}
                positionsLoading={gs.positionsLoading}
                showAddPosition={gs.showAddPosition}
                setShowAddPosition={gs.setShowAddPosition}
                newPosition={gs.newPosition}
                setNewPosition={gs.setNewPosition}
                onAdd={gs.actions.addPosition}
                onClose={gs.actions.closePosition}
                onRefresh={gs.actions.fetchPositions}
              />
            )}

            {activePanel === "x402" && (
              <X402Panel
                configured={gs.x402Configured}
                wallet={gs.x402Wallet}
                txCount={gs.x402TxCount}
                onSaveWallet={gs.actions.saveX402Wallet}
              />
            )}

            {activePanel === "research" && (
              <KellyResearch
                kellyFair={kellyFair}
                setKellyFair={setKellyFair}
                kellyMarket={kellyMarket}
                setKellyMarket={setKellyMarket}
              />
            )}
          </div>
        </TabPanel>

        {/* ── Kill Switch Banner ── */}
        <AnimatePresence>
          {gs.killSwitch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center shadow-[0_0_40px_oklch(0.60_0.20_15/0.2)]"
            >
              <div className="flex items-center justify-center gap-3">
                <Skull className="h-6 w-6 text-red-400" />
                <span className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-red-400">
                  All Trading Halted — Kill Switch Active
                </span>
                <Skull className="h-6 w-6 text-red-400" />
              </div>
              <p className="mt-1 text-xs text-red-400/60">
                Aucune operation ne sera executee. Desactiver le kill switch pour reprendre.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
