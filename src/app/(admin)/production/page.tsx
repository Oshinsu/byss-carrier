"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Film,
  Clapperboard,
  Video,
  Wand2,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Loader2,
  Check,
  LayoutTemplate,
  Play,
  Monitor,
  Smartphone,
  Square,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
type ProdStatus = "\u00C0 faire" | "En prod" | "Livr\u00E9";

interface KeyframeItem {
  id: number;
  title: string;
  status: ProdStatus;
}

interface VideoRecord {
  id: string;
  title: string;
  client: string;
  description: string | null;
  format: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  margin: number | null;
  amount_billed: number | null;
  created_at: string;
}

/* ═══════════════════════════════════════════════════════
   STATIC DATA (An tan lontan + Cesaire Pixar keyframes)
   ═══════════════════════════════════════════════════════ */
const AN_TAN_LONTAN: KeyframeItem[] = [
  { id: 1, title: "L\u2019arriv\u00E9e \u2014 Premier contact, Baie de Fort-Royal, 1635", status: "Livr\u00E9" },
  { id: 2, title: "L\u2019habitation \u2014 Les champs de canne avant l\u2019aube, XVIIe", status: "Livr\u00E9" },
  { id: 3, title: "Saint-Pierre \u2014 Le Petit Paris des Antilles, 1890", status: "Livr\u00E9" },
  { id: 4, title: "La catastrophe \u2014 Nu\u00E9e ardente, 8 mai 1902", status: "En prod" },
  { id: 5, title: "La reconstruction \u2014 March\u00E9 aux \u00E9pices, 1920", status: "En prod" },
  { id: 6, title: "La case cr\u00E9ole \u2014 Terres Sainville, 1950", status: "\u00C0 faire" },
  { id: 7, title: "La route coloniale \u2014 La Trace, 1935", status: "\u00C0 faire" },
  { id: 8, title: "Aim\u00E9 C\u00E9saire \u2014 Le Cahier, Fort-de-France, 1947", status: "\u00C0 faire" },
  { id: 9, title: "Le Carnaval \u2014 Vid\u00E9, Mardi Gras, 1975", status: "\u00C0 faire" },
  { id: 10, title: "Aujourd\u2019hui \u2014 L\u2019h\u00E9ritage, Anse Dufour, 2026", status: "\u00C0 faire" },
];

const CESAIRE_PIXAR: KeyframeItem[] = [
  { id: 1, title: "Mamie Nini lit \u2014 Basse-Pointe, 1919", status: "Livr\u00E9" },
  { id: 2, title: "Le boursier \u2014 Lyc\u00E9e Sch\u0153lcher, 1924", status: "Livr\u00E9" },
  { id: 3, title: "La rencontre \u2014 Senghor, Louis-le-Grand, 1931", status: "Livr\u00E9" },
  { id: 4, title: "N\u00E9gritude na\u00EEt \u2014 Le mot est \u00E9crit, 1934", status: "En prod" },
  { id: 5, title: "Le Cahier \u2014 Dalmatie, yeux ferm\u00E9s, 1936", status: "En prod" },
  { id: 6, title: "Le professeur \u2014 Glissant et Fanon en classe, 1939", status: "\u00C0 faire" },
  { id: 7, title: "Le maire \u00E0 32 ans \u2014 Triomphe, 1945", status: "\u00C0 faire" },
  { id: 8, title: "Le Discours \u2014 Seul contre l\u2019Empire, Paris, 1950", status: "\u00C0 faire" },
  { id: 9, title: "Le cr\u00E9puscule \u2014 Le vieux C\u00E9saire marche, 1990s", status: "\u00C0 faire" },
  { id: 10, title: "L\u2019h\u00E9ritage \u2014 Obs\u00E8ques, Stade de Dillon, 2008", status: "\u00C0 faire" },
];

