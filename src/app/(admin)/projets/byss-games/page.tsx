"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  Gamepad2, Star, Globe, Crown, Search, ChevronDown, ChevronUp,
  ExternalLink, Flame, Swords, Smartphone, Monitor, Wrench,
  Users, Building2, Music, Cpu, Palette, MapPin, BookOpen,
  Clock, Zap, Shield, Mountain, Languages, CheckSquare, Workflow,
  MessageSquare, Eye, Timer
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   BYSS GAMES — Studio Overview + IP Projects
   Data sourced from GDD files — March 2026
   ═══════════════════════════════════════════════════════ */

// ── Studio IP Stats ──────────────────────────────────
const IP_STATS = [
  { label: "Civilisations", value: "5", icon: Crown },
  { label: "Architectures", value: "73", icon: Building2 },
  { label: "Villes avec lore", value: "31", icon: MapPin },
  { label: "Mots intraduisibles", value: "22", icon: BookOpen },
  { label: "Grandes Guerres", value: "3", icon: Swords },
  { label: "Traites Vivants", value: "6", icon: Shield },
  { label: "Instruments inventes", value: "8", icon: Music },
  { label: "Calendriers incompatibles", value: "5", icon: Clock },
];

// ── Foyer Strategy ───────────────────────────────────
const FOYERS = [
  {
    id: 1,
    name: "JW Villages",
    type: "Mobile Builder",
    timeline: "4 semaines",
    status: "active",
    desc: "Valide l'IP en conditions reelles. Feedback joueurs, communaute, notoriete.",
    revenue: "F2P + cosmetiques + Battle Pass — 5K-50K/an",
    icon: Smartphone,
    color: "#FFD700",
  },
  {
    id: 2,
    name: "JW x TWW3 Mod",
    type: "Total War Mod",
    timeline: "6 mois",
    status: "planned",
    desc: "Communaute TWW3 : 2M+ joueurs. Exposition massive. Zero budget marketing.",
    revenue: "Gratuit (notoriete) — invaluable indirect",
    icon: Wrench,
    color: "#8B5CF6",
  },
  {
    id: 3,
    name: "JW Confederation",
    type: "PC Grand Strategy",
    timeline: "12-18 mois",
    status: "planned",
    desc: "Le jeu complet. Steam Early Access. Financement KickStarter post-Villages.",
    revenue: "Premium + Early Access — 100K-500K (post-KS)",
    icon: Monitor,
    color: "#3B82F6",
  },
  {
    id: 4,
    name: "JW Le Traducteur",
    type: "Narrative RPG",
    timeline: "Parallele",
    status: "planned",
    desc: "Public Disco Elysium / 80 Days. Differente audience. Revenue additionnel.",
    revenue: "Premium (itch.io + Steam) — 10K-100K",
    icon: BookOpen,
    color: "#10B981",
  },
];

