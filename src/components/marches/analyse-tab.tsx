"use client";

import { motion } from "motion/react";
import { Brain, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarcheRow } from "@/lib/marches";

export function AnalyseTab({
  marches, analyzeTarget, analyzing, analysisResult,
  onAnalyzeTargetChange, onRunAnalysis,
}: {
  marches: MarcheRow[];
  analyzeTarget: string;
  analyzing: boolean;
  analysisResult: string | null;
  onAnalyzeTargetChange: (v: string) => void;
  onRunAnalysis: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {marches.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-text-muted)]"><Brain className="mx-auto mb-3 h-10 w-10 opacity-30" /><p className="font-[family-name:var(--font-clash-display)] text-lg">Rien \u00e0 analyser.</p><p className="mt-1 text-sm">Importez des march\u00e9s depuis l&apos;onglet Veille.</p></div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 space-y-4">
            <h3 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">Analyse approfondie</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Claude analyse le march\u00e9 vs les capacit\u00e9s BYSS, identifie les comp\u00e9tences manquantes, propose des partenaires GME, estime l&apos;effort et g\u00e9n\u00e8re une recommandation GO/NO-GO.</p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">March\u00e9 \u00e0 analyser</label>
                <select value={analyzeTarget} onChange={(e) => onAnalyzeTargetChange(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none">
                  <option value="">S\u00e9lectionner...</option>
                  {marches.map((m) => (<option key={m.id} value={m.id}>{m.title} \u2014 {m.acheteur}</option>))}
                </select>
              </div>
              <button onClick={onRunAnalysis} disabled={!analyzeTarget || analyzing}
                className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50">
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}Analyser avec Claude
              </button>
            </div>
          </div>

          {analyzing && (
            <div className="flex flex-col items-center justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-cyan-400" /><p className="mt-4 text-sm text-[var(--color-text-muted)]">Sorel analyse le march\u00e9...</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">Capacit\u00e9s BYSS, comp\u00e9tences, partenaires, effort, pricing</p></div>
          )}

          {analysisResult && !analyzing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-cyan-500/20 bg-[#0F0F1A] p-6">
              <h4 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-lg font-bold text-cyan-400"><Brain className="h-5 w-5" />R\u00e9sultat de l&apos;analyse</h4>
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-[var(--color-text-muted)]">{analysisResult}</div>
            </motion.div>
          )}

          {marches.filter((m) => m.ai_analysis).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Analyses pr\u00e9c\u00e9dentes</h4>
              {marches.filter((m) => m.ai_analysis).map((m) => (
                <div key={m.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-[var(--color-text)] line-clamp-1">{m.title}</h5>
                    {m.go_no_go && <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", m.go_no_go === "GO" ? "bg-emerald-500/10 text-emerald-400" : m.go_no_go === "NO-GO" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400")}>{m.go_no_go}</span>}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 whitespace-pre-wrap">{m.ai_analysis}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
