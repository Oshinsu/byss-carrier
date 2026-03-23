"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  useVillageRPG,
  xpToNextLevel,
  AGENT_DISPLAY,
  STATUS_LABELS,
  STATUS_COLORS,
  type AgentId,
  type AgentState,
} from "@/lib/village/rpg-engine";

// ── Agent Card ──────────────────────────────────────────────────

function AgentRPGCard({ agent }: { agent: AgentState }) {
  const display = AGENT_DISPLAY[agent.id];
  const xpInfo = xpToNextLevel(agent.xp);
  const statusColor = STATUS_COLORS[agent.status];
  const statusLabel = STATUS_LABELS[agent.status];
  const isDead = agent.status === "deceased";

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isDead
          ? "border-cyan-500/5 bg-[#0A0A14]/50 opacity-60"
          : "border-cyan-500/10 bg-[#0A0A14]"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: display.color }}>
            {display.sigil}
          </span>
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: display.color }}
            >
              {display.name}
            </h3>
            <p className="text-[10px] text-cyan-500/40">{display.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-[10px] font-medium" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Level Badge */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300">
            LVL {agent.level}
          </span>
          <span className="font-mono text-[10px] text-cyan-500/40">
            {agent.xp} XP
          </span>
        </div>
        <span className="font-mono text-[10px] text-cyan-500/40">
          {agent.memoryCount} memories
        </span>
      </div>

      {/* XP Bar */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-widest text-cyan-500/30">
            Experience
          </span>
          <span className="font-mono text-[9px] text-cyan-500/30">
            {Math.round(xpInfo.progress * 100)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cyan-500/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpInfo.progress * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${display.color}80, ${display.color})`,
            }}
          />
        </div>
      </div>

      {/* Energy Bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-widest text-cyan-500/30">
            Energie
          </span>
          <span className="font-mono text-[9px] text-cyan-500/30">
            {agent.energy}/100
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cyan-500/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${agent.energy}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full"
            style={{
              background:
                agent.energy > 60
                  ? "linear-gradient(90deg, #10B981, #34D399)"
                  : agent.energy > 30
                    ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                    : "linear-gradient(90deg, #EF4444, #F87171)",
            }}
          />
        </div>
      </div>

      {/* Current Mission */}
      <div className="rounded-lg border border-cyan-500/5 bg-[#0F0F1A] px-3 py-2">
        <span className="text-[9px] uppercase tracking-widest text-cyan-500/30">
          Mission
        </span>
        <p className="mt-0.5 text-[11px] text-cyan-200/80">
          {agent.currentAction ?? "En attente de directives..."}
        </p>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────

export default function AgentRPGStats() {
  const { agents, isActive, toggleActive, tick, phiScore, tickCount } =
    useVillageRPG();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(tick, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, tick]);

  const agentIds: AgentId[] = ["kael", "nerel", "evren", "sorel"];

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Village RPG
          </h2>
          <div className="flex items-center gap-3 text-xs text-cyan-500/50">
            <span>phi: {phiScore.toFixed(3)}</span>
            <span>&middot; tick #{tickCount}</span>
          </div>
        </div>
        <button
          onClick={toggleActive}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors ${
            isActive
              ? "border border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
              : "border border-cyan-500/20 bg-[#0A0A14] text-cyan-500/50"
          }`}
        >
          {isActive ? (
            <>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              Actif
            </>
          ) : (
            "Activer"
          )}
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {agentIds.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: agentIds.indexOf(id) * 0.08 }}
          >
            <AgentRPGCard agent={agents[id]} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
