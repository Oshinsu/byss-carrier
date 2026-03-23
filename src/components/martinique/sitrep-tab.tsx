"use client";

import { Shield, Thermometer, Droplets, Cloud, Activity, Zap } from "lucide-react";
import { ImperialGlass, SectionLabel, MetricCell } from "./primitives";

export interface ActivityRecord {
  id: string;
  type: string;
  description: string;
  created_at: string;
  entity_name?: string;
}

interface Props {
  mqTime: string;
  signalCount: number;
  pipelineCount: number;
  lastActivity?: ActivityRecord;
  activities: ActivityRecord[];
}

export function TabSitrep({ mqTime, signalCount, pipelineCount, lastActivity, activities }: Props) {
  const alertLevel: "NOMINAL" | "ELEVATED" | "CRITICAL" = "NOMINAL";
  const alertColor = alertLevel === "NOMINAL" ? "#22C55E" : alertLevel === "ELEVATED" ? "#F59E0B" : "#FF2D2D";

  return (
    <div className="space-y-3">
      {/* Alert Status */}
      <ImperialGlass glow={`${alertColor}15`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${alertColor}15`, border: `1px solid ${alertColor}40` }}>
              <Shield className="h-4 w-4" style={{ color: alertColor }} />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-[#ffffff30]">ALERT STATUS</div>
              <div className="font-[family-name:var(--font-clash-display)] text-lg font-bold" style={{ color: alertColor }}>{alertLevel}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-[#00D4FF80]">{mqTime}</div>
            <div className="text-[9px] text-[#ffffff20]">MARTINIQUE LOCAL</div>
          </div>
        </div>
      </ImperialGlass>

      {/* Weather */}
      <ImperialGlass>
        <SectionLabel>CONDITIONS METEO</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center gap-1 rounded bg-[#0A1628] p-2">
            <Thermometer className="h-4 w-4 text-[#FF2D2D80]" />
            <span className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#00D4FF]">28{"\u00B0"}C</span>
            <span className="text-[8px] text-[#ffffff30]">TEMP</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded bg-[#0A1628] p-2">
            <Droplets className="h-4 w-4 text-[#00D4FF80]" />
            <span className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#00D4FF]">78%</span>
            <span className="text-[8px] text-[#ffffff30]">HUMIDITE</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded bg-[#0A1628] p-2">
            <Cloud className="h-4 w-4 text-[#ffffff30]" />
            <span className="text-[10px] font-bold text-[#00D4FF]">PARTIEL</span>
            <span className="text-[8px] text-[#ffffff30]">CIEL</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded bg-[#0A1628] p-2">
            <Activity className="h-4 w-4 text-[#22C55E80]" />
            <span className="text-[10px] font-bold text-[#22C55E]">CALME</span>
            <span className="text-[8px] text-[#ffffff30]">MER</span>
          </div>
        </div>
      </ImperialGlass>

      {/* Key signals */}
      <ImperialGlass>
        <SectionLabel>SIGNAUX ACTIFS</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded border border-[#00D4FF15] bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[#00D4FF]">{signalCount}</div>
            <div className="text-[8px] uppercase text-[#ffffff30]">Intel Entities</div>
          </div>
          <div className="rounded border border-[#00B4D815] bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[#00B4D8]">{pipelineCount}</div>
            <div className="text-[8px] uppercase text-[#ffffff30]">Pipeline</div>
          </div>
          <div className="rounded border border-[#22C55E15] bg-[#0A1628] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[#22C55E]">{activities.length}</div>
            <div className="text-[8px] uppercase text-[#ffffff30]">Actions 24h</div>
          </div>
        </div>
      </ImperialGlass>

      {/* Key metrics */}
      <ImperialGlass>
        <SectionLabel>METRIQUES CLES</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="PIB" value="9.3 Md\u20AC" sub="+1.2% (2024)" />
          <MetricCell label="CHOMAGE" value="15.2%" sub="Q4 2025" alert />
          <MetricCell label="POPULATION" value="350K" sub="-0.8%/an (exode)" alert />
          <MetricCell label="SALAIRE MED." value="1 850\u20AC" sub="/mois net" />
        </div>
      </ImperialGlass>

      {/* Last agent action */}
      {lastActivity && (
        <ImperialGlass>
          <SectionLabel>DERNIERE ACTION AGENT</SectionLabel>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#00B4D815]">
              <Zap className="h-3 w-3 text-[#00B4D8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-[#ffffff90]">{lastActivity.description || lastActivity.type}</div>
              {lastActivity.entity_name && <div className="text-[9px] text-[#00B4D8]">{lastActivity.entity_name}</div>}
              <div className="text-[9px] text-[#ffffff25] font-mono">
                {new Date(lastActivity.created_at).toLocaleString("fr-FR", { timeZone: "America/Martinique" })}
              </div>
            </div>
          </div>
        </ImperialGlass>
      )}

      {/* Activity feed */}
      <ImperialGlass>
        <SectionLabel>FLUX ACTIVITE (24H)</SectionLabel>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-[10px] text-[#ffffff20]">Aucune activite recente</div>
        ) : (
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {activities.slice(0, 15).map((a) => (
              <div key={a.id} className="flex items-center gap-2 rounded border border-[#00D4FF08] bg-[#0A1628] px-2 py-1.5">
                <div className="h-1 w-1 shrink-0 rounded-full bg-[#00D4FF40]" />
                <span className="min-w-0 flex-1 truncate text-[9px] text-[#ffffff50]">{a.description || a.type}</span>
                <span className="shrink-0 font-mono text-[8px] text-[#ffffff20]">
                  {new Date(a.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Martinique" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </ImperialGlass>
    </div>
  );
}
