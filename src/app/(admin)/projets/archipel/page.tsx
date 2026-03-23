"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Music, Globe, Users, Database, Cpu, Heart, CircleOff } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   ARCHIPEL — Spotify Caribéen
   Infrastructure pour la souveraineté sonique
   Marché: $66.58M (2024), 3.1M users 2027
   ═══════════════════════════════════════════════════════ */

const MILESTONES = [
  "Sonic Pi + Web Audio API integration",
  "Annoy recommandation engine",
  "Kubernetes + Kafka infrastructure",
  "Claude IA curation multimodale",
  "MVP artiste onboarding",
  "Beta launch 100 users",
  "Monetisation + licensing",
] as const;

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

export default function ArchipelPage() {
  const [milestones, setMilestones, loaded] = useLocalStorage<Record<string, Status>>(
    STORAGE_KEYS.ARCHIPEL_MILESTONES,
    Object.fromEntries(MILESTONES.map((m) => [m, "planned" as Status]))
  );

  const toggle = useCallback((name: string) => {
    setMilestones((prev) => ({ ...prev, [name]: cycleStatus(prev[name] ?? "planned") }));
  }, [setMilestones]);

  const vals = Object.values(milestones);
  const doneCount = vals.filter((s) => s === "done").length;
  const pct = Math.round((doneCount / vals.length) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          Archipel <span className="text-[var(--color-gold)]">&sim;</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Infrastructure pour la souverainete sonique — Pas un clone, une revolution
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-text-muted)]/30 bg-[var(--color-text-muted)]/10 px-4 py-1.5">
          <CircleOff className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">Site : Concept — Pas encore en ligne</span>
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
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{doneCount}/{vals.length} milestones</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: "$66.58M", label: "Marche 2024", icon: Globe },
          { value: "3.1M", label: "Users prevus 2027", icon: Users },
          { value: "100%", label: "Souverainete donnees", icon: Database },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="group relative">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 text-center"
              >
                <Icon className="mx-auto mb-2 h-6 w-6 text-[var(--color-gold)]" />
                <p className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-gold)]">{s.value}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{s.label}</p>
              </motion.div>
              <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50">
                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] px-3 py-2 text-xs text-[var(--color-text-muted)] whitespace-nowrap shadow-xl">
                  Source : IFPI Global Music Report 2025, Spotify Caribbean data
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thesis */}
      <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-6">
        <h2 className="mb-3 font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
          These centrale
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          L&apos;algorithme de Spotify ne comprend pas la difference entre zouk love et bouyon.
          Archipel est la premiere plateforme IA-native qui comprend la musique caribbeenne —
          ses rythmes, ses diasporas, ses micro-genres. Pas un clone : une infrastructure
          pour la souverainete sonique.
        </p>
      </div>

      {/* Milestones — clickable */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Cpu className="mr-1.5 inline h-3 w-3" />Roadmap — click to toggle
        </h2>
        <div className="space-y-2">
          {MILESTONES.map((m, i) => {
            const s = milestones[m] ?? "planned";
            const st = statusStyle(s);
            return (
              <motion.div
                key={m}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggle(m)}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all hover:border-[var(--color-gold)]"
              >
                <span className={`text-xs font-medium ${s === "done" ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
                  {m}
                </span>
                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Philosophy */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 text-center">
        <Heart className="mx-auto mb-3 h-6 w-6 text-[var(--color-gold)]" />
        <p className="font-[family-name:var(--font-clash-display)] text-lg font-bold italic text-[var(--color-gold)]">
          &ldquo;IA-first, user-first, maximum power.&rdquo;
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          Metaphore phlorotannine — structure moleculaire unique de la musique caribbeenne
        </p>
      </div>
    </div>
  );
}
