"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { motion } from "motion/react";
import {
  Calculator,
  ChevronDown,
  FileDown,
  Check,
  Crown,
  Gem,
  Medal,
  Sparkles,
  TrendingUp,
  User,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/lib/store";
import { SkeletonCard, SkeletonKPI } from "@/components/ui/loading-skeleton";

/* ═══════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════ */
type Sector =
  | "Restaurant"
  | "Rhum"
  | "Hotel"
  | "Excursion"
  | "Telecoms"
  | "Plongee"
  | "Location"
  | "Institution";

type Tier = "essentiel" | "croissance" | "domination";

const SECTORS: Sector[] = [
  "Telecoms",
  "Rhum",
  "Hotel",
  "Excursion",
  "Restaurant",
  "Plongee",
  "Location",
  "Institution",
];

// Prospects fetched from Supabase (see useEffect below)

/* ── Pricing by sector ── */
const PRICING: Record<string, Record<Tier, number>> = {
  Restaurant: { essentiel: 3500, croissance: 8000, domination: 15000 },
  Rhum: { essentiel: 8000, croissance: 22000, domination: 79000 },
  Hotel: { essentiel: 12000, croissance: 45000, domination: 107000 },
  Excursion: { essentiel: 5000, croissance: 12000, domination: 24000 },
  Telecoms: { essentiel: 18000, croissance: 42000, domination: 135000 },
  _default: { essentiel: 5000, croissance: 15000, domination: 45000 },
};

/* ── Services by sector ── */
const SERVICES: Record<string, Record<Tier, string[]>> = {
  Restaurant: {
    essentiel: ["Video IA", "Google My Business"],
    croissance: ["Video IA", "Site web + réservation", "Google My Business", "WhatsApp bot"],
    domination: ["Video IA premium", "Site web + réservation", "Google My Business", "WhatsApp bot", "Meta Ads", "Newsletter", "Shooting photo"],
  },
  Rhum: {
    essentiel: ["Video héritage", "Newsletter"],
    croissance: ["Video héritage", "E-commerce Shopify", "Google Ads 5 marchés", "Newsletter"],
    domination: ["Video héritage premium", "E-commerce Shopify", "Google Ads 5 marchés", "Newsletter", "Meta Ads", "Stratégie export", "RP digitale"],
  },
  Hotel: {
    essentiel: ["Video tour", "Google Hotel Ads"],
    croissance: ["Chatbot concierge 4 langues", "Google Hotel Ads", "Video tour", "Guest app"],
    domination: ["Chatbot concierge 4 langues", "Google Hotel Ads", "Video tour", "Guest app", "Revenue management", "Meta Ads", "Booking optimization"],
  },
  Excursion: {
    essentiel: ["Video immersive", "Site booking"],
    croissance: ["Video immersive", "Site booking", "Google Ads", "WhatsApp 24/7"],
    domination: ["Video immersive premium", "Site booking", "Google Ads", "WhatsApp 24/7", "Meta Ads", "TripAdvisor management", "Influenceur strategy"],
  },
  Telecoms: {
    essentiel: ["3 vidéos/mois", "5 images/mois", "Google Ads"],
    croissance: ["6 vidéos/mois", "10-20 images/mois", "Meta + Google Ads", "Agent IA"],
    domination: ["12 vidéos/mois", "30 images/mois", "Meta + Google Ads", "Agent IA", "Stratégie omnicanale", "Dashboard analytics", "Community management"],
  },
  _default: {
    essentiel: ["Video IA", "Présence digitale"],
    croissance: ["Video IA", "Site web", "Google Ads", "Support dédié"],
    domination: ["Video IA premium", "Site web", "Google Ads", "Meta Ads", "Agent IA", "Stratégie complète", "Support prioritaire"],
  },
};

const ROI_MULTIPLIERS: Record<Tier, number> = {
  essentiel: 0.05,
  croissance: 0.15,
  domination: 0.30,
};

const TIER_META: Record<Tier, { label: string; icon: React.ElementType; badge?: string }> = {
  essentiel: { label: "Essentiel", icon: Medal },
  croissance: { label: "Croissance", icon: Crown, badge: "Recommandé" },
  domination: { label: "Domination", icon: Gem },
};

/* ═══════════════════════════════════════════════════════
   PRICING PAGE
   ═══════════════════════════════════════════════════════ */
export default function PricingPage() {
  const { add: notify } = useNotifications();
  const [, copy] = useCopyToClipboard();

  const [loading, setLoading] = useState(true);
  const [prospect, setProspect] = useState("");
  const [sector, setSector] = useState<Sector>("Restaurant");
  const [ca, setCa] = useState(500000);
  const [budgetPub, setBudgetPub] = useState(5000);
  const [tauxConversion, setTauxConversion] = useState(2);
  const [prospectOpen, setProspectOpen] = useState(false);
  const [prospectNames, setProspectNames] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("prospects").select("name").order("name").then(({ data }) => {
      setProspectNames(data?.map((p: { name: string }) => p.name) || []);
    }).finally(() => setLoading(false));
  }, []);

  const prices = useMemo(() => {
    return PRICING[sector] ?? PRICING._default;
  }, [sector]);

  const services = useMemo(() => {
    return SERVICES[sector] ?? SERVICES._default;
  }, [sector]);

  const calculateROI = (tier: Tier) => {
    const price = prices[tier];
    const revenueIncrease = ca * ROI_MULTIPLIERS[tier];
    return Math.round(((revenueIncrease - price) / price) * 100);
  };

  const [generating, setGenerating] = useState(false);
  const [proposalContent, setProposalContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    notify({
      type: "info",
      title: "Kaiou genere la proposition...",
      message: `Proposition pour ${prospect || "prospect"} — pack ${sector}`,
      duration: 3000,
    });
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_proposal",
          data: {
            name: prospect || "Prospect",
            company: prospect || "Entreprise",
            industry: sector,
            estimatedBudget: ca,
            needs: [sector],
            painPoints: [],
            interactions: [],
            status: "warm",
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProposalContent(data.result || null);
        notify({ type: "success", title: "Proposition generee!", message: "Contenu pret — scrollez vers le bas.", duration: 3000 });
      }
    } catch {
      notify({ type: "error", title: "Erreur", message: "Impossible de generer la proposition.", duration: 3000 });
    }
    setGenerating(false);
  };

  const tiers: Tier[] = ["essentiel", "croissance", "domination"];

  if (loading) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <SkeletonKPI />
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <SkeletonCard />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Heading ── */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-gold-glow)]">
          <Calculator className="h-6 w-6 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">
            Calculateur ROI
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Simulez le retour sur investissement et générez une proposition.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* ═══════════════════════════════════════════════
           LEFT PANEL — Input Form
           ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6"
        >
          {/* Prospect */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <User className="h-3.5 w-3.5" />
              Prospect
            </label>
            <div className="relative">
              <input
                type="text"
                value={prospect}
                onChange={(e) => setProspect(e.target.value)}
                onFocus={() => setProspectOpen(true)}
                onBlur={() => setTimeout(() => setProspectOpen(false), 150)}
                placeholder="Nom du prospect..."
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
              />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              {prospectOpen && (
                <div className="absolute left-0 top-full z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-1 shadow-xl">
                  {prospectNames.filter((p) =>
                    p.toLowerCase().includes(prospect.toLowerCase())
                  ).map((p) => (
                    <button
                      key={p}
                      onMouseDown={() => {
                        setProspect(p);
                        setProspectOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sector */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <Building2 className="h-3.5 w-3.5" />
              Secteur
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* CA Annuel */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <span>CA annuel client</span>
              <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">
                {ca.toLocaleString("fr-FR")} €
              </span>
            </label>
            <input
              type="range"
              min={50000}
              max={5000000}
              step={50000}
              value={ca}
              onChange={(e) => setCa(Number(e.target.value))}
              className="accent-[var(--color-gold)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>50K €</span>
              <span>5M €</span>
            </div>
          </div>

          {/* Budget Pub */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Budget pub actuel
            </label>
            <div className="relative">
              <input
                type="number"
                value={budgetPub}
                onChange={(e) => setBudgetPub(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 pr-8 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                €
              </span>
            </div>
          </div>

          {/* Taux de conversion */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Taux de conversion actuel
            </label>
            <div className="relative">
              <input
                type="number"
                value={tauxConversion}
                onChange={(e) => setTauxConversion(Number(e.target.value))}
                step={0.1}
                min={0}
                max={100}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 pr-8 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                %
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              Résumé prospect
            </div>
            <div className="mt-2 space-y-1 text-sm text-[var(--color-text)]">
              <p>
                <span className="text-[var(--color-text-muted)]">Prospect: </span>
                {prospect || "—"}
              </p>
              <p>
                <span className="text-[var(--color-text-muted)]">Secteur: </span>
                {sector}
              </p>
              <p>
                <span className="text-[var(--color-text-muted)]">CA: </span>
                {ca.toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
           RIGHT PANEL — Pricing Cards
           ═══════════════════════════════════════════════ */}
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const meta = TIER_META[tier];
            const Icon = meta.icon;
            const price = prices[tier];
            const roi = calculateROI(tier);
            const tierServices = services[tier];
            const isCroissance = tier === "croissance";
            const isDomination = tier === "domination";

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6 transition-all",
                  isCroissance
                    ? "border-[var(--color-gold)]/60 bg-gradient-to-b from-[var(--color-gold-glow)] to-[var(--color-surface)] shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)]"
                    : isDomination
                      ? "border-purple-500/30 bg-[var(--color-surface)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
                )}
              >
                {/* Badge */}
                {meta.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-bg)]">
                      {meta.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isCroissance
                        ? "bg-[var(--color-gold-glow)]"
                        : isDomination
                          ? "bg-purple-500/10"
                          : "bg-[var(--color-surface-2)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isCroissance
                          ? "text-[var(--color-gold)]"
                          : isDomination
                            ? "text-purple-400"
                            : "text-[var(--color-text-muted)]"
                      )}
                    />
                  </div>
                  <h3
                    className={cn(
                      "font-[family-name:var(--font-clash-display)] text-lg font-bold",
                      isCroissance
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-text)]"
                    )}
                  >
                    {meta.label}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <span className="font-[family-name:var(--font-clash-display)] text-3xl font-black text-[var(--color-text)]">
                    {price.toLocaleString("fr-FR")}
                  </span>
                  <span className="ml-1 text-sm text-[var(--color-text-muted)]">€</span>
                </div>

                {/* Services */}
                <ul className="mb-6 flex-1 space-y-2">
                  {tierServices.map((service) => (
                    <li key={service} className="flex items-start gap-2 text-sm">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isCroissance
                            ? "text-[var(--color-gold)]"
                            : isDomination
                              ? "text-purple-400"
                              : "text-emerald-500"
                        )}
                      />
                      <span className="text-[var(--color-text-muted)]">{service}</span>
                    </li>
                  ))}
                </ul>

                {/* ROI */}
                <div
                  className={cn(
                    "rounded-lg border p-3",
                    isCroissance
                      ? "border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-bg)]"
                  )}
                >
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    ROI estimé
                  </div>
                  <p
                    className={cn(
                      "mt-1 font-[family-name:var(--font-clash-display)] text-xl font-bold",
                      roi > 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {roi > 0 ? "+" : ""}
                    {roi}%
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                    +{(ca * ROI_MULTIPLIERS[tier]).toLocaleString("fr-FR")} € de CA estimé
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Generate Button ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-2"
      >
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-8 py-3.5 font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-bg)] shadow-lg shadow-[var(--color-gold)]/20 transition-all hover:shadow-xl hover:shadow-[var(--color-gold)]/30 disabled:opacity-50"
        >
          <FileDown className={cn("h-5 w-5 transition-transform group-hover:-translate-y-0.5", generating && "animate-spin")} />
          {generating ? "Kaiou genere..." : "Generer la Proposition IA"}
        </button>
      </motion.div>

      {/* Proposal content */}
      {proposalContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">
                Proposition generee par Kaiou
              </span>
            </div>
            <button
              onClick={() => copy(proposalContent)}
              className="rounded-lg border border-[var(--color-border-subtle)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Copier
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-muted)]">
            {proposalContent}
          </div>
        </motion.div>
      )}
    </div>
  );
}
