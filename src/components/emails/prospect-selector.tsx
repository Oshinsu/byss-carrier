"use client";

import { motion } from "motion/react";
import { User, ChevronDown, Building, Star, Flame, TrendingUp, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prospect, Interaction } from "@/types";

const PRICING_LABELS: Record<string, { label: string; color: string }> = {
  essentiel: { label: "Essentiel", color: "text-blue-400" },
  croissance: { label: "Croissance", color: "text-cyan-400" },
  domination: { label: "Domination", color: "text-fuchsia-400" },
};

const PHASE_COLORS: Record<string, string> = {
  prospect: "bg-gray-500/20 text-gray-400", contacte: "bg-blue-500/20 text-blue-400",
  rdv: "bg-cyan-500/20 text-cyan-400", demo: "bg-violet-500/20 text-violet-400",
  proposition: "bg-amber-500/20 text-amber-400", negociation: "bg-orange-500/20 text-orange-400",
  signe: "bg-emerald-500/20 text-emerald-400", perdu: "bg-red-500/20 text-red-400",
  inactif: "bg-gray-500/20 text-gray-500",
};

export function ProspectSelector({
  prospects, selectedProspect, interactions, loadingProspects, loadingInteractions, onProspectChange,
}: {
  prospects: Prospect[];
  selectedProspect: Prospect | null;
  interactions: Interaction[];
  loadingProspects: boolean;
  loadingInteractions: boolean;
  onProspectChange: (id: string) => void;
}) {
  const pricingInfo = selectedProspect?.option_chosen ? PRICING_LABELS[selectedProspect.option_chosen] : null;

  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
      <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
        <User className="h-3.5 w-3.5" />Prospect
      </label>
      {loadingProspects ? (
        <div className="h-10 animate-pulse rounded-lg bg-[var(--color-surface-2)]" />
      ) : (
        <div className="relative">
          <select value={selectedProspect?.id ?? ""} onChange={(e) => onProspectChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-2.5 pr-10 text-sm text-[var(--color-text)] transition-colors focus:border-cyan-500/50 focus:outline-none">
            {prospects.map((p) => (<option key={p.id} value={p.id}>{p.name} {p.key_contact ? `\u2014 ${p.key_contact}` : ""}</option>))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        </div>
      )}

      {selectedProspect && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
              <Building className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">{selectedProspect.name}</h4>
              {selectedProspect.sector && <span className="text-[10px] text-[var(--color-text-muted)]">{selectedProspect.sector}</span>}
            </div>
            <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", PHASE_COLORS[selectedProspect.phase] ?? "bg-gray-500/20 text-gray-400")}>
              {selectedProspect.phase}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} className={cn("h-3.5 w-3.5", si < (selectedProspect.score || 0) ? "fill-cyan-400 text-cyan-400" : "text-[var(--color-border-subtle)]")} />
              ))}
            </div>
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
              selectedProspect.ai_score === "fire" ? "bg-orange-500/20 text-orange-400" : selectedProspect.ai_score === "warm" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400")}>
              {selectedProspect.ai_score === "fire" && <Flame className="h-3 w-3" />}
              {selectedProspect.ai_score === "warm" && <TrendingUp className="h-3 w-3" />}
              {selectedProspect.ai_score === "cold" && <Snowflake className="h-3 w-3" />}
              {selectedProspect.ai_score ?? "cold"}
            </span>
            {pricingInfo && <span className={cn("text-[10px] font-medium", pricingInfo.color)}>{pricingInfo.label}</span>}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div><span className="text-[var(--color-text-muted)]">Email:</span> <span className="text-[var(--color-text)]">{selectedProspect.email ? "oui" : "non"}</span></div>
            <div><span className="text-[var(--color-text-muted)]">Basket:</span> <span className="font-medium text-cyan-400">{selectedProspect.estimated_basket ? `${Number(selectedProspect.estimated_basket).toLocaleString("fr-FR")} \u20ac` : "\u2014"}</span></div>
          </div>

          {selectedProspect.pain_points && (
            <div className="text-[11px]"><span className="text-[var(--color-text-muted)]">Douleurs:</span> <span className="text-cyan-400">{selectedProspect.pain_points}</span></div>
          )}

          <div className="border-t border-[var(--color-border-subtle)] pt-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {loadingInteractions ? "Chargement..." : `${interactions.length} interaction${interactions.length !== 1 ? "s" : ""}`}
            </span>
            {interactions.length > 0 && (
              <div className="mt-1 space-y-1">
                {interactions.slice(0, 3).map((i) => (
                  <div key={i.id} className="flex items-center gap-2 text-[10px]">
                    <span className={cn("rounded-full px-1.5 py-0.5 font-medium", i.direction === "outbound" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400")}>{i.type}</span>
                    <span className="truncate text-[var(--color-text-muted)]">{i.subject || i.content?.slice(0, 40) || "\u2014"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
