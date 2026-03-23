"use client";

import { cn } from "@/lib/utils";
import { ImperialGlass, SectionLabel, MetricCell } from "./primitives";

const OPERATEURS = [
  { name: "Orange", part: 45, color: "#F97316" },
  { name: "Digicel", part: 30, color: "#EF4444" },
  { name: "SFR", part: 15, color: "#EF4444" },
  { name: "Free", part: 10, color: "#3B82F6" },
];

export function TabTechnologie() {
  return (
    <div className="space-y-3">
      <ImperialGlass>
        <SectionLabel color="#00D4FF">INFRASTRUCTURE TECH</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="4G" value="95%" sub="Quasi-totale" />
          <MetricCell label="5G" value="20%" sub="En deploiement" />
          <MetricCell label="FIBRE" value="60%" sub="Objectif 100%" />
          <MetricCell label="STARTUPS" value="<10" sub="dont BYSS" />
          <MetricCell label="DATA CENTERS" value="0" sub="cloud only" alert />
          <MetricCell label="CONCURRENTS IA" value="0" sub="BYSS seul" />
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00D4FF">PARTS MARCHE TELECOM</SectionLabel>
        <div className="space-y-2">
          {OPERATEURS.map((op) => (
            <div key={op.name}>
              <div className="mb-0.5 flex items-center justify-between text-[10px]">
                <span className="text-[#ffffff60]">{op.name}</span>
                <span className="font-mono font-bold text-[#00D4FF]">{op.part}%</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-[#0A1628]">
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${op.part}%`, background: op.color, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00D4FF">ECOSYSTEME TECH LOCAL</SectionLabel>
        <div className="space-y-1">
          {[
            { label: "Freelances dev", value: "~200", note: "Web/WordPress" },
            { label: "Agences web", value: "~15-20", note: "Sites, e-commerce" },
            { label: "ESN/SSII", value: "~5", note: "GFI, Atos" },
            { label: "Startups deeptech", value: "0", note: "Avant BYSS" },
            { label: "Incubateurs", value: "2", note: "Technopole, FT Antilles" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between border-b border-[#00D4FF08] px-1 py-1.5">
              <div>
                <span className="text-[9px] text-[#ffffff50]">{item.label}</span>
                <span className="ml-2 text-[8px] text-[#ffffff20]">{item.note}</span>
              </div>
              <span className="font-mono text-[9px] font-bold text-[#00D4FF]">{item.value}</span>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00D4FF">DEPLOIEMENT 5G</SectionLabel>
        <div className="space-y-1.5">
          {[
            { zone: "FDF centre", statut: "Deploye", pct: 100 },
            { zone: "Lamentin / FDF", statut: "Deploye", pct: 90 },
            { zone: "Schoelcher", statut: "En cours", pct: 60 },
            { zone: "Trinite / Robert", statut: "Q3 2026", pct: 20 },
            { zone: "Sud (Marin)", statut: "2027", pct: 5 },
            { zone: "Nord", statut: "Non planifie", pct: 0 },
          ].map((z) => (
            <div key={z.zone}>
              <div className="mb-0.5 flex items-center justify-between text-[9px]">
                <span className="text-[#ffffff50]">{z.zone}</span>
                <span className={cn(z.pct >= 80 ? "text-[#22C55E]" : z.pct > 0 ? "text-[#F59E0B]" : "text-[#ffffff20]")}>{z.statut}</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-[#0A1628]">
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${z.pct}%`, background: z.pct >= 80 ? "#22C55E" : z.pct > 0 ? "#F59E0B" : "#333", opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass glow="#00B4D815" className="border-[#00B4D830]">
        <SectionLabel color="#00B4D8">POSITION BYSS GROUP</SectionLabel>
        <div className="rounded border border-[#00B4D820] bg-[#00B4D808] p-2 mb-2">
          <div className="text-[10px] font-bold text-[#00B4D8]">MONOPOLE IA MARTINIQUE</div>
          <div className="mt-0.5 text-[8px] text-[#ffffff40]">
            Zero concurrent IA appliquee PME. Seul acteur deploying agents IA, marketing IA, production video IA.
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8]">1er</div>
            <div className="text-[7px] text-[#ffffff25]">Agence IA</div>
          </div>
          <div className="rounded bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8]">0</div>
            <div className="text-[7px] text-[#ffffff25]">Concurrents</div>
          </div>
          <div className="rounded bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8]">35K</div>
            <div className="text-[7px] text-[#ffffff25]">TAM</div>
          </div>
          <div className="rounded bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8]">{"\u221E"}</div>
            <div className="text-[7px] text-[#ffffff25]">Avance</div>
          </div>
        </div>
      </ImperialGlass>

      <ImperialGlass glow="#FF2D2D10">
        <SectionLabel color="#FF2D2D">LACUNES CRITIQUES</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { gap: "Data center", status: "Inexistant", severity: "critical" },
            { gap: "IXP", status: "Aucun", severity: "critical" },
            { gap: "CDN edge", status: "0", severity: "high" },
            { gap: "Formation IA", status: "0 cursus", severity: "high" },
          ].map((g) => (
            <div key={g.gap} className="rounded border border-[#FF2D2D20] bg-[#FF2D2D08] p-2">
              <div className="text-[9px] text-[#ffffff50]">{g.gap}</div>
              <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#FF2D2D]">{g.status}</div>
            </div>
          ))}
        </div>
      </ImperialGlass>
    </div>
  );
}
