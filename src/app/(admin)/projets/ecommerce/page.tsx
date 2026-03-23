"use client";

import { motion } from "motion/react";
import {
  ShoppingCart, Globe, TrendingUp, Bot, Zap,
  DollarSign, MapPin, Package, BarChart3, CheckCircle2, Construction,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   E-COMMERCE ASSAULT — Multi-Store Autonomous Empire
   50+ stores autonomes, intervention minimale/jour
   Marchés: Philippines, Vietnam, Maroc, Colombie, Tunisie, Égypte, Kenya
   ═══════════════════════════════════════════════════════ */

const MARKETS = [
  { country: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", penetration: "14%", cpm: "$1.50", priority: 1, status: "primary" },
  { country: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}", penetration: "69% TikTok Shop", cpm: "$1.80", priority: 2, status: "primary" },
  { country: "Maroc", flag: "\u{1F1F2}\u{1F1E6}", penetration: "8%", cpm: "$2.00", priority: 3, status: "secondary" },
  { country: "Colombie", flag: "\u{1F1E8}\u{1F1F4}", penetration: "12%", cpm: "$1.60", priority: 4, status: "secondary" },
  { country: "Tunisie", flag: "\u{1F1F9}\u{1F1F3}", penetration: "6%", cpm: "$1.40", priority: 5, status: "tertiary" },
  { country: "Egypte", flag: "\u{1F1EA}\u{1F1EC}", penetration: "5%", cpm: "$1.20", priority: 6, status: "tertiary" },
  { country: "Kenya", flag: "\u{1F1F0}\u{1F1EA}", penetration: "7%", cpm: "$1.00", priority: 7, status: "tertiary" },
];

const STACK = [
  { tool: "Claude Code", role: "Orchestrateur principal", icon: Bot },
  { tool: "MCP Meta/TikTok/Google", role: "Ads automation", icon: Zap },
  { tool: "CJDropshipping API", role: "Fulfillment", icon: Package },
  { tool: "Higgsfield / MiniMax", role: "Video creatives", icon: BarChart3 },
];

const PHASES = ["Phase 1 — store-creator-v1", "Phase 2 — scaling", "Phase 3 — empire"] as const;
const PHASE_STATUSES = ["planned", "in_progress", "done"] as const;
type PhaseStatus = (typeof PHASE_STATUSES)[number];

interface MilestoneState {
  phases: Record<string, PhaseStatus>;
  markets: Record<string, PhaseStatus>;
}

const defaultState = (): MilestoneState => ({
  phases: Object.fromEntries(PHASES.map((p) => [p, "planned" as PhaseStatus])),
  markets: Object.fromEntries(MARKETS.map((m) => [m.country, "planned" as PhaseStatus])),
});

function cycleStatus(s: PhaseStatus): PhaseStatus {
  const idx = PHASE_STATUSES.indexOf(s);
  return PHASE_STATUSES[(idx + 1) % PHASE_STATUSES.length];
}

function statusStyle(s: PhaseStatus) {
  if (s === "done") return { bg: "#10B98120", color: "#10B981", label: "done" };
  if (s === "in_progress") return { bg: "#22D3EE20", color: "#22D3EE", label: "in progress" };
  return { bg: "#6B728020", color: "#6B7280", label: "planned" };
}

export default function EcommercePage() {
  const [state, setState, loaded] = useLocalStorage<MilestoneState>(STORAGE_KEYS.ECOMMERCE_MILESTONES, defaultState());

  const togglePhase = (name: string) => {
    setState({ ...state, phases: { ...state.phases, [name]: cycleStatus(state.phases[name] ?? "planned") } });
  };

  const toggleMarket = (country: string) => {
    setState({ ...state, markets: { ...state.markets, [country]: cycleStatus(state.markets[country] ?? "planned") } });
  };

  const allItems = [...Object.values(state.phases), ...Object.values(state.markets)];
  const doneCount = allItems.filter((s) => s === "done").length;
  const pct = Math.round((doneCount / allItems.length) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          E-Commerce <span className="text-[var(--color-gold)]">Assault</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          50+ stores autonomes — Claude Code orchestrateur — Intervention minimale/jour
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
          <Construction className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">Site : En developpement</span>
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
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{doneCount}/{allItems.length} milestones — click to toggle status</p>
      </div>

      {/* Markets Grid */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Globe className="h-3 w-3 text-[var(--color-cyan)]" />
          Marches cibles — click to toggle status
        </h2>
        <div className="grid grid-cols-7 gap-3">
          {MARKETS.map((m, i) => {
            const ms = state.markets[m.country] ?? "planned";
            const st = statusStyle(ms);
            return (
              <div className="group relative">
                <motion.div
                  key={m.country}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleMarket(m.country)}
                  className="cursor-pointer rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center transition-all hover:border-[var(--color-gold)]"
                >
                  <span className="text-2xl">{m.flag}</span>
                  <h3 className="mt-1 text-xs font-bold text-[var(--color-text)]">{m.country}</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)]">E-com: {m.penetration}</p>
                  <p className="text-[10px] text-[var(--color-cyan)]">CPM: {m.cpm}</p>
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase"
                    style={{ backgroundColor: st.bg, color: st.color }}
                  >
                    {st.label}
                  </span>
                </motion.div>
                <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50">
                  <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] px-3 py-2 text-xs text-[var(--color-text-muted)] whitespace-nowrap shadow-xl">
                    Estimation basee sur etudes marche 2025-2026
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack */}
      <div className="grid grid-cols-4 gap-3">
        {STACK.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.tool}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
            >
              <Icon className="mb-2 h-5 w-5 text-[var(--color-gold)]" />
              <h3 className="text-xs font-bold text-[var(--color-text)]">{s.tool}</h3>
              <p className="text-[10px] text-[var(--color-text-muted)]">{s.role}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Phases — clickable */}
      <div className="space-y-3">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Phases — click to toggle
        </h2>
        {PHASES.map((name, i) => {
          const ps = state.phases[name] ?? "planned";
          const st = statusStyle(ps);
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => togglePhase(name)}
              className="cursor-pointer rounded-xl border p-6 transition-all hover:border-[var(--color-gold)]"
              style={{ borderColor: `${st.color}40`, background: `${st.color}08` }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold" style={{ color: st.color }}>
                  {name}
                </h2>
                <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </div>
              {name === PHASES[0] && (
                <>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Script Claude Code qui cree un store complet en autonomie : niche research &rarr; produit selection &rarr; store setup &rarr; creative generation &rarr; ads launch. Objectif : 1 store/jour.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <div className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-center">
                      <p className="font-mono text-lg font-bold text-[var(--color-gold)]">$0</p>
                      <p className="text-[9px] text-[var(--color-text-muted)]">Capital initial</p>
                    </div>
                    <div className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-center">
                      <p className="font-mono text-lg font-bold text-[var(--color-cyan)]">1/jour</p>
                      <p className="text-[9px] text-[var(--color-text-muted)]">Stores crees</p>
                    </div>
                    <div className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-center">
                      <p className="font-mono text-lg font-bold text-[#10B981]">50+</p>
                      <p className="text-[9px] text-[var(--color-text-muted)]">Objectif M+2</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
