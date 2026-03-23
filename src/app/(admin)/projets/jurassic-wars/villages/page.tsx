"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TreePine, Gamepad2, Palette, Cpu, Users, Hammer,
  Smartphone, Swords, ChevronDown, ChevronUp,
  Shield, Zap, Heart, Crown, Mountain, Waves,
  Wind, Leaf, Eye, Music, Database, Bot
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   JW VILLAGES — Mobile Builder | Jurassic Wars IP
   Data from GDD_PRINCIPAL.md + STACK_TECH.md
   ═══════════════════════════════════════════════════════ */

// ── Civilizations (from GDD) ─────────────────────────
const CIVILIZATIONS = [
  {
    name: "Pangeen",
    role: "Le Builder",
    icon: Crown,
    color: "#C1440E",
    difficulty: 2,
    resource: "Millet",
    premium: "Bronze",
    loop: "Construis des Greniers-Oeufs, maintiens les aqueducs, gere le Grand Comptage.",
    unitSignature: "Brachiosaure de guerre (lent, devastateur)",
    mechanic: "La Fille du Grenier — si tu ne la nommes pas, les charancons-saures ravagent tes stocks.",
    palette: ["#C1440E", "#CD7F32", "#FFD700"],
    paletteNames: ["Laterite rouge", "Bronze", "Or"],
  },
  {
    name: "Volonien",
    role: "Le Trader",
    icon: Waves,
    color: "#40E0D0",
    difficulty: 3,
    resource: "Ambre",
    premium: "Perles de plesiosaurus",
    loop: "Envoie des praos commercer avec d'autres joueurs. Le prix de l'ambre fluctue en temps reel (server-side).",
    unitSignature: "Praos de guerre (defense maritime)",
    mechanic: "La Maree d'Ambre — 48h/semaine, fenetre de ramassage egalitaire. Tout le monde peut s'enrichir.",
    palette: ["#40E0D0", "#FF6B6B", "#F5F5F5"],
    paletteNames: ["Turquoise", "Corail", "Nacre"],
  },
  {
    name: "Arkhani",
    role: "Le Nomade",
    icon: Wind,
    color: "#8B6914",
    difficulty: 5,
    resource: "Cuir de raptor",
    premium: "Prestige (statut, pas de monnaie)",
    loop: "Camp MOBILE. Se deplace 1x/semaine sur la carte. Raid ultra-agressif. Defense quasi-nulle.",
    unitSignature: "Cavalier raptor (ultra-mobile, faible armure)",
    mechanic: "L'IMPRESSION — au debut, tu entres dans la Fosse. Des caches. Tu ressors avec un raptor lie OU sans. Mort permanente du raptor.",
    palette: ["#8B6914", "#78866B", "#F5DEB3"],
    paletteNames: ["Ocre", "Kaki", "Os"],
  },
  {
    name: "N'Goro",
    role: "Le Grower",
    icon: Leaf,
    color: "#00FF7F",
    difficulty: 3,
    resource: "Fioles de poison",
    premium: "Insectes bioluminescents rares",
    loop: "Tout POUSSE. Construction organique. Plus tes structures vieillissent, plus elles deviennent solides.",
    unitSignature: "Guerrier-racine (regenere en terrain mangrove)",
    mechanic: "La Mere des Lucioles — gere des lignees d'insectes sur des generations. Si elle meurt en raid, pertes de 30 generations, moral en chute.",
    palette: ["#1A1A2E", "#00FFFF", "#00FF7F"],
    paletteNames: ["Noir mangrove", "Bleu bioluminescent", "Vert profond"],
  },
  {
    name: "Ishtiri",
    role: "Le Savant",
    icon: Eye,
    color: "#FFD700",
    difficulty: 4,
    resource: "Obsidienne",
    premium: "Poudre d'or",
    loop: "Calibrage de precision temporelle. A moments fixes, tu DOIS etre en ligne observer les migrations de quetzalcoatlus.",
    unitSignature: "Quetzalcoatlus de combat (aerien, attaque en pique)",
    mechanic: "Le Calendrier de 260 jours — si tu rates une observation, le calendrier se decale, perte de buffs permanents.",
    palette: ["#1C1C1C", "#FFD700", "#8B0000"],
    paletteNames: ["Obsidienne", "Or sacre", "Rouge volcanique"],
  },
];

