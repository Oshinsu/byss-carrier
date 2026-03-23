"use client";

import { ImperialGlass, SectionLabel, MetricCell, InfluenceBar } from "./primitives";

interface Prospect {
  id: string;
  name: string;
  sector: string;
  status: string;
  city: string | null;
}

const TOP_GROUPES = [
  { name: "GBH (Hayot)", ca: "6 Md\u20AC", secteur: "Distribution/Auto/Industrie", employes: "22 000", influence: 10 },
  { name: "SARA", ca: "800 M\u20AC", secteur: "Raffinerie/Energie", employes: "450", influence: 8 },
  { name: "Orange Cara\u00EFbe", ca: "650 M\u20AC", secteur: "T\u00E9l\u00E9com", employes: "1 200", influence: 7 },
  { name: "Digicel Antilles", ca: "400 M\u20AC", secteur: "T\u00E9l\u00E9com", employes: "600", influence: 7 },
  { name: "Groupe Cretinoir", ca: "350 M\u20AC", secteur: "Distribution", employes: "800", influence: 6 },
  { name: "Groupe Reynoird", ca: "300 M\u20AC", secteur: "Distribution/BTP", employes: "1 500", influence: 6 },
  { name: "SFR Cara\u00EFbe", ca: "250 M\u20AC", secteur: "T\u00E9l\u00E9com", employes: "400", influence: 5 },
  { name: "Groupe Fabre-Domergue", ca: "200 M\u20AC", secteur: "Automobile", employes: "500", influence: 5 },
  { name: "Groupe Aubery", ca: "180 M\u20AC", secteur: "Automobile/Distrib", employes: "700", influence: 5 },
  { name: "Groupe Dufry Antilles", ca: "150 M\u20AC", secteur: "Duty-Free/Travel", employes: "300", influence: 4 },
];

interface Props {
  prospects: Prospect[];
  loading: boolean;
  sectorCounts: [string, number][];
}

export function TabEntreprises({ prospects, loading, sectorCounts }: Props) {
  return (
    <div className="space-y-3">
      <ImperialGlass>
        <SectionLabel color="#00B4D8">TISSU ECONOMIQUE</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="ENTREPRISES" value="~35 000" sub="registre CCI MQ" />
          <MetricCell label="CREATIONS 2025" value="~3 200" sub="+4% vs 2024" />
          <MetricCell label="PIPELINE BYSS" value={`${prospects.length}`} sub="prospects actifs" />
          <MetricCell label="MICRO-ENT." value="65%" sub="du tissu" />
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">TOP 10 GROUPES</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#00D4FF15] text-[8px] uppercase tracking-wider text-[#ffffff30]">
                <th className="pb-1.5 pr-2">#</th>
                <th className="pb-1.5 pr-2">Groupe</th>
                <th className="pb-1.5 pr-2">CA</th>
                <th className="pb-1.5">Influence</th>
              </tr>
            </thead>
            <tbody>
              {TOP_GROUPES.map((g, i) => (
                <tr key={g.name} className="border-b border-[#00D4FF08] transition-colors hover:bg-[#00D4FF05]">
                  <td className="py-1 pr-2 font-mono text-[10px] text-[#00D4FF60]">{i + 1}</td>
                  <td className="py-1 pr-2 text-[10px] font-semibold text-[#ffffff80]">{g.name}</td>
                  <td className="py-1 pr-2 font-mono text-[10px] text-[#00B4D8]">{g.ca}</td>
                  <td className="py-1"><InfluenceBar level={g.influence} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ImperialGlass>

      <ImperialGlass glow="#00B4D810">
        <SectionLabel color="#00B4D8">PIPELINE BYSS ({prospects.length})</SectionLabel>
        {loading ? (
          <div className="flex h-32 items-center justify-center text-[10px] text-[#ffffff30]">
            <div className="animate-pulse">CHARGEMENT...</div>
          </div>
        ) : prospects.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-[10px] text-[#ffffff20]">AUCUN PROSPECT</div>
        ) : (
          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            {prospects.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded border border-[#00D4FF08] bg-[#0A1628] px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00B4D8]" />
                  <span className="text-[10px] font-medium text-[#ffffff70]">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {p.city && <span className="text-[8px] text-[#ffffff25]">{p.city}</span>}
                  <span className="rounded bg-[#00B4D815] px-1.5 py-0.5 text-[8px] font-medium text-[#00B4D8]">{p.sector || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImperialGlass>

      {sectorCounts.length > 0 && (
        <ImperialGlass>
          <SectionLabel color="#00B4D8">SECTEURS PIPELINE</SectionLabel>
          <div className="space-y-1.5">
            {sectorCounts.map(([sector, count]) => (
              <div key={sector} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-[9px] text-[#ffffff40]">{sector}</span>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#0A1628]">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ width: `${(count / Math.max(...sectorCounts.map((s) => s[1]))) * 100}%`, background: "#00B4D8", opacity: 0.6 }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right font-mono text-[9px] font-bold text-[#00B4D8]">{count}</span>
              </div>
            ))}
          </div>
        </ImperialGlass>
      )}

      <div className="grid grid-cols-2 gap-2">
        <ImperialGlass>
          <div className="text-[9px] font-bold uppercase tracking-wider text-[#00D4FF80]">CCI MQ</div>
          <div className="mt-1 space-y-1 text-[9px]">
            <div className="flex justify-between"><span className="text-[#ffffff30]">Inscrites</span><span className="text-[#ffffff60]">~25K</span></div>
            <div className="flex justify-between"><span className="text-[#ffffff30]">President</span><span className="text-[#ffffff60]">P. Jock</span></div>
            <div className="flex justify-between"><span className="text-[#ffffff30]">Budget</span><span className="text-[#ffffff60]">~18M{"\u20AC"}</span></div>
          </div>
        </ImperialGlass>
        <ImperialGlass>
          <div className="text-[9px] font-bold uppercase tracking-wider text-[#00D4FF80]">MEDEF MQ</div>
          <div className="mt-1 space-y-1 text-[9px]">
            <div className="flex justify-between"><span className="text-[#ffffff30]">Adherents</span><span className="text-[#ffffff60]">~800</span></div>
            <div className="flex justify-between"><span className="text-[#ffffff30]">President</span><span className="text-[#ffffff60]">E. Bellemare</span></div>
            <div className="flex justify-between"><span className="text-[#ffffff30]">Priorite</span><span className="text-[#ffffff60]">Numerique</span></div>
          </div>
        </ImperialGlass>
      </div>
    </div>
  );
}
