"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, Leaf, Palette, GraduationCap, Globe, Shield,
  ChevronDown, Clock, DollarSign, BookOpen, Scale, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   PROGRAMME D\u00c9TAILL\u00c9 — LES 20 MESURES BISSOL
   Chaque mesure chiffr\u00e9e, dat\u00e9e, assign\u00e9e
   Source : programme_detaille.md
   ═══════════════════════════════════════════════════════ */

const PILIERS = [
  { id: "numerique", label: "Num\u00e9rique", color: "#00D4FF", icon: Cpu, count: 5 },
  { id: "terre", label: "Terre", color: "#10B981", icon: Leaf, count: 4 },
  { id: "culture", label: "Culture", color: "#00B4D8", icon: Palette, count: 3 },
  { id: "jeunesse", label: "Jeunesse", color: "#8B5CF6", icon: GraduationCap, count: 4 },
  { id: "caraibe", label: "Cara\u00efbe", color: "#F59E0B", icon: Globe, count: 2 },
  { id: "transparence", label: "Transparence", color: "#06B6D4", icon: Shield, count: 2 },
];

interface Mesure {
  number: number;
  title: string;
  pilier: string;
  quoi: string;
  cout: string;
  financement: string;
  baseLegale: string;
  timeline: string;
  kpi: string;
  reference?: string;
  note?: string;
}

