"use client";

import { motion } from "motion/react";
import {
  Building2, FileText, Scale, Shield, Users, Briefcase,
  AlertTriangle, CheckCircle2, Clock, Euro, ChevronRight,
  Bot, Sparkles, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Page Juridique SASU
   Statuts, obligations, IA explicative
   ═══════════════════════════════════════════════════════ */

const SASU_SECTIONS = [
  {
    id: "forme",
    icon: Building2,
    title: "Forme juridique",
    status: "ok" as const,
    content: `**SASU** — Societe par Actions Simplifiee Unipersonnelle.
Un seul associe (Gary Bissol), president de droit.
Capital social: variable (minimum 1EUR). NAF 62.01Z (programmation informatique).
Siege: Fort-de-France, Martinique.`,
    ia_note: "La SASU est le vehicule ideal pour un solo-entrepreneur tech. Responsabilite limitee aux apports, fiscalite optimisable (IS ou IR), et aucune obligation de commissaire aux comptes sous les seuils PME.",
  },
  {
    id: "president",
    icon: Users,
    title: "President (Dirigeant)",
    status: "ok" as const,
    content: `**Gary Bissol** — President et associe unique.
Regime social: assimile salarie (regime general de la Securite sociale).
Pas de cotisations minimales si pas de remuneration.
Peut cumuler: president + salaire + dividendes.`,
    ia_note: "En SASU, le president assimile salarie beneficie d'une meilleure couverture sociale qu'un TNS (travailleur non salarie en EURL), mais les charges sont plus elevees (~65% vs ~45%). L'optimisation classique: salaire minimal + dividendes flat tax 30%.",
  },
  {
    id: "capital",
    icon: Euro,
    title: "Capital social",
    status: "attention" as const,
    content: `Capital **variable** recommande (clause de variabilite dans les statuts).
Plancher: 1EUR. Plafond: libre.
Permet d'augmenter/diminuer le capital sans modifier les statuts (economies de formalites).
Apports: numeraire (especes) ou nature (materiel, IP Cadifor, logiciels).`,
    ia_note: "Conseil: evaluer les apports en nature (propriete intellectuelle Cadifor, code source Orion/Byss Emploi) pour gonfler le capital sans cash. Un commissaire aux apports n'est obligatoire que si un apport en nature depasse 30.000EUR ou 50% du capital.",
  },
  {
    id: "fiscalite",
    icon: Scale,
    title: "Fiscalite",
    status: "ok" as const,
    content: `**IS (Impot sur les Societes)** par defaut.
Taux reduit: **15%** sur les premiers 42.500EUR de benefice (sous conditions PME).
Taux normal: **25%** au-dela.
Option IR possible les 5 premieres annees (mais rarement avantageuse en SASU).

**TVA**: regime de droit commun (collecte + deduction).
Taux Martinique: **8.5%** (taux reduit DOM) au lieu de 20% en metropole.

**Avantage DOM**: abattement d'IS de 50% (plafonné) possible via article 44 quaterdecies du CGI si investissement productif neuf.`,
    ia_note: "La TVA a 8.5% en Martinique est un avantage competitif massif: les factures clients sont 11.5 points moins cheres qu'en metropole. Pour les clients metropole, tu factures TTC mais collectes moins = marge superieure.",
  },
  {
    id: "obligations",
    icon: FileText,
    title: "Obligations annuelles",
    status: "attention" as const,
    content: `1. **Comptes annuels** — Bilan + compte de resultat + annexe. Depot au greffe dans les 6 mois apres cloture.
2. **AG annuelle** — Decision unique de l'associe unique (PV d'approbation des comptes). Delai: 6 mois apres cloture.
3. **Declaration IS** (cerfa 2065) — Avant le 2eme jour ouvre apres le 1er mai (cloture au 31/12).
4. **Declaration TVA** — Mensuelle ou trimestrielle selon CA.
5. **CFE** (Cotisation Fonciere des Entreprises) — Exoneree la 1ere annee.
6. **Declaration DAS2** — Si honoraires verses > 1.200EUR/an a un prestataire.`,
    ia_note: "Priorite immediate: trouver un expert-comptable specialise startup/SaaS en Martinique. Budget: 150-250EUR/mois. Il gere les declarations, optimise la fiscalite, et prepare les dossiers JEI/CIR.",
  },
  {
    id: "jei",
    icon: Sparkles,
    title: "JEI — Jeune Entreprise Innovante",
    status: "eligible" as const,
    content: `**Conditions JEI** (article 44 sexies-0 A du CGI):
- PME < 250 salaries, CA < 50MEUR
- Moins de 8 ans d'existence
- 15% minimum des charges en R&D
- Capital detenu a 50%+ par personnes physiques
- Activite reellement nouvelle (pas de reprise)

**Avantages**:
- Exoneration IS totale pendant 1 an, puis 50% la 2eme annee
- Exoneration charges sociales patronales sur les chercheurs/techniciens R&D
- Exoneration CFE et taxe fonciere (sur deliberation collectivite)`,
    ia_note: "BYSS GROUP est quasi-certainement eligible JEI. Le phi-engine (693 lignes Rust, recherche IIT), Orion (90 agents IA), et le MCP France Travail sont de la R&D pure. Le dossier JEI se depose aupres du MESRI (Ministere de l'Enseignement Superieur).",
  },
  {
    id: "cir",
    icon: Shield,
    title: "CIR / CII — Credits d'impot",
    status: "eligible" as const,
    content: `**CIR (Credit d'Impot Recherche)**:
- 30% des depenses de R&D (jusqu'a 100MEUR)
- Eligible: salaires chercheurs, sous-traitance R&D, amortissements, brevets
- Declaration avec liasse fiscale (cerfa 2069-A-SD)

**CII (Credit d'Impot Innovation)**:
- 20% des depenses d'innovation (plafond 400.000EUR)
- Eligible: conception de prototypes, installations pilotes
- Orion SaaS, phi-engine WASM, Senzaris language = innovation

**Cumul**: CIR + CII cumulables sur des depenses differentes.`,
    ia_note: "Estimation CIR pour BYSS GROUP 2026: si 80% du temps de Gary (unique salarie) est en R&D, et qu'il se verse 30.000EUR brut/an, le CIR serait d'environ 9.000EUR. Avec le CII en plus sur les prototypes Orion, on peut atteindre 15-20.000EUR de credits d'impot.",
  },
  {
    id: "acre",
    icon: Clock,
    title: "ACRE — Aide aux Createurs",
    status: "a_verifier" as const,
    content: `**ACRE** (Aide a la Creation ou Reprise d'Entreprise):
- Exoneration partielle de charges sociales pendant 12 mois
- Applicable si: demandeur d'emploi, beneficiaire RSA/ASS, ou < 26 ans
- Demande a l'URSSAF dans les 45 jours suivant la creation

**Attention**: en SASU, le president assimile salarie peut beneficier de l'ACRE uniquement s'il se verse une remuneration.`,
    ia_note: "Verifie ton eligibilite ACRE avec ton expert-comptable. Si tu etais demandeur d'emploi avant la creation de BYSS GROUP SAS, tu es eligible. L'economie peut atteindre 5.000-8.000EUR la premiere annee.",
  },
  {
    id: "protection",
    icon: Shield,
    title: "Protection & PI",
    status: "attention" as const,
    content: `**Propriete intellectuelle a proteger**:
1. Marque BYSS GROUP — depot INPI (~250EUR, protection 10 ans)
2. Marque ORION — verifier disponibilite (risque de conflit)
3. Marque CADIFOR — depot classe 9 (logiciels) + 41 (education)
4. Code source — protege automatiquement par droit d'auteur
5. phi-engine — potentiel brevet logiciel (algorithme IIT novel)

**RGPD**: DPO non obligatoire < 250 salaries, mais registre des traitements obligatoire.
**CGV/CGU**: obligatoires pour toute prestation B2B et tout SaaS.`,
    ia_note: "Priorite 1: deposer la marque BYSS GROUP a l'INPI. Cout: ~250EUR en ligne. Classe 9 (logiciels) + 35 (publicite) + 42 (services informatiques). Duree: 6-8 mois pour l'enregistrement.",
  },
];

const statusConfig = {
  ok: { label: "En regle", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  attention: { label: "A traiter", color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertTriangle },
  eligible: { label: "Eligible", color: "text-blue-400", bg: "bg-blue-500/10", icon: Sparkles },
  a_verifier: { label: "A verifier", color: "text-purple-400", bg: "bg-purple-500/10", icon: Info },
};

export default function JuridiquePage() {
  const [expandedId, setExpandedId] = useState<string | null>("forme");
  const [aiMode, setAiMode] = useState(true);

  const countByStatus = (s: string) => SASU_SECTIONS.filter((sec) => sec.status === s).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            Juridique <span className="text-[var(--color-gold)]">SASU</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            BYSS GROUP SAS — Fort-de-France — NAF 62.01Z
          </p>
        </div>
        <button
          onClick={() => setAiMode(!aiMode)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
            aiMode
              ? "border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
              : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
          )}
        >
          <Bot className="h-4 w-4" />
          {aiMode ? "IA active" : "IA desactivee"}
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["ok", "attention", "eligible", "a_verifier"] as const).map((s) => {
          const cfg = statusConfig[s];
          const StatusIcon = cfg.icon;
          return (
            <div key={s} className={cn("flex items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] p-4", cfg.bg)}>
              <StatusIcon className={cn("h-5 w-5", cfg.color)} />
              <div>
                <div className="text-2xl font-bold text-[var(--color-text)] font-[family-name:var(--font-clash-display)]">{countByStatus(s)}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SASU_SECTIONS.map((sec, i) => {
          const isOpen = expandedId === sec.id;
          const cfg = statusConfig[sec.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden"
            >
              {/* Header clickable */}
              <button
                onClick={() => setExpandedId(isOpen ? null : sec.id)}
                className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[var(--color-gold-glow)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
                  <sec.icon className="h-5 w-5 text-[var(--color-gold)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
                    {sec.title}
                  </h3>
                </div>
                <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", cfg.bg, cfg.color)}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {cfg.label}
                </div>
                <ChevronRight className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", isOpen && "rotate-90")} />
              </button>

              {/* Content */}
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[var(--color-border-subtle)]"
                >
                  <div className="p-5 space-y-4">
                    {/* Main content */}
                    <div className="text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line">
                      {sec.content.split("**").map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-[var(--color-text)] font-semibold">{part}</strong>
                        ) : (
                          <span key={j}>{part}</span>
                        )
                      )}
                    </div>

                    {/* IA Note */}
                    {aiMode && sec.ia_note && (
                      <div className="rounded-lg border border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4 text-[var(--color-gold)]" />
                          <span className="text-xs font-semibold text-[var(--color-gold)]">Analyse IA — Sorel</span>
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {sec.ia_note}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          Document genere par Sorel (soso) — Agent comptable BYSS GROUP.
          <br />
          <span className="italic text-[var(--color-gold-muted)]">Ces informations sont indicatives. Consultez un expert-comptable pour validation.</span>
        </p>
      </div>
    </div>
  );
}
