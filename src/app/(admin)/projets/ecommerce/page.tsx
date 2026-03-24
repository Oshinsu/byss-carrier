"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart, Globe, TrendingUp, Bot, Zap, Search, Plus,
  DollarSign, MapPin, Package, BarChart3, Store, Rocket,
  Target, Eye, ChevronRight, Loader2, PieChart, Calendar,
  Sparkles, ExternalLink, Trash2, ArrowRight,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  TARGET_MARKETS, NICHES, STORE_STATUSES, ECOM_STORAGE,
  getStatusConfig, computeKPIs, competitionConfig,
  generateStoreId, generateProductId,
  type MarketAnalysis, type ProductIdea, type StoreProject, type StorePlan,
  type StoreStatusId,
} from "@/lib/ecommerce";

/* ═══════════════════════════════════════════════════════
   E-COMMERCE COMMAND CENTER
   50 stores. 7 marches. Claude orchestrateur.
   CJDropshipping + TikTok Ads + Kling visuals.
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
  const [, setLoaded] = useState(false);

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

/* ═══════════════════════════════════════════════════════
   TAB 1 — OPPORTUNITES
   ═══════════════════════════════════════════════════════ */

function OpportunitiesTab({
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
      {/* Analysis Form */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Search className="h-4 w-4 text-cyan-400" />
          Analyse de marche
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Niche
            </label>
            <div className="relative">
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
              >
                <option value="">Choisir une niche...</option>
                {NICHES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-48">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Marche
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              {TARGET_MARKETS.map((m) => (
                <option key={m.id} value={m.id}>{m.flag} {m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={analyze}
              disabled={loading || !niche}
              className="flex items-center gap-2 rounded-lg bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyser le marche
            </button>
          </div>
        </div>
      </div>

      {/* Current Result */}
      {currentResult && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)] p-6"
        >
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

      {/* History */}
      {analyses.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Historique ({analyses.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {analyses.map((a, i) => (
              <motion.div
                key={`${a.niche}-${a.country}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setCurrentResult(a)}
                className="cursor-pointer rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all hover:border-cyan-500/30"
              >
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

/* ═══════════════════════════════════════════════════════
   TAB 2 — PRODUITS
   ═══════════════════════════════════════════════════════ */

function ProductsTab({
  selectedProducts,
  setSelectedProducts,
}: {
  selectedProducts: ProductIdea[];
  setSelectedProducts: (v: ProductIdea[] | ((p: ProductIdea[]) => ProductIdea[])) => void;
}) {
  const [niche, setNiche] = useState("");
  const [priceRange, setPriceRange] = useState("$5-$30");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductIdea[]>([]);

  const findProducts = useCallback(async () => {
    if (!niche) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ecommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "find_products", niche, priceRange }),
      });
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error("[ecom] find products error:", err);
    } finally {
      setLoading(false);
    }
  }, [niche, priceRange]);

  const addToStore = (product: ProductIdea) => {
    const exists = selectedProducts.some((p) => p.name === product.name);
    if (!exists) {
      setSelectedProducts((prev) => [...prev, { ...product, id: generateProductId(), selected: true }]);
    }
  };

  const removeFromStore = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Package className="h-4 w-4 text-cyan-400" />
          Trouver des produits gagnants
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="">Choisir une niche...</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Prix de vente</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="$5-$15">$5 - $15</option>
              <option value="$5-$30">$5 - $30</option>
              <option value="$15-$50">$15 - $50</option>
              <option value="$30-$100">$30 - $100</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={findProducts}
              disabled={loading || !niche}
              className="flex items-center gap-2 rounded-lg bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Trouver des produits
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Resultats ({products.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p, i) => (
              <motion.div
                key={p.id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[var(--color-text)]">{p.name}</h4>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{p.source}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{p.margin}%</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <p className="text-[9px] text-[var(--color-text-muted)]">Cout</p>
                    <p className="font-mono text-sm font-bold text-red-400">${p.cost}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-[9px] text-[var(--color-text-muted)]">Prix vente</p>
                    <p className="font-mono text-sm font-bold text-emerald-400">${p.sellingPrice}</p>
                  </div>
                  <div className="ml-auto flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        style={{ width: `${Math.min(p.margin, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[10px] italic text-cyan-400/70">{p.marketingAngle}</p>
                <button
                  onClick={() => addToStore(p)}
                  disabled={selectedProducts.some((sp) => sp.name === p.name)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 py-1.5 text-[10px] font-semibold text-cyan-400 transition-all hover:bg-cyan-500/15 disabled:opacity-30"
                >
                  <Plus className="h-3 w-3" />
                  {selectedProducts.some((sp) => sp.name === p.name) ? "Deja ajoute" : "Ajouter au store"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="rounded-xl border border-emerald-500/20 bg-[var(--color-surface)] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
            <ShoppingCart className="h-3 w-3" />
            Produits selectionnes ({selectedProducts.length})
          </h3>
          <div className="space-y-2">
            {selectedProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)] px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--color-text)]">{p.name}</span>
                  <span className="font-mono text-[10px] text-emerald-400">${p.sellingPrice}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{p.margin}% marge</span>
                </div>
                <button onClick={() => removeFromStore(p.id)} className="text-red-400/50 hover:text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && selectedProducts.length === 0 && (
        <EmptyState text="Aucun produit. Selectionne une niche et lance la recherche." />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 3 — STORE BUILDER
   ═══════════════════════════════════════════════════════ */

function BuilderTab({
  selectedProducts,
  stores,
  setStores,
}: {
  selectedProducts: ProductIdea[];
  stores: StoreProject[];
  setStores: (v: StoreProject[] | ((p: StoreProject[]) => StoreProject[])) => void;
}) {
  const [niche, setNiche] = useState("");
  const [country, setCountry] = useState("ph");
  const [budget, setBudget] = useState(500);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StorePlan | null>(null);
  const [selectedName, setSelectedName] = useState("");

  const generatePlan = useCallback(async () => {
    if (!niche) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ecommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_store_plan",
          niche,
          products: selectedProducts,
          country,
          budget,
        }),
      });
      const json = await res.json();
      if (json.data && json.data.storeNames) {
        setPlan(json.data);
        setSelectedName(json.data.storeNames[0] || "");
      }
    } catch (err) {
      console.error("[ecom] plan error:", err);
    } finally {
      setLoading(false);
    }
  }, [niche, country, budget, selectedProducts]);

  const launchStore = () => {
    if (!plan || !selectedName) return;
    const newStore: StoreProject = {
      id: generateStoreId(),
      name: selectedName,
      niche,
      country,
      status: "planning",
      products: [...selectedProducts],
      revenue: 0,
      adSpend: 0,
      profit: 0,
      plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStores((prev) => [newStore, ...prev]);
    setPlan(null);
    setSelectedName("");
  };

  const TECH_STACK = [
    { name: "Shopify / Next.js", role: "Storefront" },
    { name: "CJDropshipping", role: "Fulfillment" },
    { name: "TikTok Ads", role: "Acquisition" },
    { name: "Kling / Replicate", role: "Creatives" },
    { name: "Claude Code", role: "Orchestrateur" },
  ];

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Store className="h-4 w-4 text-cyan-400" />
          Generateur de plan store
        </h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="">Choisir...</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Marche</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              {TARGET_MARKETS.map((m) => (
                <option key={m.id} value={m.id}>{m.flag} {m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generatePlan}
              disabled={loading || !niche}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
              Generer le plan
            </button>
          </div>
        </div>
        {selectedProducts.length > 0 && (
          <p className="mt-2 text-[10px] text-emerald-400">{selectedProducts.length} produits selectionnes seront inclus</p>
        )}
      </div>

      {/* Plan Results */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Store Names */}
          <div className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)] p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Nom du store</p>
            <div className="flex gap-2">
              {plan.storeNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedName(name)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedName === name
                      ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-400"
                      : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-cyan-500/30"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Identity */}
          {plan.brandIdentity && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Identite de marque</p>
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  {plan.brandIdentity.colors.map((c, i) => (
                    <div key={i} className="h-8 w-8 rounded-lg border border-white/10" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--color-text)]">{plan.brandIdentity.tone}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Cible : {plan.brandIdentity.targetAudience}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {plan.launchTimeline && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                <Calendar className="mr-1 inline h-3 w-3" />
                Sprint 7 jours
              </p>
              <div className="flex gap-2">
                {plan.launchTimeline.map((step) => (
                  <div key={step.day} className="flex-1 rounded-lg bg-[var(--color-surface-2)] p-2 text-center">
                    <p className="font-mono text-xs font-bold text-cyan-400">J{step.day}</p>
                    <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)] leading-tight">{step.task}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Allocation */}
          {plan.budgetAllocation && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                <PieChart className="mr-1 inline h-3 w-3" />
                Allocation budget (${budget})
              </p>
              <div className="flex gap-2">
                {plan.budgetAllocation.map((item) => (
                  <div key={item.category} className="flex-1 rounded-lg bg-[var(--color-surface-2)] p-3 text-center">
                    <p className="font-mono text-sm font-bold text-emerald-400">${item.amount}</p>
                    <p className="text-[9px] text-[var(--color-text-muted)]">{item.category}</p>
                    <p className="text-[8px] text-cyan-400">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Launch Button */}
          <button
            onClick={launchStore}
            disabled={!selectedName}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40"
          >
            <Rocket className="h-4 w-4" />
            Lancer la creation — {selectedName}
          </button>
        </motion.div>
      )}

      {/* Tech Stack */}
      <div className="grid grid-cols-5 gap-2">
        {TECH_STACK.map((t) => (
          <div key={t.name} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-center">
            <p className="text-[10px] font-bold text-cyan-400">{t.name}</p>
            <p className="text-[9px] text-[var(--color-text-muted)]">{t.role}</p>
          </div>
        ))}
      </div>

      {!plan && (
        <EmptyState text="Selectionne une niche, un marche, un budget. Le plan se genere." />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 4 — STORES ACTIFS
   ═══════════════════════════════════════════════════════ */

function ActiveStoresTab({
  stores,
  setStores,
}: {
  stores: StoreProject[];
  setStores: (v: StoreProject[] | ((p: StoreProject[]) => StoreProject[])) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNiche, setNewNiche] = useState("");
  const [newCountry, setNewCountry] = useState("ph");

  const kpis = computeKPIs(stores);

  const addManualStore = () => {
    if (!newName || !newNiche) return;
    const store: StoreProject = {
      id: generateStoreId(),
      name: newName,
      niche: newNiche,
      country: newCountry,
      status: "research",
      products: [],
      revenue: 0,
      adSpend: 0,
      profit: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStores((prev) => [store, ...prev]);
    setNewName("");
    setNewNiche("");
    setShowAdd(false);
  };

  const cycleStatus = (id: string) => {
    const statusIds = STORE_STATUSES.map((s) => s.id);
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const idx = statusIds.indexOf(s.status);
        const next = statusIds[(idx + 1) % statusIds.length] as StoreStatusId;
        return { ...s, status: next, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const removeStore = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Stores" value={kpis.totalStores.toString()} sub={`${kpis.liveStores} en ligne`} color="cyan" />
        <KPICard label="Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} color="emerald" />
        <KPICard label="Ad Spend" value={`$${kpis.totalAdSpend.toLocaleString()}`} color="amber" />
        <KPICard label="Profit" value={`$${kpis.totalProfit.toLocaleString()}`} color={kpis.totalProfit >= 0 ? "emerald" : "red"} />
        <KPICard
          label="Best"
          value={kpis.bestPerformer?.name || "—"}
          sub={kpis.bestPerformer ? `$${kpis.bestPerformer.profit}` : ""}
          color="cyan"
        />
      </div>

      {/* Add Store */}
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Stores ({stores.length})
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20"
        >
          <Plus className="h-3 w-3" />
          Ajouter un store
        </button>
      </div>

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)] p-4"
        >
          <div className="flex gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du store"
              className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-cyan-500/50 focus:outline-none"
            />
            <select
              value={newNiche}
              onChange={(e) => setNewNiche(e.target.value)}
              className="w-48 appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="">Niche...</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="w-40 appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
            >
              {TARGET_MARKETS.map((m) => (
                <option key={m.id} value={m.id}>{m.flag} {m.name}</option>
              ))}
            </select>
            <button
              onClick={addManualStore}
              disabled={!newName || !newNiche}
              className="rounded-lg bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/25 disabled:opacity-40"
            >
              Creer
            </button>
          </div>
        </motion.div>
      )}

      {/* Store Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stores.map((store, i) => {
          const statusCfg = getStatusConfig(store.status);
          const market = TARGET_MARKETS.find((m) => m.id === store.country);
          return (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-all hover:border-cyan-500/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">{store.name}</h4>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {market?.flag} {store.niche}
                  </p>
                </div>
                <button
                  onClick={() => cycleStatus(store.id)}
                  className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all hover:opacity-80"
                  style={{ backgroundColor: `${statusCfg.color}20`, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="font-mono text-xs font-bold text-emerald-400">${store.revenue}</p>
                  <p className="text-[8px] text-[var(--color-text-muted)]">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xs font-bold text-amber-400">${store.adSpend}</p>
                  <p className="text-[8px] text-[var(--color-text-muted)]">Ad Spend</p>
                </div>
                <div className="text-center">
                  <p className={`font-mono text-xs font-bold ${store.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${store.profit}
                  </p>
                  <p className="text-[8px] text-[var(--color-text-muted)]">Profit</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] text-[var(--color-text-muted)]">{store.products.length} produits</span>
                <button
                  onClick={() => removeStore(store.id)}
                  className="text-red-400/0 transition-all group-hover:text-red-400/50 hover:!text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {stores.length === 0 && (
        <EmptyState text="Aucun store. Construis le premier depuis le Store Builder ou ajoute manuellement." />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */

function ScoreBadge({ score, small }: { score: number; small?: boolean }) {
  const color = score >= 75 ? "emerald" : score >= 50 ? "cyan" : score >= 30 ? "amber" : "red";
  const colorMap = { emerald: "#10B981", cyan: "#00D4FF", amber: "#F59E0B", red: "#EF4444" };
  return (
    <span
      className={`rounded-full font-mono font-bold ${small ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-0.5 text-[10px]"}`}
      style={{ backgroundColor: `${colorMap[color]}20`, color: colorMap[color] }}
    >
      {score}/100
    </span>
  );
}

function CompetitionBadge({ level }: { level: MarketAnalysis["competitionLevel"] }) {
  const cfg = competitionConfig(level);
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Globe }) {
  return (
    <div className="rounded-lg bg-[var(--color-surface-2)] p-3">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-cyan-400" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</span>
      </div>
      <p className="text-xs text-[var(--color-text)]">{value || "N/A"}</p>
    </div>
  );
}

function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "#00D4FF", emerald: "#10B981", amber: "#F59E0B", red: "#EF4444",
  };
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
      <p className="font-mono text-lg font-bold" style={{ color: colorMap[color] || "#00D4FF" }}>{value}</p>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      {sub && <p className="text-[9px] text-[var(--color-text-muted)]">{sub}</p>}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-subtle)] py-16">
      <ShoppingCart className="mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
      <p className="text-sm italic text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
