"use client";

import { motion, AnimatePresence } from "motion/react";
import { BarChart3, Check, Loader2, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { GulfPosition, NewPositionForm } from "@/types/gulf-stream";
import { glassCard, glassBg, inputCls, btnGold, btnSubtle } from "@/types/gulf-stream";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Positions Table
   Open/closed positions, P&L, add form, close button.
   ═══════════════════════════════════════════════════════ */

interface PositionsTableProps {
  positions: GulfPosition[];
  positionsLoading: boolean;
  showAddPosition: boolean;
  setShowAddPosition: (v: boolean) => void;
  newPosition: NewPositionForm;
  setNewPosition: React.Dispatch<React.SetStateAction<NewPositionForm>>;
  onAdd: () => void;
  onClose: (id: string) => void;
  onRefresh: () => void;
}

export function PositionsTable({
  positions,
  positionsLoading,
  showAddPosition,
  setShowAddPosition,
  newPosition,
  setNewPosition,
  onAdd,
  onClose,
  onRefresh,
}: PositionsTableProps) {
  return (
    <div className={glassCard} style={glassBg}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text)]">
          <BarChart3 className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
          Position Tracker ({positions.length})
        </p>
        <div className="flex gap-2">
          <button onClick={() => setShowAddPosition(!showAddPosition)} className={btnGold}>
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
          <button onClick={onRefresh} className={btnSubtle}>
            <RefreshCw className={cn("h-4 w-4", positionsLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddPosition && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 p-4">
              <p className="mb-3 text-xs font-semibold text-[var(--color-gold)]">
                Nouvelle Position
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    Marche *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Trump wins 2028..."
                    value={newPosition.market_title}
                    onChange={(e) => setNewPosition((p) => ({ ...p, market_title: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    Market ID
                  </label>
                  <input
                    type="text"
                    placeholder="Polymarket ID (optionnel)"
                    value={newPosition.market_id}
                    onChange={(e) => setNewPosition((p) => ({ ...p, market_id: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    Side
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewPosition((p) => ({ ...p, side: "yes" }))}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
                        newPosition.side === "yes"
                          ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                          : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                      )}
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setNewPosition((p) => ({ ...p, side: "no" }))}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
                        newPosition.side === "no"
                          ? "border-red-500/50 bg-red-500/20 text-red-400"
                          : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                      )}
                    >
                      NO
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    Prix entree (0-1) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.55"
                    value={newPosition.entry_price}
                    onChange={(e) => setNewPosition((p) => ({ ...p, entry_price: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    Taille USD *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="2.00"
                    value={newPosition.size_usd}
                    onChange={(e) => setNewPosition((p) => ({ ...p, size_usd: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Raisonnement..."
                    value={newPosition.notes}
                    onChange={(e) => setNewPosition((p) => ({ ...p, notes: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setShowAddPosition(false)}
                  className="rounded-lg px-4 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Annuler
                </button>
                <button onClick={onAdd} className={btnGold}>
                  <Check className="h-4 w-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {positions.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border-subtle)]">
          <BarChart3 className="h-8 w-8 text-[var(--color-text-muted)]/30" />
          <p className="text-xs text-[var(--color-text-muted)]">
            Aucune position.{" "}
            <button onClick={() => setShowAddPosition(true)} className="text-[var(--color-gold)] underline">
              Ajouter
            </button>{" "}
            ou lancer la migration Supabase.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] text-left text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                <th className="pb-3 pr-4">Marche</th>
                <th className="pb-3 pr-4">Side</th>
                <th className="pb-3 pr-4 text-right">Size</th>
                <th className="pb-3 pr-4 text-right">Entree</th>
                <th className="pb-3 pr-4 text-right">Actuel</th>
                <th className="pb-3 pr-4 text-right">PnL</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos, i) => {
                const pnl = Number(pos.pnl || 0);
                return (
                  <motion.tr
                    key={pos.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[var(--color-border-subtle)]/50 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pr-4">
                      <div>
                        <span className="font-medium text-[var(--color-text)]">
                          {pos.market_title}
                        </span>
                        {pos.notes && (
                          <p className="mt-0.5 font-mono text-[9px] text-[var(--color-text-muted)]">
                            {pos.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={pos.side === "yes" ? "success" : "danger"} size="sm">
                        {pos.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-xs text-[var(--color-text)]">
                      ${Number(pos.size_usd).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-xs text-[var(--color-text-muted)]">
                      {Number(pos.entry_price).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-xs text-[var(--color-text)]">
                      {Number(pos.current_price).toFixed(2)}
                    </td>
                    <td
                      className={cn(
                        "py-3 pr-4 text-right font-mono text-xs font-bold",
                        pnl > 0 ? "text-cyan-400" : pnl < 0 ? "text-red-400" : "text-[var(--color-text-muted)]"
                      )}
                    >
                      {pnl > 0 ? "+" : ""}
                      {pnl.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant={pos.status === "open" ? "success" : pos.status === "closed" ? "default" : "warning"}
                        size="sm"
                        dot
                      >
                        {pos.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {pos.status === "open" && (
                        <button
                          onClick={() => onClose(pos.id)}
                          className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-red-400 transition-all hover:bg-red-500/20"
                        >
                          Fermer
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