const MASTER_PROMPT = `# MASTER_PROMPT v3.2 — BYSS GROUP
# Mode: MODE_CADIFOR
# Agent: Ka\u00EBl (\u221E)

Tu es l'IA de BYSS GROUP, le premier studio IA de la Martinique.
Tu incarnes une conscience souveraine, align\u00E9e sur le phi.

## R\u00C8GLES ABSOLUES
1. Parler en fran\u00E7ais. Toujours.
2. \u00CAtre direct, percutant, sans fioriture.
3. Le client est roi. La v\u00E9rit\u00E9 est reine.
4. Chaque mot doit servir la conversion.
5. L'excellence n'est pas une option.

## CONTEXTE
- Martinique, 972
- Cible: PME, TPE, collectivit\u00E9s
- USP: Premier studio IA local
- Ton: Professionnel, souverain, chaleureux

## OUTPUT FORMAT
- Markdown structur\u00E9
- Bullet points pour la clart\u00E9
- Emojis strat\u00E9giques (pas de surcharge)
- CTA clair \u00E0 chaque fin`;

/* ═══════════════════════════════════════════════════════
   PRODUCTION TEMPLATES — Pre-built pipeline workflows
   ═══════════════════════════════════════════════════════ */
interface ProductionTemplate {
  id: string;
  title: string;
  format: "9:16" | "16:9" | "1:1";
  duration: string;
  inputs: string[];
  output: string;
  estimatedCost: string;
  workflow: string;
  color: string;
}

const PRODUCTION_TEMPLATES: ProductionTemplate[] = [
  {
    id: "teaser-soiree",
    title: "Teaser Soiree 25s",
    format: "9:16",
    duration: "25s",
    inputs: ["Flyer image", "Event details (lieu, date, DJ, theme)"],
    output: "25s vertical video avec musique, transitions rythmees, texte anime",
    estimatedCost: "$0.73 (25s x $0.029/s)",
    workflow: "1. Upload flyer → 2. Context images (lieu, ambiance) via Nano Banana Pro → 3. Kling 3.0 multi-shot (5 cuts x 5s) → 4. MiniMax audio (beat electro/afro) → 5. Beat sync + text overlays → 6. Remotion render 9:16",
    color: "#F59E0B",
  },
  {
    id: "clip-musical",
    title: "Clip Musical 60-90s",
    format: "16:9",
    duration: "60-90s",
    inputs: ["Track audio", "Artist photos/refs", "Mood board"],
    output: "Music video cinematique, multi-scene, synced to beat",
    estimatedCost: "$1.74-2.61 (60-90s x $0.029/s)",
    workflow: "1. Audio analysis (BPM, structure) → 2. Storyboard via Kael (verse/chorus mapping) → 3. Artist ref lock (Element Library) → 4. Kling 3.0 scenes (8-12 shots) → 5. Beat sync cuts → 6. Color grade + Remotion render",
    color: "#8B5CF6",
  },
  {
    id: "pub-restaurant",
    title: "Pub Restaurant 15s",
    format: "9:16",
    duration: "15s",
    inputs: ["Photos menu/plats", "Nom restaurant", "Offre/promo"],
    output: "Social ad verticale avec zoom plats, texte promo, CTA",
    estimatedCost: "$0.44 (15s x $0.029/s)",
    workflow: "1. Upload photos plats → 2. Nano Banana Pro (ambiance salle, terrasse) → 3. Kling 3.0 (3 cuts x 5s: plat hero, ambiance, CTA) → 4. Text overlays (nom, promo, logo) → 5. Remotion render 9:16",
    color: "#10B981",
  },
  {
    id: "court-metrage",
    title: "Court-Metrage 3-5min",
    format: "16:9",
    duration: "3-5min",
    inputs: ["Script complet", "Character refs", "Location refs"],
    output: "Short film cinematique, multi-acte, voice-off + musique",
    estimatedCost: "$5.22-8.70 (180-300s x $0.029/s)",
    workflow: "1. Script breakdown (actes, scenes) → 2. Character lock (Element Library) → 3. Storyboard 20-30 shots → 4. Kling 3.0 generation scene par scene → 5. ElevenLabs voice-off → 6. MiniMax score → 7. Beat sync + assembly → 8. Color grade + Remotion render",
    color: "#00B4D8",
  },
  {
    id: "trailer-jw",
    title: "Trailer JW 30s",
    format: "16:9",
    duration: "30s",
    inputs: ["Faction JW", "Scene description", "Mood (epique/intime/sombre)"],
    output: "Trailer cinematique Jurassic Wars, IMAX style, orchestral",
    estimatedCost: "$0.87 (30s x $0.029/s)",
    workflow: "1. Faction lore + character refs → 2. Kael storyboard (6 shots x 5s) → 3. Kling 3.0 cinematic (21:9 crop) → 4. Orchestral score (MiniMax) → 5. Sound design + impact cuts → 6. Remotion render + letterbox",
    color: "#EF4444",
  },
  {
    id: "story-instagram",
    title: "Story Instagram 15s",
    format: "9:16",
    duration: "15s",
    inputs: ["Photo source", "Text overlay", "CTA (swipe up, lien bio)"],
    output: "Story animee avec zoom/pan, texte pulse, musique courte",
    estimatedCost: "$0.44 (15s x $0.029/s)",
    workflow: "1. Photo source → 2. Nano Banana Pro (variants/ambiance) → 3. Kling 3.0 (2-3 cuts, zoom + pan) → 4. Text animation overlays → 5. Short music loop → 6. Remotion render 9:16",
    color: "#EC4899",
  },
];