// ── Games with real GDD data ─────────────────────────
const GAMES = [
  {
    name: "JW Villages",
    subtitle: "Mobile Builder — Clash of Clans-like",
    icon: Smartphone,
    color: "#FFD700",
    pitch: "5 civilisations prehistoriques sur dinosaures. 5 facons radicalement differentes de construire, raider, et survivre. Le premier mobile builder ou ta civilisation change ta facon de jouer — pas juste ton skin.",
    stack: ["React Native + Expo", "Supabase Realtime", "Claude API", "Zustand"],
    civilizations: [
      { name: "Pangeen — Le Builder", resource: "Millet + Bronze", mechanic: "Greniers-Oeufs, aqueducs, Grand Comptage. La Fille du Grenier empêche les charancons-saures.", difficulty: 2 },
      { name: "Volonien — Le Trader", resource: "Ambre + Perles", mechanic: "Praos commerciaux, prix de l'ambre en temps reel (server-side). Maree d'Ambre 48h/semaine.", difficulty: 3 },
      { name: "Arkhani — Le Nomade", resource: "Cuir + Prestige", mechanic: "Camp MOBILE. Raid ultra-agressif. L'Impression : la Fosse, raptor lie, mort permanente.", difficulty: 5 },
      { name: "N'Goro — Le Grower", resource: "Poisons + Insectes bioluminescents", mechanic: "Construction organique. Plus les structures vieillissent, plus elles sont solides. Mere des Lucioles.", difficulty: 3 },
      { name: "Ishtiri — Le Savant", resource: "Obsidienne + Poudre d'or", mechanic: "Calendrier de 260 jours. Observation des migrations de quetzalcoatlus. Precision temporelle.", difficulty: 4 },
    ],
    roadmap: [
      { week: "Semaine 1", task: "Core loop Pangeen — carte, batiments, ressources, timers, raid basique" },
      { week: "Semaine 2", task: "Arkhani + Impression — camp mobile, Fosse, raptor lie, mort permanente" },
      { week: "Semaine 3", task: "Volonien + Commerce — praos, marees, prix dynamique Supabase Realtime" },
      { week: "Semaine 4", task: "Polish + Traites + Soft Launch — traite inter-civ, Claude API events, itch.io" },
    ],
  },
  {
    name: "JW Confederation",
    subtitle: "Total War-like PC — Campagne tour par tour + Batailles RTS",
    icon: Monitor,
    color: "#3B82F6",
    pitch: "Total War dans l'univers Jurassic Wars. Campagne grand strategy CK3-like au tour par tour, batailles tactiques RTS dans Unreal Engine 5. Les 5 civilisations. Les dinosaures. L'Impression. La Thermodynamique des Greniers.",
    stack: ["Next.js (campagne)", "Unreal Engine 5 (batailles)", "Claude API (events)", "JSON bridge"],
    mechanics: [
      { name: "Double couche", desc: "Campagne tour par tour (Next.js) + Batailles RTS (UE5). Communication par JSON decouple." },
      { name: "Thermodynamique des Greniers", desc: "Millet -5%/tour (entropie). Charancons-saures si pas de Fille du Grenier. Greniers <20% = desertions." },
      { name: "L'Impression Arkhani", desc: "Fosse en debut de campagne. Dés caches. Raptor lie qui vieillit, meurt, et reapparait sauvage." },
      { name: "5 Horloges Incompatibles", desc: "Chaque civ compte le temps differemment. Le jeu traduit mais la diplomatie affiche la notation native." },
      { name: "6 Traites Vivants", desc: "Traite de l'Ambre, Pacte des Os, Accord de Songa, Route du Vent, Silence de Quetz, Accord de Drek." },
    ],
    units: [
      { civ: "Pangeen", list: "Legionnaire de bronze, Brachiosaure de siege, Raptor de reconnaissance, Catapulte d'os" },
      { civ: "Arkhani", list: "Cavalier raptor, Tyrannosaure de guerre (1/armee), Archers montes, Apaiseur" },
      { civ: "Volonien", list: "Guerrier-plongeur amphibie, Galere a plesiosaurus, Mercenaire pangeen, Defense recifale" },
      { civ: "Ishtiri", list: "Pretresse-guerriere, Quetzalcoatlus de combat, Lancier obsidienne, Miroir de guerre" },
      { civ: "N'Goro", list: "Guerrier-racine (regen), Spinosaure aquatique, Mambo de bataille (poison), Fantome (recon)" },
    ],
    roadmap: [
      { week: "Mois 1", task: "Prototype campagne Next.js — carte SVG, personnages, tour par tour, Claude events" },
      { week: "Mois 2", task: "Integration UE5 — 1er prototype bataille Pangeen vs Arkhani, JSON bridge" },
      { week: "Mois 3", task: "2 factions jouables completes end-to-end — Impression + Thermodynamique" },
      { week: "Mois 6", task: "5 factions, Early Access Steam" },
    ],
  },
  {
    name: "JW x TWW3 Mod",
    subtitle: "Faction Arkhani jouable dans Total War: Warhammer III",
    icon: Wrench,
    color: "#8B5CF6",
    pitch: "Mod de faction complete pour TWW3 Immortal Empires. Faction Arkhani avec camp mobile (Horde), L'Impression, Evil Pichon comme Legendary Lord, et Silence comme raptor compagnon a mort permanente.",
    stack: ["RPFM", "Assembly Kit (Terry + Variant Editor)", "RMEditor", "Blender", "Lua scripting"],
    legendaryLord: {
      name: "Evil Pichon",
      stats: "Melee 65 / Defence 50 / Leadership 75 / Speed 90",
      traits: [
        "Le Petit Dangereux : +10 charge, +5 atk en duel",
        "Cicatrices du Duel de la Passe : +15 ward save vs personnages",
        "Ti sur l'Epaule : aura +8 moral (represente par Ti)",
      ],
      companion: "Silence — vieux raptor lie. Vieillit tour apres tour. Mort permanente. Event cinematique a sa mort.",
    },
    mechanics: [
      { name: "Prestige (ressource)", desc: "Remplace l'or. Gagne par victoires et raids. Depense pour unites d'elite et Kuriltai." },
      { name: "Lien d'Impression", desc: "Profondeur du lien cavalier/raptor. +X% efficacite unites montees. Malus si raptors morts." },
      { name: "Camp mobile (Horde)", desc: "Mécanique Horde de TWW3 adaptee aux nomades Arkhani." },
      { name: "Silence vieillissant", desc: "Tours 1-20 : jeune et fort. Tours 21-50 : -10% vitesse. Tours 51+ : -20% vitesse, +5 moral zone." },
    ],
    roadmap: [
      { week: "Sprint 1 (2 sem)", task: "4 unites Arkhani reskin, Evil Pichon LL, Custom Battle test, Workshop alpha" },
      { week: "Sprint 2 (1 mois)", task: "Assets originaux Replicate/Blender, Silence (Lua), Prestige pooled, Camp mobile" },
      { week: "Sprint 3 (2 mois)", task: "Faction jouable Immortal Empires via Mixu, Kuriltai politique, 10+ unites" },
    ],
  },
  {
    name: "JW Le Traducteur",
    subtitle: "Jeu narratif diplomatique — Disco Elysium x 80 Days x Sorcery!",
    icon: Languages,
    color: "#10B981",
    pitch: "Tu es le seul homme au monde qui parle les cinq langues. Qui appartient a tout le monde et a personne. Tu voyages entre les cinq civilisations. Tu negocies. Tu dechiffres. Tu previens des guerres. Tu en declenches d'autres. Le choix de traduction EST le gameplay.",
    stack: ["React + Electron (PC)", "Next.js (Web)", "Claude API", "Higgsfield", "MiniMax 2.7", "Suno", "Zustand + SQLite"],
    mechanics: [
      { name: "Traduire n'est pas neutre", desc: "Quand l'Ambassadeur Pangeen dit 'bwere', tu as 3 options de traduction. Chaque choix = consequences diplomatiques differentes. La traduction EST le gameplay." },
      { name: "22 Mots Intraduisibles", desc: "Chaque mot = un pouvoir debloque. 'daga' (Arkhani) suspend l'hostilite, 'tzolk' (Ishtiri) gagne la confiance des pretresses, 'ngoma-nze' (N'Goro) fait de toi l'un des leurs." },
      { name: "La Neutralite Corrosive", desc: "5 jauges de loyaute. Confiance totale d'UNE faction = mefiance des QUATRE autres. La vraie competence : 5 relations imparfaites et productives." },
      { name: "5 Horloges Incompatibles", desc: "Chaque faction compte le temps autrement. Les delais de negociation sont en notation native. Erreurs de conversion = guerres." },
      { name: "6 Traites Vivants", desc: "Tu peux etre appele pour reinterpreter un traite sans le rompre. Tu choisis les mots du nouveau texte. Les mots ont des consequences dans les deux langues." },
      { name: "PNJs vivants (Claude API)", desc: "Evil Pichon, Ratu Seri, Ixchel, Grand-Mere Griffes, Lua la Petite Mambo — chaque PNJ est alimente par Claude avec system prompt = lore Nerel + memoire des interactions." },
    ],
    scenes: [
      { name: "L'Arrivee a Songa", desc: "Un pied sec, un pied dans l'eau. On te demande si tu es Pangeen ou N'Goro. Reponse correcte : 'Je suis les deux.'" },
      { name: "La Fosse", desc: "Tu assistes a une Impression. Le raptor regarde le gamin. Tu dois traduire le silence pour l'Ambassadeur Pangeen." },
      { name: "La Mort de Ti", desc: "Ti meurt. Evil Pichon ne dit rien. Tu dois traduire son silence pour les cinq delegations. Il n'y a rien a traduire. C'est le point." },
      { name: "Le Pont de Drek", desc: "Sequence noire. 80 pas. Le jeu eteint tout. Tu avances a l'aveugle." },
      { name: "La Nuit des Couleurs", desc: "Event global annuel. Six couleurs. Les Fantomes blancs. Tu regardes les six cites briller depuis la frontiere." },
    ],
    roadmap: [
      { week: "Semaine 1-2", task: "Core prototype — Interface Comptoir de Songa, 3 PNJs Claude API, premier traite (Accord de Songa), 5 mots intraduisibles actifs" },
      { week: "Semaine 3", task: "Evil Pichon entre — PNJ le plus complexe, neutralite (jauges 5 factions), premier voyage (Higgsfield)" },
      { week: "Semaine 4", task: "Polish + Electron — Packaging desktop, upload itch.io, trailer Higgsfield + MiniMax + Suno" },
    ],
  },
];

