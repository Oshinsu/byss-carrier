"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImperialGlass, SectionLabel, MetricCell } from "./primitives";

const POP_PYRAMID = [
  { tranche: "0-14", pct: 15.2 },
  { tranche: "15-29", pct: 16.8 },
  { tranche: "30-44", pct: 18.5 },
  { tranche: "45-59", pct: 22.1 },
  { tranche: "60-74", pct: 17.8 },
  { tranche: "75+", pct: 9.6 },
];

const COMMUNES = [
  { name: "Fort-de-France", pop: 78000, type: "Pr\u00E9fecture" },
  { name: "Le Lamentin", pop: 42000, type: "Economique" },
  { name: "Le Robert", pop: 22000, type: "Nord-Atlantique" },
  { name: "Schoelcher", pop: 20000, type: "Universitaire" },
  { name: "Sainte-Marie", pop: 16000, type: "Nord-Atlantique" },
  { name: "Le Fran\u00E7ois", pop: 18000, type: "Est" },
  { name: "Ducos", pop: 17000, type: "Centre" },
  { name: "Riviere-Sal\u00E9e", pop: 13000, type: "Sud" },
  { name: "Trinit\u00E9", pop: 12000, type: "Nord-Atlantique" },
  { name: "Saint-Joseph", pop: 16000, type: "Centre" },
  { name: "Les Trois-Ilets", pop: 8000, type: "Sud/Tourisme" },
  { name: "Le Marin", pop: 9000, type: "Sud" },
  { name: "Sainte-Luce", pop: 10000, type: "Sud/Tourisme" },
  { name: "Le Diamant", pop: 6000, type: "Sud" },
  { name: "Saint-Esprit", pop: 9000, type: "Centre" },
  { name: "Gros-Morne", pop: 10000, type: "Centre" },
  { name: "Le Morne-Rouge", pop: 5000, type: "Nord" },
  { name: "Le Carbet", pop: 4000, type: "Nord-Cara\u00EFbe" },
  { name: "Case-Pilote", pop: 5000, type: "Nord-Cara\u00EFbe" },
  { name: "Bellefontaine", pop: 1600, type: "Nord-Cara\u00EFbe" },
  { name: "Le Precheur", pop: 1500, type: "Nord" },
  { name: "Saint-Pierre", pop: 4000, type: "Nord/Historique" },
  { name: "Le Lorrain", pop: 7000, type: "Nord-Atlantique" },
  { name: "Macouba", pop: 1200, type: "Nord" },
  { name: "Basse-Pointe", pop: 3500, type: "Nord" },
  { name: "Le Morne-Vert", pop: 1800, type: "Centre" },
  { name: "Fonds-Saint-Denis", pop: 900, type: "Centre" },
  { name: "Ajoupa-Bouillon", pop: 1800, type: "Nord" },
  { name: "Grand-Riviere", pop: 700, type: "Nord" },
  { name: "Les Anses-d'Arlet", pop: 4000, type: "Sud" },
  { name: "Le Vauclin", pop: 9000, type: "Est" },
  { name: "Riviere-Pilote", pop: 12000, type: "Sud" },
  { name: "Sainte-Anne", pop: 5000, type: "Sud/Tourisme" },
  { name: "Le Marigot", pop: 3500, type: "Nord-Atlantique" },
];

const maxPop = Math.max(...COMMUNES.map((c) => c.pop));

