"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Landmark,
  Building2,
  Tv,
  Vote,
  Users,
  Eye,
  CheckSquare,
  Square,
  Sword,
  Target,
  Zap,
  ChevronDown,
  Cpu,
  Leaf,
  Palette,
  GraduationCap,
  Globe,
  Shield,
  Scroll,
  Crown,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
interface Mesure {
  id: string;
  number: number;
  text: string;
  is_validated: boolean;
}

interface LoreEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_name: string | null;
  color: string | null;
}

/* ═══════════════════════════════════════════════════════
   REAL CONTENT — Le Troisi\u00e8me Chemin (positionnement.md)
   ═══════════════════════════════════════════════════════ */
const DIAGNOSTIC = "La Martinique est gouvern\u00e9e par des gens qui g\u00e8rent un mod\u00e8le mort sans proposer de mod\u00e8le vivant.";

const ADVERSAIRES = [
  {
    name: "PPM / Letchimy",
    label: "Assimilationnisme progressiste",
    slogan: "\u00ab Nous sommes Fran\u00e7ais, profitons-en mieux \u00bb",
    bilan: "D\u00e9pendance aux transferts, exode des jeunes, vie ch\u00e8re, chlord\u00e9cone impuni. Bilan 2021-2028 : organigramme apr\u00e8s 8 ans, 40 homicides, cyberattaque, langue de bois.",
  },
  {
    name: "MIM / Marie-Jeanne",
    label: "Souverainisme sans plan",
    slogan: "\u00ab Nous voulons l\u2019ind\u00e9pendance \u00bb",
    bilan: "Aucun mod\u00e8le \u00e9conomique alternatif, aucune transition propos\u00e9e. Force : dignit\u00e9 du discours. Faiblesse : z\u00e9ro op\u00e9rationnalit\u00e9.",
  },
  {
    name: "Conconne",
    label: "Dissidence sans direction",
    slogan: "\u00ab Je suis contre tout le monde \u00bb",
    bilan: "Franc-parler mais pas de programme.",
  },
];

const PILIERS_DETAIL = [
  {
    id: "numerique",
    label: "Num\u00e9rique",
    icon: Cpu,
    color: "#00D4FF",
    description: "Hub IA Cara\u00efbe. Administration 100% en ligne. Open data int\u00e9gral. 1 000 jeunes form\u00e9s au code chaque ann\u00e9e. Incubateur de startups carib\u00e9en.",
    count: 5,
  },
  {
    id: "terre",
    label: "Terre",
    icon: Leaf,
    color: "#10B981",
    description: "Souverainet\u00e9 alimentaire 50% en 10 ans. Agence fonci\u00e8re CTM. Label P\u00e9yi. Plan chlord\u00e9cone 2.0 : cartographie, d\u00e9pollution, indemnisation.",
    count: 4,
  },
  {
    id: "culture",
    label: "Culture",
    icon: Palette,
    color: "#00B4D8",
    description: "Studio carib\u00e9en de production. Export culturel : dancehall, gastronomie, cr\u00e9ole. Carnaval comme marque mondiale.",
    count: 3,
  },
  {
    id: "jeunesse",
    label: "Jeunesse",
    icon: GraduationCap,
    color: "#8B5CF6",
    description: "Programme Ret\u00e9 P\u00e9yi : logement + emploi garanti 18-30 ans. Bourse L\u00e9opold Bissol. Maisons de la jeunesse. Service civique martiniquais.",
    count: 4,
  },
  {
    id: "caraibe",
    label: "Cara\u00efbe",
    icon: Globe,
    color: "#F59E0B",
    description: "Diplomatie carib\u00e9enne active : bureau CTM dans chaque \u00eele CARICOM. \u00c9changes universitaires Cara\u00efbe.",
    count: 2,
  },
  {
    id: "transparence",
    label: "Transparence",
    icon: Shield,
    color: "#06B6D4",
    description: "Budget participatif citoyen : 10% du budget d\u2019investissement CTM d\u00e9cid\u00e9 par vote en ligne. Tableau de bord public en temps r\u00e9el.",
    count: 2,
  },
];

/* ═══════════════════════════════════════════════════════
   REAL CONTENT — Vision Finale (trajectoire)
   ═══════════════════════════════════════════════════════ */
const TRAJECTOIRE = [
  { annee: "2026", phase: "Fondation", objectif: "BYSS GROUP. Digicel. MOOSTIK TV. Orion lanc\u00e9. Pipeline activ\u00e9." },
  { annee: "2027", phase: "Consolidation", objectif: "Orion 1 000 clients. BYSS GROUP 2M\u20ac+ ARR. An tan lontan diffus\u00e9. Nom Bissol install\u00e9." },
  { annee: "2028", phase: "Direction", objectif: "CTM. Le Troisi\u00e8me Chemin. La preuve : un homme qui FAIT au lieu de promettre." },
  { annee: "2029-2031", phase: "\u00c2ge d\u2019or", objectif: "Transformation territoriale. Martinique comme laboratoire. BYSS GROUP international." },
  { annee: "2032", phase: "Sommet", objectif: "Pr\u00e9sidence de la R\u00e9publique." },
];