// ── Tech Stack (from STACK_TECH.md) ──────────────────
const TECH_STACK = [
  { domain: "Code principal", tool: "Cursor + Claude Code", usage: "Tout le dev" },
  { domain: "IA narrative", tool: "Claude API", usage: "PNJs, events dynamiques" },
  { domain: "Vision IA", tool: "Open Claw", usage: "Analyse tactique visuelle" },
  { domain: "Video", tool: "Higgsfield + Kling", usage: "Assets visuels, trailer" },
  { domain: "Cinematiques", tool: "MiniMax 2.7", usage: "Moments-pivots in-game" },
  { domain: "3D image→mesh", tool: "Replicate (TripoSR)", usage: "Assets 3D depuis concepts" },
  { domain: "3D modelisation", tool: "Blender", usage: "Cleanup, rigging" },
  { domain: "Texturing", tool: "UE5 + Megascans", usage: "Bake haute fidelite" },
  { domain: "Audio", tool: "Suno", usage: "OST par civilisation" },
  { domain: "Mobile", tool: "React Native + Expo", usage: "JW Villages" },
  { domain: "Backend mobile", tool: "Supabase", usage: "Auth, DB, Realtime" },
  { domain: "PC campagne", tool: "Next.js", usage: "JW Confederation campagne" },
  { domain: "PC batailles", tool: "Unreal Engine 5", usage: "JW Confederation batailles" },
  { domain: "TWW3 mod", tool: "RPFM + AK + RMEditor", usage: "JW x TWW3" },
  { domain: "Versionning", tool: "GitHub (Oshinsu)", usage: "Tous les projets" },
];

