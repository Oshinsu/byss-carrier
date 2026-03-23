"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Building2, FileText, Scale, Shield, Users, Briefcase,
  AlertTriangle, CheckCircle2, Clock, Euro, ChevronDown,
  Bot, Sparkles, Info, Send, Calendar, Landmark, Receipt,
  BookOpen, GraduationCap, Percent, ToggleLeft, ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Page SASU & Juridique
   Statuts, obligations, chatbot juridique, eligibilites
   ═══════════════════════════════════════════════════════ */

const COMPANY_INFO = [
  { label: "Forme juridique", value: "SASU (Societe par Actions Simplifiee Unipersonnelle)", icon: Building2 },
  { label: "NAF", value: "62.01Z (Programmation informatique)", icon: Briefcase },
  { label: "Fondee", value: "14 mars 2026", icon: Calendar },
  { label: "President", value: "Gary Bissol", icon: Users },
  { label: "Siege", value: "Fort-de-France, Martinique", icon: Landmark },
  { label: "Capital", value: "1 000 EUR", icon: Euro },
  { label: "TVA", value: "8.5% (Martinique)", icon: Percent },
];

interface SasuSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string;
}

const SASU_SECTIONS: SasuSection[] = [
  {
    id: "definition",
    title: "Qu'est-ce qu'une SASU ?",
    icon: Building2,
    content: `La **SASU** (Societe par Actions Simplifiee Unipersonnelle) est la forme juridique la plus utilisee par les entrepreneurs individuels en France. C'est une SAS avec un seul associe, combinant la protection du patrimoine personnel (responsabilite limitee aux apports) et une grande souplesse de fonctionnement.

**Avantages cles:**
- Responsabilite limitee au montant des apports (1 000 EUR pour BYSS GROUP)
- Liberte statutaire quasi-totale (pas de capital minimum, pas de commissaire aux comptes sous les seuils)
- Regime social protecteur: le president est assimile salarie (regime general de la Securite sociale)
- Credibilite vis-a-vis des clients, banques et partenaires (societe de capitaux)
- Facilite de transmission: cession d'actions simple, pas de formalites lourdes
- Possibilite d'accueillir de nouveaux associes sans changer de forme juridique (la SASU devient SAS)
- Pas d'obligation de nommer un commissaire aux comptes tant que 2 des 3 seuils suivants ne sont pas depasses: 4M EUR de bilan, 8M EUR de CA, 50 salaries

**Inconvenients:**
- Charges sociales plus elevees qu'en EURL/micro-entreprise (~65% vs ~45%)
- Comptabilite obligatoire (bilan, compte de resultat, annexe)
- Formalites de creation plus lourdes qu'une micro-entreprise (statuts, immatriculation RCS, publication JAL)`,
  },
  {
    id: "obligations-president",
    title: "Obligations du President",
    icon: Users,
    content: `En tant que President et associe unique de BYSS GROUP SAS, Gary Bissol assume les responsabilites suivantes:

**Declarations obligatoires:**
- Declaration de resultats (liasse fiscale 2065) avant le 2eme jour ouvre suivant le 1er mai
- Declarations de TVA mensuelles ou trimestrielles selon le regime choisi
- Declaration CFE (Cotisation Fonciere des Entreprises) — exoneree la 1ere annee
- Declaration DAS2 si honoraires verses > 1 200 EUR/an a un meme prestataire
- Declaration des beneficiaires effectifs (registre RBE) a la creation et a chaque modification

**Registres obligatoires:**
- Registre des decisions de l'associe unique (equivalent PV d'AG)
- Registre des mouvements de titres (en cas de cession d'actions)
- Livre des inventaires (bilan et compte de resultat annuels)

**Assemblee Generale:**
- L'associe unique prend seul les decisions qui relevent normalement de l'AG
- Decision annuelle obligatoire: approbation des comptes dans les 6 mois suivant la cloture de l'exercice
- Les decisions sont consignees dans un registre des decisions (pas de formalisme de convocation)
- Decisions extraordinaires: modification des statuts, augmentation de capital, dissolution`,
  },
  {
    id: "regime-fiscal",
    title: "Regime fiscal",
    icon: Scale,
    content: `**Impot sur les Societes (IS) — regime par defaut:**
- Taux reduit: **15%** sur les premiers 42 500 EUR de benefice (sous conditions: CA < 10M EUR, capital entierement libere, detenu a 75%+ par des personnes physiques)
- Taux normal: **25%** au-dela de 42 500 EUR de benefice
- La SASU paye l'IS sur ses benefices, puis le president paye l'IR sur ses remunerations et dividendes percus

**Option pour l'Impot sur le Revenu (IR):**
- Possible pendant les 5 premieres annees de la societe
- Peu avantageuse en general en SASU: les benefices sont imposes directement au bareme progressif de l'IR meme s'ils ne sont pas distribues
- Peut etre interessante si les benefices sont faibles et le taux marginal IR bas
- L'option est irrevocable pour la duree choisie (maximum 5 exercices)

**Dividendes:**
- Flat tax (PFU) de **30%** (12.8% IR + 17.2% prelevements sociaux)
- Option possible pour le bareme progressif de l'IR si plus avantageux
- En SASU, les dividendes ne sont PAS soumis a cotisations sociales (contrairement a l'EURL)
- Strategie classique d'optimisation: salaire minimal + dividendes en flat tax`,
  },
  {
    id: "regime-social",
    title: "Regime social",
    icon: Shield,
    content: `**President assimile salarie (regime par defaut en SASU):**
- Affiliation au regime general de la Securite sociale (memes droits qu'un salarie)
- Cotisations: environ **65%** du salaire brut (part patronale + salariale)
- Couverture: maladie, maternite, retraite de base + complementaire (AGIRC-ARRCO), invalidite, deces
- Pas de cotisations minimales si le president ne se verse aucune remuneration
- Bulletin de paie obligatoire si remuneration versee
- Pas d'assurance chomage (le president n'est pas salarie au sens du droit du travail)

**Comparaison avec le TNS (Travailleur Non Salarie — regime EURL):**
- TNS: cotisations ~45% mais couverture sociale inferieure (retraite moins favorable, pas de prevoyance automatique)
- Assimile salarie: cotisations ~65% mais meilleure couverture, pas de cotisations minimales si pas de remuneration
- Pour Gary qui demarre sans se remunerer immediatement, la SASU est avantageuse: zero cotisations sociales tant qu'aucun salaire n'est verse

**Optimisation premiere annee:**
- Ne pas se verser de salaire les premiers mois (zero charges)
- Couvrir les frais personnels via des notes de frais (deductibles pour la societe)
- Verser un premier salaire une fois le CA stabilise
- Complementer par des dividendes en fin d'exercice (flat tax 30% = moins cher que les cotisations sociales)`,
  },
  {
    id: "tva-martinique",
    title: "TVA Martinique",
    icon: Percent,
    content: `**Taux de TVA en Martinique (departement d'outre-mer):**
- Taux normal: **8.5%** (vs 20% en metropole)
- Taux reduit: **2.1%** (presse, medicaments, spectacles — vs 5.5% et 10% en metropole)
- Exoneration pour certaines operations specifiques aux DOM

**Avantage concurrentiel massif:**
- Un site web facture 5 000 EUR HT = 5 425 EUR TTC en Martinique vs 6 000 EUR TTC en metropole
- Pour un client metropolitain: BYSS GROUP facture avec TVA a 8.5%, le client peut deduire cette TVA normalement
- Marge supplementaire sur chaque prestation par rapport aux concurrents metropolitains

**Regime de TVA applicable:**
- Regime reel simplifie si CA < 254 000 EUR (prestations de services): acomptes semestriels + regularisation annuelle
- Regime reel normal au-dela: declarations et paiement mensuels
- Franchise en base de TVA possible si CA < 36 800 EUR (mais deconseille en B2B: pas de deduction de la TVA sur les achats)

**Particularites DOM:**
- La TVA n'est pas applicable aux echanges entre la Martinique et la metropole (assimilees a des exportations/importations pour la TVA)
- Les prestations de services numeriques intra-UE suivent les regles normales d'autoliquidation
- L'octroi de mer (taxe specifique DOM) ne s'applique pas aux prestations de services`,
  },
  {
    id: "obligations-comptables",
    title: "Obligations comptables",
    icon: FileText,
    content: `**Documents comptables obligatoires:**

**1. Bilan** — Photographie du patrimoine de la societe a la date de cloture.
- Actif: immobilisations (materiel informatique, logiciels), creances clients, tresorerie
- Passif: capital social, reserves, dettes fournisseurs, emprunts, resultat de l'exercice

**2. Compte de resultat** — Film de l'activite sur l'exercice.
- Produits: chiffre d'affaires, subventions, produits financiers
- Charges: achats, sous-traitance, loyers, salaires, charges sociales, amortissements, impots
- Resultat net = produits - charges

**3. Annexe** — Notes explicatives complementaires.
- Methodes comptables utilisees
- Detail des immobilisations et amortissements
- Etat des creances et dettes
- Engagements hors bilan
- La SASU peut etablir une annexe simplifiee si 2 des 3 seuils suivants ne sont pas depasses: 350K EUR de bilan, 700K EUR de CA, 10 salaries

**Obligations de depot:**
- Depot des comptes annuels au greffe du Tribunal de commerce dans les 6 mois suivant la cloture
- Option de confidentialite: les micro-entreprises et petites entreprises peuvent demander la non-publication du compte de resultat
- Cout du depot: environ 45 EUR en ligne via Infogreffe

**Expert-comptable:**
- Non obligatoire mais fortement recommande
- Budget: 150-250 EUR/mois pour une SASU de la taille de BYSS GROUP
- Missions: tenue comptable, declarations fiscales et sociales, conseil en optimisation`,
  },
  {
    id: "calendrier-fiscal",
    title: "Calendrier fiscal",
    icon: Calendar,
    content: `**Dates cles pour BYSS GROUP SAS (exercice du 1er janvier au 31 decembre):**

**Mensuel:**
- TVA (regime reel normal): declaration et paiement avant le 19-24 du mois suivant (selon departement et mode de paiement)
- Bulletin de paie du president (si remunere): etablissement et versement mensuel
- DSN (Declaration Sociale Nominative): avant le 5 ou le 15 du mois suivant selon effectif

**Trimestriel:**
- TVA (regime simplifie): acomptes en juillet et decembre, regularisation annuelle en mai
- Acomptes IS: 4 acomptes (15 mars, 15 juin, 15 septembre, 15 decembre) calcules sur le benefice de l'exercice precedent

**Annuel:**
- **Avant le 2eme jour ouvre apres le 1er mai:** Declaration de resultats IS (liasse fiscale 2065 + annexes)
- **Avant le 15 mai:** Solde IS (si l'IS total est superieur a la somme des 4 acomptes)
- **Avant le 30 juin:** Approbation des comptes par l'associe unique + depot au greffe
- **Avant le 31 decembre:** Paiement de la CFE (Cotisation Fonciere des Entreprises) — exoneree la 1ere annee
- **CVAE** (Cotisation sur la Valeur Ajoutee des Entreprises): applicable uniquement si CA > 500 000 EUR

**Premiere annee (2026):**
- Pas de CFE a payer (exoneration automatique la 1ere annee)
- Pas d'acomptes IS (aucun exercice precedent de reference)
- Declaration de debut d'activite: deja faite lors de l'immatriculation le 14 mars 2026
- Premier exercice: du 14 mars 2026 au 31 decembre 2026 (exercice inferieur a 12 mois)`,
  },
];