/* ═══════════════════════════════════════════════════════
   REAL CONTENT — Manifeste
   ═══════════════════════════════════════════════════════ */
const MANIFESTE_PARAGRAPHS = [
  "Martinique. Tu perds tes enfants. 10 000 par d\u00e9cennie. Ils partent parce que tu ne leur donnes pas de raison de rester.",
  "Tu paies ton manger 40% plus cher que ceux qui te l\u2019envoient. Et quand tu demandes pourquoi, on te r\u00e9pond avec des tableaux.",
  "Tu enterres 40 des tiens par balles en un an. Et ceux qui te gouvernent appellent \u00e7a \u00ab des tensions \u00bb.",
  "Tu as \u00e9t\u00e9 empoisonn\u00e9e au chlord\u00e9cone. Et quand tu as demand\u00e9 justice, on t\u2019a r\u00e9pondu \u00ab prescription \u00bb.",
  "Tu es gouvern\u00e9e par des hommes de 70 et 80 ans qui g\u00e8rent un mod\u00e8le mort sans proposer de mod\u00e8le vivant. Tu m\u00e9rites mieux.",
];

const MANIFESTE_CLOSING = [
  "Il y a 80 ans, un homme nomm\u00e9 L\u00e9opold Bissol marchait du nord au sud de cette \u00eele pour \u00e9veiller ceux qui dormaient. Orphelin. Noir. Sans p\u00e8re. Sans dipl\u00f4me. \u00c9b\u00e9niste. Syndicaliste. R\u00e9sistant. D\u00e9put\u00e9.",
  "Aujourd\u2019hui, son arri\u00e8re-petit-fils te dit : le temps de l\u2019\u00e9veil est revenu. Pas un \u00e9veil de col\u00e8re \u2014 un \u00e9veil de puissance.",
  "Nous ne sommes pas le PPM. Nous ne sommes pas le MIM. Nous sommes le troisi\u00e8me chemin.",
  "Notre nom : L\u2019\u00c9veil. Notre m\u00e9thode : le num\u00e9rique, la terre, la culture, la jeunesse, la Cara\u00efbe. Notre promesse : pas changer le statut \u2014 changer le mod\u00e8le.",
];

/* ═══════════════════════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════════════════════ */
const CARTOGRAPHIES = [
  { name: "\u00c9conomique", icon: Building2, entries: 47, color: "var(--color-gold)" },
  { name: "Institutionnelle", icon: Landmark, entries: 23, color: "var(--color-blue)" },
  { name: "M\u00e9dia", icon: Tv, entries: 15, color: "var(--color-amber)" },
  { name: "Politique", icon: Vote, entries: 31, color: "var(--color-fire)" },
  { name: "Sociale", icon: Users, entries: 19, color: "var(--color-green)" },
];

const PLAN_ICONS: Record<string, React.ElementType> = {
  Target: Target,
  Zap: Zap,
  Sword: Sword,
};

const DEFAULT_PLANS = [
  { name: "Moostik", desc: "Plateforme citoyenne. D\u00e9mocratie participative. Vote. Transparence.", icon: Target, color: "var(--color-gold)" },
  { name: "Orion", desc: "SaaS IA pour PME. CRM intelligent. Automatisation. Revenue engine.", icon: Zap, color: "var(--color-blue)" },
  { name: "Random", desc: "Op\u00e9rations d\u2019influence. M\u00e9dias. Communication strat\u00e9gique.", icon: Sword, color: "var(--color-fire)" },
];

/* ═══════════════════════════════════════════════════════
   EVEIL PAGE
   ═══════════════════════════════════════════════════════ */
