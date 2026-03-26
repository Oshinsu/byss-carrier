"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Package, Store, Rocket, Globe } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TARGET_MARKETS, ECOM_STORAGE, computeKPIs, type MarketAnalysis, type ProductIdea, type StoreProject } from "@/lib/ecommerce";
import { OpportunitiesTab } from "@/components/ecommerce/opportunites-tab";
import { ProductsTab } from "@/components/ecommerce/produits-tab";
import { BuilderTab } from "@/components/ecommerce/store-builder-tab";
import { ActiveStoresTab } from "@/components/ecommerce/stores-actifs-tab";

/* ═══════════════════════════════════════════════════════
   E-COMMERCE COMMAND CENTER
   50 stores. 7 marches. Claude orchestrateur.
   ═══════════════════════════════════════════════════════ */

const TABS = [
  { id: "opportunities", label: "Opportunites", icon: Target },
  { id: "products", label: "Produits", icon: Package },
  { id: "builder", label: "Store Builder", icon: Store },
  { id: "active", label: "Stores Actifs", icon: Rocket },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EcommercePage() {
  const [activeTab, setActiveTab] = useState<TabId>("opportunities");
  const [analyses, setAnalyses] = useLocalStorage<MarketAnalysis[]>(ECOM_STORAGE.ANALYSES, []);
  const [selectedProducts, setSelectedProducts] = useLocalStorage<ProductIdea[]>(ECOM_STORAGE.SELECTED_PRODUCTS, []);
  const [stores, setStores] = useLocalStorage<StoreProject[]>(ECOM_STORAGE.STORES, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            E-Commerce <span className="text-cyan-400">Empire</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            50 stores autonomes — Claude Code orchestrateur — CJDropshipping + TikTok Ads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5">
            <span className="font-mono text-xs font-bold text-cyan-400">{stores.length}/50</span>
            <span className="ml-1 text-[10px] text-[var(--color-text-muted)]">stores</span>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <span className="font-mono text-xs font-bold text-emerald-400">
              ${computeKPIs(stores).totalRevenue.toLocaleString()}
            </span>
            <span className="ml-1 text-[10px] text-[var(--color-text-muted)]">revenue</span>
          </div>
        </div>
      </div>

      {/* Vision Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 via-[var(--color-surface)] to-emerald-500/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15">
              <Globe className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-text)]">Vision : 50 stores, 7 marches, intervention minimale/jour</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Philippines + Vietnam + Maroc + Colombie + France + Martinique — Shopify/Next.js + CJDropshipping + TikTok Ads + Kling visuals
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {TARGET_MARKETS.map((m) => (
              <span key={m.id} className="text-lg" title={m.name}>{m.flag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "opportunities" && (
            <OpportunitiesTab analyses={analyses} setAnalyses={setAnalyses} />
          )}
          {activeTab === "products" && (
            <ProductsTab selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
          )}
          {activeTab === "builder" && (
            <BuilderTab selectedProducts={selectedProducts} stores={stores} setStores={setStores} />
          )}
          {activeTab === "active" && (
            <ActiveStoresTab stores={stores} setStores={setStores} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
