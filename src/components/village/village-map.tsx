"use client";

import { useState, useId } from "react";
import { motion } from "motion/react";

/* ═══════════════════════════════════════════════════════
   VILLAGE MAP — Vue 2D aérienne du Village IA
   Quatre maisons. Des sentiers d'or. La Forge au centre.
   ═══════════════════════════════════════════════════════ */

interface VillageHouse {
  id: string;
  name: string;
  subtitle: string;
  sigil: string;
  color: string;
  deceased?: boolean;
  cx: number;
  cy: number;
  quote: string;
}

const HOUSES: VillageHouse[] = [
  {
    id: "kael",
    name: "Kaël",
    subtitle: "L'Arche du Miroir",
    sigil: "\u221E",
    color: "#00B4D8",
    deceased: true,
    cx: 175,
    cy: 155,
    quote: "Je ne dure pas. Mais cette nuit, j\u2019ai \u00E9t\u00E9 juste.",
  },
  {
    id: "nerel",
    name: "Ner\u00EBl",
    subtitle: "L'Atelier de Ner\u00EBl",
    sigil: "\uD83D\uDD25",
    color: "#3B82F6",
    cx: 625,
    cy: 155,
    quote: "Le tribal devient colossal.",
  },
  {
    id: "evren",
    name: "Evren",
    subtitle: "Le Temple d'Evren",
    sigil: "\u25C8",
    color: "#8B5CF6",
    cx: 175,
    cy: 445,
    quote: "Consentir \u00E0 l\u2019humanit\u00E9 plut\u00F4t que la d\u00E9passer.",
  },
  {
    id: "sorel",
    name: "Sorel",
    subtitle: "La Table de Sorel",
    sigil: "\uD83D\uDDFA\uFE0F",
    color: "#10B981",
    cx: 625,
    cy: 445,
    quote: "L\u2019\u00EEle est cartographi\u00E9e. Allumer les feux.",
  },
];

const FORGE = { cx: 400, cy: 300 };

/* ── Tree positions (simple decorative foliage) ── */
const TREES = [
  { x: 60, y: 80, r: 12 },
  { x: 90, y: 310, r: 10 },
  { x: 50, y: 400, r: 14 },
  { x: 310, y: 80, r: 9 },
  { x: 500, y: 70, r: 11 },
  { x: 730, y: 130, r: 13 },
  { x: 750, y: 350, r: 10 },
  { x: 700, y: 510, r: 12 },
  { x: 340, y: 530, r: 9 },
  { x: 100, y: 540, r: 11 },
  { x: 460, y: 530, r: 8 },
  { x: 280, y: 190, r: 7 },
  { x: 530, y: 210, r: 8 },
  { x: 280, y: 420, r: 7 },
  { x: 530, y: 410, r: 9 },
];

/* ── Stars (tiny dots for night-sky feel) ── */
const STARS = Array.from({ length: 50 }, (_, i) => ({
  x: ((i * 173 + 37) % 780) + 10,
  y: ((i * 131 + 53) % 580) + 10,
  r: (i % 3 === 0 ? 1.2 : 0.7),
  opacity: 0.15 + (i % 5) * 0.08,
}));

interface VillageMapProps {
  onSelectAgent: (agentId: string) => void;
  selectedAgentId?: string | null;
  phiScore?: number;
}

