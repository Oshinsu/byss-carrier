"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clapperboard, Cpu, Image, Music, Mic, Film, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const LS_KEY = "atl-production-progress";
const PROGRESS_STEPS = [0, 25, 50, 75, 100];

const ICON_MAP: Record<string, typeof Film> = { Film, Image, Cpu, Clapperboard, Mic, Music };

const INITIAL_PIPELINE = [
  { id: "research", name: "Recherche Historique", tool: "Archives + Claude", progress: 100, icon: "Film" },
  { id: "script", name: "Script & Narration", tool: "Claude Opus + XTTS-v2 (Replicate)", progress: 100, icon: "Mic" },
  { id: "keyframe", name: "Keyframe Generation", tool: "Midjourney v6", progress: 70, icon: "Image" },
  { id: "anim", name: "Animation Video", tool: "Kling 3.0 + Nano Banana Pro", progress: 45, icon: "Cpu" },
  { id: "music", name: "Musique Creole", tool: "Suno + instruments locaux", progress: 30, icon: "Music" },
  { id: "post", name: "Post-Production", tool: "DaVinci Resolve", progress: 0, icon: "Clapperboard" },
];

const METRICS = [
  { label: "Episodes scriptes", value: "10/10" },
  { label: "Episodes animes", value: "3/10" },
  { label: "Duree totale cible", value: "42 min" },
  { label: "Budget IA estime", value: "280$" },
];

function getStatus(progress: number) {
  if (progress >= 100) return "done";
  if (progress > 0) return "in_progress";
  return "pending";
}

export default function ATLProductionPage() {
  const [pipeline, setPipeline] = useState(INITIAL_PIPELINE);
  const [hydrated, setHydrated] = useState(false);

  /* ── Load persisted progress ──────────────────────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const map: Record<string, number> = JSON.parse(saved);
        setPipeline((prev) => prev.map((s) => ({ ...s, progress: map[s.id] ?? s.progress })));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  /* ── Cycle progress: click to advance ─────────────── */
  function cycleProgress(id: string) {
    setPipeline((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== id) return s;
        const idx = PROGRESS_STEPS.indexOf(s.progress);
        const nextIdx = idx >= 0 ? (idx + 1) % PROGRESS_STEPS.length : 0;
        return { ...s, progress: PROGRESS_STEPS[nextIdx] };
      });
      const map: Record<string, number> = {};
      updated.forEach((s) => { map[s.id] = s.progress; });
      localStorage.setItem(LS_KEY, JSON.stringify(map));
      return updated;
    });
  }

  const overall = Math.round(pipeline.reduce((sum, s) => sum + s.progress, 0) / pipeline.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Clapperboard className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <PageHeader title="Production" />
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            An tan lontan — Pipeline IA, Kling 3.0 + Nano Banana Pro
          </p>
        </div>
        <div className="ml-auto text-right">
          <div className="font-mono text-lg font-bold text-[var(--color-gold)]">{overall}%</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">global</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
        <motion.div
          className="h-full rounded-full bg-[var(--color-gold)]"
          initial={{ width: 0 }}
          animate={{ width: `${overall}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3"
          >
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{m.value}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Pipeline de Production
          </h2>
        </div>
        {pipeline.map((step, i) => {
          const status = getStatus(step.progress);
          const StepIcon = ICON_MAP[step.icon] ?? Film;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 last:border-b-0"
            >
              <StepIcon className={`h-4 w-4 ${status === "done" ? "text-emerald-400" : status === "in_progress" ? "text-amber-400" : "text-[var(--color-text-muted)]"}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--color-text)]">{step.name}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{step.tool}</div>
              </div>
              {/* Clickable progress bar */}
              <button
                onClick={() => cycleProgress(step.id)}
                className="group w-32"
                title={`${step.progress}% — Cliquer pour changer`}
              >
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-raised)] transition-all group-hover:h-2.5">
                  <motion.div
                    className="h-full rounded-full bg-[var(--color-gold)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${step.progress}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  />
                </div>
              </button>
              <button
                onClick={() => cycleProgress(step.id)}
                className="w-10 text-right font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
              >
                {hydrated ? step.progress : INITIAL_PIPELINE[i].progress}%
              </button>
              {status === "done" ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