// ── Social Mechanics ─────────────────────────────────
const SOCIAL_MECHANICS = [
  {
    name: "Les Traites Vivants",
    desc: "Pas des alliances generiques. Des CONTRATS codes avec termes, delais, sanctions automatiques. Ex : Arkhani s'engage 500 cuir en 3 migrations, Volonien donne 200 sel + 50 hamecons. Si delai non respecte : praos de guerre automatiquement.",
    icon: Shield,
  },
  {
    name: "Le Kuriltai",
    desc: "Les clans Arkhani ne votent pas. Ils parlent. Systeme de debat asynchrone dans l'app. Les decisions de clan se prennent a la majorite de voix exprimees.",
    icon: Users,
  },
];

// ── Emotional Hooks (retention) ──────────────────────
const EMOTIONAL_HOOKS = [
  { name: "La Fosse", desc: "Arkhani, jour 1. Tu ressors avec ton raptor. Son nom." },
  { name: "La Mort du Raptor", desc: "Il hurle 3 nuits. Tu le vois galoper libre dans la plaine plus tard. Il ne revient pas." },
  { name: "La Maree d'Ambre", desc: "48h. Tout le monde sur la plage. Egalite totale." },
  { name: "La Nuit des Couleurs", desc: "Event global annuel. Les 6 cites allument tout en meme temps." },
  { name: "Le Premier Traite Rompu", desc: "Tu regardes les praos de guerre approcher et tu sais que c'est ta faute." },
];

// ── Monetization ─────────────────────────────────────
const MONETIZATION = [
  { label: "Free to Play", desc: "Baseline gratuite" },
  { label: "Speed-ups", desc: "Classique, non-agressif" },
  { label: "Cosmetiques", desc: "Skins de raptors, couleurs de bioluminescence, variantes architecturales" },
  { label: "Battle Pass mensuel", desc: "Contenu lore exclusif — nouvelles de Nerel, background de personnages" },
  { label: "Zero pay-to-win", desc: "Le Kiki est gratuit pour tout le monde" },
];

// ── Tech Stack ───────────────────────────────────────
const TECH = [
  { domain: "Frontend", tool: "React Native + Expo", detail: "Cross-platform iOS + Android, Expo Go pour tests immediats" },
  { domain: "State", tool: "Zustand", detail: "Simple, zero boilerplate" },
  { domain: "Cartes/Grilles", tool: "react-native-svg", detail: "+ react-native-gesture-handler" },
  { domain: "Animations", tool: "react-native-reanimated", detail: "Timers de construction visuels" },
  { domain: "Backend", tool: "Supabase", detail: "Auth, DB, Realtime (prix ambre), Row Level Security, Edge Functions" },
  { domain: "IA Events", tool: "Claude API", detail: "System prompt par civilisation issu du lore Nerel" },
  { domain: "Assets", tool: "Higgsfield + Replicate TripoSR", detail: "Image ref → mesh .glb → Blender cleanup → sprite sheets" },
  { domain: "Audio", tool: "Suno", detail: "5 ambiances musicales distinctes par civilisation" },
];

// ── Audio per civilization ───────────────────────────
const AUDIO = [
  { civ: "Pangeen", style: "Epique africain, percussions lourdes", instruments: "Djembe, balafon, Grondeur" },
  { civ: "Volonien", style: "Ambiant marin, melancolique", instruments: "Pleureur (harpe), vagues, flute" },
  { civ: "Arkhani", style: "Tribal agressif, rythmique pur", instruments: "Claqueur, tambours de guerre" },
  { civ: "Ishtiri", style: "Minimaliste, cristallin", instruments: "Miroir (obsidienne), silence" },
  { civ: "N'Goro", style: "Bourdonnement organique", instruments: "Chanteurs de Boue, Creux" },
];

