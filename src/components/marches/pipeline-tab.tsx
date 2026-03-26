"use client";

import { motion } from "motion/react";
import { TrendingUp, Loader2, Building2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARCHE_PIPELINE, type MarcheRow } from "@/lib/marches";

function daysUntil(dateStr: string | null): number | null { if (!dateStr) return null; const t = new Date(dateStr); if (isNaN(t.getTime())) return null; return Math.ceil((t.getTime() - Date.now()) / 86_400_000); }
function formatCurrency(n: number | null): string { if (!n) return "\u2014"; return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }); }

function PipelineCard({ marche, onClick }: { marche: MarcheRow; onClick: () => void }) {
  const dl = daysUntil(marche.date_limite);
  const urgent = dl !== null && dl >= 0 && dl <= 7;
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3.5 text-left transition hover:border-cyan-500/30">
      <h4 className="text-sm font-medium text-[var(--color-text)] line-clamp-2 mb-1.5">{marche.title}</h4>
      <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-2"><Building2 className="h-3 w-3" />{marche.acheteur || "\u2014"}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dl !== null && dl >= 0 && <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", urgent ? "bg-red-500/15 text-red-400" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}>J-{dl}</span>}
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", marche.relevance_score >= 60 ? "bg-emerald-500/10 text-emerald-400" : marche.relevance_score >= 30 ? "bg-amber-500/10 text-amber-400" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}>{marche.relevance_score}%</span>
        </div>
        {(marche.budget_proposed || marche.budget_estimated) && <span className="text-xs font-medium text-cyan-400">{formatCurrency(marche.budget_proposed || marche.budget_estimated)}</span>}
      </div>
    </button>
  );
}

export function PipelineTab({
  marches, marchesLoading, pipelineGroups, onMarcheClick,
}: {
  marches: MarcheRow[];
  marchesLoading: boolean;
  pipelineGroups: { id: string; label: string; items: MarcheRow[] }[];
  onMarcheClick: (m: MarcheRow) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {marchesLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
      ) : marches.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-text-muted)]"><TrendingUp className="mx-auto mb-3 h-10 w-10 opacity-30" /><p className="font-[family-name:var(--font-clash-display)] text-lg">Le pipeline est vide.</p><p className="mt-1 text-sm">Importez des march\u00e9s depuis l&apos;onglet Veille.</p></div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineGroups.map((group) => (
            <div key={group.id} className="min-w-[280px] flex-1">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{group.label}</h3>
                <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-bold text-[var(--color-text-muted)]">{group.items.length}</span>
              </div>
              <div className="space-y-3">
                {group.items.map((m) => <PipelineCard key={m.id} marche={m} onClick={() => onMarcheClick(m)} />)}
                {group.items.length === 0 && <div className="rounded-lg border border-dashed border-[var(--color-border-subtle)] p-4 text-center text-xs text-[var(--color-text-muted)]">Aucun march\u00e9</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {marches.filter((m) => ["no_go", "lost"].includes(m.status)).length > 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Archiv\u00e9s (NO GO / Perdus)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {marches.filter((m) => ["no_go", "lost"].includes(m.status)).map((m) => (
              <button key={m.id} onClick={() => onMarcheClick(m)} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] p-2.5 text-left text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]">
                {m.status === "no_go" ? <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" /> : <X className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                <span className="line-clamp-1">{m.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
