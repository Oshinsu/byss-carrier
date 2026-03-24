"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clapperboard, Eye, Film, Tv, CalendarDays, ChevronDown, Sparkles, Brain, Layers, Check, ExternalLink } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   MOOSTIK — Scene Generator by BLOODWINGSStudio
   Real data extracted from moostik.vercel.app — 22/03/2026
   Primary: #0b0b0e, Cards: #18181b, Borders: #27272a, Text: #fafafa
   ═══════════════════════════════════════════════════════ */

const SITE_URL = "https://moostik.vercel.app";
const EXTRACTION_DATE = "22/03/2026";

function Tooltip({ label, source }: { label: string; source?: string }) {
  return (
    <div className="pointer-events-none absolute -top-20 left-1/2 z-50 w-56 -translate-x-1/2 rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] p-3 text-xs opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
      <p className="mb-1 text-[var(--color-text)]">{label}</p>
      <p className="text-[9px] text-[var(--color-text-muted)]">Extrait de {source ?? SITE_URL} le {EXTRACTION_DATE}</p>
    </div>
  );
}

const REAL_STATS = [
  { label: "Vues teaser Instagram", value: "349K", icon: Eye, tooltip: "349 183 vues sur le teaser poste le 16 janvier 2026. 11 486 likes, 876 saves, 1 611 nouveaux followers." },
  { label: "Diffuseur interesse", value: "M1ere", icon: Tv, tooltip: "Martinique 1ere (France TV) interesse pour diffusion broadcast. BIXA (DAC Fort-de-France) partenaire institutionnel." },
  { label: "Voix confirmee", value: "Evil P", icon: Sparkles, tooltip: "Evil Pichon (Evil Tik) confirme comme voix principale. Adoubement culturel martiniquais." },
  { label: "Revenu estime an 1", value: "30-80K", icon: Layers, tooltip: "30 000 a 80 000 EUR an 1 : droits M1ere (1-3K/ep), YouTube AdSense, sponsoring Digicel (5-15K/saison), merchandising, CTM." },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: "0",
    period: "/mois",
    images: "20 images",
    videos: "5 videos",
    features: ["Signal extraction basique", "Export 720p", "Watermark"],
    highlight: false,
  },
  {
    name: "Creator",
    price: "129",
    period: "/mois",
    images: "100 images",
    videos: "30 videos",
    features: ["11 types de signaux", "Export 1080p", "Sans watermark", "Priority render"],
    highlight: false,
  },
  {
    name: "Studio",
    price: "349",
    period: "/mois",
    images: "500 images",
    videos: "150 videos",
    features: ["Reality Bleed Protocol", "Export 4K", "EDL export", "API access", "Team (3 seats)"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "1 499",
    period: "/mois",
    images: "5 000 images",
    videos: "2 000 videos",
    features: ["Full consciousness levels", "Custom pipeline", "Dedicated GPU", "SLA 99.9%", "Unlimited seats"],
    highlight: false,
  },
];

const EPISODES_DATA: Record<number, Array<{ title: string; duration: string; status: string }>> = {
  1: [
    { title: "Ep 1 — Premiere rencontre", duration: "3:45", status: "done" },
    { title: "Ep 2 — Le marche", duration: "4:10", status: "done" },
    { title: "Ep 3 — La fete", duration: "3:30", status: "done" },
    { title: "Ep 4 — Tempete", duration: "4:00", status: "done" },
    { title: "Ep 5 — Retrouvailles", duration: "5:15", status: "done" },
  ],
  2: [
    { title: "Ep 6 — Nouveau depart", duration: "4:20", status: "done" },
    { title: "Ep 7 — Le secret", duration: "3:55", status: "done" },
    { title: "Ep 8 — La course", duration: "4:30", status: "done" },
    { title: "Ep 9 — Trahison", duration: "4:15", status: "done" },
    { title: "Ep 10 — Redemption", duration: "5:40", status: "done" },
  ],
  3: [
    { title: "Ep 11 — Renaissance", duration: "4:00", status: "in_progress" },
    { title: "Ep 12 — Les ombres", duration: "4:30", status: "planned" },
    { title: "Ep 13 — Alliance", duration: "4:15", status: "planned" },
    { title: "Ep 14 — La quete", duration: "4:45", status: "planned" },
    { title: "Ep 15 — Apotheose", duration: "5:00", status: "planned" },
  ],
  4: [],
};

