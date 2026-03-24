"use client";

import { ImperialGlass, SectionLabel, MetricCell, HBar } from "./primitives";

const SECTEURS = [
  { name: "Services", pct: 30, color: "#3B82F6" },
  { name: "Tourisme", pct: 22, color: "#00B4D8" },
  { name: "Commerce", pct: 18, color: "#F59E0B" },
  { name: "BTP", pct: 15, color: "#EF4444" },
  { name: "Agriculture", pct: 5, color: "#22C55E" },
  { name: "Industrie", pct: 6, color: "#8B5CF6" },
  { name: "Peche", pct: 4, color: "#06B6D4" },
];

const PIB_HISTORY = [
  { year: "2019", value: 8.9 },
  { year: "2020", value: 8.2 },
  { year: "2021", value: 8.7 },
  { year: "2022", value: 9.0 },
  { year: "2023", value: 9.1 },
  { year: "2024", value: 9.3 },
];

const TRADE_DATA = [
  { label: "Imports", value: 3.2, color: "#EF4444" },
  { label: "Exports", value: 0.4, color: "#22C55E" },
  { label: "Deficit", value: -2.8, color: "#F59E0B" },
];

export function TabEconomie() {
  return (
    <div className="space-y-3">
      <ImperialGlass>
        <SectionLabel color="#00B4D8">INDICATEURS MACRO</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="PIB" value="9.3 Md\€" sub="+1.2% (2024)" />
          <MetricCell label="CHOMAGE" value="15.2%" sub="Q4 2025" alert />
          <MetricCell label="SALAIRE MED." value="1 850\€" sub="/mois net" />
          <MetricCell label="TVA" value="8.5%" sub="vs 20% metropole" />
          <MetricCell label="INFLATION" value="+40%" sub="alimentaire vs metro" alert />
          <MetricCell label="POPULATION" value="350K" sub="-0.8%/an" alert />
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">PIB EVOLUTION (Md{"\€"})</SectionLabel>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {PIB_HISTORY.map((d) => {
            const h = (d.value / 10) * 100;
            return (
              <div key={d.year} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[9px] font-bold text-[#00D4FF]">{d.value}</span>
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{ height: `${h}%`, background: "linear-gradient(to top, #00D4FF40, #00D4FF15)", border: "1px solid #00D4FF30", borderBottom: "none" }}
                />
                <span className="font-mono text-[8px] text-[#ffffff30]">{d.year}</span>
              </div>
            );
          })}
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">REPARTITION SECTORIELLE</SectionLabel>
        <div className="space-y-1.5">
          {SECTEURS.map((s) => (
            <HBar key={s.name} label={s.name} value={s.pct} max={35} color={s.color} />
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">COMMERCE EXTERIEUR</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {TRADE_DATA.map((t) => (
            <div key={t.label} className="rounded border border-[#00D4FF10] bg-[#0A1628] p-2 text-center">
              <div className="text-[8px] uppercase text-[#ffffff30]">{t.label}</div>
              <div className="font-[family-name:var(--font-clash-display)] text-lg font-bold" style={{ color: t.color }}>
                {t.value > 0 ? `${t.value}` : `${t.value}`} Md{"\€"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded border border-[#00D4FF10] bg-[#0A1628] p-2">
            <div className="text-[8px] uppercase tracking-wider text-[#ffffff30]">TOP IMPORTS</div>
            <div className="mt-1 text-[9px] text-[#ffffff50]">Alimentaire, vehicules, hydrocarbures, equipements</div>
          </div>
          <div className="rounded border border-[#00D4FF10] bg-[#0A1628] p-2">
            <div className="text-[8px] uppercase tracking-wider text-[#ffffff30]">TOP EXPORTS</div>
            <div className="mt-1 text-[9px] text-[#ffffff50]">Rhum AOC, banane, canne, peche, fleurs</div>
          </div>
        </div>
      </ImperialGlass>

      <ImperialGlass glow="#FF2D2D10">
        <SectionLabel color="#FF2D2D">SURINFLATION -- MONOPOLE</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { produit: "Alimentation", ecart: "+38%" },
            { produit: "Carburant", ecart: "+12%" },
            { produit: "Logement", ecart: "+25%" },
            { produit: "Services", ecart: "+15%" },
          ].map((item) => (
            <div key={item.produit} className="flex items-center justify-between rounded border border-[#FF2D2D20] bg-[#FF2D2D08] px-3 py-2">
              <span className="text-[10px] text-[#ffffff50]">{item.produit}</span>
              <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#FF2D2D]">{item.ecart}</span>
            </div>
          ))}
        </div>
      </ImperialGlass>
    </div>
  );
}
