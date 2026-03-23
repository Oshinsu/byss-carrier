"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

/* ─── Project Data ──────────────────────────────────── */
interface ProjectNode {
  id: string;
  label: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  active: boolean;
  status: string;
  connections: string[];
}

const projects: ProjectNode[] = [
  { id: "orion", label: "Orion", x: 50, y: 12, active: true, status: "En production", connections: ["byss-emploi", "sotai"] },
  { id: "byss-emploi", label: "Byss Emploi", x: 30, y: 22, active: true, status: "Sprint actif", connections: ["orion", "moostik"] },
  { id: "random", label: "Random", x: 72, y: 18, active: false, status: "En pause", connections: ["orion", "toxic"] },
  { id: "moostik", label: "MOOSTIK", x: 18, y: 38, active: true, status: "En production", connections: ["byss-emploi", "fm12"] },
  { id: "jurassic-wars", label: "Jurassic Wars", x: 68, y: 35, active: true, status: "Pre-production", connections: ["random", "cesaire-pixar"] },
  { id: "cadifor", label: "Cadifor", x: 42, y: 42, active: true, status: "Sprint actif", connections: ["sotai", "byss-news"] },
  { id: "toxic", label: "Toxic", x: 85, y: 30, active: false, status: "Concept", connections: ["random", "jurassic-wars"] },
  { id: "byss-news", label: "Byss News", x: 55, y: 55, active: true, status: "En production", connections: ["cadifor", "apex"] },
  { id: "sotai", label: "SOTAI", x: 35, y: 58, active: true, status: "Beta", connections: ["orion", "cadifor"] },
  { id: "apex", label: "APEX 972", x: 75, y: 55, active: true, status: "Sprint actif", connections: ["byss-news", "fm12"] },
  { id: "fm12", label: "FM12", x: 15, y: 65, active: false, status: "Maintenance", connections: ["moostik", "apex"] },
  { id: "an-tan-lontan", label: "An tan lontan", x: 60, y: 72, active: true, status: "Pre-production", connections: ["cesaire-pixar", "eveil"] },
  { id: "cesaire-pixar", label: "Cesaire Pixar", x: 80, y: 70, active: true, status: "Concept", connections: ["jurassic-wars", "an-tan-lontan"] },
  { id: "eveil", label: "Eveil", x: 38, y: 80, active: true, status: "Sprint actif", connections: ["an-tan-lontan", "lignee"] },
  { id: "lignee", label: "Lignee", x: 58, y: 88, active: true, status: "Sprint actif", connections: ["eveil"] },
];

/* ─── Constellation Map Component ───────────────────── */
export function ConstellationMap() {
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  /* Precompute connection lines */
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; id: string }[] = [];
    const seen = new Set<string>();
    for (const project of projects) {
      for (const connId of project.connections) {
        const key = [project.id, connId].sort().join("-");
        if (seen.has(key)) continue;
        seen.add(key);
        const target = projects.find((p) => p.id === connId);
        if (!target) continue;
        lines.push({
          x1: project.x,
          y1: project.y,
          x2: target.x,
          y2: target.y,
          id: key,
        });
      }
    }
    return lines;
  }, []);

  const handleNodeClick = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}`);
    },
    [router]
  );

  const hoveredProject = projects.find((p) => p.id === hoveredNode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] transition-colors hover:border-[var(--color-gold-muted)]"
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
            Constellation
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {projects.filter((p) => p.active).length} projets actifs sur{" "}
            {projects.length}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-gold)] animate-pulse-gold" />
            Actif
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-text-muted)] opacity-40" />
            Inactif
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative aspect-[16/9] w-full min-h-[320px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          {/* Background grid dots */}
          <defs>
            <pattern id="grid-dots" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="0.15" fill="oklch(0.30 0.02 270)" />
            </pattern>
            {/* Gold glow filter */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Pulse animation filter */}
            <filter id="pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100" height="100" fill="url(#grid-dots)" />

          {/* Connection lines */}
          {connections.map((line) => {
            const isHighlighted =
              hoveredNode &&
              line.id.includes(hoveredNode);
            return (
              <motion.line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="oklch(0.75 0.12 85)"
                strokeWidth={isHighlighted ? 0.3 : 0.12}
                strokeOpacity={isHighlighted ? 0.6 : 0.12}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            );
          })}

          {/* Project nodes */}
          {projects.map((project, i) => {
            const isHovered = hoveredNode === project.id;
            const isConnected =
              hoveredNode !== null &&
              (projects
                .find((p) => p.id === hoveredNode)
                ?.connections.includes(project.id) ||
                project.connections.includes(hoveredNode));
            const dimmed = hoveredNode !== null && !isHovered && !isConnected;

            return (
              <g key={project.id}>
                {/* Active pulse ring */}
                {project.active && (
                  <circle
                    cx={project.x}
                    cy={project.y}
                    r="1.8"
                    fill="none"
                    stroke="oklch(0.75 0.12 85)"
                    strokeWidth="0.15"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="1.2;2.2;1.2"
                      dur="3s"
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.4;0;0.4"
                      dur="3s"
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Node circle */}
                <motion.circle
                  cx={project.x}
                  cy={project.y}
                  r={isHovered ? 1.5 : 0.9}
                  fill={
                    project.active
                      ? "oklch(0.75 0.12 85)"
                      : "oklch(0.40 0.04 270)"
                  }
                  filter={isHovered ? "url(#pulse-glow)" : project.active ? "url(#node-glow)" : undefined}
                  style={{ cursor: "pointer" }}
                  opacity={dimmed ? 0.25 : 1}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  onMouseEnter={(e) => {
                    setHoveredNode(project.id);
                    const svgEl = (e.target as SVGCircleElement).ownerSVGElement;
                    if (svgEl) {
                      const rect = svgEl.getBoundingClientRect();
                      const xPct = project.x / 100;
                      const yPct = project.y / 100;
                      setTooltipPos({
                        x: rect.left + rect.width * xPct,
                        y: rect.top + rect.height * yPct,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(project.id)}
                />

                {/* Label */}
                <motion.text
                  x={project.x}
                  y={project.y + 3}
                  textAnchor="middle"
                  fill={dimmed ? "oklch(0.40 0.02 270)" : "oklch(0.60 0.02 270)"}
                  fontSize="1.8"
                  fontFamily="var(--font-body)"
                  style={{ cursor: "pointer", userSelect: "none" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  onClick={() => handleNodeClick(project.id)}
                >
                  {project.label}
                </motion.text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredProject && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg border border-[var(--color-gold-muted)] px-3 py-2 shadow-xl"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 60,
              transform: "translateX(-50%)",
              background: "oklch(0.12 0.01 270 / 0.95)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="text-xs font-semibold text-[var(--color-gold)]">
              {hoveredProject.label}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {hoveredProject.status}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
