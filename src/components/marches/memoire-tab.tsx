"use client";

import { motion } from "motion/react";
import { FileText, Sparkles, Save, Loader2, Eye } from "lucide-react";
import { MEMOIRE_SECTIONS, type MarcheRow } from "@/lib/marches";

export function MemoireTab({
  goMarches, marches, memoireTarget, generatingMemoire, memoireSections, savingMemoire,
  onMemoireTargetChange, onGenerate, onSectionChange, onSave, onExportPdf, onViewMemoire,
}: {
  goMarches: MarcheRow[];
  marches: MarcheRow[];
  memoireTarget: string;
  generatingMemoire: boolean;
  memoireSections: Record<string, string>;
  savingMemoire: boolean;
  onMemoireTargetChange: (v: string) => void;
  onGenerate: () => void;
  onSectionChange: (key: string, value: string) => void;
  onSave: () => void;
  onExportPdf: () => void;
  onViewMemoire: (id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {goMarches.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-text-muted)]"><FileText className="mx-auto mb-3 h-10 w-10 opacity-30" /><p className="font-[family-name:var(--font-clash-display)] text-lg">Aucun march\u00e9 GO.</p><p className="mt-1 text-sm">Passez un march\u00e9 en statut GO pour g\u00e9n\u00e9rer un m\u00e9moire technique.</p></div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 space-y-4">
            <h3 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">G\u00e9n\u00e9ration M\u00e9moire Technique</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Claude g\u00e9n\u00e8re un squelette structur\u00e9 bas\u00e9 sur l&apos;analyse du CCTP. Chaque section est \u00e9ditable.</p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">March\u00e9 GO</label>
                <select value={memoireTarget} onChange={(e) => onMemoireTargetChange(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
                  <option value="">S\u00e9lectionner...</option>
                  {goMarches.map((m) => (<option key={m.id} value={m.id}>{m.title}</option>))}
                </select>
              </div>
              <button onClick={onGenerate} disabled={!memoireTarget || generatingMemoire}
                className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50">
                {generatingMemoire ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}G\u00e9n\u00e9rer le squelette
              </button>
            </div>
          </div>

          {Object.keys(memoireSections).length > 0 && (
            <div className="space-y-4">
              {MEMOIRE_SECTIONS.map((section) => (
                <div key={section.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{section.label}</label>
                  <textarea value={memoireSections[section.id] || ""} onChange={(e) => onSectionChange(section.id, e.target.value)} rows={6}
                    placeholder={section.placeholder}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/30 focus:border-cyan-500/50 focus:outline-none resize-y" />
                </div>
              ))}
              <div className="flex items-center gap-3">
                <button onClick={onSave} disabled={savingMemoire}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50">
                  {savingMemoire ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Sauvegarder
                </button>
                <button onClick={onExportPdf}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-6 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:border-cyan-500/30 hover:text-cyan-400">
                  <FileText className="h-4 w-4" />Exporter PDF
                </button>
              </div>
            </div>
          )}

          {marches.filter((m) => m.memoire_technique).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">M\u00e9moires existants</h4>
              {marches.filter((m) => m.memoire_technique).map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                  <div><h5 className="text-sm font-medium text-[var(--color-text)]">{m.title}</h5><p className="text-xs text-[var(--color-text-muted)]">{m.acheteur}</p></div>
                  <button onClick={() => onViewMemoire(m.id)} className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"><Eye className="mr-1 inline h-3 w-3" />Voir</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
