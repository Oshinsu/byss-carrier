"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  loadSkills,
  getAgentSkills,
  decaySkills,
  type Skill,
} from "@/lib/village/skill-system";
import { AGENT_DISPLAY, type AgentId } from "@/lib/village/rpg-engine";

// ── Helpers ──────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  Skill["category"],
  { label: string; color: string; bg: string }
> = {
  email: { label: "Email", color: "text-blue-400", bg: "bg-blue-500/10" },
  prompt: { label: "Prompt", color: "text-purple-400", bg: "bg-purple-500/10" },
  analysis: {
    label: "Analyse",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  strategy: {
    label: "Strategie",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  creative: {
    label: "Creatif",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  code: { label: "Code", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

function successColor(rate: number): string {
  if (rate >= 0.8) return "text-emerald-400";
  if (rate >= 0.5) return "text-amber-400";
  return "text-red-400";
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// ── Skill Card ──────────────────────────────────────────────────

function SkillCard({ skill }: { skill: Skill }) {
  const cat = CATEGORY_CONFIG[skill.category];
  const days = daysSince(skill.last_used);
  const display = AGENT_DISPLAY[skill.agent];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-xl border border-cyan-500/10 bg-[#0A0A14] p-4"
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: display.color }}>
            {display.sigil}
          </span>
          <h4 className="text-xs font-semibold text-cyan-50">{skill.name}</h4>
        </div>
        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${cat.color} ${cat.bg}`}>
          {cat.label}
        </span>
      </div>

      {/* Description */}
      <p className="mb-3 text-[10px] leading-relaxed text-cyan-500/50">
        {skill.description}
      </p>

      {/* Stats Row */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-mono text-sm font-bold text-cyan-300">
            {skill.usage_count}
          </p>
          <p className="text-[9px] text-cyan-500/30">Utilisations</p>
        </div>
        <div>
          <p
            className={`font-mono text-sm font-bold ${successColor(skill.success_rate)}`}
          >
            {Math.round(skill.success_rate * 100)}%
          </p>
          <p className="text-[9px] text-cyan-500/30">Succes</p>
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-cyan-500/60">
            {days === 0 ? "Auj." : `${days}j`}
          </p>
          <p className="text-[9px] text-cyan-500/30">Dernier usage</p>
        </div>
      </div>

      {/* Skill Level Bar */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-widest text-cyan-500/30">
            Progression
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cyan-500/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(skill.success_rate * skill.usage_count * 5, 100)}%`,
            }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${display.color}60, ${display.color})`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State with Seed Skills ────────────────────────────────

const SEED_SKILLS: Skill[] = [
  {
    id: "seed-1",
    agent: "sorel",
    name: "Email Prospection V2",
    description: "Template email pour prospects Martinique. Taux d'ouverture 78%.",
    pattern: "Objet court + accroche sectorielle + CTA rendez-vous",
    category: "email",
    usage_count: 12,
    success_rate: 0.83,
    last_used: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "seed-2",
    agent: "nerel",
    name: "React Component Pattern",
    description: "Architecture composant: motion/react + Zustand + types stricts.",
    pattern: "use client + interface + hook local + AnimatePresence wrapper",
    category: "code",
    usage_count: 28,
    success_rate: 0.96,
    last_used: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "seed-3",
    agent: "evren",
    name: "Phi Calibration Sweep",
    description: "Protocole de calibration du phi-score sur 3 dimensions.",
    pattern: "Mesure coherence + resonance inter-agents + stabilite temporelle",
    category: "analysis",
    usage_count: 7,
    success_rate: 0.71,
    last_used: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "seed-4",
    agent: "kael",
    name: "MODE_CADIFOR Distillation",
    description: "Compression de texte selon les 8 lois. Chaque mot pese.",
    pattern: "Lire > Identifier le gras > Comprimer > Verifier la memorabilite",
    category: "creative",
    usage_count: 47,
    success_rate: 0.91,
    last_used: new Date("2026-03-14").toISOString(),
    created_at: new Date("2025-06-01").toISOString(),
  },
  {
    id: "seed-5",
    agent: "sorel",
    name: "Pipeline Scoring",
    description: "Scoring IA des prospects avec 8 criteres sectoriels.",
    pattern: "Budget + Timing + Decision-maker + Sector fit + Digital maturity",
    category: "strategy",
    usage_count: 15,
    success_rate: 0.80,
    last_used: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "seed-6",
    agent: "nerel",
    name: "Prompt Engineering V3",
    description: "Structure de prompt pour generation coherente avec le lore.",
    pattern: "Contexte lore + contrainte style + exemples + output format",
    category: "prompt",
    usage_count: 22,
    success_rate: 0.86,
    last_used: new Date(Date.now() - 86400000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
  },
];

// ── Main Component ──────────────────────────────────────────────

export default function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filterAgent, setFilterAgent] = useState<Skill["agent"] | "all">("all");
  const [filterCategory, setFilterCategory] = useState<
    Skill["category"] | "all"
  >("all");

  useEffect(() => {
    const stored = loadSkills();
    // Use seed data if no skills exist yet
    setSkills(stored.length > 0 ? stored : SEED_SKILLS);
  }, []);

  const filtered = skills
    .filter((s) => filterAgent === "all" || s.agent === filterAgent)
    .filter((s) => filterCategory === "all" || s.category === filterCategory);

  const agentIds: (AgentId | "all")[] = [
    "all",
    "kael",
    "nerel",
    "evren",
    "sorel",
  ];
  const categories: (Skill["category"] | "all")[] = [
    "all",
    "email",
    "prompt",
    "analysis",
    "strategy",
    "creative",
    "code",
  ];

  const totalUsage = filtered.reduce((sum, s) => sum + s.usage_count, 0);
  const avgSuccess =
    filtered.length > 0
      ? filtered.reduce((sum, s) => sum + s.success_rate, 0) / filtered.length
      : 0;

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Arbre de Competences
          </h2>
          <p className="text-xs text-cyan-500/50">
            {filtered.length} skills &middot; {totalUsage} utilisations
            &middot; {(avgSuccess * 100).toFixed(0)}% succes moyen
          </p>
        </div>
        <button
          onClick={() => {
            const result = decaySkills();
            if (result.decayed > 0 || result.archived > 0) {
              setSkills(loadSkills());
            }
          }}
          className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-[10px] font-semibold text-cyan-500/50 transition-colors hover:text-cyan-300"
        >
          Decay Check
        </button>
      </div>

      {/* Agent Filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        {agentIds.map((id) => {
          const isAll = id === "all";
          const display = isAll ? null : AGENT_DISPLAY[id as AgentId];
          const active = filterAgent === id;

          return (
            <button
              key={id}
              onClick={() => setFilterAgent(id)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                active
                  ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                  : "border border-cyan-500/10 text-cyan-500/40 hover:text-cyan-500/60"
              }`}
            >
              {isAll ? "Tous" : display?.name ?? id}
            </button>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isAll = cat === "all";
          const config = isAll ? null : CATEGORY_CONFIG[cat as Skill["category"]];
          const active = filterCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-[9px] font-semibold transition-colors ${
                active
                  ? `border ${config?.bg ?? "bg-cyan-500/10"} ${config?.color ?? "text-cyan-300"} border-cyan-500/30`
                  : "border border-cyan-500/5 text-cyan-500/30 hover:text-cyan-500/50"
              }`}
            >
              {isAll ? "Toutes" : config?.label ?? cat}
            </button>
          );
        })}
      </div>

      {/* Skill Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-xs text-cyan-500/30">
          Aucune competence trouvee. Le systeme apprend par l'action.
        </div>
      )}
    </div>
  );
}