const SEASONS = [
  { id: 1, title: "Saison 1", episodes: 5, status: "Diffusee" },
  { id: 2, title: "Saison 2", episodes: 5, status: "Diffusee" },
  { id: 3, title: "Saison 3", episodes: 5, status: "En production" },
  { id: 4, title: "Saison 4", episodes: 0, status: "Planifiee" },
];

const STATUS_COLORS: Record<string, string> = {
  Diffusee: "bg-emerald-400/10 text-emerald-400",
  "En production": "bg-amber-400/10 text-amber-400",
  Planifiee: "bg-blue-400/10 text-blue-400",
};

const EP_STATUS_CYCLE = ["planned", "in_progress", "done"] as const;
type EpStatus = (typeof EP_STATUS_CYCLE)[number];

function cycleEpStatus(s: EpStatus): EpStatus {
  return EP_STATUS_CYCLE[(EP_STATUS_CYCLE.indexOf(s) + 1) % EP_STATUS_CYCLE.length];
}

function epStatusStyle(s: EpStatus) {
  if (s === "done") return { bg: "#10B98120", color: "#10B981", label: "done" };
  if (s === "in_progress") return { bg: "#22D3EE20", color: "#22D3EE", label: "in progress" };
  return { bg: "#6B728020", color: "#6B7280", label: "planned" };
}

interface State {
  episodes: Record<string, EpStatus>;
}

function buildDefaultState(): State {
  const episodes: Record<string, EpStatus> = {};
  for (const [seasonId, eps] of Object.entries(EPISODES_DATA)) {
    eps.forEach((ep) => {
      episodes[`S${seasonId}-${ep.title}`] = ep.status as EpStatus;
    });
  }
  return { episodes };
}