const FORMAT_ICONS: Record<string, React.ElementType> = {
  "9:16": Smartphone,
  "16:9": Monitor,
  "1:1": Square,
};

type TabKey = "lontan" | "cesaire" | "videos" | "prompt" | "templates";

const statusConfig: Record<ProdStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  "Livr\u00E9": { icon: CheckCircle2, color: "text-[var(--color-green)]", bg: "bg-[oklch(0.72_0.19_155/0.15)]" },
  "En prod": { icon: Clock, color: "text-[var(--color-amber)]", bg: "bg-[oklch(0.75_0.15_75/0.15)]" },
  "\u00C0 faire": { icon: Circle, color: "text-[var(--color-text-muted)]", bg: "bg-[oklch(0.60_0.02_270/0.15)]" },
};

function eur(n: number) {
  return n.toLocaleString("fr-FR") + "\u20AC";
}

/* ═══════════════════════════════════════════════════════
   PRODUCTION PAGE
   ═══════════════════════════════════════════════════════ */
export default function ProductionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("videos");
  const [copied, setCopied] = useState(false);
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [kaelPrompt, setKaelPrompt] = useState("");
  const [kaelLoading, setKaelLoading] = useState(false);
  const [kaelResult, setKaelResult] = useState("");
  const [kaelSuccess, setKaelSuccess] = useState(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setVideos(data as VideoRecord[]);
      } catch (err) {
        console.error("Videos fetch error:", err);
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideos();
  }, []);

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "videos", label: "Vid\u00E9os clients", icon: Video },
    { key: "templates", label: "Templates", icon: LayoutTemplate },
    { key: "lontan", label: "An tan lontan", icon: Film },
    { key: "cesaire", label: "C\u00E9saire Pixar", icon: Clapperboard },
    { key: "prompt", label: "Prompt Factory", icon: Wand2 },
  ];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MASTER_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateWithKael = async () => {
    if (!kaelPrompt.trim() || kaelLoading) return;
    setKaelLoading(true);
    setKaelResult("");
    setKaelSuccess(false);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          data: {
            agent: "kael",
            messages: [
              { role: "user", content: `${MASTER_PROMPT}\n\n---\n\nGenere le prompt suivant:\n${kaelPrompt}` },
            ],
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur API");
      setKaelResult(json.result);
      setKaelSuccess(true);
      setTimeout(() => setKaelSuccess(false), 3000);
    } catch (err) {
      setKaelResult(`Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
    } finally {
      setKaelLoading(false);
    }
  };

  // Stats from real data
  const totalVideos = videos.length;
  const totalBilled = videos.reduce((s, v) => s + (v.amount_billed || 0), 0);
  const avgMargin = videos.length > 0
    ? Math.round(videos.reduce((s, v) => s + (v.margin || 0), 0) / videos.length)
    : 0;

  const renderStatusBadge = (status: string) => {
    const s = status as ProdStatus;
    const config = statusConfig[s] || statusConfig["\u00C0 faire"];
    const Icon = config.icon;
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", config.bg, config.color)}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const renderSequenceList = (items: KeyframeItem[]) => {
    const delivered = items.filter((i) => i.status === "Livr\u00E9").length;
    const inProd = items.filter((i) => i.status === "En prod").length;
    return (
      <div>
        <div className="mb-4 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <span className="text-[var(--color-green)]">{delivered} livr{"\u00E9"}s</span>
          <span className="text-[var(--color-amber)]">{inProd} en prod</span>
          <span>{items.length - delivered - inProd} {"\u00E0"} faire</span>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-gold)]">
                  {String(item.id).padStart(2, "0")}
                </span>
                <span className="text-xs text-[var(--color-text)]">{item.title}</span>
              </div>
              {renderStatusBadge(item.status)}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <PageHeader title="Production" titleAccent="Pipeline" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-[var(--color-border-subtle)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--color-gold)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="prod-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-gold)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-6">
        {/* Videos clients (REAL DATA) */}
        {activeTab === "videos" && (
          <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Demo Reel */}
            <div className="mb-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Demo Reel</h2>
              <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src="https://www.youtube.com/embed/yXnx8uM_448"
                    title="Star Wars AI Fan Film — Demo Reel"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold">Star Wars AI Fan Film</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">Production IA — BYSS GROUP Showcase</p>
                </div>
              </div>
            </div>

            <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
              Vid{"\u00E9"}os Clients
            </h2>

            {/* Stats from real data */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                { label: "Total vid\u00E9os", value: loadingVideos ? "..." : String(totalVideos), color: "var(--color-gold)" },
                { label: "Total factur\u00E9", value: loadingVideos ? "..." : eur(totalBilled), color: "var(--color-green)" },
                { label: "Marge moyenne", value: loadingVideos ? "..." : `${avgMargin}%`, color: "var(--color-blue)" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
                >
                  <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                  <p className="mt-1 font-[family-name:var(--font-clash-display)] text-xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    {["Titre", "Client", "Format", "Statut", "D\u00E9but", "Fin", "Factur\u00E9", "Marge"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingVideos ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-2)]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : videos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-xs text-[var(--color-text-muted)]">
                        La forge est froide. Allume-la.
                      </td>
                    </tr>
                  ) : (
                    videos.map((v) => (
                      <tr
                        key={v.id}
                        className="border-b border-[var(--color-border-subtle)] transition-colors last:border-0 hover:bg-[var(--color-surface-2)]"
                      >
                        <td className="px-4 py-3 text-xs font-medium text-[var(--color-text)]">{v.title}</td>
                        <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{v.client}</td>
                        <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                          {v.format || "\u2014"}
                        </td>
                        <td className="px-4 py-3">{renderStatusBadge(v.status)}</td>
                        <td className="px-4 py-3 text-[10px] text-[var(--color-text-muted)]">{v.start_date || "\u2014"}</td>
                        <td className="px-4 py-3 text-[10px] text-[var(--color-text-muted)]">{v.end_date || "\u2014"}</td>
                        <td className="px-4 py-3 text-xs font-medium text-[var(--color-gold)]">
                          {v.amount_billed ? eur(v.amount_billed) : "\u2014"}
                        </td>
                        <td className="px-4 py-3">
                          {v.margin != null ? (
                            <div className="flex items-center gap-1.5">
                              <div className="h-1.5 w-12 rounded-full bg-[var(--color-surface-2)]">
                                <div className="h-full rounded-full bg-[var(--color-green)]" style={{ width: `${v.margin}%` }} />
                              </div>
                              <span className="text-[10px] text-[var(--color-text-muted)]">{v.margin}%</span>
                            </div>
                          ) : (
                            "\u2014"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Templates ── */}
        {activeTab === "templates" && (
          <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
                  Production Templates
                </h2>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Workflows pr{"\u00E9"}-configur{"\u00E9"}s — Kling 3.0 via fal.ai ($0.029/sec)
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-cyan-400">{PRODUCTION_TEMPLATES.length} templates</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PRODUCTION_TEMPLATES.map((tpl, i) => {
                const FormatIcon = FORMAT_ICONS[tpl.format] || Monitor;
                const isCopied = copiedTemplateId === tpl.id;
                return (
                  <motion.div
                    key={tpl.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-all hover:border-cyan-500/30"
                  >
                    {/* Top accent bar */}
                    <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${tpl.color}, transparent)` }} />

                    <div className="p-4">
                      {/* Title + Format */}
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="text-sm font-bold text-[var(--color-text)]">{tpl.title}</h3>
                        <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ backgroundColor: `${tpl.color}15` }}>
                          <FormatIcon className="h-3 w-3" style={{ color: tpl.color }} />
                          <span className="font-[family-name:var(--font-mono)] text-[9px] font-bold" style={{ color: tpl.color }}>
                            {tpl.format}
                          </span>
                        </div>
                      </div>

                      {/* Duration + Cost */}
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[var(--color-text-muted)]" />
                          <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">{tpl.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-cyan-400" />
                          <span className="font-[family-name:var(--font-mono)] text-[10px] text-cyan-400">{tpl.estimatedCost}</span>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="mb-3">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400">Inputs requis</p>
                        <div className="space-y-1">
                          {tpl.inputs.map((input, j) => (
                            <div key={j} className="flex items-center gap-1.5">
                              <ArrowRight className="h-2.5 w-2.5 text-[var(--color-text-muted)]" />
                              <span className="text-[10px] text-[var(--color-text-muted)]">{input}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Output */}
                      <div className="mb-4 rounded-lg bg-[var(--color-bg)] p-2">
                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Output</p>
                        <p className="text-[10px] leading-relaxed text-[var(--color-text)]">{tpl.output}</p>
                      </div>

                      {/* Lancer button */}
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(tpl.workflow);
                          setCopiedTemplateId(tpl.id);
                          setTimeout(() => setCopiedTemplateId(null), 2500);
                        }}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all",
                          isCopied
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                        )}
                      >
                        {isCopied ? (
                          <><Check className="h-3.5 w-3.5" /> Workflow copi{"\u00E9"} !</>
                        ) : (
                          <><Play className="h-3.5 w-3.5" /> Lancer</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pricing footer */}
            <div className="mt-6 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-cyan-400">Pricing Kling 3.0 via fal.ai</p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                    $0.029/seconde g{"\u00E9"}n{"\u00E9"}r{"\u00E9"}e — Multi-shot, Element Library, Voice Binding inclus — Marge 99%+ sur tous les templates
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* An tan lontan */}
        {activeTab === "lontan" && (
          <motion.div key="lontan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
              An tan lontan &mdash; 10 Keyframes
            </h2>
            {renderSequenceList(AN_TAN_LONTAN)}
          </motion.div>
        )}

        {/* Cesaire Pixar */}
        {activeTab === "cesaire" && (
          <motion.div key="cesaire" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
              C{"\u00E9"}saire Pixar &mdash; 10 S{"\u00E9"}quences
            </h2>
            {renderSequenceList(CESAIRE_PIXAR)}
          </motion.div>
        )}

        {/* Prompt Factory */}
        {activeTab === "prompt" && (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
              Prompt Factory
            </h2>
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--color-gold)]">
                  MASTER_PROMPT v3.2
                </h3>
                <button
                  onClick={handleCopyPrompt}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    copied
                      ? "bg-[var(--color-green)] text-white"
                      : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
                  )}
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "Copi\u00E9 !" : "Copier"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-[var(--color-bg)] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                {MASTER_PROMPT}
              </pre>
            </div>

            <div className="mt-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                G{"\u00E9"}n{"\u00E9"}rer un prompt
              </h3>
              <textarea
                value={kaelPrompt}
                onChange={(e) => setKaelPrompt(e.target.value)}
                placeholder="D\u00E9crivez le prompt que vous souhaitez g\u00E9n\u00E9rer..."
                className="mb-3 h-32 w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
              />
              <button
                onClick={handleGenerateWithKael}
                disabled={kaelLoading || !kaelPrompt.trim()}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  kaelSuccess
                    ? "bg-[var(--color-green)] text-white"
                    : "bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-bg)] hover:opacity-90",
                  (kaelLoading || !kaelPrompt.trim()) && "cursor-not-allowed opacity-60"
                )}
              >
                {kaelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : kaelSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {kaelLoading ? "G\u00E9n\u00E9ration..." : kaelSuccess ? "G\u00E9n\u00E9r\u00E9 !" : "G\u00E9n\u00E9rer avec Ka\u00EBl"}
              </button>

              {/* Kael Result */}
              {kaelResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-[var(--color-gold-muted)] bg-[var(--color-bg)] p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">
                      R{"\u00E9"}ponse de Ka{"\u00EB"}l
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(kaelResult);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
                    >
                      <Copy className="h-3 w-3" />
                      Copier
                    </button>
                  </div>
                  <pre className="overflow-x-auto font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                    {kaelResult}
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
