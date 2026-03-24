"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Sun, Calculator, MessageCircle, Mail, TrendingUp, AlertTriangle, CheckCircle2, XCircle, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   ZENITH ECO — Solar/Energy Business Optimization
   Client: ENR Free (Martinique)
   Innovation: Simulateur "calculateur d'économies" IA
   ═══════════════════════════════════════════════════════ */

const ISSUES = [
  { issue: "Site WordPress 40% qualite", severity: "critical" },
  { issue: "6 pages copiant le meme paragraphe", severity: "critical" },
  { issue: "Blog mort depuis 2020", severity: "high" },
  { issue: "Pas de WhatsApp (canal primaire MQ)", severity: "critical" },
  { issue: "50-100EUR/jour en ads sans conversion", severity: "high" },
];

const PIPELINE_STEPS = [
  { step: "1. Capture", desc: "Simulateur economies sur site", icon: Calculator, color: "#3B82F6" },
  { step: "2. Nurture", desc: "Sequence emails automatique", icon: Mail, color: "#F59E0B" },
  { step: "3. WhatsApp", desc: "Canal principal Martinique", icon: MessageCircle, color: "#10B981" },
  { step: "4. Conversion", desc: "RDV devis + installation", icon: TrendingUp, color: "#00B4D8" },
];

const STATUSES = ["planned", "in_progress", "done"] as const;
type Status = (typeof STATUSES)[number];

function cycleStatus(s: Status): Status {
  return STATUSES[(STATUSES.indexOf(s) + 1) % STATUSES.length];
}

function statusStyle(s: Status) {
  if (s === "done") return { bg: "#10B98120", color: "#10B981", label: "done" };
  if (s === "in_progress") return { bg: "#22D3EE20", color: "#22D3EE", label: "in progress" };
  return { bg: "#6B728020", color: "#6B7280", label: "planned" };
}

interface State {
  issues: Record<string, boolean>; // true = resolved
  pipeline: Record<string, Status>;
}

const defaultState = (): State => ({
  issues: Object.fromEntries(ISSUES.map((i) => [i.issue, false])),
  pipeline: Object.fromEntries(PIPELINE_STEPS.map((s) => [s.step, "planned" as Status])),
});

