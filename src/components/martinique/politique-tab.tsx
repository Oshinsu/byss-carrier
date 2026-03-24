"use client";

import { Zap } from "lucide-react";
import { ImperialGlass, SectionLabel, MetricCell } from "./primitives";

const PARTIS = [
  { name: "PPM", full: "Parti Progressiste Martiniquais", orientation: "Autonomiste mod\u00E9r\u00E9", couleur: "#22C55E", president: "S. Letchimy" },
  { name: "MIM", full: "Mouvement Ind\u00E9pendantiste Martiniquais", orientation: "Ind\u00E9pendantiste", couleur: "#EF4444", president: "A. Marie-Jeanne" },
  { name: "BA", full: "Batir le Pays Martinique", orientation: "Nationaliste", couleur: "#F59E0B", president: "Y. Monplaisir" },
  { name: "DVG", full: "Divers Gauche", orientation: "Socialiste", couleur: "#EC4899", president: "\u2014" },
  { name: "DVD", full: "Divers Droite", orientation: "R\u00E9publicain", couleur: "#3B82F6", president: "\u2014" },
  { name: "RN", full: "Rassemblement National", orientation: "Droite nationale", couleur: "#1E3A5F", president: "\u2014" },
];

const ELUS = [
  { role: "Pr\u00E9sident CTM", nom: "Serge Letchimy", parti: "PPM", depuis: "2021" },
  { role: "D\u00E9put\u00E9e 1\u00E8re", nom: "Jiovanny William", parti: "DVG", depuis: "2024" },
  { role: "D\u00E9put\u00E9 2\u00E8me", nom: "Johnny Hajjar", parti: "DVG", depuis: "2022" },
  { role: "D\u00E9put\u00E9e 3\u00E8me", nom: "Marcellin Nadeau", parti: "P\u00E9yi-A", depuis: "2022" },
  { role: "D\u00E9put\u00E9 4\u00E8me", nom: "Jean-Philippe Nilor", parti: "MIM/GDR", depuis: "2012" },
  { role: "S\u00E9nateur", nom: "Catherine Conconne", parti: "DVG", depuis: "2017" },
  { role: "S\u00E9nateur", nom: "Fr\u00E9d\u00E9ric Buval", parti: "RDPI", depuis: "2023" },
];

export function TabPolitique() {
  return (
    <div className="space-y-3">
      <ImperialGlass>
        <SectionLabel color="#00B4D8">POUVOIR POLITIQUE</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MetricCell label="PRES. CTM" value="Letchimy" sub="PPM -- 2021" />
          <MetricCell label="DEPUTES AN" value="4" sub="Assemblee Nationale" />
          <MetricCell label="SENATEURS" value="2" sub="Senat" />
          <MetricCell label="BUDGET CTM" value="1.3 Md\€" sub="/an" />
          <MetricCell label="PROCHAINES" value="Dec 2028" sub="Op. Eveil" />
          <MetricCell label="CONSEILLERS" value="51" sub="Assemblee MQ" />
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">ELUS PRINCIPAUX</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#00D4FF15] text-[8px] uppercase tracking-wider text-[#ffffff30]">
                <th className="pb-1.5 pr-2">Fonction</th>
                <th className="pb-1.5 pr-2">Nom</th>
                <th className="pb-1.5 pr-2">Parti</th>
                <th className="pb-1.5">Depuis</th>
              </tr>
            </thead>
            <tbody>
              {ELUS.map((e) => (
                <tr key={`${e.role}-${e.nom}`} className="border-b border-[#00D4FF08]">
                  <td className="py-1 pr-2 text-[9px] text-[#00B4D8]">{e.role}</td>
                  <td className="py-1 pr-2 text-[9px] font-semibold text-[#ffffff70]">{e.nom}</td>
                  <td className="py-1 pr-2">
                    <span className="rounded bg-[#00B4D815] px-1.5 py-0.5 text-[8px] font-medium text-[#00B4D8]">{e.parti}</span>
                  </td>
                  <td className="py-1 font-mono text-[9px] text-[#ffffff30]">{e.depuis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">PARTIS POLITIQUES</SectionLabel>
        <div className="space-y-1">
          {PARTIS.map((p) => (
            <div key={p.name} className="flex items-center gap-2 rounded border border-[#00D4FF08] bg-[#0A1628] px-2 py-1.5">
              <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.couleur }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#ffffff70]">{p.name}</span>
                  <span className="truncate text-[8px] text-[#ffffff30]">{p.full}</span>
                </div>
                <div className="text-[8px] text-[#ffffff20]">{p.orientation} -- {p.president}</div>
              </div>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass>
        <SectionLabel color="#00B4D8">CTM -- COMPETENCES</SectionLabel>
        <div className="space-y-1">
          {[
            { comp: "Transport", budget: "~180 M\€" },
            { comp: "Lycees", budget: "~120 M\€" },
            { comp: "Formation pro", budget: "~90 M\€" },
            { comp: "Dev. economique", budget: "~200 M\€" },
            { comp: "Culture/Patrimoine", budget: "~45 M\€" },
            { comp: "Environnement", budget: "~150 M\€" },
            { comp: "Amenagement", budget: "~250 M\€" },
            { comp: "Social/Sante", budget: "~300 M\€" },
          ].map((c) => (
            <div key={c.comp} className="flex items-center justify-between border-b border-[#00D4FF08] px-1 py-1">
              <span className="text-[9px] text-[#ffffff50]">{c.comp}</span>
              <span className="font-mono text-[9px] text-[#00B4D8]">{c.budget}</span>
            </div>
          ))}
        </div>
      </ImperialGlass>

      <ImperialGlass glow="#00B4D815" className="border-[#00B4D830]">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-[#00B4D8]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00B4D8]">OPERATION EVEIL -- CTM 2028</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded border border-[#00B4D820] bg-[#00B4D808] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8]">20</div>
            <div className="text-[8px] text-[#ffffff30]">Mesures</div>
          </div>
          <div className="rounded border border-[#00B4D820] bg-[#00B4D808] p-2 text-center">
            <div className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8]">38M{"\€"}</div>
            <div className="text-[8px] text-[#ffffff30]">Programme</div>
          </div>
          <div className="rounded border border-[#00B4D820] bg-[#00B4D808] p-2 text-center">
            <a href="/eveil" className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#00B4D8] hover:underline">
              EVEIL {"\u2192"}
            </a>
            <div className="text-[8px] text-[#ffffff30]">Page dediee</div>
          </div>
        </div>
      </ImperialGlass>
    </div>
  );
}
