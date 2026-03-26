"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Search, Plus, Loader2, Package, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { NICHES, generateProductId, type ProductIdea } from "@/lib/ecommerce";
import { EmptyState } from "./shared";

export function ProductsTab({
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
      if (json.data && Array.isArray(json.data)) setProducts(json.data);
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
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Package className="h-4 w-4 text-cyan-400" />
          Trouver des produits gagnants
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              <option value="">Choisir une niche...</option>
              {NICHES.map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div className="w-40">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Prix de vente</label>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
              <option value="$5-$15">$5 - $15</option>
              <option value="$5-$30">$5 - $30</option>
              <option value="$15-$50">$15 - $50</option>
              <option value="$30-$100">$30 - $100</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={findProducts} disabled={loading || !niche} className="flex items-center gap-2 rounded-lg bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:opacity-40">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Trouver des produits
            </button>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Resultats ({products.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p, i) => (
              <motion.div key={p.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[var(--color-text)]">{p.name}</h4>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{p.source}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{p.margin}%</span>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div><p className="text-[9px] text-[var(--color-text-muted)]">Cout</p><p className="font-mono text-sm font-bold text-red-400">${p.cost}</p></div>
                  <ArrowRight className="h-3 w-3 text-[var(--color-text-muted)]" />
                  <div><p className="text-[9px] text-[var(--color-text-muted)]">Prix vente</p><p className="font-mono text-sm font-bold text-emerald-400">${p.sellingPrice}</p></div>
                  <div className="ml-auto flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${Math.min(p.margin, 100)}%` }} />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[10px] italic text-cyan-400/70">{p.marketingAngle}</p>
                <button onClick={() => addToStore(p)} disabled={selectedProducts.some((sp) => sp.name === p.name)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 py-1.5 text-[10px] font-semibold text-cyan-400 transition-all hover:bg-cyan-500/15 disabled:opacity-30">
                  <Plus className="h-3 w-3" />
                  {selectedProducts.some((sp) => sp.name === p.name) ? "Deja ajoute" : "Ajouter au store"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

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
