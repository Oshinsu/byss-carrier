"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* ─── Types ─────────────────────────────────────────── */
interface SystemNode {
  id: string;
  label: string;
  href: string;
  color: string;
  x: number; // SVG coords (0-600)
  y: number; // SVG coords (0-400)
  baseRadius: number;
}

interface SystemEdge {
  from: string;
  to: string;
  label: string;
  active: boolean;
}

/* ─── Node Definitions ────────────────────────────────── */
const NODES: SystemNode[] = [
  { id: "pipeline", label: "Pipeline", href: "/pipeline", color: "#10B981", x: 300, y: 60, baseRadius: 28 },
  { id: "finance", label: "Finance", href: "/finance", color: "#F59E0B", x: 520, y: 120, baseRadius: 26 },
  { id: "production", label: "Production", href: "/production", color: "#A855F7", x: 80, y: 120, baseRadius: 26 },
  { id: "intelligence", label: "Intel", href: "/intelligence", color: "#EC4899", x: 130, y: 280, baseRadius: 24 },
  { id: "village", label: "Village IA", href: "/village", color: "#8B5CF6", x: 300, y: 200, baseRadius: 30 },
  { id: "gulf", label: "Gulf Stream", href: "/gulf-stream", color: "#06B6D4", x: 520, y: 280, baseRadius: 24 },
  { id: "marches", label: "Marches", href: "/marches", color: "#F97316", x: 470, y: 350, baseRadius: 24 },
  { id: "calendrier", label: "Calendrier", href: "/calendrier", color: "#3B82F6", x: 130, y: 350, baseRadius: 22 },
  { id: "email", label: "Email", href: "/emails", color: "#6366F1", x: 80, y: 200, baseRadius: 24 },
  { id: "research", label: "Research", href: "/research", color: "#14B8A6", x: 520, y: 200, baseRadius: 22 },
];

/* ─── Edge Definitions (synergy connections) ──────────── */
const EDGES: SystemEdge[] = [
  { from: "pipeline", to: "finance", label: "Signe -> Facture", active: true },
  { from: "pipeline", to: "email", label: "Phase -> Relance", active: true },
  { from: "email", to: "calendrier", label: "Email -> J+7", active: true },
  { from: "finance", to: "gulf", label: "Revenue -> PnL", active: true },
  { from: "production", to: "pipeline", label: "Video -> Prospect", active: true },
  { from: "village", to: "pipeline", label: "Agent -> Action", active: true },
  { from: "village", to: "email", label: "Sorel -> Draft", active: true },
  { from: "village", to: "production", label: "Nerel -> Prompt", active: true },
  { from: "village", to: "research", label: "Evren -> Analyse", active: true },
  { from: "research", to: "intelligence", label: "Data -> Intel", active: true },
  { from: "research", to: "pipeline", label: "Company -> CRM", active: true },
  { from: "marches", to: "pipeline", label: "Tender -> Prospect", active: true },
  { from: "marches", to: "calendrier", label: "Deadline -> Event", active: true },
  { from: "intelligence", to: "village", label: "Lore -> Agent", active: true },
  { from: "gulf", to: "finance", label: "Trade -> Revenue", active: true },
  { from: "calendrier", to: "pipeline", label: "RDV -> Follow-up", active: true },
];

/* ─── Activity Data (from agent_logs count per module) ─── */
function useActivityCounts(): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("agent_logs")
        .select("agent_name")
        .gte("created_at", todayStart.toISOString());

      if (!data) return;

      const map: Record<string, number> = {};
      for (const log of data) {
        const name = (log.agent_name ?? "system").toLowerCase();
        // Map agent names to node IDs
        if (name.includes("sorel") || name.includes("email")) map.email = (map.email ?? 0) + 1;
        else if (name.includes("nerel") || name.includes("production")) map.production = (map.production ?? 0) + 1;
        else if (name.includes("evren") || name.includes("research")) map.research = (map.research ?? 0) + 1;
        else if (name.includes("kael") || name.includes("briefing")) map.village = (map.village ?? 0) + 1;
        else if (name.includes("pipeline") || name.includes("prospect")) map.pipeline = (map.pipeline ?? 0) + 1;
        else if (name.includes("finance") || name.includes("invoice")) map.finance = (map.finance ?? 0) + 1;
        else map.village = (map.village ?? 0) + 1;
      }
      setCounts(map);
    }
    fetch().catch(() => {});
  }, []);

  return counts;
}

