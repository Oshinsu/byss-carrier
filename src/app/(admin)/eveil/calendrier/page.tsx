"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Timer, Flame, Crown, Sparkles, Star, Zap, Check, Search, Swords, Megaphone, Vote, Eye, Target } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

const ICON_MAP: Record<string, typeof Zap> = { Zap, Sparkles, Flame, Crown, Star, Search, Swords, Megaphone, Vote };

/* ═══════════════════════════════════════════════════════
   REAL TIMELINE — calendrier.md (Calendrier de Guerre)
   J-33 mois — Objectif : Décembre 2028
   ═══════════════════════════════════════════════════════ */
const PHASES = [
  {
    id: "intelligence",
    name: "Phase 1 : Intelligence",
    period: "Mars \u2014 Septembre 2026",
    desc: "Architecture pos\u00e9e. Cartographies politiques, \u00e9conomiques, sociales. Renseignement. R\u00e9daction programme v1.0. D\u00e9cision : nom du mouvement.",
    color: "#6B7280",
    icon: "Search",
    milestones: [
      "Architecture du repo pos\u00e9e",
      "Cartographie politique (partis, CE, Assembl\u00e9e)",
      "Cartographie \u00e9conomique (GBH, structure b\u00e9k\u00e9)",
      "QG Notion cr\u00e9\u00e9",
      "Donn\u00e9es INSEE / IEDOM fetch\u00e9es",
      "51 conseillers de l\u2019Assembl\u00e9e profil\u00e9s",
      "34 maires cartographi\u00e9s",
      "Veille m\u00e9diatique automatis\u00e9e",
      "Premier cercle identifi\u00e9 (3-5 personnes)",
      "Analyse budget CTM 2025",
      "Analyse march\u00e9s publics CTM 2021-2025",
      "\u00c9tude r\u00e9sultats \u00e9lections 2021 par bureau",
      "Cartographie sociale : syndicats, associations, cultes",
      "Analyse r\u00e9seaux sociaux MTQ",
      "Programme v1.0 r\u00e9dig\u00e9",
      "Positionnement finalis\u00e9",
      "Nom du mouvement d\u00e9cid\u00e9",
    ],
  },
  {
    id: "preparation",
    name: "Phase 2 : Pr\u00e9paration",
    period: "Octobre 2026 \u2014 Juin 2027",
    desc: "Cr\u00e9ation formelle du mouvement. Site web. Contenus digitaux. D\u00e9placements terrain discrets. Constitution de la liste (51 candidats). Formation \u00e9quipe campagne. Premiers soutiens publics.",
    color: "#00D4FF",
    icon: "Sparkles",
    milestones: [
      "Mouvement cr\u00e9\u00e9 (association loi 1901)",
      "Site web du mouvement",
      "Premiers contenus YouTube / Instagram / TikTok",
      "D\u00e9placements terrain discrets (\u00e9coute)",
      "Financement structur\u00e9",
      "Programme v2.0 (retour terrain int\u00e9gr\u00e9)",
      "Liste pr\u00e9visionnelle 51 candidats",
      "\u00c9quipe de campagne form\u00e9e",
      "Premiers soutiens publics (sportifs, artistes)",
      "Derniers tests de messages",
      "Discours fondateur pr\u00e9par\u00e9",
      "Budget campagne boucl\u00e9",
      "Plan m\u00e9dia pr\u00eat",
    ],
  },
  {
    id: "emergence",
    name: "Phase 3 : \u00c9mergence",
    period: "Juillet 2027 \u2014 Mars 2028",
    desc: "D\u00c9CLARATION PUBLIQUE DE CANDIDATURE. Discours fondateur. Lancement officiel. Premiers meetings (10 communes prioritaires). Couverture m\u00e9diatique. Pr\u00e9sence r\u00e9seaux sociaux constante.",
    color: "#EF4444",
    icon: "Flame",
    milestones: [
      "D\u00c9CLARATION DE CANDIDATURE (Juillet 2027)",
      "Discours fondateur",
      "Lancement officiel du mouvement",
      "Site web complet avec programme",
      "10 premiers meetings (communes prioritaires)",
      "Couverture m\u00e9diatique progressive",
      "Pr\u00e9sence constante r\u00e9seaux sociaux",
      "Recrutement final candidats de la liste",
      "Meetings dans les 34 communes",
      "D\u00e9p\u00f4t officiel de la liste",
      "Campagne terrain intensive lanc\u00e9e",
      "R\u00e9v\u00e9lation \u00e9quipe compl\u00e8te",
    ],
  },
  {
    id: "campagne",
    name: "Phase 4 : Campagne",
    period: "Avril \u2014 D\u00e9cembre 2028",
    desc: "Campagne terrain : 2 communes/semaine. Digital : 3 posts/jour minimum. D\u00e9bats t\u00e9l\u00e9vis\u00e9s. Riposte temps r\u00e9el (Agent GARDIEN actif). Mobilisation maximale. JOUR J.",
    color: "#00B4D8",
    icon: "Swords",
    milestones: [
      "Campagne terrain : 2 communes/semaine",
      "Contenu digital quotidien (3 posts/jour)",
      "D\u00e9bats t\u00e9l\u00e9vis\u00e9s avec adversaires",
      "Agent GARDIEN actif (riposte temps r\u00e9el)",
      "Campagne officielle (Oct-Nov 2028)",
      "Meetings finaux",
      "Mobilisation maximale",
      "Strat\u00e9gie jour J",
      "1er tour \u00e9lections territoriales",
      "2nd tour (si n\u00e9cessaire)",
      "VICTOIRE",
    ],
  },
  {
    id: "gouvernance",
    name: "Phase 5 : Gouvernance",
    period: "Janvier 2029+",
    desc: "Les 100 premiers jours. Discours d\u2019investiture en cr\u00e9ole. Open data int\u00e9gral jour 1. Hub IA Cara\u00efbe mois 2. Souverainet\u00e9 alimentaire mois 3. La transformation commence.",
    color: "#FF69B4",
    icon: "Crown",
    milestones: [
      "Jour 1 : Discours d\u2019investiture \u2014 en cr\u00e9ole",
      "Semaine 1 : Nomination du conseil ex\u00e9cutif",
      "Mois 1 : Open data int\u00e9gral + tableau de bord citoyen",
      "Mois 2 : Lancement Hub IA Cara\u00efbe",
      "Mois 3 : Plan souverainet\u00e9 alimentaire activ\u00e9",
    ],
  },
];

