"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Film, Music, Brain, Layers, Zap, Timer, Code, FlaskConical } from "lucide-react";

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
const LS_KEY = "byss-videoos-milestones";

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
  const [state, setState] = useState<State>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const persist = useCallback((next: State) => {
    setState(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }, []);

  const togglePhase = (name: string) => {
    persist({ ...state, phases: { ...state.phases, [name]: cycleStatus(state.phases[name] ?? "planned") } });
  };

  const togglePipeline = (name: string) => {
    persist({ ...state, pipeline: { ...state.pipeline, [name]: cycleStatus(state.pipeline[name] ?? "planned") } });
  };

  const all = [...Object.values(state.phases), ...Object.values(state.pipeline)];
  const doneCount = all.filter((s) => s === "done").length;
  const pct = Math.round((doneCount / all.length) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          Video<span className="text-[var(--color-gold)]">OS</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Montage video IA-native — Beat-synced + Multi-agents — Fenetre 18-36 mois avant Adobe
        </p>
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