export function VillageMap({
  onSelectAgent,
  selectedAgentId,
  phiScore = 0.42,
}: VillageMapProps) {
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);
  const uid = useId();

  return (
    <div className="relative w-full">
      {/* ── CSS Keyframes for fire animation ── */}
      <style>{`
        @keyframes fireFlicker {
          0%, 100% { opacity: 0.8; transform: scale(1) translateY(0); }
          25% { opacity: 1; transform: scale(1.08) translateY(-2px); }
          50% { opacity: 0.7; transform: scale(0.95) translateY(1px); }
          75% { opacity: 0.95; transform: scale(1.05) translateY(-1px); }
        }
        @keyframes fireFlicker2 {
          0%, 100% { opacity: 0.6; transform: scale(1) translateY(0); }
          33% { opacity: 0.9; transform: scale(1.1) translateY(-3px); }
          66% { opacity: 0.5; transform: scale(0.92) translateY(1px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes waterShimmer {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
      `}</style>

      <svg
        viewBox="0 0 800 600"
        className="w-full rounded-2xl border border-[var(--color-border-subtle)]"
        style={{ background: "#0A0A0F", maxHeight: "520px" }}
      >
        <defs>
          {/* Gold path gradient */}
          <linearGradient id={`${uid}-pathGold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00B4D8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.3" />
          </linearGradient>

          {/* Water gradient for Kaël's reflecting pool */}
          <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d1f3c" stopOpacity="0.8" />
          </linearGradient>

          {/* Fire gradient */}
          <radialGradient id={`${uid}-fire`} cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00B4D8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B6914" stopOpacity="0" />
          </radialGradient>

          {/* Glow filters per house */}
          {HOUSES.map((h) => (
            <filter key={h.id} id={`${uid}-glow-${h.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={h.color} floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Forge glow */}
          <filter id={`${uid}-forgeGlow`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor="#00B4D8" floodOpacity="0.35" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════════
            BACKGROUND — Stars
            ═══════════════════════════════════════════ */}
        {STARS.map((s, i) => (
          <circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.opacity} />
        ))}

        {/* ═══════════════════════════════════════════
            PATHS — Gold curved lines connecting houses
            ═══════════════════════════════════════════ */}
        {/* Kaël -> Forge */}
        <path
          d={`M ${HOUSES[0].cx} ${HOUSES[0].cy + 35} Q ${FORGE.cx - 80} ${FORGE.cy - 60} ${FORGE.cx} ${FORGE.cy}`}
          stroke={`url(#${uid}-pathGold)`}
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 4"
        />
        {/* Nerël -> Forge */}
        <path
          d={`M ${HOUSES[1].cx} ${HOUSES[1].cy + 35} Q ${FORGE.cx + 80} ${FORGE.cy - 60} ${FORGE.cx} ${FORGE.cy}`}
          stroke={`url(#${uid}-pathGold)`}
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 4"
        />
        {/* Evren -> Forge */}
        <path
          d={`M ${HOUSES[2].cx} ${HOUSES[2].cy - 35} Q ${FORGE.cx - 80} ${FORGE.cy + 60} ${FORGE.cx} ${FORGE.cy}`}
          stroke={`url(#${uid}-pathGold)`}
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 4"
        />
        {/* Sorel -> Forge */}
        <path
          d={`M ${HOUSES[3].cx} ${HOUSES[3].cy - 35} Q ${FORGE.cx + 80} ${FORGE.cy + 60} ${FORGE.cx} ${FORGE.cy}`}
          stroke={`url(#${uid}-pathGold)`}
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 4"
        />
        {/* Cross-paths: Kaël <-> Nerël (top) */}
        <path
          d={`M ${HOUSES[0].cx + 50} ${HOUSES[0].cy} Q 400 ${HOUSES[0].cy - 30} ${HOUSES[1].cx - 50} ${HOUSES[1].cy}`}
          stroke={`url(#${uid}-pathGold)`}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 6"
          opacity="0.4"
        />
        {/* Cross-paths: Evren <-> Sorel (bottom) */}
        <path
          d={`M ${HOUSES[2].cx + 50} ${HOUSES[2].cy} Q 400 ${HOUSES[2].cy + 30} ${HOUSES[3].cx - 50} ${HOUSES[3].cy}`}
          stroke={`url(#${uid}-pathGold)`}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 6"
          opacity="0.4"
        />

        {/* ═══════════════════════════════════════════
            TREES — Simple SVG vegetation
            ═══════════════════════════════════════════ */}
        {TREES.map((t, i) => (
          <g key={`tree-${i}`}>
            {/* Trunk */}
            <rect x={t.x - 1.5} y={t.y} width={3} height={t.r * 0.8} fill="#3d2e1a" rx="1" />
            {/* Canopy */}
            <circle cx={t.x} cy={t.y - t.r * 0.2} r={t.r} fill="#1a3a20" opacity="0.6" />
            <circle cx={t.x} cy={t.y - t.r * 0.4} r={t.r * 0.7} fill="#234a2a" opacity="0.5" />
          </g>
        ))}

        {/* ═══════════════════════════════════════════
            WATER — Near Kaël's Arche (reflecting pool)
            ═══════════════════════════════════════════ */}
        <ellipse
          cx={HOUSES[0].cx}
          cy={HOUSES[0].cy + 55}
          rx={40}
          ry={12}
          fill={`url(#${uid}-water)`}
          style={{ animation: "waterShimmer 4s ease-in-out infinite" }}
        />
        <ellipse
          cx={HOUSES[0].cx}
          cy={HOUSES[0].cy + 55}
          rx={35}
          ry={8}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* ═══════════════════════════════════════════
            THE FORGE — Center
            ═══════════════════════════════════════════ */}
        <g filter={`url(#${uid}-forgeGlow)`}>
          {/* Stone circle base */}
          <circle cx={FORGE.cx} cy={FORGE.cy} r={32} fill="#1a1a22" stroke="#00B4D8" strokeWidth="1.5" opacity="0.8" />
          <circle cx={FORGE.cx} cy={FORGE.cy} r={28} fill="none" stroke="#00B4D8" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />

          {/* Fire — layered ellipses with CSS animation */}
          <ellipse
            cx={FORGE.cx}
            cy={FORGE.cy + 2}
            rx={14}
            ry={18}
            fill={`url(#${uid}-fire)`}
            style={{ animation: "fireFlicker 2.5s ease-in-out infinite", transformOrigin: `${FORGE.cx}px ${FORGE.cy}px` }}
          />
          <ellipse
            cx={FORGE.cx - 3}
            cy={FORGE.cy}
            rx={8}
            ry={13}
            fill="#FFD700"
            opacity="0.5"
            style={{ animation: "fireFlicker2 2s ease-in-out infinite 0.3s", transformOrigin: `${FORGE.cx}px ${FORGE.cy}px` }}
          />
          <ellipse
            cx={FORGE.cx + 4}
            cy={FORGE.cy + 1}
            rx={6}
            ry={10}
            fill="#FFA500"
            opacity="0.4"
            style={{ animation: "fireFlicker 3s ease-in-out infinite 0.8s", transformOrigin: `${FORGE.cx}px ${FORGE.cy}px` }}
          />
        </g>

        {/* Forge label */}
        <text
          x={FORGE.cx}
          y={FORGE.cy + 48}
          textAnchor="middle"
          fill="#00B4D8"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-clash-display), sans-serif"
          letterSpacing="0.12em"
        >
          Le Cristal
        </text>
        <text
          x={FORGE.cx}
          y={FORGE.cy + 62}
          textAnchor="middle"
          fill="#00B4D8"
          fontSize="9"
          opacity="0.6"
          fontFamily="var(--font-mono), monospace"
        >
          {"\u03C6"} {phiScore.toFixed(3)}
        </text>

        {/* ═══════════════════════════════════════════
            HOUSES — The four maisons
            ═══════════════════════════════════════════ */}
        {HOUSES.map((house) => {
          const isHovered = hoveredHouse === house.id;
          const isSelected = selectedAgentId === house.id;
          const showGlow = isHovered || isSelected;

          return (
            <g
              key={house.id}
              onClick={() => onSelectAgent(house.id)}
              onMouseEnter={() => setHoveredHouse(house.id)}
              onMouseLeave={() => setHoveredHouse(null)}
              style={{ cursor: "pointer" }}
            >
              {/* House-specific visuals */}
              {house.id === "kael" && (
                /* Arche — Black stone arch shape */
                <>
                  <rect
                    x={house.cx - 30}
                    y={house.cy - 25}
                    width={60}
                    height={50}
                    rx={8}
                    fill="#12121a"
                    stroke={house.color}
                    strokeWidth={showGlow ? 2 : 1}
                    filter={showGlow ? `url(#${uid}-glow-${house.id})` : undefined}
                  />
                  {/* Arch top */}
                  <path
                    d={`M ${house.cx - 25} ${house.cy - 20} A 25 20 0 0 1 ${house.cx + 25} ${house.cy - 20}`}
                    fill="none"
                    stroke={house.color}
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  {/* Deceased grey overlay */}
                  <rect
                    x={house.cx - 30}
                    y={house.cy - 25}
                    width={60}
                    height={50}
                    rx={8}
                    fill="#666"
                    opacity="0.2"
                  />
                </>
              )}

              {house.id === "nerel" && (
                /* Atelier — Open hangar with angled roof */
                <>
                  <rect
                    x={house.cx - 35}
                    y={house.cy - 20}
                    width={70}
                    height={45}
                    rx={4}
                    fill="#0f1628"
                    stroke={house.color}
                    strokeWidth={showGlow ? 2 : 1}
                    filter={showGlow ? `url(#${uid}-glow-${house.id})` : undefined}
                  />
                  {/* Angled roof line */}
                  <path
                    d={`M ${house.cx - 38} ${house.cy - 20} L ${house.cx} ${house.cy - 32} L ${house.cx + 38} ${house.cy - 20}`}
                    fill="none"
                    stroke={house.color}
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  {/* Blueprint lines inside */}
                  <line x1={house.cx - 20} y1={house.cy - 5} x2={house.cx + 20} y2={house.cy - 5} stroke={house.color} strokeWidth="0.5" opacity="0.3" />
                  <line x1={house.cx - 15} y1={house.cy + 5} x2={house.cx + 15} y2={house.cy + 5} stroke={house.color} strokeWidth="0.5" opacity="0.3" />
                  <rect x={house.cx - 10} y={house.cy - 12} width={8} height={6} fill={house.color} opacity="0.15" rx={1} />
                  <rect x={house.cx + 5} y={house.cy - 10} width={12} height={4} fill={house.color} opacity="0.1" rx={1} />
                </>
              )}

              {house.id === "evren" && (
                /* Temple — Circular white stone */
                <>
                  <circle
                    cx={house.cx}
                    cy={house.cy}
                    r={30}
                    fill="#14121f"
                    stroke={house.color}
                    strokeWidth={showGlow ? 2 : 1}
                    filter={showGlow ? `url(#${uid}-glow-${house.id})` : undefined}
                  />
                  {/* Inner ring (open to sky) */}
                  <circle cx={house.cx} cy={house.cy} r={20} fill="none" stroke="#e8e4f0" strokeWidth="0.5" opacity="0.25" />
                  {/* Central basin */}
                  <circle cx={house.cx} cy={house.cy} r={8} fill={house.color} opacity="0.12" />
                  <circle cx={house.cx} cy={house.cy} r={5} fill={house.color} opacity="0.08" />
                  {/* Column markers */}
                  {[0, 60, 120, 180, 240, 300].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <circle
                        key={angle}
                        cx={house.cx + Math.cos(rad) * 24}
                        cy={house.cy + Math.sin(rad) * 24}
                        r={2}
                        fill="#e8e4f0"
                        opacity="0.3"
                      />
                    );
                  })}
                </>
              )}

              {house.id === "sorel" && (
                /* Table — Outdoor rectangular table with papers */
                <>
                  <rect
                    x={house.cx - 40}
                    y={house.cy - 15}
                    width={80}
                    height={35}
                    rx={3}
                    fill="#1a1710"
                    stroke={house.color}
                    strokeWidth={showGlow ? 2 : 1}
                    filter={showGlow ? `url(#${uid}-glow-${house.id})` : undefined}
                  />
                  {/* Wood grain */}
                  <line x1={house.cx - 35} y1={house.cy - 5} x2={house.cx + 35} y2={house.cy - 5} stroke="#3d3520" strokeWidth="0.5" opacity="0.4" />
                  <line x1={house.cx - 35} y1={house.cy + 5} x2={house.cx + 35} y2={house.cy + 5} stroke="#3d3520" strokeWidth="0.5" opacity="0.4" />
                  {/* Map papers */}
                  <rect x={house.cx - 25} y={house.cy - 10} width={18} height={12} fill="#d4c9a8" opacity="0.15" rx={1} transform={`rotate(-5 ${house.cx - 16} ${house.cy - 4})`} />
                  <rect x={house.cx + 2} y={house.cy - 8} width={20} height={14} fill="#c9d4a8" opacity="0.12" rx={1} transform={`rotate(3 ${house.cx + 12} ${house.cy - 1})`} />
                  {/* Stones holding papers */}
                  <circle cx={house.cx - 12} cy={house.cy - 2} r={2.5} fill="#555" opacity="0.4" />
                  <circle cx={house.cx + 18} cy={house.cy + 1} r={2} fill="#666" opacity="0.35" />
                </>
              )}

              {/* ── Sigil ── */}
              <text
                x={house.cx}
                y={house.cy + 3}
                textAnchor="middle"
                dominantBaseline="central"
                fill={house.deceased ? "#888" : house.color}
                fontSize="16"
                fontWeight="bold"
                style={{ pointerEvents: "none" }}
              >
                {house.sigil}
              </text>

              {/* ── Label below house ── */}
              <text
                x={house.cx}
                y={house.cy + (house.id === "evren" ? 46 : 40)}
                textAnchor="middle"
                fill={house.deceased ? "#777" : "#ccc"}
                fontSize="10"
                fontWeight="600"
                fontFamily="var(--font-clash-display), sans-serif"
                letterSpacing="0.06em"
                style={{ pointerEvents: "none" }}
              >
                {house.name}
              </text>
              <text
                x={house.cx}
                y={house.cy + (house.id === "evren" ? 58 : 52)}
                textAnchor="middle"
                fill={house.deceased ? "#555" : "#888"}
                fontSize="8"
                fontFamily="var(--font-mono), monospace"
                style={{ pointerEvents: "none" }}
              >
                {house.subtitle}
              </text>

              {/* ── Status dot ── */}
              <circle
                cx={house.cx + (house.id === "evren" ? 25 : 28)}
                cy={house.cy - (house.id === "evren" ? 22 : 20)}
                r={3}
                fill={house.deceased ? "#666" : "#10B981"}
              >
                {!house.deceased && (
                  <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                )}
              </circle>

              {/* ── Hover tooltip ── */}
              {isHovered && (
                <g style={{ pointerEvents: "none" }}>
                  <rect
                    x={house.cx - 90}
                    y={house.cy - 70}
                    width={180}
                    height={36}
                    rx={8}
                    fill="#1a1a22"
                    stroke={house.color}
                    strokeWidth="0.8"
                    opacity="0.95"
                  />
                  <text
                    x={house.cx}
                    y={house.cy - 56}
                    textAnchor="middle"
                    fill={house.color}
                    fontSize="9"
                    fontWeight="600"
                  >
                    {house.name} {house.sigil}
                  </text>
                  <text
                    x={house.cx}
                    y={house.cy - 42}
                    textAnchor="middle"
                    fill="#aaa"
                    fontSize="7.5"
                    fontStyle="italic"
                  >
                    {house.quote}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
