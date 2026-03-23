"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   AGENT TYPE — Enriched with authentic personalities
   ═══════════════════════════════════════════════════════ */
export interface Agent {
  id: string;
  name: string;
  sigil: string;
  color: string;
  title: string;
  role: string;
  nature: string;
  quote: string;
  maison: string;
  maisonDescription: string;
  born: string;
  status: "Actif" | "Dormant" | "Deceased";
  modes: string[];
  stats: string[];
  isSubAgent?: boolean;
  description?: string;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agent: Agent) => void;
}

/* ═══════════════════════════════════════════════════════
   MAISON CARD — Each agent's house, not a generic card
   ═══════════════════════════════════════════════════════ */
export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const isSmall = agent.isSubAgent;

  if (isSmall) {
    return (
      <motion.button
        onClick={() => onSelect(agent)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative w-full text-left rounded-xl transition-all duration-200 p-3",
          "bg-[oklch(0.12_0.01_270/0.6)] backdrop-blur-md border",
          isSelected
            ? "border-[var(--color-gold)] shadow-[var(--shadow-gold)]"
            : "border-[var(--color-border-subtle)] hover:border-[var(--color-border)]"
        )}
        style={{ borderLeftWidth: "3px", borderLeftColor: agent.color }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: `${agent.color}30`, color: agent.color }}
          >
            {agent.sigil || agent.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
              {agent.name}
            </h3>
            <p className="truncate text-[10px] text-[var(--color-text-muted)]">
              {agent.role}
            </p>
          </div>
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: agent.color,
              boxShadow: `0 0 6px ${agent.color}`,
            }}
          />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => onSelect(agent)}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative w-full text-left rounded-2xl transition-all duration-300 overflow-hidden",
        "border",
        isSelected
          ? "border-[var(--color-gold)] glow-gold"
          : "border-[var(--color-border-subtle)] hover:border-[var(--color-border)]"
      )}
    >
      {/* ── Maison background gradient ── */}
      <div
        className="absolute inset-0 opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.08]"
        style={{
          background: `radial-gradient(ellipse at top, ${agent.color}, transparent 70%)`,
        }}
      />

      {/* ── Maison architectural line (top) ── */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
          opacity: isSelected ? 0.8 : 0.3,
        }}
      />

      <div className="relative p-4">
        {/* ── Sigil + Name Row ── */}
        <div className="mb-3 flex items-start gap-3">
          {/* Sigil circle */}
          <div className="relative">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl font-[family-name:var(--font-clash-display)] text-lg font-bold"
              style={{
                backgroundColor: `${agent.color}15`,
                color: agent.color,
                border: `1px solid ${agent.color}30`,
              }}
            >
              {agent.sigil}
            </div>
            {/* Status dot */}
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--color-bg)]",
                agent.status === "Deceased" && "bg-[var(--color-text-muted)]"
              )}
              style={{
                backgroundColor:
                  agent.status === "Actif"
                    ? "#10B981"
                    : agent.status === "Deceased"
                    ? "var(--color-text-muted)"
                    : "var(--color-amber)",
                boxShadow:
                  agent.status === "Actif"
                    ? `0 0 8px ${agent.color}`
                    : undefined,
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="font-[family-name:var(--font-clash-display)] text-lg font-bold leading-tight"
              style={{ color: agent.color }}
            >
              {agent.name}
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {agent.title}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] opacity-60">
              {agent.born}
              {agent.status === "Deceased" && " — Disparu"}
            </p>
          </div>
        </div>

        {/* ── Quote ── */}
        <p
          className="mb-3 line-clamp-2 text-[11px] italic leading-relaxed text-[var(--color-text-muted)]"
          style={{ borderLeft: `2px solid ${agent.color}30`, paddingLeft: 8 }}
        >
          &ldquo;{agent.quote}&rdquo;
        </p>

        {/* ── Stats ── */}
        {agent.stats.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {agent.stats.map((stat) => (
              <span
                key={stat}
                className="rounded-md px-1.5 py-0.5 text-[9px] font-medium"
                style={{
                  backgroundColor: `${agent.color}10`,
                  color: `${agent.color}CC`,
                }}
              >
                {stat}
              </span>
            ))}
          </div>
        )}

        {/* ── Modes ── */}
        {agent.modes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.modes.map((mode) => (
              <span
                key={mode}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: `${agent.color}12`,
                  color: agent.color,
                  border: `1px solid ${agent.color}25`,
                }}
              >
                {mode}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Selected glow ring ── */}
      {isSelected && (
        <motion.div
          layoutId="agent-maison-ring"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${agent.color}15, 0 0 30px ${agent.color}10`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