export function TabDemographie() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? COMMUNES : COMMUNES.slice(0, 12);

  return (
    <div className="space-y-3">
      <ImperialGlass>
        <SectionLabel color="#8B5CF6">DEMOGRAPHIE</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="POPULATION" value="350 000" sub="-0.8%/an" alert />
          <MetricCell label="AGE MEDIAN" value="45 ans" sub="Vieillissement" alert />
          <MetricCell label="EXODE" value="-3 000" sub="/an (18-30 ans)" alert />
          <MetricCell label="CHLORDECONE" value="92%" sub="pop. contaminee" alert />
          <MetricCell label="COMMUNES" value="34" sub="1 128 km{'\u00B2'}" />
          <MetricCell label="DENSITE" value="310" sub="hab/km{'\u00B2'}" />
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#8B5CF6">PYRAMIDE DES AGES</SectionLabel>
        <div className="space-y-1.5">
          {POP_PYRAMID.map((p) => (
            <div key={p.tranche} className="flex items-center gap-2">
              <span className="w-10 shrink-0 text-right font-mono text-[9px] text-[#ffffff40]">{p.tranche}</span>
              <div className="relative h-4 flex-1 overflow-hidden rounded bg-[#0A1628]">
                <div
                  className="absolute left-0 top-0 h-full rounded"
                  style={{
                    width: `${(p.pct / 25) * 100}%`,
                    background: p.tranche === "45-59" || p.tranche === "60-74" ? "#FF2D2D60" : "#00D4FF40",
                    border: `1px solid ${p.tranche === "45-59" || p.tranche === "60-74" ? "#FF2D2D30" : "#00D4FF20"}`,
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-[9px] font-bold text-[#00D4FF]">{p.pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded border border-[#FF2D2D20] bg-[#FF2D2D08] p-2 text-[9px] text-[#FF2D2D80]">
          ALERTE: Les 45+ = 49.5% de la population. Exode massif des 18-30 ans.
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#8B5CF6">INDICATEURS SOCIAUX</SectionLabel>
        <div className="space-y-1">
          {[
            { label: "Chomage", value: "15.2%", detail: "FR: 7.3%", alert: true },
            { label: "Chomage <25", value: "38%", detail: "FR: 17%", alert: true },
            { label: "Pauvrete", value: "29%", detail: "FR: 14%", alert: true },
            { label: "Diplomes Bac+", value: "42%", detail: "FR: 52%", alert: false },
            { label: "Homicides", value: "5.2/100K", detail: "FR: 1.3/100K", alert: true },
            { label: "Esperance vie", value: "80.2 ans", detail: "FR: 82.7 ans", alert: false },
            { label: "Creole", value: "90%", detail: "Pratique quotid.", alert: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded border border-[#00D4FF08] bg-[#0A1628] px-2 py-1.5">
              <span className="text-[9px] text-[#ffffff40]">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={cn("font-mono text-[10px] font-bold", item.alert ? "text-[#FF2D2D]" : "text-[#00D4FF]")}>{item.value}</span>
                <span className="text-[8px] text-[#ffffff25]">({item.detail})</span>
              </div>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8B5CF6]">COMMUNES (34)</span>
          <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 text-[9px] text-[#00D4FF60] hover:text-[#00D4FF]">
            {showAll ? "Reduire" : "Voir tout"}
            <ChevronRight className={cn("h-3 w-3 transition-transform", showAll && "rotate-90")} />
          </button>
        </div>
        <div className="space-y-0.5">
          {displayed.map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <span className="w-28 shrink-0 truncate text-[9px] text-[#ffffff50]">{c.name}</span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#0A1628]">
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${(c.pop / maxPop) * 100}%`, background: c.pop > 20000 ? "#00D4FF" : "#00D4FF40", opacity: 0.5 }} />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-[8px] text-[#ffffff30]">{c.pop.toLocaleString("fr-FR")}</span>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass glow="#FF2D2D10">
        <SectionLabel color="#FF2D2D">CHLORDECONE -- CRISE</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded border border-[#FF2D2D20] bg-[#FF2D2D08] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#FF2D2D]">92%</div>
            <div className="text-[8px] text-[#ffffff30]">Contamination</div>
          </div>
          <div className="rounded border border-[#FF2D2D20] bg-[#FF2D2D08] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#FF2D2D]">1972-93</div>
            <div className="text-[8px] text-[#ffffff30]">Utilisation</div>
          </div>
          <div className="rounded border border-[#FF2D2D20] bg-[#FF2D2D08] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#FF2D2D]">+80%</div>
            <div className="text-[8px] text-[#ffffff30]">Cancer prostate</div>
          </div>
        </div>
      </ImperialGlass>
    </div>
  );
}
