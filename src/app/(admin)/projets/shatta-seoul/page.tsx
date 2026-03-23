"use client";

import { motion } from "motion/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Music, Globe, TrendingUp, Users, Video, Mic, ExternalLink } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SHATTA SEOUL — Marketing Musical Caribéen × K-pop
   157K views / 200€ = €0.0013 CPV (17x market benchmark)
   Phase 1: France → Phase 2: Afrique → Phase 3: Corée
   ═══════════════════════════════════════════════════════ */

const ARTISTS = [
  { name: "X-Man", genre: "Shatta", streams: "Pioneer", status: "active" },
  { name: "Shannon", genre: "Shatta/Pop", streams: "Sony Publishing", status: "signed" },
  { name: "Maureen", genre: "Shatta/Dance", streams: "+314% YoY", status: "rising" },
  { name: "Tai J (Danjaa)", genre: "Shatta", streams: "Emerging", status: "active" },
  { name: "Marginal", genre: "Shatta/Rap", streams: "BYSS client", status: "active" },
];

const PHASES = [
  { phase: "Phase 1 \u2014 France", desc: "Consolidation marche francais. Proof: Maureen success.", color: "#3B82F6" },
  { phase: "Phase 2 \u2014 Afrique", desc: "Afrique francophone. CPM $1.50 vs France $4-8.", color: "#10B981" },
  { phase: "Phase 3 \u2014 Coree", desc: "BM/KARD confirme interet. Bridge K-pop \u00d7 Caraibe.", color: "#00B4D8" },
];

const AI_PERSONAS = [
  { name: "Soli", desc: "Persona shatta coreen via Kling + XTTS-v2 (Replicate) + Suno", flag: "\u{1F1F0}\u{1F1F7}" },
  { name: "Shatta Tokyo", desc: "Japanese dancehall IA \u2014 cross-cultural sans appropriation", flag: "\u{1F1EF}\u{1F1F5}" },
];

const PHASE_STATUSES = ["planned", "in_progress", "done"] as const;
type PhaseStatus = (typeof PHASE_STATUSES)[number];
function cycleStatus(s: PhaseStatus): PhaseStatus {
  return PHASE_STATUSES[(PHASE_STATUSES.indexOf(s) + 1) % PHASE_STATUSES.length];
}

function statusStyle(s: PhaseStatus) {
  if (s === "done") return { bg: "#10B98120", color: "#10B981", label: "done" };
  if (s === "in_progress") return { bg: "#22D3EE20", color: "#22D3EE", label: "in progress" };
  return { bg: "#6B728020", color: "#6B7280", label: "planned" };
}

interface State {
  phases: Record<string, PhaseStatus>;
  artists: Record<string, boolean>; // true = active, false = inactive
}

const defaultState = (): State => ({
  phases: Object.fromEntries(PHASES.map((p) => [p.phase, "planned" as PhaseStatus])),
  artists: Object.fromEntries(ARTISTS.map((a) => [a.name, true])),
});

export default function ShattaSeoulPage() {
  const [state, setState, loaded] = useLocalStorage<State>(STORAGE_KEYS.SHATTA_SEOUL_MILESTONES, defaultState());

  const togglePhase = (name: string) => {
    setState({ ...state, phases: { ...state.phases, [name]: cycleStatus(state.phases[name] ?? "planned") } });
  };

  const toggleArtist = (name: string) => {
    setState({ ...state, artists: { ...state.artists, [name]: !(state.artists[name] ?? true) } });
  };

  const phaseVals = Object.values(state.phases);
  const activeArtists = Object.values(state.artists).filter(Boolean).length;
  const donePhases = phaseVals.filter((s) => s === "done").length;
  const totalItems = phaseVals.length + ARTISTS.length;
  const doneItems = donePhases + activeArtists;
  const pct = Math.round((doneItems / totalItems) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          Shatta <span className="text-[var(--color-gold)]">Seoul</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Marketing musical caribeen \u00d7 K-pop — 157K views / 200EUR = 0.0013EUR CPV (17x benchmark)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="https://www.youtube.com/@Byssgroup97" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 transition-all hover:bg-red-500/20">
            <ExternalLink className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400">Visiter YouTube</span>
          </a>
          <a href="https://www.instagram.com/gary_byss" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 transition-all hover:bg-pink-500/20">
            <ExternalLink className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-xs font-semibold text-pink-400">Visiter Instagram</span>
          </a>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Progression globale</span>
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
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{donePhases}/{phaseVals.length} phases done &middot; {activeArtists}/{ARTISTS.length} artists active</p>
      </div>

      {/* Performance Banner */}
      <div className="group relative">
        <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-mono text-2xl font-bold text-[var(--color-gold)]">157K</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">views / 200EUR budget</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-[var(--color-cyan)]">0.0013EUR</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">CPV (17x benchmark)</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-[#10B981]">90-110</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">BPM genre shatta</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] px-3 py-2 text-xs text-[var(--color-text-muted)] whitespace-nowrap shadow-xl">
            157K views / 200EUR = 0.0013EUR CPV — Source : Meta Ads Manager
          </div>
        </div>
      </div>

      {/* Artists — checkable */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Mic className="h-3 w-3 text-[var(--color-gold)]" />Artistes — click to toggle active/inactive
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {ARTISTS.map((a, i) => {
            const isActive = state.artists[a.name] ?? true;
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggleArtist(a.name)}
                className={`cursor-pointer rounded-xl border p-3 text-center transition-all hover:border-[var(--color-gold)] ${
                  isActive
                    ? "border-[var(--color-cyan)] bg-[#22D3EE08]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] opacity-50"
                }`}
              >
                <Music className={`mx-auto mb-1 h-4 w-4 ${isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"}`} />
                <h3 className="text-xs font-bold text-[var(--color-text)]">{a.name}</h3>
                <p className="text-[9px] text-[var(--color-text-muted)]">{a.genre}</p>
                <p className="text-[9px] text-[var(--color-cyan)]">{a.streams}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                  isActive ? "bg-[#10B98115] text-[#10B981]" : "bg-[#EF444415] text-[#EF4444]"
                }`}>
                  {isActive ? "active" : "inactive"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Phases — clickable */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Phases — click to toggle
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {PHASES.map((p, i) => {
            const s = state.phases[p.phase] ?? "planned";
            const st = statusStyle(s);
            return (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => togglePhase(p.phase)}
                className="cursor-pointer rounded-xl border p-5 transition-all hover:border-[var(--color-gold)]"
                style={{ borderColor: `${st.color}40`, background: `${st.color}08` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ color: st.color }}>{p.phase}</h3>
                  <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Social Proof — Instagram */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Globe className="h-3 w-3 text-pink-400" />Social Proof — Behind the scenes
        </h2>
        <div className="overflow-hidden rounded-xl border border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-purple-500/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">@gary_byss</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Behind the scenes, tournages, studio sessions</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/gary_byss/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" />
              Suivre sur Instagram
            </a>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Contenu exclusif", desc: "Tournages, studio, making-of" },
              { label: "Artistes", desc: "Collaborations en direct" },
              { label: "BYSS GROUP", desc: "Le quotidien du studio" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-pink-500/10 bg-pink-500/5 p-3">
                <p className="text-xs font-semibold text-pink-400">{item.label}</p>
                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Personas */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Video className="h-3 w-3 text-[var(--color-cyan)]" />Personas IA musicaux
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {AI_PERSONAS.map((p) => (
            <div key={p.name} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <span className="text-2xl">{p.flag}</span>
              <h3 className="mt-1 text-sm font-bold text-[var(--color-text)]">{p.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
