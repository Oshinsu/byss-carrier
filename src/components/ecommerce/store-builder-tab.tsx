"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Bot, Loader2, Store, Rocket, Calendar, PieChart } from "lucide-react";
import { TARGET_MARKETS, NICHES, generateStoreId, type ProductIdea, type StoreProject, type StorePlan } from "@/lib/ecommerce";
import { onStoreCreated } from "@/lib/synergies";
import { EmptyState } from "./shared";

export function BuilderTab({
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
        body: JSON.stringify({ action: "generate_store_plan", niche, products: selectedProducts, country, budget }),
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
      id: generateStoreId(), name: selectedName, niche, country, status: "planning",
      products: [...selectedProducts], revenue: 0, adSpend: 0, profit: 0, plan,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setStores((prev) => [newStore, ...prev]);
    onStoreCreated(newStore.id, newStore.name, newStore.niche, newStore.country);
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
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Store className="h-4 w-4 text-cyan-400" />
          Generateur de plan store
        </h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              <option value="">Choisir...</option>
              {NICHES.map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Marche</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              {TARGET_MARKETS.map((m) => (<option key={m.id} value={m.id}>{m.flag} {m.name}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Budget ($)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none" />
          </div>
          <div className="flex items-end">
            <button onClick={generatePlan} disabled={loading || !niche} className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:opacity-40">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
              Generer le plan
            </button>
          </div>
        </div>
        {selectedProducts.length > 0 && (
          <p className="mt-2 text-[10px] text-emerald-400">{selectedProducts.length} produits selectionnes seront inclus</p>
        )}
      </div>

      {plan && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)] p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Nom du store</p>
            <div className="flex gap-2">
              {plan.storeNames.map((name) => (
                <button key={name} onClick={() => setSelectedName(name)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${selectedName === name ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-400" : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-cyan-500/30"}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

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

          {plan.launchTimeline && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                <Calendar className="mr-1 inline h-3 w-3" />Sprint 7 jours
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

          {plan.budgetAllocation && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                <PieChart className="mr-1 inline h-3 w-3" />Allocation budget (${budget})
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

          <button onClick={launchStore} disabled={!selectedName}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40">
            <Rocket className="h-4 w-4" />
            Lancer la creation — {selectedName}
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {TECH_STACK.map((t) => (
          <div key={t.name} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-center">
            <p className="text-[10px] font-bold text-cyan-400">{t.name}</p>
            <p className="text-[9px] text-[var(--color-text-muted)]">{t.role}</p>
          </div>
        ))}
      </div>

      {!plan && <EmptyState text="Selectionne une niche, un marche, un budget. Le plan se genere." />}
    </div>
  );
}
