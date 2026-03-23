"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Square,
  ChevronRight,
  FileText,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EligibiliteItem } from "@/types/finance";

/* ═══════════════════════════════════════════════════════
   ELIGIBILITES TAB — Fiscal eligibilities + checkbox persistence
   ═══════════════════════════════════════════════════════ */

const ELIGIBILITES_STORAGE_KEY = "byss-eligibilites-checked";

const ELIGIBILITES_INIT: EligibiliteItem[] = [
  {
    label: "JEI (Jeune Entreprise Innovante)",
    description: "Exon\u00E9ration charges sociales + IS pour les entreprises de R&D de moins de 8 ans.",
    steps: ["V\u00E9rifier crit\u00E8res (< 250 salari\u00E9s, 15%+ R&D)", "Pr\u00E9parer dossier descriptif R&D", "D\u00E9poser aupr\u00E8s du SIE"],
    checked: false,
  },
  {
    label: "CIR (Cr\u00E9dit d\u2019Imp\u00F4t Recherche)",
    description: "30% des d\u00E9penses de R&D d\u00E9ductibles. Algorithmes IA, moteurs NLP, architectures multi-agents.",
    steps: ["Documenter les travaux de recherche Orion", "Chiffrer les d\u00E9penses \u00E9ligibles (salaires, API, infra)", "R\u00E9diger le dossier technique justificatif"],
    checked: false,
  },
  {
    label: "CII (Cr\u00E9dit d\u2019Imp\u00F4t Innovation)",
    description: "20% des d\u00E9penses d\u2019innovation, plafonn\u00E9 \u00E0 400K\u20AC. Prototypage, design, brevet.",
    steps: ["Identifier les d\u00E9penses de prototypage Orion", "Pr\u00E9parer la description technique du caract\u00E8re innovant", "D\u00E9poser avec la liasse fiscale"],
    checked: false,
  },
  {
    label: "ACRE (Aide aux Cr\u00E9ateurs)",
    description: "Exon\u00E9ration partielle de charges sociales pendant 12 mois pour les cr\u00E9ateurs d\u2019entreprise.",
    steps: ["V\u00E9rifier \u00E9ligibilit\u00E9 (date de cr\u00E9ation)", "Compl\u00E9ter le formulaire ACRE", "Transmettre \u00E0 l\u2019URSSAF"],
    checked: false,
  },
  {
    label: "BPI France \u2014 Subventions IA",
    description: "Programmes d\u2019aide \u00E0 l\u2019innovation IA : Bourse French Tech, aide au d\u00E9veloppement, pr\u00EAt d\u2019amor\u00E7age.",
    steps: ["Cr\u00E9er un compte BPI France", "Identifier le programme adapt\u00E9 (French Tech, i-Nov)", "Monter le dossier avec business plan + roadmap tech"],
    checked: false,
  },
  {
    label: "LODEOM (D\u00E9fiscalisation DOM)",
    description: "TVA r\u00E9duite 8.5% Martinique. CII major\u00E9 60% DOM. CIR 50% DOM. Exon\u00E9rations charges patronales.",
    steps: ["V\u00E9rifier le si\u00E8ge social DOM", "Appliquer le taux TVA 8.5%", "Majorer CII/CIR aux taux DOM"],
    checked: false,
  },
  {
    label: "IP Box (10% IS sur logiciels)",
    description: "Taux r\u00E9duit IS 10% sur les revenus de copyright logiciel. Applicable \u00E0 Orion, Byss Emploi, agents IA.",
    steps: ["Identifier les logiciels \u00E9ligibles", "S\u00E9parer revenus IP vs services", "D\u00E9clarer via formulaire 2058-A"],
    checked: false,
  },
  {
    label: "JEII (Jeune Entreprise Innovante \u00E0 Impact)",
    description: "Nouveau statut 2026. 7 ans exon\u00E9ration cotisations + 24 mois IS. Condition: 15% R&D minimum.",
    steps: ["V\u00E9rifier crit\u00E8res JEII 2026", "Documenter l'impact social (emploi, \u00E9nergie, \u00E9ducation)", "D\u00E9poser le dossier SIE"],
    checked: false,
  },
  {
    label: "Creative Europe MEDIA",
    description: "Financement UE pour audiovisuel. Max 120K\u20AC. Consortium 2 pays. Pour Jurassic Wars + MOOSTIK.",
    steps: ["Identifier partenaire EU (Belgique, Luxembourg)", "Pr\u00E9parer dossier production", "D\u00E9poser avant deadline MEDIA"],
    checked: false,
  },
  {
    label: "CNC \u2014 Aide au d\u00E9veloppement",
    description: "150K\u20AC max pour d\u00E9veloppement animation. CTM matche 2:1. Pour Jurassic Wars + C\u00E9saire Pixar.",
    steps: ["Pr\u00E9parer bible production", "D\u00E9poser dossier CNC", "N\u00E9gocier matching CTM"],
    checked: false,
  },
];

export function EligibilitesTab() {
  const [items, setItems] = useState<EligibiliteItem[]>(ELIGIBILITES_INIT);

  /* Load checked state from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ELIGIBILITES_STORAGE_KEY);
      if (stored) {
        const parsed: Record<number, boolean> = JSON.parse(stored);
        setItems((prev) =>
          prev.map((e, i) => ({ ...e, checked: Boolean(parsed[i]) }))
        );
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const toggle = (idx: number) => {
    setItems((prev) => {
      const next = prev.map((e, i) => (i === idx ? { ...e, checked: !e.checked } : e));
      try {
        const map: Record<number, boolean> = {};
        next.forEach((e, i) => { map[i] = e.checked; });
        localStorage.setItem(ELIGIBILITES_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center gap-2">
        <Scale className="h-5 w-5 text-[var(--color-gold)]" />
        <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)]">
          {"\u00C9"}ligibilit{"\u00E9"}s Fiscales & Subventions
        </h2>
      </div>

      {items.map((e, i) => (
        <motion.div
          key={e.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className={cn(
            "overflow-hidden rounded-xl border transition-all",
            e.checked
              ? "border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)]"
              : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
          )}
        >
          <div className="p-4">
            <button onClick={() => toggle(i)} className="flex w-full items-start gap-3 text-left">
              {e.checked ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold)]" />
              ) : (
                <Square className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className={cn("text-sm font-semibold", e.checked ? "text-[var(--color-gold)]" : "text-[var(--color-text)]")}>
                  {e.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{e.description}</p>
              </div>
            </button>
            <div className="ml-8 mt-3 space-y-1.5">
              {e.steps.map((step, si) => (
                <div key={si} className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                  <ChevronRight className="h-3 w-3 shrink-0 text-[var(--color-gold-muted)]" />
                  {step}
                </div>
              ))}
            </div>
            <div className="ml-8 mt-3">
              <button className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-1.5 text-[10px] font-medium text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">
                <FileText className="h-3 w-3" />
                Dossier {"\u00E0"} pr{"\u00E9"}parer
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      <p className="text-[10px] text-[var(--color-text-muted)]">
        V{"\u00E9"}rifier l&apos;{"\u00E9"}ligibilit{"\u00E9"} avec le comptable avant d{"\u00E9"}claration.
      </p>
    </div>
  );
}