interface PageState {
  expandedGames: Record<string, boolean>;
  expandedFoyers: boolean;
  expandedStack: boolean;
  expandedPipeline: boolean;
  expandedActions: boolean;
}

export default function ByssGamesPage() {
  const [search, setSearch] = useState("");
  const [state, setState, loaded] = useLocalStorage<PageState>(STORAGE_KEYS.BYSS_GAMES_STATE, {
    expandedGames: {},
    expandedFoyers: false,
    expandedStack: false,
    expandedPipeline: false,
    expandedActions: false,
  });

  const toggleGame = (name: string) => {
    setState({ ...state, expandedGames: { ...state.expandedGames, [name]: !state.expandedGames[name] } });
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return GAMES;
    const q = search.toLowerCase();
    return GAMES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        g.pitch.toLowerCase().includes(q)
    );
  }, [search]);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Header ────────────────────────────────── */}
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          BYSS <span className="text-[var(--color-gold)]">Games</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Division jeux video de BYSS GROUP — IP Jurassic Wars
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          Fondateur : Gary Bissol | Lore : Nerel (Nayou) | Encyclopedie live : jurassic-wars.vercel.app
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="https://jurassic-wars.vercel.app" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5 transition-all hover:bg-[var(--color-gold)]/20">
            <ExternalLink className="h-3.5 w-3.5 text-[var(--color-gold)]" />
            <span className="text-xs font-semibold text-[var(--color-gold)]">Encyclopedie JW</span>
          </a>
          <a href="https://github.com/Oshinsu" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 transition-all hover:bg-blue-500/20">
            <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">GitHub</span>
          </a>
        </div>
      </div>

      {/* ── IP Stats Grid ─────────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          L'IP en chiffres
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {IP_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center"
            >
              <s.icon className="mx-auto mb-1.5 h-5 w-5 text-[var(--color-gold)]" />
              <div className="font-mono text-2xl font-bold text-[var(--color-text)]">{s.value}</div>
              <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Foyer Strategy ────────────────────────── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
        <div
          onClick={() => setState({ ...state, expandedFoyers: !state.expandedFoyers })}
          className="flex cursor-pointer items-center justify-between p-5 transition-all hover:bg-[var(--color-surface-2)]"
        >
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-400" />
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">Strategie Foyer</h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">4 foyers independants — chaque feu brule seul</p>
            </div>
          </div>
          {state.expandedFoyers ? (
            <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          )}
        </div>
        <AnimatePresence>
          {state.expandedFoyers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--color-border-subtle)]"
            >
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {FOYERS.map((f) => (
                  <div key={f.id} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <f.icon className="h-4 w-4" style={{ color: f.color }} />
                      <span className="text-sm font-bold text-[var(--color-text)]">Foyer {f.id} — {f.name}</span>
                      {f.status === "active" && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">ACTIF</span>
                      )}
                    </div>
                    <p className="text-[10px] font-medium text-[var(--color-gold-muted)]">{f.type} | {f.timeline}</p>
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{f.desc}</p>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)] italic">{f.revenue}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Search ────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un jeu..."
          className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold)]"
        />
      </div>

      {/* ── Games ─────────────────────────────────── */}
      <div className="space-y-4">
        {filtered.map((game, i) => {
          const isExpanded = state.expandedGames[game.name] ?? false;
          return (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden"
            >
              {/* Game Header */}
              <div
                onClick={() => toggleGame(game.name)}
                className="flex cursor-pointer items-center justify-between p-5 transition-all hover:bg-[var(--color-surface-2)]"
              >
                <div className="flex items-center gap-3">
                  <game.icon className="h-5 w-5" style={{ color: game.color }} />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text)]">{game.name}</h3>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{game.subtitle}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                )}
              </div>

              {/* Game Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[var(--color-border-subtle)]"
                  >
                    <div className="space-y-5 p-5">
                      {/* Pitch */}
                      <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{game.pitch}</p>

                      {/* Stack */}
                      <div className="flex flex-wrap gap-1.5">
                        {game.stack.map((t) => (
                          <span key={t} className="rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 px-2.5 py-0.5 text-[10px] font-medium text-[var(--color-gold)]">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Civilizations (JW Villages) */}
                      {"civilizations" in game && game.civilizations && (
                        <div>
                          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">5 Civilisations asymetriques</h4>
                          <div className="space-y-2">
                            {game.civilizations.map((c) => (
                              <div key={c.name} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[var(--color-text)]">{c.name}</span>
                                  <span className="text-[10px] text-[var(--color-gold)]">
                                    {"★".repeat(c.difficulty)}{"☆".repeat(5 - c.difficulty)}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[10px] text-[var(--color-gold-muted)]">Ressource : {c.resource}</p>
                                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{c.mechanic}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mechanics (JW Confederation) */}
                      {"mechanics" in game && game.mechanics && (
                        <div>
                          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Mecaniques uniques</h4>
                          <div className="space-y-2">
                            {game.mechanics.map((m) => (
                              <div key={m.name} className="flex gap-2">
                                <Zap className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-gold)]" />
                                <div>
                                  <span className="text-xs font-bold text-[var(--color-text)]">{m.name}</span>
                                  <p className="text-[10px] text-[var(--color-text-muted)]">{m.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Units (JW Confederation) */}
                      {"units" in game && game.units && (
                        <div>
                          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Unites par civilisation</h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {game.units.map((u) => (
                              <div key={u.civ} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-2.5">
                                <span className="text-[10px] font-bold text-[var(--color-gold)]">{u.civ}</span>
                                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{u.list}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Legendary Lord (TWW3 Mod) */}
                      {"legendaryLord" in game && game.legendaryLord && (
                        <div>
                          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Legendary Lord</h4>
                          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                            <div className="text-xs font-bold text-[var(--color-text)]">{game.legendaryLord.name}</div>
                            <p className="mt-0.5 text-[10px] font-mono text-[var(--color-text-muted)]">{game.legendaryLord.stats}</p>
                            <div className="mt-2 space-y-1">
                              {game.legendaryLord.traits.map((t) => (
                                <div key={t} className="flex gap-1.5">
                                  <Star className="mt-0.5 h-2.5 w-2.5 shrink-0 text-purple-400" />
                                  <span className="text-[10px] text-[var(--color-text-muted)]">{t}</span>
                                </div>
                              ))}
                            </div>
                            <p className="mt-2 text-[10px] text-purple-300">{game.legendaryLord.companion}</p>
                          </div>
                        </div>
                      )}

                      {/* Scenes (Le Traducteur) */}
                      {"scenes" in game && game.scenes && (
                        <div>
                          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Scenes emblematiques</h4>
                          <div className="space-y-2">
                            {game.scenes.map((s: { name: string; desc: string }) => (
                              <div key={s.name} className="flex gap-2">
                                <Eye className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                                <div>
                                  <span className="text-xs font-bold text-[var(--color-text)]">{s.name}</span>
                                  <p className="text-[10px] text-[var(--color-text-muted)]">{s.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Roadmap */}
                      <div>
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Roadmap</h4>
                        <div className="space-y-1.5">
                          {game.roadmap.map((r, idx) => (
                            <div key={idx} className="flex gap-3">
                              <span className="w-28 shrink-0 text-[10px] font-bold text-[var(--color-gold)]">{r.week}</span>
                              <span className="text-[10px] text-[var(--color-text-muted)]">{r.task}</span>
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

      {filtered.length === 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Aucun jeu ne correspond a &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* ── Tech Stack ────────────────────────────── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
        <div
          onClick={() => setState({ ...state, expandedStack: !state.expandedStack })}
          className="flex cursor-pointer items-center justify-between p-5 transition-all hover:bg-[var(--color-surface-2)]"
        >
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">Stack technique globale</h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">15 outils — du code a l'audio</p>
            </div>
          </div>
          {state.expandedStack ? (
            <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          )}
        </div>
        <AnimatePresence>
          {state.expandedStack && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--color-border-subtle)]"
            >
              <div className="p-5">
                <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
                        <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Domaine</th>
                        <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Outil</th>
                        <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Usage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TECH_STACK.map((t, i) => (
                        <tr key={i} className="border-b border-[var(--color-border-subtle)] last:border-b-0">
                          <td className="px-3 py-2 font-medium text-[var(--color-text)]">{t.domain}</td>
                          <td className="px-3 py-2 text-[var(--color-gold)]">{t.tool}</td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">{t.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 3D Asset Pipeline ──────────────────────── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
        <div
          onClick={() => setState({ ...state, expandedPipeline: !state.expandedPipeline })}
          className="flex cursor-pointer items-center justify-between p-5 transition-all hover:bg-[var(--color-surface-2)]"
        >
          <div className="flex items-center gap-3">
            <Workflow className="h-5 w-5 text-violet-400" />
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">Pipeline 3D</h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">Higgsfield &rarr; Replicate &rarr; Blender &rarr; UE5</p>
            </div>
          </div>
          {state.expandedPipeline ? (
            <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          )}
        </div>
        <AnimatePresence>
          {state.expandedPipeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--color-border-subtle)]"
            >
              <div className="space-y-4 p-5">
                {/* Pipeline Steps */}
                <div className="space-y-3">
                  {[
                    { step: "1. Concept Art", tool: "Higgsfield", desc: "Prompt vue propre, fond blanc/uni, lighting neutre. Generer 4-6 vues : face / profil G / profil D / 3/4 / dos." },
                    { step: "2. Generation 3D", tool: "Replicate", desc: "TripoSR : image -> mesh .glb (30s). InstantMesh : mesh + UV map (2-3 min). Comparer et garder le meilleur." },
                    { step: "3. Nettoyage", tool: "Blender", desc: "Retopologie : Infanterie 3K-8K tris, Cavalerie 8K-20K tris, Brachiosaure/T-Rex 20K-40K tris. UV unwrap propre." },
                    { step: "4. Texturing HF", tool: "UE5 + Megascans", desc: "Peau dino -> Reptile Scales, Armure pangeen -> Dark Forged Iron + cuivre, Obsidienne ishtiri -> Black Volcanic Glass, Laque volonienne -> Lacquered Wood, Peau N'Goro -> Wet Bark + bioluminescence." },
                    { step: "5. Rigging", tool: "Blender + RMEditor", desc: "Humain -> rig Human, Raptor -> Cold One, Carnosaur -> Carnosaur Lizardmen, Brachi -> Dread Saurian, Quetzalcoatlus -> Coatl/Dragon wings." },
                    { step: "6. Conversion", tool: "Paint.net", desc: "Base Color .tga -> .dds BC1 (sRGB), Normal Map -> .dds BC3/DXT5 (Linear), Material Map -> .dds BC1 (sRGB)." },
                  ].map((p) => (
                    <div key={p.step} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-text)]">{p.step}</span>
                        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[9px] font-semibold text-violet-400">{p.tool}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{p.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Phase 1 Priority Assets */}
                <div>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Priorite Phase 1</h4>
                  <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
                          <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Asset</th>
                          <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Civ</th>
                          <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Skeleton</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { asset: "Guerrier Pangeen", civ: "Pangeen", skeleton: "Human standard", urgent: true },
                          { asset: "Raptor Arkhani", civ: "Arkhani", skeleton: "Cold One", urgent: true },
                          { asset: "Cavalier Arkhani", civ: "Arkhani", skeleton: "Cold One Rider", urgent: true },
                          { asset: "Brachiosaure de siege", civ: "Pangeen", skeleton: "Dread Saurian", urgent: false },
                          { asset: "Guerrier N'Goro", civ: "N'Goro", skeleton: "Human standard", urgent: false },
                          { asset: "Quetzalcoatlus", civ: "Ishtiri", skeleton: "Coatl", urgent: false },
                        ].map((a, i) => (
                          <tr key={i} className="border-b border-[var(--color-border-subtle)] last:border-b-0">
                            <td className="px-3 py-2 font-medium text-[var(--color-text)]">
                              {a.urgent && <Flame className="mr-1 inline h-3 w-3 text-orange-400" />}
                              {a.asset}
                            </td>
                            <td className="px-3 py-2 text-[var(--color-gold)]">{a.civ}</td>
                            <td className="px-3 py-2 text-[var(--color-text-muted)]">{a.skeleton}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Priority Actions Checklist ────────────── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
        <div
          onClick={() => setState({ ...state, expandedActions: !state.expandedActions })}
          className="flex cursor-pointer items-center justify-between p-5 transition-all hover:bg-[var(--color-surface-2)]"
        >
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">Actions prioritaires</h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">Backlog global BYSS GAMES — une a la fois</p>
            </div>
          </div>
          {state.expandedActions ? (
            <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          )}
        </div>
        <AnimatePresence>
          {state.expandedActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--color-border-subtle)]"
            >
              <div className="space-y-5 p-5">
                {/* JW Villages */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--color-text)]">
                    <Smartphone className="h-3.5 w-3.5 text-[#FFD700]" /> JW Villages
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">PRIORITE 1</span>
                  </h4>
                  <div className="space-y-1.5">
                    {["Repo GitHub cree", "Expo app setup", "Carte village SVG (Pangeen)", "5 batiments Pangeens avec timers", "Ressources millet + bronze", "1 raid basique", "Integration Supabase (auth + data)", "Civilisation Arkhani (camp mobile)", "Mecanique Impression (Fosse)", "Mort permanente du raptor", "Prix ambre Realtime (Volonien)", "Claude API events dynamiques", "Traites inter-civilisation", "Soft launch itch.io"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 shrink-0 rounded border border-[var(--color-border-subtle)]" />
                        <span className="text-[10px] text-[var(--color-text-muted)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* JW x TWW3 Mod */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--color-text)]">
                    <Wrench className="h-3.5 w-3.5 text-[#8B5CF6]" /> JW x TWW3 Mod
                  </h4>
                  <div className="space-y-1.5">
                    {["Installer RPFM + AK", "Creer premier pack : jw_arkhan.pack", "4 unites Arkhani (reskin Cold One)", "Evil Pichon Legendary Lord basique", "Test Custom Battle", "Upload Steam Workshop alpha", "Assets originaux (Replicate -> Blender -> RMV2)", "Mecanique Silence (Lua)", "Pooled Resource Prestige", "Camp mobile (Horde)", "Contacter Mixu pour startpos"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 shrink-0 rounded border border-[var(--color-border-subtle)]" />
                        <span className="text-[10px] text-[var(--color-text-muted)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* JW Confederation */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--color-text)]">
                    <Monitor className="h-3.5 w-3.5 text-[#3B82F6]" /> JW Confederation
                  </h4>
                  <div className="space-y-1.5">
                    {["Carte SVG 5 civilisations (Next.js)", "Tour par tour basique", "Claude API events", "JSON bridge -> UE5", "UE5 prototype bataille", "Steam Early Access page"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 shrink-0 rounded border border-[var(--color-border-subtle)]" />
                        <span className="text-[10px] text-[var(--color-text-muted)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* JW Le Traducteur */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--color-text)]">
                    <Languages className="h-3.5 w-3.5 text-[#10B981]" /> JW Le Traducteur
                  </h4>
                  <div className="space-y-1.5">
                    {["Interface Comptoir de Songa", "Claude API 3 PNJs", "5 mots intraduisibles actifs", "Evil Pichon PNJ", "Electron packaging", "itch.io upload"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 shrink-0 rounded border border-[var(--color-border-subtle)]" />
                        <span className="text-[10px] text-[var(--color-text-muted)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Work Rules */}
                <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 p-3">
                  <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-gold)]">Regles de travail</h4>
                  <div className="space-y-1">
                    {[
                      "Un foyer a la fois. Quand tu travailles sur Villages, tu travailles sur Villages.",
                      "Cursor first. Tout le code passe par Cursor + Claude Code.",
                      "Lore de Nerel = intouchable. Jamais diverger sans valider avec Nerel.",
                      "Prototype en 2 semaines. Sinon le design est trop complexe. Simplifie.",
                      "Assets Higgsfield/Replicate = apres la mecanique. D'abord ca marche avec des rectangles.",
                    ].map((rule) => (
                      <p key={rule} className="text-[10px] text-[var(--color-text-muted)]">{rule}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer Quote ──────────────────────────── */}
      <div className="group relative">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 text-center">
          <Flame className="mx-auto mb-2 h-6 w-6 text-orange-400" />
          <p className="text-sm italic text-[var(--color-text-muted)]">
            &ldquo;Cinq foyers. Cinq feux. Un jour ils se touchent et tout le champ brule.&rdquo;
          </p>
          <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            Croissance par Foyer — Gary Bissol
          </p>
        </div>
      </div>
    </div>
  );
}