const MESURES: Mesure[] = [
  // ── NUM\u00c9RIQUE ──
  {
    number: 1,
    title: "Hub IA Cara\u00efbe",
    pilier: "numerique",
    quoi: "Centre de formation et d\u2019innovation IA au Lamentin",
    cout: "2-5M\u20ac (investissement initial) + 800K\u20ac/an",
    financement: "FEDER (70%), CTM (20%), priv\u00e9 (10%)",
    baseLegale: "Comp\u00e9tence CTM : d\u00e9veloppement \u00e9conomique + formation professionnelle",
    timeline: "Mois 6-18 (post-investiture)",
    kpi: "200 personnes form\u00e9es/an, 20 startups h\u00e9berg\u00e9es, 50 emplois cr\u00e9\u00e9s en 3 ans",
    reference: "BYSS GROUP + Orion comme proof of concept",
  },
  {
    number: 2,
    title: "Administration 100% num\u00e9rique",
    pilier: "numerique",
    quoi: "Chaque d\u00e9marche CTM en ligne en 24 mois",
    cout: "3-8M\u20ac (refonte SI, d\u00e9veloppement, formation agents)",
    financement: "France Relance / DINUM + budget CTM",
    baseLegale: "Comp\u00e9tence CTM : administration, am\u00e9nagement num\u00e9rique",
    timeline: "Mois 1-24",
    kpi: "100% des d\u00e9marches accessibles en ligne, temps moyen de traitement / 3",
    reference: "Estonie (99% des services publics en ligne)",
  },
  {
    number: 3,
    title: "Open data int\u00e9gral",
    pilier: "numerique",
    quoi: "Budget, march\u00e9s publics, d\u00e9lib\u00e9rations \u2014 tout en ligne, temps r\u00e9el",
    cout: "200-500K\u20ac (plateforme + maintenance)",
    financement: "Budget CTM (investissement minime vs impact)",
    baseLegale: "Loi R\u00e9publique num\u00e9rique 2016 (obligation open data collectivit\u00e9s > 3 500 hab.)",
    timeline: "Mois 1-6 (premier acte symbolique)",
    kpi: "100% des donn\u00e9es budg\u00e9taires publi\u00e9es, 10 000 consultations/mois",
  },
  {
    number: 4,
    title: "Incubateur de startups carib\u00e9en",
    pilier: "numerique",
    quoi: "50 entreprises accompagn\u00e9es/an, coworking, mentorat, acc\u00e8s financement",
    cout: "1-2M\u20ac/an",
    financement: "BPI France (50%), CTM (30%), partenaires priv\u00e9s (20%)",
    baseLegale: "Comp\u00e9tence CTM : d\u00e9veloppement \u00e9conomique",
    timeline: "Mois 12-24",
    kpi: "50 startups/an, 200 emplois cr\u00e9\u00e9s en 3 ans, 5 lev\u00e9es de fonds",
    reference: "Station F, Plug and Play, The Family",
  },
  {
    number: 5,
    title: "Formation code pour 1 000 jeunes/an",
    pilier: "numerique",
    quoi: "Bootcamps intensifs (3-6 mois), gratuits, certifiants",
    cout: "3-5M\u20ac/an (6 000\u20ac/formation \u00d7 500-800 jeunes)",
    financement: "CPF + R\u00e9gion (comp\u00e9tence formation pro) + Grande \u00c9cole du Num\u00e9rique",
    baseLegale: "Comp\u00e9tence CTM : formation professionnelle",
    timeline: "Mois 6, premi\u00e8re promotion",
    kpi: "1 000 form\u00e9s/an, 70% d\u2019insertion \u00e0 6 mois",
    reference: "42 (Paris), Le Wagon, OpenClassrooms",
  },
  // ── TERRE ──
  {
    number: 6,
    title: "Plan souverainet\u00e9 alimentaire",
    pilier: "terre",
    quoi: "Objectif 50% de production locale en 10 ans (vs ~20% actuellement)",
    cout: "5-10M\u20ac/an (aides aux agriculteurs, infrastructures, formation)",
    financement: "PAC (FEADER), POSEI, budget CTM",
    baseLegale: "Comp\u00e9tence CTM : am\u00e9nagement du territoire, d\u00e9veloppement rural",
    timeline: "Plan sur 10 ans, premi\u00e8res mesures mois 3",
    kpi: "% production locale (INSEE), nombre d\u2019exploitations actives, ha cultiv\u00e9s",
  },
  {
    number: 7,
    title: "Agence fonci\u00e8re CTM",
    pilier: "terre",
    quoi: "Rachat progressif de terres agricoles, bail \u00e0 jeunes agriculteurs",
    cout: "2-5M\u20ac/an (acquisition fonci\u00e8re)",
    financement: "Budget CTM + SAFER Martinique",
    baseLegale: "Comp\u00e9tence CTM : am\u00e9nagement foncier",
    timeline: "Mois 6 (cr\u00e9ation de l\u2019agence)",
    kpi: "Ha acquis/an, nombre de baux sign\u00e9s, jeunes install\u00e9s",
  },
  {
    number: 8,
    title: "Label \u00ab P\u00e9yi \u00bb",
    pilier: "terre",
    quoi: "Certification et promotion des produits 100% martiniquais",
    cout: "500K\u20ac/an (certification, marketing, contr\u00f4les)",
    financement: "CCI + CTM + cotisations producteurs",
    baseLegale: "Comp\u00e9tence CTM : d\u00e9veloppement \u00e9conomique",
    timeline: "Mois 12 (cahier des charges + premiers labellis\u00e9s)",
    kpi: "100 produits labellis\u00e9s en 2 ans, +20% ventes produits locaux en GMS",
  },
  {
    number: 9,
    title: "Plan chlord\u00e9cone 2.0",
    pilier: "terre",
    quoi: "Cartographie compl\u00e8te, d\u00e9pollution exp\u00e9rimentale, indemnisation victimes",
    cout: "10-20M\u20ac (cofinancement \u00c9tat obligatoire)",
    financement: "\u00c9tat (Plan chlord\u00e9cone IV) + CTM + fonds europ\u00e9ens",
    baseLegale: "Comp\u00e9tence sanitaire et environnementale",
    timeline: "Mois 1 (relance du sujet), mois 6 (plan d\u00e9taill\u00e9)",
    kpi: "% sols cartographi\u00e9s, nombre de familles indemnis\u00e9es, ha d\u00e9pollu\u00e9s",
    note: "Sujet br\u00fblant. L\u2019\u00c9tat a la responsabilit\u00e9 principale. La CTM a le levier politique.",
  },
  // ── CULTURE ──
  {
    number: 10,
    title: "Studio carib\u00e9en de production",
    pilier: "culture",
    quoi: "SOTAI comme mod\u00e8le, production audiovisuelle financ\u00e9e CTM",
    cout: "1-3M\u20ac/an",
    financement: "CTM (culture) + CNC Outre-Mer + fonds europ\u00e9ens",
    baseLegale: "Comp\u00e9tence CTM : culture",
    timeline: "Mois 12",
    kpi: "50 productions/an, 10 emplois permanents, 1 s\u00e9rie internationale",
    reference: "MOOSTIK (349K vues sans financement public)",
  },
  {
    number: 11,
    title: "Export culturel",
    pilier: "culture",
    quoi: "Dancehall, gastronomie, artisanat, cr\u00e9ole comme produits d\u2019exportation",
    cout: "1-2M\u20ac/an (salons, missions export, marketing)",
    financement: "Business France + CTM + CCI",
    baseLegale: "Comp\u00e9tence CTM : coop\u00e9ration r\u00e9gionale, d\u00e9veloppement \u00e9conomique",
    timeline: "Mois 6-12",
    kpi: "CA export culturel martiniquais (+30% en 3 ans)",
  },
  {
    number: 12,
    title: "Carnaval comme marque mondiale",
    pilier: "culture",
    quoi: "Professionnalisation, budget d\u00e9di\u00e9, diffusion internationale",
    cout: "2-3M\u20ac/an",
    financement: "CTM + sponsors priv\u00e9s + droits TV",
    baseLegale: "Comp\u00e9tence CTM : culture, tourisme",
    timeline: "Carnaval 2030 = premi\u00e8re \u00e9dition \u00ab nouvelle formule \u00bb",
    kpi: "Audience TV internationale, retomb\u00e9es touristiques, emplois cr\u00e9\u00e9s",
  },
  // ── JEUNESSE ──
  {
    number: 13,
    title: "Programme \u00ab Ret\u00e9 P\u00e9yi \u00bb",
    pilier: "jeunesse",
    quoi: "Aide logement + emploi garanti pour 18-30 ans qui restent ou reviennent",
    cout: "5-10M\u20ac/an",
    financement: "CTM + \u00c9tat (contrat de convergence)",
    baseLegale: "Comp\u00e9tence CTM : action sociale, logement, emploi",
    timeline: "Mois 6",
    kpi: "Solde migratoire 18-30 ans (inverser la tendance), nombre de b\u00e9n\u00e9ficiaires",
    note: "La Martinique perd 10 000 habitants par d\u00e9cennie. C\u2019est LA mesure existentielle.",
  },
  {
    number: 14,
    title: "Bourse L\u00e9opold Bissol",
    pilier: "jeunesse",
    quoi: "100 bourses/an pour \u00e9tudes sup\u00e9rieures, 2 ans de service en Martinique au retour",
    cout: "1-2M\u20ac/an (10-20K\u20ac/bourse)",
    financement: "CTM + m\u00e9c\u00e9nat priv\u00e9",
    baseLegale: "Comp\u00e9tence CTM : formation",
    timeline: "Premi\u00e8re promotion septembre 2030",
    kpi: "100 boursiers/an, 80% de retour, domaines couverts",
  },
  {
    number: 15,
    title: "Maisons de la jeunesse",
    pilier: "jeunesse",
    quoi: "1 espace/commune : num\u00e9rique, culture, sport, accompagnement",
    cout: "500K\u20ac/maison \u00d7 10 premi\u00e8res = 5M\u20ac",
    financement: "CPER + CTM + EPCI",
    baseLegale: "Comp\u00e9tence CTM : jeunesse, \u00e9ducation populaire",
    timeline: "10 maisons en 3 ans (communes prioritaires)",
    kpi: "Fr\u00e9quentation, activit\u00e9s propos\u00e9es, insertion",
  },
  {
    number: 16,
    title: "Service civique martiniquais",
    pilier: "jeunesse",
    quoi: "6 mois pour chaque jeune, pay\u00e9, utile, formateur",
    cout: "3-5M\u20ac/an (500 jeunes \u00d7 600\u20ac/mois \u00d7 6 mois)",
    financement: "Agence du Service Civique (80%) + CTM (20%)",
    baseLegale: "Cadre national du service civique + adaptation locale",
    timeline: "Mois 12",
    kpi: "500 jeunes/an, taux d\u2019insertion post-service",
  },
  // ── CARA\u00cfBE ──
  {
    number: 17,
    title: "Diplomatie carib\u00e9enne active",
    pilier: "caraibe",
    quoi: "Bureau CTM dans chaque \u00eele CARICOM",
    cout: "500K\u20ac/an (5 bureaux \u00d7 100K\u20ac)",
    financement: "CTM (coop\u00e9ration r\u00e9gionale)",
    baseLegale: "Art. 73 Constitution + comp\u00e9tence coop\u00e9ration r\u00e9gionale CTM",
    timeline: "Premier bureau (Sainte-Lucie ou Dominique) mois 12",
    kpi: "Accords sign\u00e9s, \u00e9changes commerciaux, \u00e9tudiants en mobilit\u00e9",
  },
  {
    number: 18,
    title: "\u00c9changes universitaires Cara\u00efbe",
    pilier: "caraibe",
    quoi: "Partenariats UWI, UTECH, Universidad de Puerto Rico",
    cout: "500K\u20ac/an (bourses mobilit\u00e9 + administration)",
    financement: "Erasmus+ (programme Cara\u00efbe) + CTM",
    baseLegale: "Comp\u00e9tence CTM : enseignement sup\u00e9rieur r\u00e9gional",
    timeline: "Premiers accords mois 12, premiers \u00e9tudiants rentr\u00e9e 2030",
    kpi: "50 \u00e9tudiants/an en mobilit\u00e9, 5 universit\u00e9s partenaires",
  },
  // ── TRANSPARENCE ──
  {
    number: 19,
    title: "Budget participatif citoyen",
    pilier: "transparence",
    quoi: "10% du budget d\u2019investissement CTM d\u00e9cid\u00e9 par vote citoyen en ligne",
    cout: "200K\u20ac (plateforme + animation citoyenne)",
    financement: "Budget CTM (l\u2019investissement EST le budget participatif)",
    baseLegale: "Art. L1612-15 CGCT (budget participatif autoris\u00e9 pour les collectivit\u00e9s)",
    timeline: "Premier cycle mois 6-12",
    kpi: "Participation citoyenne (% population), projets vot\u00e9s et r\u00e9alis\u00e9s",
    reference: "Paris (100M\u20ac/an de budget participatif)",
  },
  {
    number: 20,
    title: "Tableau de bord public",
    pilier: "transparence",
    quoi: "Indicateurs cl\u00e9s de la Martinique mis \u00e0 jour en temps r\u00e9el",
    cout: "100-200K\u20ac (d\u00e9veloppement) + 50K\u20ac/an (maintenance)",
    financement: "Budget CTM (marginal)",
    baseLegale: "Loi R\u00e9publique num\u00e9rique 2016",
    timeline: "Mois 1-3 (premier acte symbolique avec l\u2019open data)",
    kpi: "Nombre de consultations, couverture m\u00e9diatique, confiance citoyenne",
    note: "Byss Emploi + Orion = les outils pour construire ce dashboard",
  },
];