/* ─── System Map Component ────────────────────────────── */
export function SystemMap() {
  const router = useRouter();
  const activityCounts = useActivityCounts();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulsingEdges, setPulsingEdges] = useState<Set<number>>(new Set());

  // Animate random edge pulses
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * EDGES.length);
      setPulsingEdges((prev) => {
        const next = new Set(prev);
        next.add(randomIdx);
        return next;
      });
      setTimeout(() => {
        setPulsingEdges((prev) => {
          const next = new Set(prev);
          next.delete(randomIdx);
          return next;
        });
      }, 2000);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Compute node radii based on activity
  const nodeRadii = useMemo(() => {
    const maxActivity = Math.max(1, ...Object.values(activityCounts));
    const radii: Record<string, number> = {};
    for (const node of NODES) {
      const activity = activityCounts[node.id] ?? 0;
      const scale = 1 + (activity / maxActivity) * 0.5;
      radii[node.id] = node.baseRadius * scale;
    }
    return radii;
  }, [activityCounts]);

  const nodeMap = useMemo(() => {
    const m: Record<string, SystemNode> = {};
    for (const n of NODES) m[n.id] = n;
    return m;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] transition-colors hover:border-[var(--color-gold-muted)]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-4">
        <div>
          <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
            Superposition Map
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {NODES.length} modules | {EDGES.length} synergies actives
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-green)]" />
          <span className="text-[10px] text-[var(--color-text-muted)]">
            Live
          </span>
        </div>
      </div>

      {/* SVG Map */}
      <div className="p-2">
        <svg
          viewBox="0 0 600 400"
          className="h-auto w-full"
          style={{ minHeight: 280 }}
        >
          <defs>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Pulse animation gradient */}
            {EDGES.map((edge, i) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              if (!from || !to) return null;
              return (
                <linearGradient
                  key={`grad-${i}`}
                  id={`edge-grad-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={from.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={to.color} stopOpacity="0.6" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;
            const isPulsing = pulsingEdges.has(i);
            const isHovered =
              hoveredNode === edge.from || hoveredNode === edge.to;

            return (
              <g key={`edge-${i}`}>
                {/* Base line */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={`url(#edge-grad-${i})`}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 0.8 : 0.2}
                  className="transition-all duration-300"
                />
                {/* Pulse dot traveling along the edge */}
                {isPulsing && (
                  <circle r="3" fill={from.color} filter="url(#glow)">
                    <animateMotion
                      dur="1.5s"
                      repeatCount="1"
                      path={`M${from.x},${from.y} L${to.x},${to.y}`}
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0.8;0"
                      dur="1.5s"
                      repeatCount="1"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const r = nodeRadii[node.id] ?? node.baseRadius;
            const isHovered = hoveredNode === node.id;
            const activity = activityCounts[node.id] ?? 0;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => router.push(node.href)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer ring (hover) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r + 4}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={isHovered ? 1.5 : 0}
                  opacity={isHovered ? 0.4 : 0}
                  className="transition-all duration-300"
                />
                {/* Activity pulse ring */}
                {activity > 0 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 2}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="0.5"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values={`${r + 2};${r + 10};${r + 2}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0;0.3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Main circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={`${node.color}15`}
                  stroke={node.color}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 1 : 0.7}
                  className="transition-all duration-300"
                />
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHovered ? node.color : "#94A3B8"}
                  fontSize={isHovered ? 10 : 9}
                  fontWeight={isHovered ? 700 : 500}
                  fontFamily="var(--font-clash-display), system-ui"
                  className="pointer-events-none transition-all duration-300"
                >
                  {node.label}
                </text>
                {/* Activity count badge */}
                {activity > 0 && (
                  <>
                    <circle
                      cx={node.x + r * 0.7}
                      cy={node.y - r * 0.7}
                      r={7}
                      fill={node.color}
                    />
                    <text
                      x={node.x + r * 0.7}
                      y={node.y - r * 0.7 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFF"
                      fontSize={7}
                      fontWeight={700}
                    >
                      {activity}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}
