"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Zap, Rocket, Users, Target, TrendingUp, BarChart3, BadgeCheck } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

const STATS = [
  { label: "Startups incubees", value: "12", icon: Rocket },
  { label: "Leads / mois", value: "120", icon: TrendingUp },
  { label: "Pipeline actif", value: "PIP4", icon: Target },
  { label: "Taux conversion", value: "18%", icon: BarChart3 },
];

const STARTUPS = [
  { name: "Zenith Eco", sector: "Green Tech", phase: "Scale", color: "text-emerald-400" },
  { name: "KaribTech", sector: "SaaS", phase: "Growth", color: "text-blue-400" },
  { name: "MatinikFood", sector: "Agroalimentaire", phase: "Seed", color: "text-amber-400" },
  { name: "SoleilPay", sector: "Fintech", phase: "Growth", color: "text-purple-400" },
  { name: "IleCare", sector: "Sante", phase: "Seed", color: "text-pink-400" },
  { name: "TraceAntan", sector: "Culture", phase: "MVP", color: "text-cyan-400" },
];

const ALL_PHASES = ["MVP", "Seed", "Growth", "Scale"] as const;
type Phase = (typeof ALL_PHASES)[number];

const PHASE_COLORS: Record<string, string> = {
  Scale: "bg-emerald-400/10 text-emerald-400",
  Growth: "bg-blue-400/10 text-blue-400",
  Seed: "bg-amber-400/10 text-amber-400",
  MVP: "bg-cyan-400/10 text-cyan-400",
};

function cyclePhase(p: Phase): Phase {
  return ALL_PHASES[(ALL_PHASES.indexOf(p) + 1) % ALL_PHASES.length];
}

export default function Apex972Page() {
  const [phases, setPhases, loaded] = useLocalStorage<Record<string, Phase>>(
    STORAGE_KEYS.APEX_972_MILESTONES,
    Object.fromEntries(STARTUPS.map((s) => [s.name, s.phase as Phase]))
  );

  const toggle = useCallback((name: string) => {
    setPhases((prev) => ({ ...prev, [name]: cyclePhase(prev[name] ?? "MVP") }));
  }, [setPhases]);

  const vals = Object.values(phases);
  const scaleCount = vals.filter((p) => p === "Scale").length;
  const pct = Math.round((scaleCount / vals.length) * 100);

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Zap className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            APEX 972
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            Incubateur tech Martinique — PIP4
          </p>
        </div>
        <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5">
          <BadgeCheck className="h-3.5 w-3.5 text-[var(--color-gold)]" />
          <span className="text-xs font-semibold text-[var(--color-gold)]">Machine a leads — 120 leads/mois</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Startups at Scale</span>
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
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{scaleCount}/{vals.length} startups at Scale phase</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-gold-glow)]">
              <s.icon className="h-4 w-4 text-[var(--color-gold)]" />
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-[var(--color-text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <div className="group relative">
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            APEX 972 est l&apos;incubateur tech de la Martinique. Pipeline PIP4 en production avec
            120 leads/mois via n8n + Airtable + 360dialog. Focus sur les startups locales a fort
            potentiel, de la phase seed au scale.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] px-3 py-2 text-xs text-[var(--color-text-muted)] whitespace-nowrap shadow-xl">
            Pipeline leads via n8n + WhatsApp 360dialog
          </div>
        </div>
      </div>

      {/* Startups table — toggleable phases */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Startups Incubees — click to cycle phase
          </h2>
          <Users className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>
        {STARTUPS.map((s, i) => {
          const phase = phases[s.name] ?? (s.phase as Phase);
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => toggle(s.name)}
              className="flex cursor-pointer items-center gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 transition-all last:border-b-0 hover:bg-[var(--color-surface-raised)]/50"
            >
              <span className={`text-sm font-bold ${s.color}`}>{s.name}</span>
              <span className="flex-1 text-xs text-[var(--color-text-muted)]">{s.sector}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PHASE_COLORS[phase] ?? ""}`}>
                {phase}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