/* ═══════════════════════════════════════════════════════
   BUDGET TOTAL
   ═══════════════════════════════════════════════════════ */
const BUDGET_TABLE = [
  { cat: "Num\u00e9rique", invest: "~15M\u20ac", recurrent: "~10M\u20ac/an", color: "#00D4FF" },
  { cat: "Terre", invest: "~10M\u20ac", recurrent: "~15M\u20ac/an", color: "#10B981" },
  { cat: "Culture", invest: "~5M\u20ac", recurrent: "~5M\u20ac/an", color: "#00B4D8" },
  { cat: "Jeunesse", invest: "~7M\u20ac", recurrent: "~15M\u20ac/an", color: "#8B5CF6" },
  { cat: "Cara\u00efbe", invest: "~1M\u20ac", recurrent: "~1M\u20ac/an", color: "#F59E0B" },
  { cat: "Transparence", invest: "~0,5M\u20ac", recurrent: "~0,3M\u20ac/an", color: "#06B6D4" },
];

export default function PlansPage() {
  const [selectedPilier, setSelectedPilier] = useState<string | null>(null);
  const [expandedMesure, setExpandedMesure] = useState<number | null>(null);

  const filtered = selectedPilier
    ? MESURES.filter((m) => m.pilier === selectedPilier)
    : MESURES;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          Programme <span className="text-[var(--color-gold)]">{"\u00c9"}veil</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          20 mesures {"\u2014"} 6 piliers {"\u2014"} Budget an 1 : ~38M{"\u20ac"} {"\u2014"} R{"\u00e9"}current : ~46M{"\u20ac"}/an (~3% du budget CTM)
        </p>
      </div>

      {/* Piliers */}
      <div className="grid grid-cols-6 gap-3">
        {PILIERS.map((p) => {
          const PIcon = p.icon;
          const isSelected = selectedPilier === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPilier(isSelected ? null : p.id)}
              className={cn("rounded-xl border p-4 text-center transition-all", isSelected ? "border-opacity-100" : "border-[var(--color-border-subtle)]")}
              style={isSelected ? { borderColor: p.color, backgroundColor: `${p.color}08` } : undefined}
            >
              <PIcon className="mx-auto mb-1 h-5 w-5" style={{ color: p.color }} />
              <p className="text-xs font-bold" style={{ color: isSelected ? p.color : "var(--color-text)" }}>{p.label}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{p.count} mesures</p>
            </button>
          );
        })}
      </div>

      {/* Mesures List */}
      <div className="space-y-2">
        {filtered.map((m, i) => {
          const pilier = PILIERS.find((p) => p.id === m.pilier)!;
          const isExpanded = expandedMesure === m.number;
          return (
            <motion.div
              key={m.number}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="overflow-hidden rounded-lg border bg-[var(--color-surface)]"
              style={{ borderColor: "var(--color-border-subtle)", borderLeftColor: pilier.color, borderLeftWidth: "3px" }}
            >
              <button onClick={() => setExpandedMesure(isExpanded ? null : m.number)} className="flex w-full items-center gap-4 p-4 text-left">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold" style={{ backgroundColor: `${pilier.color}15`, color: pilier.color }}>
                  {m.number}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">{m.title}</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{m.quoi}</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{m.cout}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.timeline}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", isExpanded && "rotate-180")} />
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[var(--color-border-subtle)] px-4 py-3 grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <DollarSign className="h-3 w-3 text-[var(--color-gold)]" />
                          <span className="text-[10px] font-bold text-[var(--color-text)]">Co{"\u00fb"}t estim{"\u00e9"}</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)]">{m.cout}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <DollarSign className="h-3 w-3 text-[var(--color-gold)]" />
                          <span className="text-[10px] font-bold text-[var(--color-text)]">Financement</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)]">{m.financement}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Scale className="h-3 w-3 text-[var(--color-gold)]" />
                          <span className="text-[10px] font-bold text-[var(--color-text)]">Base l{"\u00e9"}gale</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)]">{m.baseLegale}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <BarChart3 className="h-3 w-3 text-[var(--color-gold)]" />
                          <span className="text-[10px] font-bold text-[var(--color-text)]">KPI</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)]">{m.kpi}</p>
                      </div>
                      {m.reference && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <BookOpen className="h-3 w-3 text-[var(--color-gold)]" />
                            <span className="text-[10px] font-bold text-[var(--color-text)]">R{"\u00e9"}f{"\u00e9"}rence</span>
                          </div>
                          <p className="text-[10px] text-[var(--color-text-muted)]">{m.reference}</p>
                        </div>
                      )}
                      {m.note && (
                        <div className="col-span-2 rounded-md bg-[oklch(0.75_0.12_85/0.06)] px-3 py-2">
                          <p className="text-[10px] font-medium italic text-[var(--color-gold)]">{m.note}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Budget Table */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
          Budget Total Estim{"\u00e9"}
        </h2>
        <div className="space-y-2">
          {BUDGET_TABLE.map((row) => (
            <div key={row.cat} className="flex items-center gap-3 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="w-28 font-medium text-[var(--color-text)]">{row.cat}</span>
              <span className="w-24 text-[var(--color-text-muted)]">Invest: {row.invest}</span>
              <span className="text-[var(--color-text-muted)]">R{"\u00e9"}current: {row.recurrent}</span>
            </div>
          ))}
          <div className="mt-3 border-t border-[var(--color-border-subtle)] pt-3 flex items-center gap-3 text-xs">
            <div className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
            <span className="w-28 font-bold text-[var(--color-gold)]">TOTAL</span>
            <span className="w-24 font-bold text-[var(--color-gold)]">~38M{"\u20ac"}</span>
            <span className="font-bold text-[var(--color-gold)]">~46M{"\u20ac"}/an</span>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">
          Budget CTM ~1,5Md{"\u20ac"}/an. 46M{"\u20ac"} = ~3% du budget. R{"\u00e9"}allocable sans augmentation d{"\u2019"}imp{"\u00f4"}t par red{"\u00e9"}ploiement des cr{"\u00e9"}dits et optimisation de la commande publique.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-5 text-center">
        <p className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
          20 mesures. Chaque euro trac{"\u00e9"}. Chaque mesure chiffr{"\u00e9"}e.
        </p>
        <p className="mt-1 text-xs italic text-[var(--color-text-muted)]">
          Le reste, c{"\u2019"}est de la langue de bois.
        </p>
      </div>
    </div>
  );
}
