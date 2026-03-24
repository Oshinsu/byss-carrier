"use client";

import { motion } from "motion/react";
import { Film, Music, Brain, Layers, Zap, Timer, Code, FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   VIDEOÒS — AI-First Video Editing Software
   Beat-synced editing + Multi-agents Editor↔Critic
   Opus 4.6 (1M context) = film complet sans RAG
   Fenêtre compétitive: 18-36 mois avant réaction Adobe
   ═══════════════════════════════════════════════════════ */

const PIPELINE = [
  { layer: "Audio", tech: "Demucs v4 (Meta AI)", desc: "Separation stems — 9.20dB SDR", icon: Music, color: "#3B82F6" },
  { layer: "Beat Tracking", tech: "BEAST", desc: "Streaming Transformer, detection temps reel", icon: Timer, color: "#F59E0B" },
  { layer: "Multi-Agents", tech: "EditDuet (SIGGRAPH 2025)", desc: "Editor \u2194 Critic en boucle", icon: Brain, color: "#8B5CF6" },
  { layer: "LLM Orchestration", tech: "Claude Opus 4.6 (1M)", desc: "Film complet 90min en une session", icon: Layers, color: "#00B4D8" },
];

const PHASES = [
  { phase: "Phase 0 \u2014 POC", duration: "3 mois", desc: "Python CLI, beat-sync basique, proof of concept" },
  { phase: "Phase 1 \u2014 Multi-agents", duration: "6 mois", desc: "UI React + multi-agents Editor/Critic + beat hierarchy" },
  { phase: "Phase 2 \u2014 SaaS B2B", duration: "12 mois", desc: "Platform cloud, API, pricing tiers, enterprise" },
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
  phases: Record<string, Status>;
  pipeline: Record<string, Status>;
}

const defaultState = (): State => ({
  phases: Object.fromEntries(PHASES.map((p) => [p.phase, "planned" as Status])),
  pipeline: Object.fromEntries(PIPELINE.map((p) => [p.layer, "planned" as Status])),
});

export default function VideoOSPage() {
  const [state, setState, loaded] = useLocalStorage<State>(STORAGE_KEYS.VIDEOOS_MILESTONES, defaultState());

  const togglePhase = (name: string) => {
    setState({ ...state, phases: { ...state.phases, [name]: cycleStatus(state.phases[name] ?? "planned") } });
  };

  const togglePipeline = (name: string) => {
    setState({ ...state, pipeline: { ...state.pipeline, [name]: cycleStatus(state.pipeline[name] ?? "planned") } });
  };

  const all = [...Object.values(state.phases), ...Object.values(state.pipeline)];
  const doneCount = all.filter((s) => s === "done").length;
  const pct = Math.round((doneCount / all.length) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <PageHeader title="Video" titleAccent="OS" subtitle="Montage video IA-native — Beat-synced + Multi-agents — Fenetre 18-36 mois avant Adobe" />
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5">
          <FlaskConical className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-xs font-semibold text-purple-400">Site : R&amp;D Phase</span>
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
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{doneCount}/{all.length} milestones</p>
      </div>

      {/* Core Innovation */}
      <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-6">
        <Film className="mb-2 h-6 w-6 text-[var(--color-gold)]" />
        <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
          Innovation : Beat-Synced Editing
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Montage automatique synchronise sur la hierarchie musicale :
          croche = cut rapide, noire = transition, blanche = plan long.
          Le rythme dicte le montage, pas l&apos;inverse.
        </p>
      </div>

      {/* Pipeline Layers — clickable */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Pipeline — click to toggle</h2>
        <div className="grid grid-cols-2 gap-4">
          {PIPELINE.map((p, i) => {
            const Icon = p.icon;
            const s = state.pipeline[p.layer] ?? "planned";
            const st = statusStyle(s);
            return (
              <motion.div
                key={p.layer}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => togglePipeline(p.layer)}
                className="cursor-pointer rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-gold)]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" style={{ color: p.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.layer}</span>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[var(--color-text)]">{p.tech}</h3>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Roadmap — clickable */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Roadmap — click to toggle</h2>
        <div className="grid grid-cols-3 gap-4">
          {PHASES.map((p, i) => {
            const s = state.phases[p.phase] ?? "planned";
            const st = statusStyle(s);
            return (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => togglePhase(p.phase)}
                className="cursor-pointer rounded-xl border p-4 transition-all hover:border-[var(--color-gold)]"
                style={{ borderColor: `${st.color}40`, background: `${st.color}08` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold" style={{ color: st.color }}>{p.phase}</h3>
                  <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-cyan)]">{p.duration}</p>
                <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
        <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Comparatif — VideoOS vs marche</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
                <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-muted)]">Feature</th>
                {["VideoOS", "Premiere Pro", "CapCut", "DaVinci"].map((tool) => (
                  <th key={tool} className={`px-3 py-2.5 text-center font-semibold ${tool === "VideoOS" ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"}`}>
                    {tool}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Beat-sync auto", videoos: true, premiere: false, capcut: false, davinci: false },
                { feature: "Multi-agents IA", videoos: true, premiere: false, capcut: false, davinci: false },
                { feature: "1M context (film entier)", videoos: true, premiere: false, capcut: false, davinci: false },
                { feature: "Separation audio Demucs", videoos: true, premiere: false, capcut: false, davinci: true },
                { feature: "Export timeline EDL/XML", videoos: true, premiere: true, capcut: false, davinci: true },
                { feature: "Gratuit", videoos: false, premiere: false, capcut: true, davinci: true },
                { feature: "GPU local", videoos: false, premiere: true, capcut: false, davinci: true },
                { feature: "Plugin ecosystem", videoos: false, premiere: true, capcut: false, davinci: true },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-surface-2)]/50">
                  <td className="px-4 py-2 text-[var(--color-text)]">{row.feature}</td>
                  {[row.videoos, row.premiere, row.capcut, row.davinci].map((val, i) => (
                    <td key={i} className="px-3 py-2 text-center">
                      <span className={val ? "text-emerald-400" : "text-[var(--color-text-muted)]"}>{val ? "\u2713" : "\u2014"}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Pipeline Detail */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-400" />
          <h2 className="text-sm font-bold text-purple-300">Pipeline IA — Detail technique</h2>
        </div>
        <div className="space-y-4">
          {[
            { stage: "1. Demucs v4", tech: "Meta AI", detail: "Separation 4 stems (voix, batterie, basse, autre) a 9.20dB SDR. Modele Hybrid Transformer. Inference GPU : 2.3s pour 3min audio. Permet le montage sur chaque stem independamment.", color: "#3B82F6" },
            { stage: "2. BEAST", tech: "Streaming Transformer", detail: "Beat tracking temps reel avec hierarchie metrique complete : croche, noire, blanche, ronde. Detection downbeat, tempo, time signature. Latence <100ms. Le rythme structure le montage : croche = cut rapide, noire = transition, blanche = plan large.", color: "#F59E0B" },
            { stage: "3. Editor Agent", tech: "EditDuet (SIGGRAPH 2025)", detail: "Agent generatif qui produit un premier montage complet. Prend en input : hierarchie beats + stems + rushes indexes. Output : timeline EDL avec cuts, transitions, speed ramps alignes sur la musique.", color: "#8B5CF6" },
            { stage: "4. Critic Agent", tech: "Claude Opus 4.6", detail: "Evalue le montage de l'Editor : coherence narrative, rythme visuel, variete des plans. Score 0-100 avec feedback structure. Si score <70, l'Editor regenere. Boucle moyenne : 2.3 iterations avant convergence.", color: "#00B4D8" },
          ].map((s) => (
            <div key={s.stage} className="flex items-start gap-3 rounded-lg bg-[var(--color-surface)] p-4">
              <span className="mt-0.5 shrink-0 rounded-md px-2 py-1 font-mono text-[9px] font-bold" style={{ backgroundColor: `${s.color}15`, color: s.color }}>{s.stage}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-text)]">{s.tech}</span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-[var(--color-text-muted)]">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Advantage */}
      <div className="group relative">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 text-center">
          <Code className="mx-auto mb-2 h-5 w-5 text-[var(--color-cyan)]" />
          <p className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-cyan)]">
            1M tokens context = film complet 90min analyse en une session sans RAG
          </p>
        </div>
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] px-3 py-2 text-xs text-[var(--color-text-muted)] whitespace-nowrap shadow-xl">
            Fenetre competitive : 18-36 mois avant Adobe
          </div>
        </div>
      </div>
    </div>
  );
}