interface Eligibility {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "eligible" | "a_verifier" | "non_eligible" | "actif";
}

const INITIAL_ELIGIBILITIES: Eligibility[] = [
  {
    id: "jei",
    code: "JEI",
    name: "Jeune Entreprise Innovante",
    description: "Exoneration IS + charges sociales R&D. Conditions: < 8 ans, 15% charges R&D, PME.",
    status: "eligible",
  },
  {
    id: "cir",
    code: "CIR",
    name: "Credit d'Impot Recherche",
    description: "30% des depenses R&D. phi-engine, Orion, MCP France Travail = R&D pure.",
    status: "eligible",
  },
  {
    id: "cii",
    code: "CII",
    name: "Credit d'Impot Innovation",
    description: "20% des depenses innovation (plafond 400K EUR). Prototypes SaaS, installations pilotes.",
    status: "eligible",
  },
  {
    id: "acre",
    code: "ACRE",
    name: "Aide aux Createurs et Repreneurs",
    description: "Exoneration partielle charges sociales 12 mois. Demande URSSAF dans les 45 jours.",
    status: "a_verifier",
  },
  {
    id: "bpi",
    code: "BPI",
    name: "BPI France — Bourse French Tech",
    description: "Subvention jusqu'a 30 000 EUR pour projet innovant. Dossier a monter.",
    status: "a_verifier",
  },
];

