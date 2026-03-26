"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Rocket } from "lucide-react";
import { TARGET_MARKETS, NICHES, STORE_STATUSES, getStatusConfig, computeKPIs, generateStoreId, type StoreProject, type StoreStatusId } from "@/lib/ecommerce";
import { onStoreCreated } from "@/lib/synergies";
import { KPICard, EmptyState } from "./shared";

export function ActiveStoresTab({
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
      id: generateStoreId(), name: newName, niche: newNiche, country: newCountry,
      status: "research", products: [], revenue: 0, adSpend: 0, profit: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setStores((prev) => [store, ...prev]);
    onStoreCreated(store.id, store.name, store.niche, store.country);
    setNewName(""); setNewNiche(""); setShowAdd(false);
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
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Stores" value={kpis.totalStores.toString()} sub={`${kpis.liveStores} en ligne`} color="cyan" />
        <KPICard label="Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} color="emerald" />
        <KPICard label="Ad Spend" value={`$${kpis.totalAdSpend.toLocaleString()}`} color="amber" />
        <KPICard label="Profit" value={`$${kpis.totalProfit.toLocaleString()}`} color={kpis.totalProfit >= 0 ? "emerald" : "red"} />
        <KPICard label="Best" value={kpis.bestPerformer?.name || "\u2014"} sub={kpis.bestPerformer ? `$${kpis.bestPerformer.profit}` : ""} color="cyan" />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Stores ({stores.length})</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20">
          <Plus className="h-3 w-3" />Ajouter un store
        </button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)] p-4">
          <div className="flex gap-3">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom du store" className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-cyan-500/50 focus:outline-none" />
            <select value={newNiche} onChange={(e) => setNewNiche(e.target.value)} className="w-48 appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              <option value="">Niche...</option>
              {NICHES.map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
            <select value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="w-40 appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              {TARGET_MARKETS.map((m) => (<option key={m.id} value={m.id}>{m.flag} {m.name}</option>))}
            </select>
            <button onClick={addManualStore} disabled={!newName || !newNiche} className="rounded-lg bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/25 disabled:opacity-40">Creer</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {stores.map((store, i) => {
          const statusCfg = getStatusConfig(store.status);
          const market = TARGET_MARKETS.find((m) => m.id === store.country);
          return (
            <motion.div key={store.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="group rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-all hover:border-cyan-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">{store.name}</h4>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{market?.flag} {store.niche}</p>
                </div>
                <button onClick={() => cycleStatus(store.id)}
                  className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all hover:opacity-80"
                  style={{ backgroundColor: `${statusCfg.color}20`, color: statusCfg.color }}>
                  {statusCfg.label}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center"><p className="font-mono text-xs font-bold text-emerald-400">${store.revenue}</p><p className="text-[8px] text-[var(--color-text-muted)]">Revenue</p></div>
                <div className="text-center"><p className="font-mono text-xs font-bold text-amber-400">${store.adSpend}</p><p className="text-[8px] text-[var(--color-text-muted)]">Ad Spend</p></div>
                <div className="text-center"><p className={`font-mono text-xs font-bold ${store.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>${store.profit}</p><p className="text-[8px] text-[var(--color-text-muted)]">Profit</p></div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] text-[var(--color-text-muted)]">{store.products.length} produits</span>
                <button onClick={() => removeStore(store.id)} className="text-red-400/0 transition-all group-hover:text-red-400/50 hover:!text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {stores.length === 0 && <EmptyState text="Aucun store. Construis le premier depuis le Store Builder ou ajoute manuellement." />}
    </div>
  );
}
