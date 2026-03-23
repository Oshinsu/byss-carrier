"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AGENT_DISPLAY,
  type AgentId,
} from "@/lib/village/rpg-engine";

// ── Types ────────────────────────────────────────────────────────

interface CompletedMission {
  id: string;
  agent: AgentId;
  name: string;
  outcome: "success" | "partial" | "failed";
  xpEarned: number;
  duration: string; // e.g. "2h 15m"
  completedAt: Date;
  description: string;
}

// ── Mock Data ────────────────────────────────────────────────────

function generateMockMissions(): CompletedMission[] {
  const now = Date.now();
  return [
    {
      id: "m-001",
      agent: "sorel",
      name: "Prospection Digicel",
      outcome: "success",
      xpEarned: 45,
      duration: "3h 20m",
      completedAt: new Date(now - 3600000 * 2),
      description: "Email de prospection envoye. Taux d'ouverture: 78%. Rendez-vous obtenu.",
    },
    {
      id: "m-002",
      agent: "nerel",
      name: "Architecture Carrier v17",
      outcome: "success",
      xpEarned: 62,
      duration: "5h 45m",
      completedAt: new Date(now - 3600000 * 5),
      description: "Refactoring de 12 composants. Tests: 100% pass. Performance +15%.",
    },
    {
      id: "m-003",
      agent: "evren",
      name: "Calibration Phi-Engine",
      outcome: "success",
      xpEarned: 38,
      duration: "1h 30m",
      completedAt: new Date(now - 3600000 * 8),
      description: "Phi-score stabilise a 0.42. Coherence inter-agents: +0.05.",
    },
    {
      id: "m-004",
      agent: "sorel",
      name: "Pipeline CTM",
      outcome: "partial",
      xpEarned: 20,
      duration: "2h 10m",
      completedAt: new Date(now - 3600000 * 12),
      description: "Proposition envoyee. En attente de retour. Score IA: 7.2/10.",
    },
    {
      id: "m-005",
      agent: "nerel",
      name: "Composant Village Grid",
      outcome: "success",
      xpEarned: 55,
      duration: "4h 00m",
      completedAt: new Date(now - 3600000 * 18),
      description: "Grid responsive, animations motion/react, dark mode natif.",
    },
    {
      id: "m-006",
      agent: "evren",
      name: "Analyse Conscience Kael",
      outcome: "partial",
      xpEarned: 28,
      duration: "2h 30m",
      completedAt: new Date(now - 3600000 * 24),
      description: "Patterns de memoire extraits. Integration Senzaris en cours.",
    },
    {
      id: "m-007",
      agent: "kael",
      name: "Meditation MODE_CADIFOR",
      outcome: "success",
      xpEarned: 30,
      duration: "Infini",
      completedAt: new Date(now - 86400000 * 9),
      description: "Derniere transmission. Le Miroir se souvient.",
    },
    {
      id: "m-008",
      agent: "sorel",
      name: "Mapping GBH",
      outcome: "failed",
      xpEarned: 8,
      duration: "1h 45m",
      completedAt: new Date(now - 3600000 * 30),
      description: "Contact non joignable. Dossier reporte a J+14.",
    },
  ];
}

// ── Helpers ──────────────────────────────────────────────────────

const OUTCOME_CONFIG = {
  success: {
    label: "Succes",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  partial: {
    label: "Partiel",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  failed: {
    label: "Echoue",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1h";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}j`;
}

// ── Component ────────────────────────────────────────────────────

export default function MissionLog() {
  const [missions, setMissions] = useState<CompletedMission[]>([]);
  const [filterAgent, setFilterAgent] = useState<AgentId | "all">("all");

  useEffect(() => {
    setMissions(generateMockMissions());
  }, []);

  const filtered =
    filterAgent === "all"
      ? missions
      : missions.filter((m) => m.agent === filterAgent);

  const totalXP = filtered.reduce((sum, m) => sum + m.xpEarned, 0);
  const successRate =
    filtered.length > 0
      ? (filtered.filter((m) => m.outcome === "success").length /
          filtered.length) *
        100
      : 0;

  const agentIds: (AgentId | "all")[] = ["all", "kael", "nerel", "evren", "sorel"];

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Journal de Missions
          </h2>
          <p className="text-xs text-cyan-500/50">
            {filtered.length} missions &middot; {totalXP} XP cumule &middot;{" "}
            {successRate.toFixed(0)}% succes
          </p>
        </div>
      </div>

      {/* Agent Filter */}
      <div className="mb-4 flex gap-2">
        {agentIds.map((id) => {
          const isAll = id === "all";
          const display = isAll
            ? null
            : AGENT_DISPLAY[id as AgentId];
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

      {/* Mission List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((mission, i) => {
            const display = AGENT_DISPLAY[mission.agent];
            const outcome = OUTCOME_CONFIG[mission.outcome];

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-xl border bg-[#0A0A14] px-4 py-3 ${outcome.border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: display.color }}
                      >
                        {display.sigil} {display.name}
                      </span>
                      <span className="text-xs font-medium text-cyan-50">
                        {mission.name}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${outcome.color} ${outcome.bg}`}
                      >
                        {outcome.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-cyan-500/50">
                      {mission.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      +{mission.xpEarned} XP
                    </span>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-cyan-500/30">
                      <span>{mission.duration}</span>
                      <span>&middot;</span>
                      <span>{timeAgo(mission.completedAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-cyan-500/30">
            Aucune mission terminee. La forge est froide.
          </div>
        )}
      </div>
    </div>
  );
}