const eligibilityStatusConfig = {
  eligible: { label: "Eligible", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  actif: { label: "Actif", color: "text-blue-400", bg: "bg-blue-500/10", icon: Sparkles },
  a_verifier: { label: "A verifier", color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertTriangle },
  non_eligible: { label: "Non eligible", color: "text-red-400", bg: "bg-red-500/10", icon: Info },
};

export default function SasuPage() {
  const [expandedId, setExpandedId] = useState<string | null>("definition");
  const [chatQuery, setChatQuery] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [eligibilities, setEligibilities] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("byss_sasu_eligibilities");
        if (saved) {
          const parsed = JSON.parse(saved) as Record<string, Eligibility["status"]>;
          return INITIAL_ELIGIBILITIES.map((e) => ({
            ...e,
            status: parsed[e.id] || e.status,
          }));
        }
      } catch { /* fallback to defaults */ }
    }
    return INITIAL_ELIGIBILITIES;
  });

  // Persist eligibility changes to localStorage
  useEffect(() => {
    const map: Record<string, string> = {};
    eligibilities.forEach((e) => { map[e.id] = e.status; });
    localStorage.setItem("byss_sasu_eligibilities", JSON.stringify(map));
  }, [eligibilities]);

  const handleChatSubmit = async () => {
    if (!chatQuery.trim()) return;
    setChatLoading(true);
    setChatResponse("");
    try {
      const contextMessage = `Contexte BYSS GROUP SAS:
- Forme: SASU, NAF 62.01Z, Fondee 14 mars 2026
- President: Gary Bissol, Siege: Fort-de-France, Martinique
- Capital: 1 000 EUR, TVA Martinique: 8.5%, Regime IS
- Eligible JEI, CIR, CII

En tant qu'assistant juridique SASU, reponds a cette question de maniere precise et structuree.
Cite les articles de loi pertinents. Termine par un avertissement que ces informations sont indicatives.

Question: ${chatQuery}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          data: {
            agent: "sorel",
            messages: [
              { role: "user", content: contextMessage },
            ],
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatResponse(data.result || "Sorel n'a pas pu generer de reponse. Reessaie.");
      } else {
        setChatResponse("Erreur de communication avec le Pont. Verifie la connexion API.");
      }
    } catch {
      setChatResponse("Le Pont ne repond pas. Verifie les cles API dans les parametres.");
    } finally {
      setChatLoading(false);
    }
  };

  const toggleEligibility = (id: string) => {
    setEligibilities((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const cycle: Eligibility["status"][] = ["a_verifier", "eligible", "actif", "non_eligible"];
        const currentIdx = cycle.indexOf(e.status);
        return { ...e, status: cycle[(currentIdx + 1) % cycle.length] };
      })
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          BYSS GROUP{" "}
          <span className="text-[var(--color-gold)]">SAS</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Statuts, obligations, fiscalite — Tout savoir sur votre SASU
        </p>
      </div>

      {/* Company info card */}
      <div className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]">
            <Building2 className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
              Fiche d&apos;identite
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">Informations legales</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMPANY_INFO.map((info) => {
            const InfoIcon = info.icon;
            return (
              <div
                key={info.label}
                className="flex items-start gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3"
              >
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                <div>
                  <div className="text-xs text-[var(--color-text-muted)]">{info.label}</div>
                  <div className="mt-0.5 text-sm font-medium text-[var(--color-text)]">
                    {info.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SASU Status explainer — accordion */}
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">
          Guide <span className="text-[var(--color-gold)]">SASU</span>
        </h2>
        <div className="space-y-3">
          {SASU_SECTIONS.map((sec, i) => {
            const isOpen = expandedId === sec.id;
            const SectionIcon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : sec.id)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[var(--color-gold-glow)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
                    <SectionIcon className="h-5 w-5 text-[var(--color-gold)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
                      {sec.title}
                    </h3>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-gold)] text-black">
                    <span className="font-[family-name:var(--font-clash-display)] text-xs font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-[var(--color-border-subtle)]"
                    >
                      <div className="p-6 text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line">
                        {sec.content.split("**").map((part, j) =>
                          j % 2 === 1 ? (
                            <strong key={j} className="text-[var(--color-text)] font-semibold">
                              {part}
                            </strong>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Chatbot Juridique */}
      <div className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-[var(--color-gold)]" />
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
            Chatbot Juridique
          </h2>
          <span className="rounded-full bg-[var(--color-gold)] px-2 py-0.5 text-[10px] font-bold text-black">
            BETA
          </span>
        </div>
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          Posez vos questions sur le droit des SASU, la fiscalite, les obligations comptables...
        </p>
        <div className="space-y-3">
          <textarea
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="Ex: Quelles sont les conditions pour beneficier du taux reduit d'IS a 15% ?"
            rows={3}
            className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleChatSubmit}
              disabled={chatLoading || !chatQuery.trim()}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-[var(--color-gold-glow)] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {chatLoading ? "Analyse en cours..." : "Poser la question"}
            </button>
          </div>
          <AnimatePresence>
            {chatResponse && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-[var(--color-gold)]" />
                  <span className="text-xs font-semibold text-[var(--color-gold)]">Sorel — Assistant Juridique</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line">
                  {chatResponse}
                </p>
                <p className="mt-3 text-[10px] italic text-[var(--color-text-muted)]">
                  Ces informations sont indicatives. Consultez un expert-comptable ou un avocat pour validation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Eligibilites checklist */}
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">
          Eligibilites &{" "}
          <span className="text-[var(--color-gold)]">Aides</span>
        </h2>
        <div className="space-y-2">
          {eligibilities.map((elig, i) => {
            const cfg = eligibilityStatusConfig[elig.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={elig.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
                  <span className="font-[family-name:var(--font-clash-display)] text-xs font-bold text-[var(--color-gold)]">
                    {elig.code}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">{elig.name}</h3>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-2">
                    {elig.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleEligibility(elig.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80",
                    cfg.bg,
                    cfg.color
                  )}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {cfg.label}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          Document genere par Sorel — Agent juridique BYSS GROUP.
          <br />
          <span className="italic text-[var(--color-gold-muted)]">
            Ces informations sont indicatives et ne constituent pas un conseil juridique.
            Consultez un expert-comptable ou un avocat specialise pour validation.
          </span>
        </p>
      </div>
    </div>
  );
}
