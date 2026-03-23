"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Crosshair,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* =================================================================
   TYPES
   ================================================================= */
export type ZoneId = "nord" | "centre" | "sud" | "est" | "ouest" | null;

export const ZONES: Record<string, { name: string; desc: string; cities: string[]; color: string }> = {
  nord: {
    name: "ZONE NORD",
    desc: "Montagne Pelee -- Zone volcanique. Saint-Pierre historique. Agriculture, rhum.",
    cities: ["Saint-Pierre", "Le Precheur", "Le Morne-Rouge", "Macouba", "Grand-Riviere", "Basse-Pointe", "Ajoupa-Bouillon"],
    color: "#FF2D2D",
  },
  centre: {
    name: "ZONE CENTRE",
    desc: "Fort-de-France -- Prefecture, coeur economique. Hub BYSS GROUP.",
    cities: ["Fort-de-France", "Le Lamentin", "Schoelcher", "Ducos", "Saint-Joseph", "Gros-Morne", "Fonds-Saint-Denis"],
    color: "#00D4FF",
  },
  sud: {
    name: "ZONE SUD",
    desc: "Tourisme, marina, plages. Les Trois-Ilets, Le Marin, Sainte-Anne.",
    cities: ["Les Trois-Ilets", "Le Marin", "Sainte-Anne", "Sainte-Luce", "Le Diamant", "Riviere-Pilote", "Les Anses-d'Arlet", "Riviere-Salee"],
    color: "#22C55E",
  },
  est: {
    name: "ZONE EST",
    desc: "Cote atlantique. Agriculture, peche. Le Robert, Le Francois, Le Vauclin.",
    cities: ["Le Robert", "Le Francois", "Le Vauclin", "Trinite", "Le Marigot", "Sainte-Marie"],
    color: "#00B4D8",
  },
  ouest: {
    name: "ZONE OUEST",
    desc: "Cote caraibe nord. Le Carbet, Bellefontaine, Case-Pilote. Patrimoine.",
    cities: ["Le Carbet", "Case-Pilote", "Bellefontaine", "Le Morne-Vert"],
    color: "#8B5CF6",
  },
};

/* =================================================================
   MARTINIQUE SVG MAP
   ================================================================= */