export default function ZenithEcoPage() {
  const [state, setState, loaded] = useLocalStorage<State>(
    STORAGE_KEYS.ZENITH_ECO_MILESTONES,
    defaultState()
  );

  const toggleIssue = useCallback((issue: string) => {
    setState((prev) => ({ ...prev, issues: { ...prev.issues, [issue]: !prev.issues[issue] } }));
  }, [setState]);

  const togglePipeline = useCallback((step: string) => {
    setState((prev) => ({ ...prev, pipeline: { ...prev.pipeline, [step]: cycleStatus(prev.pipeline[step] ?? "planned") } }));
  }, [setState]);

  const issuesResolved = Object.values(state.issues).filter(Boolean).length;
  const pipelineDone = Object.values(state.pipeline).filter((s) => s === "done").length;
  const total = ISSUES.length + PIPELINE_STEPS.length;
  const done = issuesResolved + pipelineDone;
  const pct = Math.round((done / total) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <PageHeader title="Zenith" titleAccent="Eco" subtitle="Client ENR Free — Optimisation solaire Martinique — Simulateur economies IA" />
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">Client : Zenith Eco — ENR Free</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Progression globale</span>
          <span className="font-mono text-sm font-bold text-[var(--color-gold)]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-cyan)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{issuesResolved}/{ISSUES.length} issues resolved &middot; {pipelineDone}/{PIPELINE_STEPS.length} pipeline steps done</p>
      </div>

      {/* Problem — checkable issues */}
      <div className="group relative rounded-xl border border-[var(--color-fire)] bg-[#EF444408] p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-fire)]">
          <AlertTriangle className="h-4 w-4" />
          Diagnostic ENR Free — click to toggle resolved
        </h2>
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] px-3 py-2 text-xs text-[var(--color-text-muted)] whitespace-nowrap shadow-xl">
            Diagnostic realise Mars 2026
          </div>
        </div>
        <div className="space-y-2">
          {ISSUES.map((i, idx) => {
            const resolved = state.issues[i.issue] ?? false;
            return (
              <div
                key={idx}
                onClick={() => toggleIssue(i.issue)}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-all hover:bg-[#EF444410]"
              >
                {resolved ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981]" />
                ) : (
                  <span className={`h-2 w-2 shrink-0 rounded-full ${i.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                )}
                <span className={`flex-1 text-xs ${resolved ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
                  {i.issue}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                  resolved ? "bg-[#10B98115] text-[#10B981]" : "bg-[#EF444415] text-[#EF4444]"
                }`}>
                  {resolved ? "resolved" : "open"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solution */}
      <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-6">
        <Sun className="mb-2 h-6 w-6 text-[var(--color-gold)]" />
        <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
          Solution BYSS
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Simulateur &ldquo;calculateur d&apos;economies&rdquo; IA — aucun concurrent local n&apos;a ca.
          Le prospect entre sa consommation, le simulateur calcule les economies solaires
          et capture le lead automatiquement.
        </p>
      </div>

      {/* Solar Simulator */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-emerald-300">Simulateur solaire — Concept</h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Le prospect entre 3 donnees. Le simulateur calcule tout. Le lead est capture avant meme qu&apos;il ait parle a un commercial.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { input: "Surface toiture", example: "80 m2", desc: "Estimation via adresse ou saisie manuelle" },
            { input: "Orientation", example: "Sud / Sud-Ouest", desc: "Optimal Martinique : exposition face mer" },
            { input: "Consommation", example: "350 EUR/mois", desc: "Facture EDF moyenne menage martiniquais" },
          ].map((f) => (
            <div key={f.input} className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{f.input}</p>
              <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)]">{f.example}</p>
              <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-[var(--color-surface)] border border-emerald-500/20 p-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Resultats generes automatiquement</p>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: "Economies an 1", value: "2 800 EUR" },
              { label: "ROI", value: "4.2 ans" },
              { label: "Production kWh", value: "12 400 kWh" },
              { label: "CO2 evite", value: "3.2 tonnes" },
            ].map((r) => (
              <div key={r.label}>
                <p className="font-mono text-lg font-bold text-emerald-400">{r.value}</p>
                <p className="text-[9px] text-[var(--color-text-muted)]">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Funnel Conversion */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-[var(--color-text)]">Funnel WhatsApp — Taux conversion</h2>
        </div>
        <div className="space-y-3">
          {[
            { stage: "Visite site", count: "1 000", pct: 100, color: "#3B82F6" },
            { stage: "Simulation lancee", count: "320", pct: 32, color: "#F59E0B" },
            { stage: "Lead capture (email)", count: "180", pct: 18, color: "#10B981" },
            { stage: "WhatsApp engage", count: "95", pct: 9.5, color: "#00B4D8" },
            { stage: "RDV devis pris", count: "28", pct: 2.8, color: "#8B5CF6" },
            { stage: "Contrat signe", count: "8", pct: 0.8, color: "#10B981" },
          ].map((s) => (
            <div key={s.stage}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--color-text)]">{s.stage}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  <span className="font-mono font-bold" style={{ color: s.color }}>{s.count}</span>
                  <span className="ml-1 text-[9px]">({s.pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">
          Martinique : WhatsApp est le canal primaire. 80% des leads repondent sur WhatsApp vs 15% par email. Le simulateur alimente le funnel automatiquement.
        </p>
      </div>

      {/* Pipeline Lead Gen — toggleable */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Pipeline — click to toggle</h2>
        <div className="grid grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((s, i) => {
            const Icon = s.icon;
            const status = state.pipeline[s.step] ?? "planned";
            const st = statusStyle(status);
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => togglePipeline(s.step)}
                className="cursor-pointer rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-gold)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5" style={{ color: s.color }} />
                  <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <h3 className="text-xs font-bold" style={{ color: s.color }}>{s.step}</h3>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