export default function MoostikPage() {
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [state, setState, loaded] = useLocalStorage<State>(STORAGE_KEYS.MOOSTIK_MILESTONES, buildDefaultState());

  const toggleEpStatus = (seasonId: number, epTitle: string) => {
    const key = `S${seasonId}-${epTitle}`;
    const current = state.episodes[key] ?? "planned";
    setState({ ...state, episodes: { ...state.episodes, [key]: cycleEpStatus(current) } });
  };

  const allEps = Object.values(state.episodes);
  const doneCount = allEps.filter((s) => s === "done").length;
  const pct = allEps.length > 0 ? Math.round((doneCount / allEps.length) * 100) : 0;

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      {/* Header with tagline */}
      <div className="overflow-hidden rounded-xl" style={{ backgroundColor: "#0b0b0e" }}>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "#18181b" }}>
                <Clapperboard className="h-5 w-5" style={{ color: "#fafafa" }} />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold" style={{ color: "#fafafa" }}>
                  MOOSTIK
                </h1>
                <p className="text-[11px] italic" style={{ color: "#a1a1aa" }}>
                  Le contenu n&apos;est pas genere. Il emerge.
                </p>
                <p className="text-[10px] tracking-[0.15em]" style={{ color: "#71717a" }}>
                  Scene Generator par BLOODWINGSStudio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full px-3 py-1 text-[10px] font-semibold" style={{ backgroundColor: "#10B98120", color: "#10B981" }}>
                <Tv className="mr-1 inline h-3 w-3" />
                En diffusion TV
              </span>
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all hover:bg-white/10"
                style={{ borderColor: "#27272a", color: "#fafafa" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visiter le site
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {REAL_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3"
          >
            <Tooltip label={s.tooltip} />
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-gold-glow)]">
              <s.icon className="h-4 w-4 text-[var(--color-gold)]" />
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-[var(--color-text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Production globale</span>
          <span className="font-mono text-sm font-bold text-[var(--color-gold)]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-cyan)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{doneCount}/{allEps.length} episodes completed</p>
      </div>

      {/* Pricing Section */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Tarification
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`group relative rounded-lg border p-4 ${
                tier.highlight
                  ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
              }`}
            >
              <Tooltip label={`${tier.name}: ${tier.images} + ${tier.videos} par mois`} />
              {tier.highlight && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-gold)] px-3 py-0.5 text-[8px] font-bold uppercase text-black">
                  Populaire
                </span>
              )}
              <p className="text-xs font-bold text-[var(--color-text)]">{tier.name}</p>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="font-mono text-2xl font-bold text-[var(--color-text)]">{tier.price}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">{tier.period}</span>
              </div>
              <div className="mt-2 space-y-0.5 text-[10px] text-[var(--color-text-muted)]">
                <p>{tier.images}</p>
                <p>{tier.videos}</p>
              </div>
              <div className="mt-3 space-y-1 border-t border-[var(--color-border-subtle)] pt-3">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-[9px] text-[var(--color-text-secondary)]">
                    <Check className="h-2.5 w-2.5 text-emerald-400" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Description — War Plan Data */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Cheval de Troie culturel de l&apos;arsenal BYSS GROUP. 349 183 vues, 11 486 likes, 876 saves
          sur un seul teaser. Martinique 1ere veut diffuser. Evil P (Evil Tik) confirme comme voix.
          BIXA (DAC Fort-de-France) partenaire institutionnel. Classification SS.
        </p>
        <div className="mt-4 space-y-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-gold)]">Plan de guerre — 4 phases</h3>
          {[
            { phase: "Phase 0", label: "Premier episode", desc: "Sortir S1E1 (3-5 min). Integrer la voix d'Evil P. Objectif : 100K vues en 7 jours.", timing: "J0 → J+14" },
            { phase: "Phase 1", label: "Regularite", desc: "6 episodes sortis. 1 ep / 2 semaines = 26 ep/an. Production : Gary + SOTAI (Rony, Stephane, Thomas). Outils : Kling, Seedance, NBP, Suno.", timing: "J+14 → J+90" },
            { phase: "Phase 2", label: "Diffusion broadcast", desc: "MOOSTIK sur Martinique 1ere. Format 5 min, case jeunesse ou access prime. YouTube + TikTok + podcast audio en parallele.", timing: "J+90 → J+180" },
            { phase: "Phase 3", label: "Franchise", desc: "Merchandising (t-shirts Evil Tik, figurines), jeu mobile, partenariats (Digicel, Air Caraibes), extension regionale, Festival MOOSTIK a Fort-de-France.", timing: "J+180 → J+365" },
          ].map((p) => (
            <div key={p.phase} className="flex items-start gap-3 rounded-md bg-[var(--color-surface-2)]/50 px-3 py-2">
              <span className="mt-0.5 shrink-0 rounded bg-[var(--color-gold-glow)] px-2 py-0.5 font-mono text-[9px] font-bold text-[var(--color-gold)]">{p.phase}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-[var(--color-text)]">{p.label}</span>
                  <span className="text-[9px] text-[var(--color-text-muted)]">{p.timing}</span>
                </div>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--color-text-muted)]">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]/30 p-3">
          <h4 className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Modele economique</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-[var(--color-text-secondary)]">
            <div>Droits Martinique 1ere: 1 000-3 000 EUR/ep</div>
            <div>YouTube AdSense: 500-2 000 EUR/mois</div>
            <div>Sponsoring Digicel: 5 000-15 000 EUR/saison</div>
            <div>Merchandising: 2 000-5 000 EUR/mois</div>
            <div>Production financee CTM: 10-30K EUR/saison</div>
            <div className="font-semibold text-[var(--color-gold)]">Total an 1: 30 000-80 000 EUR</div>
          </div>
        </div>
      </div>

      {/* Production Pipeline Status */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Film className="h-5 w-5 text-[var(--color-gold)]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Production Pipeline</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { stage: "Script", done: 15, total: 15, color: "#10B981" },
            { stage: "Storyboard", done: 12, total: 15, color: "#3B82F6" },
            { stage: "Voix (Evil P)", done: 10, total: 15, color: "#F59E0B" },
            { stage: "Animation", done: 10, total: 15, color: "#8B5CF6" },
            { stage: "Post-prod", done: 10, total: 15, color: "#00B4D8" },
          ].map((s) => {
            const stagePct = Math.round((s.done / s.total) * 100);
            return (
              <div key={s.stage} className="rounded-lg bg-[var(--color-surface-2)] p-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.stage}</p>
                <p className="mt-1 font-mono text-lg font-bold text-[var(--color-text)]">{s.done}/{s.total}</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div className="h-full rounded-full" style={{ width: `${stagePct}%`, backgroundColor: s.color }} />
                </div>
                <p className="mt-1 font-mono text-[9px]" style={{ color: s.color }}>{stagePct}%</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Outils generation", tools: "Kling, Seedance, Suno, NBP" },
            { label: "Equipe", tools: "Gary + SOTAI (Rony, Stephane, Thomas)" },
            { label: "Rythme cible", tools: "1 episode / 2 semaines = 26 ep/an" },
          ].map((t) => (
            <div key={t.label} className="rounded-lg border border-[var(--color-border-subtle)] p-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t.label}</p>
              <p className="mt-0.5 text-[10px] text-[var(--color-text)]">{t.tools}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seasons grid with episode dropdown */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Saisons — click to expand episodes
          </h2>
        </div>
        {SEASONS.map((season, i) => {
          const isActive = activeSeason === season.id;
          const eps = EPISODES_DATA[season.id] ?? [];
          return (
            <div key={season.id}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveSeason(isActive ? null : season.id)}
                className={`flex cursor-pointer items-center gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-raised)]/50 ${
                  isActive ? "bg-[var(--color-surface-raised)]/30" : ""
                }`}
              >
                <span className="font-mono text-sm font-bold text-[var(--color-gold)]">S{season.id}</span>
                <span className="flex-1 text-sm text-[var(--color-text)]">{season.title}</span>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  {season.episodes} ep.
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[season.status] ?? ""}`}>
                  {season.status}
                </span>
                <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${isActive ? "rotate-180" : ""}`} />
              </motion.div>

              {/* Episode list */}
              <AnimatePresence>
                {isActive && eps.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-[var(--color-surface-2)]/30"
                  >
                    {eps.map((ep, j) => {
                      const key = `S${season.id}-${ep.title}`;
                      const status = state.episodes[key] ?? (ep.status as EpStatus);
                      const st = epStatusStyle(status);
                      return (
                        <div
                          key={j}
                          onClick={(e) => { e.stopPropagation(); toggleEpStatus(season.id, ep.title); }}
                          className="flex cursor-pointer items-center gap-4 border-b border-[var(--color-border-subtle)]/50 px-8 py-2.5 transition-all last:border-b-0 hover:bg-[var(--color-surface-raised)]/30"
                        >
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: st.color }} />
                          <span className={`flex-1 text-xs ${status === "done" ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text)]"}`}>
                            {ep.title}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{ep.duration}</span>
                          <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
                {isActive && eps.length === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[var(--color-surface-2)]/30 px-8 py-4"
                  >
                    <p className="text-xs text-[var(--color-text-muted)] italic">Aucun episode planifie pour le moment</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