export default function EveilPage() {
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [plansGuerre, setPlansGuerre] = useState<LoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [manifesteOpen, setManifesteOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      try {
        const [mesuresRes, loreRes] = await Promise.all([
          supabase.from("eveil_mesures").select("*").order("number"),
          supabase.from("lore_entries").select("*").eq("category", "plan_guerre"),
        ]);

        if (mesuresRes.data) {
          setMesures(mesuresRes.data as Mesure[]);
        }
        if (loreRes.data) {
          setPlansGuerre(loreRes.data as LoreEntry[]);
        }
      } catch (err) {
        console.error("Eveil fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleMesure = async (id: string, currentState: boolean) => {
    setMesures((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_validated: !currentState } : m))
    );
    const supabase = createClient();
    const { error } = await supabase.from("eveil_mesures").update({ is_validated: !currentState }).eq("id", id);
    if (error) {
      toast("Erreur: " + error.message, "error");
      // revert optimistic update
      setMesures((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_validated: currentState } : m))
      );
      return;
    }
    toast(currentState ? "Mesure réactivée" : "Mesure validée", "success");
  };

  const completedCount = mesures.filter((m) => m.is_validated).length;
  const totalMesures = mesures.length || 20;

  const plans = plansGuerre.length > 0
    ? plansGuerre.map((p) => ({
        name: p.name,
        desc: p.description,
        icon: PLAN_ICONS[p.icon_name || ""] || Target,
        color: p.color || "var(--color-gold)",
      }))
    : DEFAULT_PLANS;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <PageHeader
          title="Operation"
          titleAccent="Eveil"
          subtitle={`33 mois. ${totalMesures} mesures. 38M EUR. Le Troisi\u00e8me Chemin.`}
        />
      </div>

      <div className="flex-1 space-y-6 p-6">

        {/* ═══════════════════════════════════════════════════
           LE DIAGNOSTIC — Le Troisi\u00e8me Chemin
           ═══════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Flame className="h-5 w-5 text-[var(--color-gold)]" />
            <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
              Le Troisi{"\u00e8"}me Chemin
            </h2>
          </div>
          <p className="mb-4 text-sm font-medium italic text-[var(--color-gold)]">
            {DIAGNOSTIC}
          </p>

          {/* Adversaires */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {ADVERSAIRES.map((a) => (
              <div key={a.name} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3">
                <h4 className="text-xs font-bold text-[var(--color-fire)]">{a.name}</h4>
                <p className="text-[10px] font-medium text-[var(--color-text-muted)]">{a.label}</p>
                <p className="mt-1 text-[10px] italic text-[var(--color-text-muted)]">{a.slogan}</p>
                <p className="mt-2 text-[10px] leading-relaxed text-[var(--color-text-muted)]">{a.bilan}</p>
              </div>
            ))}
          </div>

          {/* Souverainet\u00e9 fonctionnelle */}
          <div className="rounded-lg border border-[var(--color-gold-muted)] bg-[oklch(0.75_0.12_85/0.04)] p-4">
            <h3 className="mb-2 text-xs font-bold text-[var(--color-gold)]">Souverainet{"\u00e9"} fonctionnelle</h3>
            <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              Pas changer le statut. Changer le mod{"\u00e8"}le. Utiliser chaque comp{"\u00e9"}tence CTM au maximum de sa puissance.
              La CTM a les comp{"\u00e9"}tences d{"\u2019"}un d{"\u00e9"}partement + une r{"\u00e9"}gion : d{"\u00e9"}veloppement {"\u00e9"}conomique, {"\u00e9"}ducation,
              transport, sanitaire, coop{"\u00e9"}ration r{"\u00e9"}gionale, am{"\u00e9"}nagement, culture.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              Avec ces comp{"\u00e9"}tences, on peut transformer l{"\u2019"}{"\u00eele"} SANS changer de statut. Et si le mod{"\u00e8"}le marche, la question du statut se posera d{"\u2019"}elle-m{"\u00ea"}me {"\u2014"} non pas comme un acte de rupture mais comme une cons{"\u00e9"}quence logique de la puissance acquise.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
           LES 6 PILIERS (from positionnement.md)
           ═══════════════════════════════════════════════════ */}
        <div>
          <h2 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            Les 6 Piliers
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PILIERS_DETAIL.map((pilier, i) => {
              const Icon = pilier.icon;
              return (
                <motion.div
                  key={pilier.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${pilier.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: pilier.color }} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold" style={{ color: pilier.color }}>{pilier.label}</h3>
                      <span className="text-[10px] text-[var(--color-text-muted)]">{pilier.count} mesures</span>
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed text-[var(--color-text-muted)]">
                    {pilier.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
           MANIFESTE (expandable, from manifeste.md)
           ═══════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
          <button
            onClick={() => setManifesteOpen(!manifesteOpen)}
            className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="flex items-center gap-3">
              <Scroll className="h-5 w-5 text-[var(--color-gold)]" />
              <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
                Manifeste {"\u2014"} L{"\u2019"}{"\u00c9"}veil de la Martinique
              </h2>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", manifesteOpen && "rotate-180")} />
          </button>
          <AnimatePresence>
            {manifesteOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 border-t border-[var(--color-border-subtle)] px-6 py-5">
                  {/* Opening paragraphs */}
                  <div className="space-y-3">
                    {MANIFESTE_PARAGRAPHS.map((p, i) => (
                      <p key={i} className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="h-px bg-[var(--color-border-subtle)]" />

                  {/* Closing paragraphs */}
                  <div className="space-y-3">
                    {MANIFESTE_CLOSING.map((p, i) => (
                      <p key={i} className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Signature */}
                  <div className="mt-4 rounded-lg border border-[var(--color-gold-muted)] bg-[oklch(0.75_0.12_85/0.04)] p-4 text-center">
                    <p className="text-xs font-semibold text-[var(--color-gold)]">Martinique. L{"\u00e9"}v{"\u00e9"}.</p>
                    <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                      Gary Bissol {"\u2014"} Arri{"\u00e8"}re-petit-fils de L{"\u00e9"}opold {"\u2014"} Fondateur de L{"\u2019"}{"\u00c9"}veil
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════
           VISION — Trajectoire CTM 2028 → Pr\u00e9sidence 2032
           ═══════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Crown className="h-5 w-5 text-[var(--color-gold)]" />
            <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
              Trajectoire {"\u2014"} CTM 2028 {"\u2192"} Pr{"\u00e9"}sidence 2032
            </h2>
          </div>
          <div className="relative ml-4">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[#6B7280] via-[#00B4D8] to-[#FF69B4]" />
            {TRAJECTOIRE.map((t, i) => (
              <motion.div
                key={t.annee}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative mb-6 pl-10 last:mb-0"
              >
                <div
                  className={cn(
                    "absolute left-1 top-1 h-5 w-5 rounded-full border-2",
                    i === 0
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)]"
                  )}
                  style={i === 0 ? { boxShadow: "0 0 12px oklch(0.75 0.12 85 / 0.4)" } : undefined}
                />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[var(--color-gold)]">{t.annee}</span>
                    <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                      {t.phase}
                    </span>
                    {i === 0 && (
                      <span className="rounded-full bg-[oklch(0.75_0.12_85/0.15)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-gold)]">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t.objectif}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Cartographies ── */}
        <div>
          <h2 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            Cartographies
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {CARTOGRAPHIES.map((carto, i) => {
              const Icon = carto.icon;
              return (
                <motion.div
                  key={carto.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center"
                >
                  <div
                    className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${carto.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: carto.color }} />
                  </div>
                  <h3 className="text-xs font-semibold text-[var(--color-text)]">{carto.name}</h3>
                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                    {carto.entries} entr{"\u00e9"}es
                  </p>
                  <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-[var(--color-surface-2)] py-1.5 text-[10px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]">
                    <Eye className="h-3 w-3" />
                    Voir
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Programme 20 mesures (from Supabase) ── */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
              Programme &mdash; {totalMesures} Mesures
            </h2>
            <span className="text-xs text-[var(--color-text-muted)]">
              {completedCount}/{totalMesures} valid{"\u00e9"}es
            </span>
          </div>
          <div className="h-1.5 mb-4 rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--color-gold)] transition-all"
              style={{
                width: `${(completedCount / totalMesures) * 100}%`,
                boxShadow: "0 0 8px oklch(0.75 0.12 85 / 0.3)",
              }}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2 rounded-md px-2 py-1.5">
                  <div className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-[var(--color-surface-2)]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-2)]" />
                </div>
              ))}
            </div>
          ) : mesures.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">
              Aucune mesure trouv{"\u00e9"}e
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {mesures.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMesure(m.id, m.is_validated)}
                  className="flex items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  {m.is_validated ? (
                    <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                  ) : (
                    <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                  )}
                  <span
                    className={cn(
                      "text-[11px] leading-tight",
                      m.is_validated
                        ? "text-[var(--color-text)] line-through decoration-[var(--color-gold-muted)]"
                        : "text-[var(--color-text-muted)]"
                    )}
                  >
                    <span className="font-semibold text-[var(--color-gold)]">{m.number}.</span>{" "}
                    {m.text}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Plans de guerre (from Supabase lore_entries or fallback) ── */}
        <div>
          <h2 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            Plans de Guerre
          </h2>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
                  <div className="mb-3 h-10 w-10 rounded-lg bg-[var(--color-surface-2)]" />
                  <div className="mb-2 h-5 w-24 rounded bg-[var(--color-surface-2)]" />
                  <div className="h-8 w-full rounded bg-[var(--color-surface-2)]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan, i) => {
                const Icon = plan.icon;
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group cursor-pointer rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-gold-muted)] hover:shadow-[var(--shadow-gold)]"
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${plan.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: plan.color }} />
                    </div>
                    <h3
                      className="mb-1 font-[family-name:var(--font-clash-display)] text-lg font-bold"
                      style={{ color: plan.color }}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                      {plan.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer quote ── */}
        <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-5 text-center">
          <p className="font-[family-name:var(--font-clash-display)] text-sm font-bold italic text-[var(--color-gold)]">
            {"\u00ab"} Le troisi{"\u00e8"}me chemin n{"\u2019"}est pas entre les deux autres. Il est au-dessus. {"\u00bb"}
          </p>
        </div>
      </div>
    </div>
  );
}
