"use client";

import { cn } from "@/lib/utils";
import { ImperialGlass, SectionLabel, MetricCell } from "./primitives";

const NETWORKS = [
  {
    key: "maritime",
    name: "Réseau Maritime",
    operator: "Vedettes Tropicales",
    zone: "Inter-communal",
    lines: 2,
    color: "#00B4D8",
    datasetUrl: "https://transport.data.gouv.fr/datasets/gtfs-du-reseau-maritime-de-martinique",
    routes: ["Trois-Îlets ↔ Fort-de-France", "Case-Pilote ↔ Fort-de-France"],
  },
  {
    key: "centre",
    name: "Réseau Centre (CACEM)",
    operator: "Mozaïk",
    zone: "Fort-de-France, Schœlcher, Le Lamentin, Saint-Joseph",
    lines: 61,
    color: "#22C55E",
    datasetUrl: "https://transport.data.gouv.fr/datasets/gtfs-urbain-de-la-zone-centre",
  },
  {
    key: "sud",
    name: "Réseau Sud (Sud Lib)",
    operator: "CAESM",
    zone: "12 communes sud",
    lines: 81,
    color: "#F59E0B",
    datasetUrl: "https://transport.data.gouv.fr/datasets/gtfs-urbain-de-la-zone-sud",
  },
  {
    key: "nord",
    name: "Réseau Nord (CAP NORD)",
    operator: "CAP NORD",
    zone: "Grand-Rivière → Le Robert",
    lines: 9,
    color: "#EF4444",
    datasetUrl: "https://transport.data.gouv.fr/datasets/gtfs-urbain-de-la-zone-nord-cap-nord",
  },
];

const FERRY_SCHEDULE = [
  { depart: "06:00", arrivee: "06:20", sens: "Trois-Îlets → FdF" },
  { depart: "06:30", arrivee: "06:50", sens: "FdF → Trois-Îlets" },
  { depart: "07:00", arrivee: "07:20", sens: "Trois-Îlets → FdF" },
  { depart: "07:30", arrivee: "07:50", sens: "FdF → Trois-Îlets" },
  { depart: "12:15", arrivee: "12:35", sens: "Trois-Îlets → FdF" },
  { depart: "12:30", arrivee: "12:50", sens: "FdF → Trois-Îlets" },
  { depart: "17:00", arrivee: "17:20", sens: "FdF → Trois-Îlets" },
  { depart: "17:30", arrivee: "17:50", sens: "Trois-Îlets → FdF" },
  { depart: "18:00", arrivee: "18:20", sens: "FdF → Trois-Îlets" },
];

const TOTAL_LINES = NETWORKS.reduce((s, n) => s + n.lines, 0);

export function TabTransport() {
  return (
    <div className="space-y-3">
      {/* Stats */}
      <ImperialGlass>
        <SectionLabel color="#00D4FF">TRANSPORT MARTINIQUE</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="LIGNES" value={`${TOTAL_LINES}+`} sub="Bus + ferry" />
          <MetricCell label="RÉSEAUX" value="4" sub="Nord / Centre / Sud / Maritime" />
          <MetricCell label="TCSP" value="BRT" sub="En service FdF-Lamentin" />
          <MetricCell label="FERRY" value="20 min" sub="Trois-Îlets ↔ FdF" />
        </div>
      </ImperialGlass>

      {/* Network cards */}
      <ImperialGlass>
        <SectionLabel color="#00D4FF">RÉSEAUX GTFS</SectionLabel>
        <div className="space-y-2">
          {NETWORKS.map((net) => (
            <div
              key={net.key}
              className="rounded border border-[#00D4FF10] bg-[#0A1628] p-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: net.color }}
                    />
                    <span className="text-[11px] font-bold text-[#ffffffCC]">
                      {net.name}
                    </span>
                  </div>
                  <div className="mt-1 text-[9px] text-[#ffffff40]">
                    {net.operator} — {net.zone}
                  </div>
                  {net.routes && (
                    <div className="mt-1 space-y-0.5">
                      {net.routes.map((r) => (
                        <div
                          key={r}
                          className="text-[8px] text-[#00D4FF60]"
                        >
                          ⛴ {r}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className="font-[family-name:var(--font-clash-display)] text-lg font-bold"
                    style={{ color: net.color }}
                  >
                    {net.lines}
                  </span>
                  <span className="text-[7px] text-[#ffffff25]">lignes</span>
                </div>
              </div>
              <a
                href={net.datasetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded border border-[#00D4FF20] bg-[#00D4FF08] py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#00D4FF80] transition-colors hover:border-[#00D4FF40] hover:text-[#00D4FF]"
              >
                Télécharger GTFS
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </ImperialGlass>

      {/* Ferry schedule */}
      <ImperialGlass glow="#00B4D815" className="border-[#00B4D830]">
        <SectionLabel color="#00B4D8">NAVETTES MARITIMES — HORAIRES TYPE</SectionLabel>
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-2 text-[8px] font-bold uppercase tracking-wider text-[#ffffff30] mb-1">
            <span>Départ</span>
            <span>Arrivée</span>
            <span>Sens</span>
          </div>
          {FERRY_SCHEDULE.map((s, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-3 gap-2 border-b border-[#00D4FF08] py-1.5 text-[10px]",
                s.sens.startsWith("Trois") ? "text-[#00B4D8]" : "text-[#22C55E]"
              )}
            >
              <span className="font-mono font-bold">{s.depart}</span>
              <span className="font-mono">{s.arrivee}</span>
              <span className="text-[9px] text-[#ffffff50]">{s.sens}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded bg-[#00B4D808] border border-[#00B4D820] p-2 text-[8px] text-[#ffffff30]">
          Traversée ~20 min. Horaires indicatifs — consulter Vedettes Tropicales pour MAJ.
        </div>
      </ImperialGlass>

      {/* TCSP BRT */}
      <ImperialGlass>
        <SectionLabel color="#00D4FF">TCSP — BUS RAPID TRANSIT</SectionLabel>
        <div className="space-y-1.5">
          {[
            { troncon: "FdF Pointe Simon → Mahault", statut: "Opérationnel", pct: 100 },
            { troncon: "Mahault → Lamentin centre", statut: "Opérationnel", pct: 100 },
            { troncon: "Extension Schœlcher", statut: "Études", pct: 15 },
            { troncon: "Extension Ducos", statut: "Planifié", pct: 5 },
          ].map((t) => (
            <div key={t.troncon}>
              <div className="mb-0.5 flex items-center justify-between text-[9px]">
                <span className="text-[#ffffff50]">{t.troncon}</span>
                <span
                  className={cn(
                    t.pct >= 80 ? "text-[#22C55E]" : t.pct > 0 ? "text-[#F59E0B]" : "text-[#ffffff20]"
                  )}
                >
                  {t.statut}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-[#0A1628]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${t.pct}%`,
                    background: t.pct >= 80 ? "#22C55E" : t.pct > 0 ? "#F59E0B" : "#333",
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ImperialGlass>

      {/* Source */}
      <div className="text-center">
        <a
          href="https://transport.data.gouv.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] text-[#ffffff20] hover:text-[#00D4FF60] transition-colors"
        >
          Source: transport.data.gouv.fr — Données ouvertes transport
        </a>
      </div>
    </div>
  );
}