type TaskMap = Record<string, boolean>;

export default function CalendrierPage() {
  const [checked, setChecked, hydrated] = useLocalStorage<TaskMap>(
    STORAGE_KEYS.EVEIL_CALENDRIER,
    {}
  );

  function toggleTask(phaseId: string, milestoneIdx: number) {
    setChecked((prev) => {
      const key = `${phaseId}-${milestoneIdx}`;
      return { ...prev, [key]: !prev[key] };
    });
  }

  function phaseProgress(phaseId: string, total: number) {
    let done = 0;
    for (let i = 0; i < total; i++) {
      if (checked[`${phaseId}-${i}`]) done++;
    }
    return Math.round((done / total) * 100);
  }

  const totalMilestones = PHASES.reduce((s, p) => s + p.milestones.length, 0);
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const globalProgress = totalMilestones > 0 ? Math.round((totalChecked / totalMilestones) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            Calendrier de Guerre <span className="text-[var(--color-gold)]">J-33 Mois</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Mars 2026 {"\u2192"} D{"\u00e9"}cembre 2028 {"\u2014"} 5 phases {"\u2014"} Objectif : {"\u00c9"}lections CTM
          </p>
          {/* ── Tab bar ── */}
          <div className="mt-4 flex gap-1 rounded-lg bg-[var(--color-surface)] p-1 border border-[var(--color-border-subtle)] w-fit">
            <Link href="/eveil" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-all">
              <Eye className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <Link href="/eveil/plans" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-all">
              <Target className="h-3.5 w-3.5" /> 20 Mesures
            </Link>
            <div className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-[var(--color-gold-glow)] text-[var(--color-gold)] shadow-sm">
              <Crown className="h-3.5 w-3.5" /> Calendrier
            </div>
          </div>
        </div>
        {hydrated && (
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-[var(--color-gold)]">{globalProgress}%</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{totalChecked}/{totalMilestones} jalons</div>
          </div>
        )}
      </div>

      {/* Global progress bar */}
      {hydrated && (
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${globalProgress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      )}

      {/* Timeline */}
      <div className="relative space-y-6">
        <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#6B7280] via-[#00B4D8] to-[#FF69B4]" />

        {PHASES.map((phase, i) => {
          const Icon = ICON_MAP[phase.icon] ?? Zap;
          const progress = phaseProgress(phase.id, phase.milestones.length);
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2"
                style={{ borderColor: phase.color, backgroundColor: `${phase.color}15` }}
              >
                <Icon className="h-5 w-5" style={{ color: phase.color }} />
              </div>

              {/* Phase card */}
              <div
                className="rounded-xl border p-5"
                style={{ borderColor: `${phase.color}30`, backgroundColor: `${phase.color}05` }}
              >
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold" style={{ color: phase.color }}>
                    {phase.name}
                  </h2>
                  <span className="rounded-full bg-[var(--color-surface-2)] px-3 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                    {phase.period}
                  </span>
                  {hydrated && (
                    <span className="ml-auto font-mono text-xs font-bold" style={{ color: phase.color }}>
                      {progress}%
                    </span>
                  )}
                </div>
                <p className="mb-3 text-sm text-[var(--color-text-muted)]">{phase.desc}</p>

                {/* Phase mini progress bar */}
                {hydrated && (
                  <div className="mb-3 h-1 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: phase.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                {/* Checkable milestones */}
                <div className="flex flex-wrap gap-2">
                  {phase.milestones.map((m, mIdx) => {
                    const key = `${phase.id}-${mIdx}`;
                    const isChecked = !!checked[key];
                    return (
                      <button
                        key={mIdx}
                        onClick={() => toggleTask(phase.id, mIdx)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all ${
                          isChecked
                            ? "bg-emerald-400/15 text-emerald-400 line-through"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-5 text-center">
        <Timer className="mx-auto mb-2 h-6 w-6 text-[var(--color-gold)]" />
        <p className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
          33 mois. 1 000 jours. C{"\u2019"}est plus qu{"\u2019"}il n{"\u2019"}en faut pour {"\u00e9"}veiller une {"\u00eele"}.
        </p>
      </div>
    </div>
  );
}