// ── Supabase Tables ──────────────────────────────────
const DB_TABLES = [
  { name: "players", desc: "id, civ, resources, created_at" },
  { name: "buildings", desc: "id, player_id, type, level, built_at" },
  { name: "units", desc: "id, player_id, type, qty" },
  { name: "treaties", desc: "id, player1_id, player2_id, terms, expires_at" },
  { name: "raids", desc: "id, attacker_id, defender_id, result, timestamp" },
  { name: "amber_price", desc: "id, price, updated_at — Volonien Realtime" },
];

const DEFAULT_MILESTONES = [
  { phase: "Semaine 1 — Core loop Pangeen", progress: 0 },
  { phase: "Semaine 2 — Arkhani + Impression", progress: 0 },
  { phase: "Semaine 3 — Volonien + Commerce", progress: 0 },
  { phase: "Semaine 4 — Polish + Soft Launch", progress: 0 },
];

const PROGRESS_STEPS = [0, 25, 50, 75, 100];
const LS_KEY = "jw-villages-milestones-v2";

function getStatusLabel(progress: number): string {
  if (progress === 100) return "Termine";
  if (progress > 0) return "En cours";
  return "Planifie";
}

export default function JWVillagesPage() {
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);
  const [expandedCivs, setExpandedCivs] = useState<Record<string, boolean>>({});
  const [showTech, setShowTech] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setMilestones(JSON.parse(saved));
    } catch {}
  }, []);

  const cycleProgress = (index: number) => {
    setMilestones((prev) => {
      const next = prev.map((m, i) => {
        if (i !== index) return m;
        const currentIdx = PROGRESS_STEPS.indexOf(m.progress);
        const nextIdx = currentIdx >= PROGRESS_STEPS.length - 1 ? 0 : currentIdx + 1;
        return { ...m, progress: PROGRESS_STEPS[nextIdx] };
      });
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleCiv = (name: string) => {
    setExpandedCivs((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const overallProgress = milestones.length > 0
    ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Smartphone className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            JW Villages
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            Mobile Builder — React Native + Expo | 5 civilisations asymetriques
          </p>
        </div>
      </div>

      {/* ── Pitch ───────────────────────────────── */}
      <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 p-4">
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
          5 civilisations prehistoriques sur dinosaures. 5 facons radicalement differentes de construire, raider, et survivre. Le premier mobile builder ou ta civilisation change ta facon de jouer — pas juste ton skin.
        </p>
      </div>

      {/* ── Overall Completion ──────────────────── */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Progression globale</span>
          <span className="font-mono text-xs text-[var(--color-gold)]">{overallProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* ── 5 Civilizations ─────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          5 Civilisations — Loops asymetriques
        </h2>
        <div className="space-y-3">
          {CIVILIZATIONS.map((civ, i) => {
            const isExpanded = expandedCivs[civ.name] ?? false;
            return (
              <motion.div
                key={civ.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
              >
                <div
                  onClick={() => toggleCiv(civ.name)}
                  className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  <div className="flex items-center gap-3">
                    <civ.icon className="h-5 w-5" style={{ color: civ.color }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--color-text)]">{civ.name}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">— {civ.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: civ.color }}>
                          {"★".repeat(civ.difficulty)}{"☆".repeat(5 - civ.difficulty)}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">| {civ.resource}</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                  )}
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[var(--color-border-subtle)]"
                    >
                      <div className="space-y-3 p-4">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Ressource premium</span>
                          <p className="text-xs text-[var(--color-text)]">{civ.premium}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Gameplay loop</span>
                          <p className="text-xs text-[var(--color-text-secondary)]">{civ.loop}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Unite signature</span>
                          <p className="text-xs text-[var(--color-text)]">{civ.unitSignature}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Mecanisme unique</span>
                          <p className="text-xs text-[var(--color-gold)]">{civ.mechanic}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Palette</span>
                          <div className="mt-1 flex gap-2">
                            {civ.palette.map((c, idx) => (
                              <div key={c} className="flex items-center gap-1.5">
                                <div className="h-4 w-4 rounded-sm border border-white/10" style={{ backgroundColor: c }} />
                                <span className="text-[10px] text-[var(--color-text-muted)]">{civ.paletteNames[idx]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Social Mechanics ────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Mecaniques sociales
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {SOCIAL_MECHANICS.map((m) => (
            <div key={m.name} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <m.icon className="h-4 w-4 text-[var(--color-gold)]" />
                <h3 className="text-sm font-bold text-[var(--color-text)]">{m.name}</h3>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Emotional Hooks ─────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Moments emotionnels cles (hooks retention)
        </h2>
        <div className="space-y-2">
          {EMOTIONAL_HOOKS.map((h, i) => (
            <motion.div
              key={h.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
            >
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
              <div>
                <span className="text-xs font-bold text-[var(--color-text)]">{h.name}</span>
                <p className="text-[10px] text-[var(--color-text-muted)]">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Monetization ────────────────────────── */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Monetisation</h2>
        <div className="space-y-1.5">
          {MONETIZATION.map((m) => (
            <div key={m.label} className="flex gap-2">
              <Zap className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-gold)]" />
              <div>
                <span className="text-xs font-bold text-[var(--color-text)]">{m.label}</span>
                <span className="text-xs text-[var(--color-text-muted)]"> — {m.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech Stack ──────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div
          onClick={() => setShowTech(!showTech)}
          className="flex cursor-pointer items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-2)]"
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Stack technique</h2>
          </div>
          {showTech ? <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />}
        </div>
        <AnimatePresence>
          {showTech && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="space-y-4 p-4">
                {/* Stack table */}
                <div className="space-y-2">
                  {TECH.map((t) => (
                    <div key={t.domain} className="flex gap-3">
                      <span className="w-24 shrink-0 text-[10px] font-bold text-[var(--color-gold)]">{t.domain}</span>
                      <span className="text-xs text-[var(--color-text)]">{t.tool}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">— {t.detail}</span>
                    </div>
                  ))}
                </div>

                {/* DB Tables */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Supabase Tables</span>
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {DB_TABLES.map((t) => (
                      <div key={t.name} className="rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2.5 py-1.5">
                        <span className="font-mono text-[10px] font-bold text-emerald-400">{t.name}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)]"> — {t.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* IA Events */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Bot className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">IA Events (Claude API)</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    Chaque civilisation a son system prompt issu du lore Nerel. Triggers : grenier proche du vide, raptor lie &lt;20% HP, traite proche expiration, Maree d'Ambre global.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Audio ───────────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div
          onClick={() => setShowAudio(!showAudio)}
          className="flex cursor-pointer items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-2)]"
        >
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-orange-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Audio — Suno OST</h2>
          </div>
          {showAudio ? <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />}
        </div>
        <AnimatePresence>
          {showAudio && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="space-y-2 p-4">
                {AUDIO.map((a) => (
                  <div key={a.civ} className="flex gap-3">
                    <span className="w-20 shrink-0 text-[10px] font-bold text-[var(--color-gold)]">{a.civ}</span>
                    <span className="text-xs text-[var(--color-text)]">{a.style}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">| {a.instruments}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Milestones (Roadmap) ────────────────── */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Roadmap prototype — 4 semaines
            </h2>
            <span className="text-[10px] text-[var(--color-text-muted)]">Cliquer pour modifier</span>
          </div>
        </div>
        {milestones.map((m, i) => {
          const status = getStatusLabel(m.progress);
          return (
            <motion.div
              key={m.phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => cycleProgress(i)}
              className="flex cursor-pointer items-center gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[var(--color-surface-raised)]/30"
            >
              <span className="w-56 text-xs font-medium text-[var(--color-text)]">{m.phase}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--color-gold)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${m.progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="w-12 text-right font-mono text-xs text-[var(--color-text-muted)]">{m.progress}%</span>
              <span className={`w-20 text-right text-[10px] font-medium ${m.progress === 100 ? "text-emerald-400" : m.progress > 0 ? "text-amber-400" : "text-[var(--color-text-muted)]"}`}>
                {status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
