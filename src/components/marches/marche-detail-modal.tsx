"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Building2, Clock, AlertTriangle, Target, Brain,
  FileEdit, Send, Trophy, CheckCircle2, XCircle, Search,
  ExternalLink, LinkIcon, FileText, Trash2, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MARCHE_STATUSES,
  getStatusColor,
  type MarcheStatus,
  type MarcheRow,
} from "@/lib/marches";

/* ── Icon map ── */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Brain, CheckCircle2, XCircle, FileEdit, Send, Trophy, X,
};

/* ── Helpers ── */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - Date.now()) / 86_400_000);
}

/* ═══════════════════════════════════════════════════════════════
   MARCHE DETAIL MODAL — Slide-over for full marché details
   ═══════════════════════════════════════════════════════════════ */
interface Props {
  marche: MarcheRow | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: MarcheStatus) => void;
  onSave: (id: string, data: Partial<MarcheRow>) => void;
  onDelete: (id: string) => void;
  onLinkCRM: (marche: MarcheRow) => void;
  onCreateInvoice: (marche: MarcheRow) => void;
}

export default function MarcheDetailModal({
  marche, open, onClose, onStatusChange, onSave, onDelete,
  onLinkCRM, onCreateInvoice,
}: Props) {
  const [notes, setNotes] = useState("");
  const [budgetEstimated, setBudgetEstimated] = useState("");
  const [budgetProposed, setBudgetProposed] = useState("");
  const [dirty, setDirty] = useState(false);

  // Sync with marche data
  useEffect(() => {
    if (marche) {
      setNotes(marche.notes || "");
      setBudgetEstimated(marche.budget_estimated?.toString() || "");
      setBudgetProposed(marche.budget_proposed?.toString() || "");
      setDirty(false);
    }
  }, [marche]);

  if (!marche) return null;

  const daysLeft = daysUntil(marche.date_limite);
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  const expired = daysLeft !== null && daysLeft < 0;
  const statusInfo = MARCHE_STATUSES.find((s) => s.id === marche.status);
  const StatusIcon = statusInfo ? ICON_MAP[statusInfo.icon] || Search : Search;

  const handleSave = () => {
    onSave(marche.id, {
      notes,
      budget_estimated: budgetEstimated ? parseFloat(budgetEstimated) : null,
      budget_proposed: budgetProposed ? parseFloat(budgetProposed) : null,
    });
    setDirty(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-[var(--color-border-subtle)] bg-[#0A0A14]"
          >
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">
                    {marche.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <Building2 className="h-3.5 w-3.5" />
                    {marche.acheteur || "Acheteur inconnu"}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status selector */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Statut
                </label>
                <div className="flex flex-wrap gap-2">
                  {MARCHE_STATUSES.map((s) => {
                    const Icon = ICON_MAP[s.icon] || Search;
                    return (
                      <button
                        key={s.id}
                        onClick={() => onStatusChange(marche.id, s.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                          marche.status === s.id
                            ? getStatusColor(s.id)
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Key info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Nature</span>
                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{marche.nature || "—"}</p>
                </div>
                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Plateforme</span>
                  <p className="mt-1 text-sm font-medium text-cyan-400">{marche.platform?.toUpperCase()}</p>
                </div>
                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Publication</span>
                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{formatDate(marche.date_publication)}</p>
                </div>
                <div className={cn(
                  "rounded-lg border bg-[#0F0F1A] p-3",
                  urgent ? "border-red-500/30" : "border-[var(--color-border-subtle)]",
                )}>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Date limite</span>
                  <p className={cn(
                    "mt-1 text-sm font-medium",
                    expired ? "text-[var(--color-text-muted)]" : urgent ? "text-red-400" : "text-[var(--color-text)]",
                  )}>
                    {formatDate(marche.date_limite)}
                    {daysLeft !== null && !expired && (
                      <span className={cn("ml-2 text-xs", urgent ? "text-red-400" : "text-[var(--color-text-muted)]")}>
                        (J-{daysLeft})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Relevance score */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Pertinence BYSS</span>
                  <span className={cn(
                    "text-lg font-bold font-[family-name:var(--font-clash-display)]",
                    marche.relevance_score >= 60 ? "text-emerald-400" :
                    marche.relevance_score >= 30 ? "text-amber-400" :
                    "text-[var(--color-text-muted)]",
                  )}>
                    {marche.relevance_score}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--color-surface)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${marche.relevance_score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-2 rounded-full",
                      marche.relevance_score >= 60 ? "bg-emerald-400" :
                      marche.relevance_score >= 30 ? "bg-amber-400" :
                      "bg-gray-500",
                    )}
                  />
                </div>
              </div>

              {/* CPV codes */}
              {marche.cpv_codes && marche.cpv_codes.length > 0 && (
                <div>
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Codes CPV</span>
                  <div className="flex flex-wrap gap-1.5">
                    {marche.cpv_codes.map((c) => (
                      <span key={c} className="rounded bg-[var(--color-surface)] px-2 py-0.5 font-mono text-xs text-cyan-400/70">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {marche.description && (
                <div>
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Description</span>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{marche.description}</p>
                </div>
              )}

              {/* AI Analysis */}
              {marche.ai_analysis && (
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    <Brain className="h-3.5 w-3.5" />
                    Analyse IA
                  </h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap">{marche.ai_analysis}</p>
                  {marche.go_no_go && (
                    <div className={cn(
                      "mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold",
                      marche.go_no_go === "GO" ? "bg-emerald-500/10 text-emerald-400" :
                      marche.go_no_go === "NO-GO" ? "bg-red-500/10 text-red-400" :
                      "bg-amber-500/10 text-amber-400",
                    )}>
                      {marche.go_no_go}
                    </div>
                  )}
                </div>
              )}

              {/* Budget inputs */}
              <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Budget</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] text-[var(--color-text-muted)]">Estimé (EUR)</label>
                    <input
                      type="number"
                      value={budgetEstimated}
                      onChange={(e) => { setBudgetEstimated(e.target.value); setDirty(true); }}
                      placeholder="0"
                      className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/30 focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-[var(--color-text-muted)]">Proposé (EUR)</label>
                    <input
                      type="number"
                      value={budgetProposed}
                      onChange={(e) => { setBudgetProposed(e.target.value); setDirty(true); }}
                      placeholder="0"
                      className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/30 focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => { setNotes(e.target.value); setDirty(true); }}
                  rows={4}
                  placeholder="Notes internes..."
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/30 focus:border-cyan-500/50 focus:outline-none resize-none"
                />
              </div>

              {/* Save button (if dirty) */}
              {dirty && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSave}
                  className="w-full rounded-lg bg-cyan-500/10 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
                >
                  Sauvegarder
                </motion.button>
              )}

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => onLinkCRM(marche)}
                  className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <LinkIcon className="h-4 w-4" />
                  Lier au CRM
                </button>
                <button
                  onClick={() => onCreateInvoice(marche)}
                  className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <FileText className="h-4 w-4" />
                  Créer la facture
                </button>
                {marche.url_source && (
                  <a
                    href={marche.url_source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:border-cyan-500/30 hover:text-cyan-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir l&apos;avis
                  </a>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => {
                  if (confirm("Supprimer ce marché du pipeline ?")) {
                    onDelete(marche.id);
                    onClose();
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