export function MartiniqueMap({
  activeZone,
  onZoneClick,
}: {
  activeZone: ZoneId;
  onZoneClick: (zone: ZoneId) => void;
}) {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 340 560"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(0,212,255,0.15))" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#00D4FF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A1628" />
            <stop offset="100%" stopColor="#0D1F3C" />
          </linearGradient>
        </defs>

        <rect width="340" height="560" fill="url(#ocean)" rx="8" />

        {/* Grid lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="340" y2={i * 50} stroke="#00D4FF" strokeOpacity="0.04" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="560" stroke="#00D4FF" strokeOpacity="0.04" strokeWidth="0.5" />
        ))}

        {/* Coordinate labels */}
        <text x="8" y="18" fill="#00D4FF" fillOpacity="0.25" fontSize="7" fontFamily="monospace">14.80°N</text>
        <text x="8" y="548" fill="#00D4FF" fillOpacity="0.25" fontSize="7" fontFamily="monospace">14.39°N</text>
        <text x="260" y="18" fill="#00D4FF" fillOpacity="0.25" fontSize="7" fontFamily="monospace">61.00°W</text>

        {/* NORD */}
        <path
          d="M130,55 C138,42 155,32 175,28 C195,25 215,30 230,42 C240,50 248,62 252,78 C255,92 252,108 245,120 L235,135 C225,140 210,142 195,140 L170,138 C155,140 140,140 128,135 C118,128 112,118 110,105 C108,90 112,72 120,60 Z"
          fill={activeZone === "nord" ? "#FF2D2D15" : "#FF2D2D08"}
          stroke={activeZone === "nord" ? "#FF2D2D" : "#FF2D2D60"}
          strokeWidth={activeZone === "nord" ? "1.5" : "0.8"}
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick(activeZone === "nord" ? null : "nord")}
          filter={activeZone === "nord" ? "url(#glow)" : undefined}
        />

        {/* OUEST */}
        <path
          d="M88,140 C95,132 110,128 128,135 C130,148 125,165 118,180 C112,195 105,210 100,225 L95,240 C90,248 88,255 88,260 C88,250 82,235 80,220 C78,200 80,175 85,155 Z"
          fill={activeZone === "ouest" ? "#8B5CF615" : "#8B5CF608"}
          stroke={activeZone === "ouest" ? "#8B5CF6" : "#8B5CF660"}
          strokeWidth={activeZone === "ouest" ? "1.5" : "0.8"}
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick(activeZone === "ouest" ? null : "ouest")}
          filter={activeZone === "ouest" ? "url(#glow)" : undefined}
        />

        {/* EST */}
        <path
          d="M235,135 C245,140 252,148 258,160 C265,175 270,195 268,215 C265,235 258,250 248,262 L235,272 C225,265 215,260 205,258 C195,255 188,248 185,240 C182,230 185,215 190,200 C195,185 200,170 202,155 C205,142 218,138 235,135 Z"
          fill={activeZone === "est" ? "#00B4D815" : "#00B4D808"}
          stroke={activeZone === "est" ? "#00B4D8" : "#00B4D860"}
          strokeWidth={activeZone === "est" ? "1.5" : "0.8"}
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick(activeZone === "est" ? null : "est")}
          filter={activeZone === "est" ? "url(#glow)" : undefined}
        />

        {/* CENTRE */}
        <path
          d="M88,260 C90,255 95,245 100,235 L118,225 C125,220 135,218 148,218 C165,218 178,222 188,230 C192,238 198,248 205,258 L215,268 C225,272 232,278 235,285 C228,295 218,302 205,308 L185,315 C170,318 155,320 140,318 L120,312 C108,308 98,300 92,290 C86,280 85,270 88,260 Z"
          fill={activeZone === "centre" ? "#00D4FF15" : "#00D4FF08"}
          stroke={activeZone === "centre" ? "#00D4FF" : "#00D4FF60"}
          strokeWidth={activeZone === "centre" ? "1.5" : "0.8"}
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick(activeZone === "centre" ? null : "centre")}
          filter={activeZone === "centre" ? "url(#glow)" : undefined}
        />

        {/* SUD */}
        <path
          d="M92,290 C98,300 108,308 120,312 L140,318 C155,320 170,318 185,315 L205,308 C218,302 228,295 235,285 C240,295 242,308 240,322 C238,340 232,358 225,375 C218,395 208,412 200,430 C192,448 182,465 175,478 C168,490 158,495 150,492 C142,488 135,478 130,465 C122,445 115,425 110,405 C105,385 100,362 98,340 C95,320 92,305 92,290 Z"
          fill={activeZone === "sud" ? "#22C55E15" : "#22C55E08"}
          stroke={activeZone === "sud" ? "#22C55E" : "#22C55E60"}
          strokeWidth={activeZone === "sud" ? "1.5" : "0.8"}
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick(activeZone === "sud" ? null : "sud")}
          filter={activeZone === "sud" ? "url(#glow)" : undefined}
        />

        {/* City dots */}
        <circle cx="110" cy="275" r="4" fill="#00B4D8" filter="url(#glow-strong)" className="animate-pulse" />
        <circle cx="110" cy="275" r="7" fill="none" stroke="#00B4D8" strokeWidth="0.5" strokeOpacity="0.5" />
        <text x="70" y="270" fill="#00B4D8" fontSize="7" fontWeight="bold" fontFamily="monospace">FDF</text>

        <circle cx="165" cy="265" r="3" fill="#00D4FF" filter="url(#glow)" />
        <text x="172" y="268" fill="#00D4FF" fontSize="6" fontFamily="monospace" fillOpacity="0.7">LAMENTIN</text>

        <circle cx="115" cy="115" r="2.5" fill="#FF2D2D" filter="url(#glow)" />
        <text x="72" y="112" fill="#FF2D2D" fontSize="6" fontFamily="monospace" fillOpacity="0.7">ST-PIERRE</text>

        <circle cx="205" cy="420" r="2.5" fill="#22C55E" filter="url(#glow)" />
        <text x="212" y="423" fill="#22C55E" fontSize="6" fontFamily="monospace" fillOpacity="0.7">LE MARIN</text>

        <circle cx="165" cy="65" r="2" fill="#FF2D2D" />
        <text x="175" y="60" fill="#FF2D2D" fontSize="5.5" fontFamily="monospace" fillOpacity="0.6">MT. PELEE</text>
        <text x="175" y="68" fill="#FF2D2D" fontSize="5" fontFamily="monospace" fillOpacity="0.4">1 397m</text>

        <circle cx="245" cy="195" r="2" fill="#00B4D8" filter="url(#glow)" />
        <text x="252" y="198" fill="#00B4D8" fontSize="5.5" fontFamily="monospace" fillOpacity="0.6">LE ROBERT</text>

        <circle cx="140" cy="335" r="2" fill="#22C55E" filter="url(#glow)" />
        <text x="148" y="332" fill="#22C55E" fontSize="5.5" fontFamily="monospace" fillOpacity="0.6">3-ILETS</text>

        <circle cx="98" cy="165" r="2" fill="#8B5CF6" filter="url(#glow)" />
        <text x="60" y="168" fill="#8B5CF6" fontSize="5.5" fontFamily="monospace" fillOpacity="0.6">CARBET</text>

        <circle cx="255" cy="160" r="2" fill="#00B4D8" filter="url(#glow)" />
        <text x="262" y="163" fill="#00B4D8" fontSize="5.5" fontFamily="monospace" fillOpacity="0.6">TRINITE</text>

        {/* Radar sweep */}
        <g className="origin-center" style={{ transformOrigin: "170px 280px" }}>
          <line x1="170" y1="280" x2="170" y2="100" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity="0.3" className="animate-[radar-sweep_6s_linear_infinite]" style={{ transformOrigin: "170px 280px" }} />
        </g>

        {/* Compass rose */}
        <g transform="translate(305, 520)">
          <circle r="12" fill="none" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.3" />
          <text y="-14" textAnchor="middle" fill="#00D4FF" fillOpacity="0.5" fontSize="6" fontWeight="bold">N</text>
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.3" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.3" />
        </g>

        {/* Scale bar */}
        <g transform="translate(20, 530)">
          <line x1="0" y1="0" x2="60" y2="0" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="60" y1="-3" x2="60" y2="3" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity="0.4" />
          <text x="30" y="10" textAnchor="middle" fill="#00D4FF" fillOpacity="0.35" fontSize="6" fontFamily="monospace">~20 km</text>
        </g>

        {/* Zone labels */}
        <text x="170" y="85" textAnchor="middle" fill="#FF2D2D" fillOpacity={activeZone === "nord" ? "0.9" : "0.35"} fontSize="8" fontFamily="monospace" fontWeight="bold" className="transition-all duration-300">NORD</text>
        <text x="80" y="200" textAnchor="middle" fill="#8B5CF6" fillOpacity={activeZone === "ouest" ? "0.9" : "0.35"} fontSize="8" fontFamily="monospace" fontWeight="bold" className="transition-all duration-300">OUEST</text>
        <text x="260" y="220" textAnchor="middle" fill="#00B4D8" fillOpacity={activeZone === "est" ? "0.9" : "0.35"} fontSize="8" fontFamily="monospace" fontWeight="bold" className="transition-all duration-300">EST</text>
        <text x="150" y="290" textAnchor="middle" fill="#00D4FF" fillOpacity={activeZone === "centre" ? "0.9" : "0.35"} fontSize="8" fontFamily="monospace" fontWeight="bold" className="transition-all duration-300">CENTRE</text>
        <text x="160" y="410" textAnchor="middle" fill="#22C55E" fillOpacity={activeZone === "sud" ? "0.9" : "0.35"} fontSize="8" fontFamily="monospace" fontWeight="bold" className="transition-all duration-300">SUD</text>
      </svg>

      <style jsx>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* =================================================================
   ZONE INFO OVERLAY
   ================================================================= */
export function ZoneInfoOverlay({ activeZone }: { activeZone: ZoneId }) {
  return (
    <AnimatePresence>
      {activeZone && ZONES[activeZone] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-3 rounded border px-3 py-2"
          style={{
            borderColor: `${ZONES[activeZone].color}40`,
            background: `${ZONES[activeZone].color}08`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: ZONES[activeZone].color }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ZONES[activeZone].color }}>
              {ZONES[activeZone].name}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-[#ffffff50]">{ZONES[activeZone].desc}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {ZONES[activeZone].cities.map((c) => (
              <span key={c} className="rounded bg-[#0A1628] px-1.5 py-0.5 text-[8px] text-[#ffffff40]">{c}</span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
