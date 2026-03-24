"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gamepad2, Plus, ChevronRight, ChevronDown, X,
  Users, Brain, Cpu, Target, Bot, Code, Palette,
  Music, Shield, Zap, Play, Clock, Star,
  Loader2, Sparkles, GitBranch, Layout,
  CheckCircle2, Circle, ArrowRight, GripVertical,
  Crown, Eye, Swords, Globe, Smartphone,
  Monitor, Wrench, Volume2, Bug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { onSprintCompleted } from "@/lib/synergies";

/* ═══════════════════════════════════════════════════════════════
   BYSS GAMES STUDIO
   4 jeux x Godot 4 x Claude Agents
   Pipeline: Concept → Prototype → Alpha → Beta → Gold
   ═══════════════════════════════════════════════════════════════ */

// ─── Types ──────────────────────────────────────────────────────

type GameStatus = "concept" | "prototype" | "alpha" | "beta" | "gold";
type Priority = "P0" | "P1" | "P2" | "P3";
type SprintColumn = "backlog" | "sprint" | "in_progress" | "review" | "done";
type AgentStatus = "active" | "idle";
type AgentTier = 1 | 2 | 3;
type AIAction = "brainstorm" | "prototype" | "sprint-plan" | "code-review";

interface GameProject {
  slug: string;
  name: string;
  subtitle: string;
  genre: string;
  engine: string;
  status: GameStatus;
  progress: number;
  sprintCount: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  assets: { models: number; textures: number; sounds: number; scripts: number };
}

interface SprintTask {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  estimate: number;
  column: SprintColumn;
  gameSlug: string;
}

interface StudioAgent {
  name: string;
  role: string;
  tier: AgentTier;
  icon: React.ComponentType<{ className?: string }>;
  status: AgentStatus;
  color: string;
}

// ─── Constants ──────────────────────────────────────────────────

const PIPELINE_STAGES: { key: GameStatus; label: string }[] = [
  { key: "concept", label: "Concept" },
  { key: "prototype", label: "Prototype" },
  { key: "alpha", label: "Alpha" },
  { key: "beta", label: "Beta" },
  { key: "gold", label: "Gold" },
];

const SPRINT_COLUMNS: { key: SprintColumn; label: string; color: string }[] = [
  { key: "backlog", label: "Backlog", color: "text-gray-400" },
  { key: "sprint", label: "Sprint", color: "text-blue-400" },
  { key: "in_progress", label: "In Progress", color: "text-amber-400" },
  { key: "review", label: "Review", color: "text-purple-400" },
  { key: "done", label: "Done", color: "text-emerald-400" },
];

const GAMES: GameProject[] = [
  {
    slug: "jw-villages",
    name: "JW Villages",
    subtitle: "Builder mobile F2P",
    genre: "City Builder",
    engine: "Godot 4 + Supabase",
    status: "prototype",
    progress: 25,
    sprintCount: 4,
    icon: Smartphone,
    color: "#00D4FF",
    description: "5 civilisations asymetriques. Ressources, construction, diplomatie.",
    assets: { models: 12, textures: 34, sounds: 8, scripts: 22 },
  },
  {
    slug: "jw-confederation",
    name: "JW Confederation",
    subtitle: "Strategie campagne",
    genre: "Grand Strategy",
    engine: "Next.js + UE5",
    status: "concept",
    progress: 10,
    sprintCount: 1,
    icon: Globe,
    color: "#FFB800",
    description: "Double layer: web strategique + UE5 batailles temps reel.",
    assets: { models: 0, textures: 5, sounds: 2, scripts: 8 },
  },
  {
    slug: "tww3-mod",
    name: "TWW3 Mod",
    subtitle: "Evil Pichon Legendary Lord",
    genre: "Total War Mod",
    engine: "Assembly Kit + Lua",
    status: "alpha",
    progress: 45,
    sprintCount: 7,
    icon: Swords,
    color: "#FF4444",
    description: "Legendary lord faction. Custom units, skills, campaign mechanics.",
    assets: { models: 28, textures: 56, sounds: 14, scripts: 38 },
  },
  {
    slug: "le-traducteur",
    name: "Le Traducteur",
    subtitle: "Narratif diplomatique",
    genre: "Narrative RPG",
    engine: "Godot 4 + Ink + Claude API",
    status: "concept",
    progress: 15,
    sprintCount: 2,
    icon: Crown,
    color: "#A855F7",
    description: "Diplomatie par le langage. Chaque mot pese. IA generative.",
    assets: { models: 3, textures: 10, sounds: 6, scripts: 15 },
  },
];

const STUDIO_TEAM: StudioAgent[] = [
  // Tier 1 — Directors
  { name: "Gary", role: "Creative Director", tier: 1, icon: Crown, status: "active", color: "#00D4FF" },
  { name: "Claude/Evren", role: "Technical Director", tier: 1, icon: Cpu, status: "active", color: "#A855F7" },
  { name: "Claude/Sorel", role: "Producer", tier: 1, icon: Target, status: "active", color: "#FFB800" },
  // Tier 2 — Leads
  { name: "Nerel", role: "Art Director + World Builder", tier: 2, icon: Palette, status: "active", color: "#FF6B9D" },
  { name: "Claude", role: "Game Designer", tier: 2, icon: Brain, status: "active", color: "#00D4FF" },
  { name: "Claude", role: "Lead Programmer", tier: 2, icon: Code, status: "active", color: "#10B981" },
  // Tier 3 — Specialists
  { name: "Agent", role: "Gameplay Programmer", tier: 3, icon: Gamepad2, status: "idle", color: "#6B7280" },
  { name: "Agent", role: "Systems Designer", tier: 3, icon: Wrench, status: "idle", color: "#6B7280" },
  { name: "Agent", role: "Sound Designer", tier: 3, icon: Volume2, status: "idle", color: "#6B7280" },
  { name: "Agent", role: "QA Lead", tier: 3, icon: Bug, status: "idle", color: "#6B7280" },
];

const AI_ACTIONS: { key: AIAction; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { key: "brainstorm", label: "Brainstorm", icon: Sparkles, desc: "Generer 5 idees de mecaniques" },
  { key: "prototype", label: "Prototype", icon: Code, desc: "GDScript snippet pour une mecanique" },
  { key: "sprint-plan", label: "Sprint Plan", icon: Layout, desc: "Analyser backlog, prioriser" },
  { key: "code-review", label: "Code Review", icon: Eye, desc: "Review des derniers changements" },
];

const GDD_SECTIONS = [
  "Core Loop", "Civilisations", "Mecaniques", "Economie", "Tech Stack", "Roadmap",
];

// ─── Storage helpers ────────────────────────────────────────────

function loadTasks(gameSlug: string): SprintTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`byss-games-sprint-${gameSlug}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTasks(gameSlug: string, tasks: SprintTask[]) {
  try {
    localStorage.setItem(`byss-games-sprint-${gameSlug}`, JSON.stringify(tasks));
  } catch { /* ignore */ }
}

function loadProgress(slug: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`byss-games-progress-${slug}`);
    return raw ? Number(raw) : fallback;
  } catch { return fallback; }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Priority badge ─────────────────────────────────────────────

function PriorityBadge({ p }: { p: Priority }) {
  const colors: Record<Priority, string> = {
    P0: "bg-red-500/20 text-red-400 border-red-500/30",
    P1: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    P2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    P3: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold border", colors[p])}>
      {p}
    </span>
  );
}

// ─── Status badge ───────────────────────────────────────────────

function StatusBadge({ status }: { status: GameStatus }) {
  const map: Record<GameStatus, { label: string; color: string }> = {
    concept: { label: "Concept", color: "bg-gray-500/20 text-gray-400" },
    prototype: { label: "Prototype", color: "bg-blue-500/20 text-blue-400" },
    alpha: { label: "Alpha", color: "bg-amber-500/20 text-amber-400" },
    beta: { label: "Beta", color: "bg-purple-500/20 text-purple-400" },
    gold: { label: "Gold", color: "bg-emerald-500/20 text-emerald-400" },
  };
  const { label, color } = map[status];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider", color)}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function GamesStudioPage() {
  const [expandedGame, setExpandedGame] = useState<string | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [tasks, setTasks] = useState<Record<string, SprintTask[]>>({});
  const [addingTask, setAddingTask] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ game: string; action: string; result: string } | null>(null);
  const [gddExpanded, setGddExpanded] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // New task form
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("P1");
  const [newAssignee, setNewAssignee] = useState("Claude");
  const [newEstimate, setNewEstimate] = useState(2);

  useEffect(() => {
    const loaded: Record<string, SprintTask[]> = {};
    GAMES.forEach((g) => { loaded[g.slug] = loadTasks(g.slug); });
    setTasks(loaded);
    setHydrated(true);
  }, []);

  const addTask = useCallback((gameSlug: string) => {
    if (!newTitle.trim()) return;
    const task: SprintTask = {
      id: uid(),
      title: newTitle.trim(),
      assignee: newAssignee,
      priority: newPriority,
      estimate: newEstimate,
      column: "backlog",
      gameSlug,
    };
    setTasks((prev) => {
      const updated = { ...prev, [gameSlug]: [...(prev[gameSlug] || []), task] };
      saveTasks(gameSlug, updated[gameSlug]);
      return updated;
    });
    setNewTitle("");
    setAddingTask(null);
  }, [newTitle, newAssignee, newPriority, newEstimate]);

  const moveTask = useCallback((gameSlug: string, taskId: string, direction: "forward" | "backward") => {
    const colOrder: SprintColumn[] = ["backlog", "sprint", "in_progress", "review", "done"];
    setTasks((prev) => {
      const gameTasks = [...(prev[gameSlug] || [])];
      const idx = gameTasks.findIndex((t) => t.id === taskId);
      if (idx === -1) return prev;
      const task = gameTasks[idx];
      const colIdx = colOrder.indexOf(task.column);
      const newColIdx = direction === "forward" ? Math.min(colIdx + 1, 4) : Math.max(colIdx - 1, 0);
      gameTasks[idx] = { ...task, column: colOrder[newColIdx] };
      const updated = { ...prev, [gameSlug]: gameTasks };
      saveTasks(gameSlug, updated[gameSlug]);

      // Synergy: check if all sprint tasks are now done
      if (colOrder[newColIdx] === "done") {
        const sprintTasks = gameTasks.filter((t) => t.column !== "backlog");
        const allDone = sprintTasks.length > 0 && sprintTasks.every((t) => t.column === "done");
        if (allDone) {
          const game = GAMES.find((g) => g.slug === gameSlug);
          onSprintCompleted(game?.name || gameSlug, game?.sprintCount || 0);
        }
      }

      return updated;
    });
  }, []);

  const deleteTask = useCallback((gameSlug: string, taskId: string) => {
    setTasks((prev) => {
      const gameTasks = (prev[gameSlug] || []).filter((t) => t.id !== taskId);
      const updated = { ...prev, [gameSlug]: gameTasks };
      saveTasks(gameSlug, updated[gameSlug]);
      return updated;
    });
  }, []);

  const runAI = useCallback(async (game: GameProject, action: AIAction) => {
    setAiLoading(`${game.slug}-${action}`);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "game_studio",
          data: {
            gameName: game.name,
            gameSlug: game.slug,
            gameStatus: game.status,
            sprintCount: game.sprintCount,
            aiAction: action,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult({ game: game.slug, action, result: data.result || "Pas de resultat." });
      } else {
        setAiResult({ game: game.slug, action, result: `Erreur API (${res.status}). Reessayez.` });
      }
    } catch (err) {
      console.error("[games] AI error:", err);
      setAiResult({ game: game.slug, action, result: "Le systeme a flanché. Pas le vaisseau." });
    }
    setAiLoading(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080F] p-4 lg:p-8">
      {/* ─── Header ────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF]">
            <Gamepad2 className="h-5 w-5 text-[#06080F]" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-clash-display)] text-2xl font-bold tracking-wide text-[var(--color-text)]">
              BYSS GAMES STUDIO
            </h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">
              4 jeux &times; Godot 4 &times; Claude Agents
            </p>
          </div>
        </div>
        {/* Quick stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: "Projets actifs", value: "4", color: "#00D4FF" },
            { label: "Sprints total", value: String(GAMES.reduce((a, g) => a + g.sprintCount, 0)), color: "#FFB800" },
            { label: "Assets", value: String(GAMES.reduce((a, g) => a + g.assets.models + g.assets.textures + g.assets.sounds + g.assets.scripts, 0)), color: "#A855F7" },
            { label: "Agents", value: String(STUDIO_TEAM.length), color: "#10B981" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[12px] text-[var(--color-text-muted)]">{s.label}</span>
              <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Production Pipeline ─────────────────────────── */}
      <div className="mb-8 rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5">
        <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
          Production Pipeline
        </h2>
        <div className="flex items-center gap-1 mb-5">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.key} className="flex items-center gap-1 flex-1">
              <div className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider border",
                "border-[var(--color-border-subtle)] bg-[#0F0F1A] text-[var(--color-text-muted)]"
              )}>
                {stage.label}
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <ArrowRight className="h-3 w-3 text-[var(--color-text-muted)]/40 shrink-0" />
              )}
            </div>
          ))}
        </div>
        {/* Per-game pipeline position */}
        <div className="space-y-2">
          {GAMES.map((game) => {
            const stageIdx = PIPELINE_STAGES.findIndex((s) => s.key === game.status);
            const Icon = game.icon as React.ComponentType<{ className?: string; color?: string }>;
            return (
              <div key={game.slug} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-40 shrink-0">
                  <Icon className="h-3.5 w-3.5" color={game.color as string} />
                  <span className="text-[12px] font-medium text-[var(--color-text)] truncate">{game.name}</span>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  {PIPELINE_STAGES.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 flex-1 rounded-full transition-colors",
                        i <= stageIdx ? "opacity-100" : "opacity-20"
                      )}
                      style={{ backgroundColor: i <= stageIdx ? game.color : "#1a1a2e" }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold tabular-nums w-10 text-right" color={game.color as string}>
                  {game.progress}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Game Cards ──────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        {GAMES.map((game) => {
          const Icon = game.icon as React.ComponentType<{ className?: string; color?: string }>;
          const isExpanded = expandedGame === game.slug;
          const gameTasks = tasks[game.slug] || [];
          const progress = hydrated ? loadProgress(game.slug, game.progress) : game.progress;

          return (
            <motion.div
              key={game.slug}
              layout
              className={cn(
                "rounded-xl border bg-[#0A0A14] transition-colors",
                isExpanded ? "border-[var(--color-border-subtle)] lg:col-span-2" : "border-[var(--color-border-subtle)]"
              )}
            >
              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${game.color}15` }}
                    >
                      <Icon className="h-5 w-5" color={game.color as string} />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-clash-display)] text-base font-bold text-[var(--color-text)]">
                        {game.name}
                      </h3>
                      <p className="text-[12px] text-[var(--color-text-muted)]">{game.subtitle}</p>
                    </div>
                  </div>
                  <StatusBadge status={game.status} />
                </div>

                <p className="text-[13px] text-[var(--color-text-muted)] mb-3">{game.description}</p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--color-text-muted)] mb-3">
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="h-3 w-3" /> {game.genre}
                  </span>
                  <span className="flex items-center gap-1">
                    <Code className="h-3 w-3" /> {game.engine}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3" /> Sprint {game.sprintCount}
                  </span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#0F0F1A] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: game.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[12px] font-bold tabular-nums" color={game.color as string}>
                    {progress}%
                  </span>
                </div>

                {/* Asset counters */}
                <div className="mt-3 flex gap-4 text-[11px] text-[var(--color-text-muted)]">
                  <span>{game.assets.models} models</span>
                  <span>{game.assets.textures} textures</span>
                  <span>{game.assets.sounds} sons</span>
                  <span>{game.assets.scripts} scripts</span>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setExpandedGame(isExpanded ? null : game.slug)}
                  className="mt-4 flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-1.5 text-[12px] font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-text)]"
                >
                  {isExpanded ? "Fermer" : "Ouvrir"}
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
                    <ChevronRight className="h-3 w-3" />
                  </motion.div>
                </button>
              </div>

              {/* ─── Expanded: Sprint Board + GDD + AI ──── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-[var(--color-border-subtle)]"
                  >
                    <div className="p-5 space-y-6">
                      {/* Sprint Kanban */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Sprint Board
                          </h4>
                          <button
                            onClick={() => setAddingTask(addingTask === game.slug ? null : game.slug)}
                            className="flex items-center gap-1 rounded-md bg-[var(--color-gold)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20 transition-colors"
                          >
                            <Plus className="h-3 w-3" /> Ajouter Tache
                          </button>
                        </div>

                        {/* Add task form */}
                        <AnimatePresence>
                          {addingTask === game.slug && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mb-4"
                            >
                              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3 space-y-2">
                                <input
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  placeholder="Titre de la tache..."
                                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#06080F] px-3 py-1.5 text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-gold)]/40"
                                  onKeyDown={(e) => e.key === "Enter" && addTask(game.slug)}
                                />
                                <div className="flex flex-wrap gap-2">
                                  <select
                                    value={newPriority}
                                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                                    className="rounded-md border border-[var(--color-border-subtle)] bg-[#06080F] px-2 py-1 text-[12px] text-[var(--color-text)] outline-none"
                                  >
                                    <option value="P0">P0 — Critique</option>
                                    <option value="P1">P1 — Important</option>
                                    <option value="P2">P2 — Normal</option>
                                    <option value="P3">P3 — Nice-to-have</option>
                                  </select>
                                  <input
                                    value={newAssignee}
                                    onChange={(e) => setNewAssignee(e.target.value)}
                                    placeholder="Assignee"
                                    className="rounded-md border border-[var(--color-border-subtle)] bg-[#06080F] px-2 py-1 text-[12px] text-[var(--color-text)] outline-none w-28"
                                  />
                                  <div className="flex items-center gap-1 rounded-md border border-[var(--color-border-subtle)] bg-[#06080F] px-2 py-1">
                                    <Clock className="h-3 w-3 text-[var(--color-text-muted)]" />
                                    <input
                                      type="number"
                                      value={newEstimate}
                                      onChange={(e) => setNewEstimate(Number(e.target.value))}
                                      min={1}
                                      max={40}
                                      className="w-10 bg-transparent text-[12px] text-[var(--color-text)] outline-none"
                                    />
                                    <span className="text-[11px] text-[var(--color-text-muted)]">h</span>
                                  </div>
                                  <button
                                    onClick={() => addTask(game.slug)}
                                    className="rounded-md bg-[var(--color-gold)] px-3 py-1 text-[12px] font-bold text-[#06080F] hover:opacity-90"
                                  >
                                    Ajouter
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Kanban columns */}
                        <div className="grid grid-cols-5 gap-2">
                          {SPRINT_COLUMNS.map((col) => {
                            const colTasks = gameTasks.filter((t) => t.column === col.key);
                            return (
                              <div key={col.key} className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-2 min-h-[120px]">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={cn("text-[11px] font-bold uppercase tracking-wider", col.color)}>
                                    {col.label}
                                  </span>
                                  <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums">
                                    {colTasks.length}
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {colTasks.map((task) => (
                                    <div
                                      key={task.id}
                                      className="group rounded-md border border-[var(--color-border-subtle)] bg-[#06080F] p-2 text-[11px] hover:border-[var(--color-gold)]/30 transition-colors"
                                    >
                                      <div className="flex items-start justify-between gap-1 mb-1">
                                        <span className="font-medium text-[var(--color-text)] leading-tight">{task.title}</span>
                                        <button
                                          onClick={() => deleteTask(game.slug, task.id)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        >
                                          <X className="h-3 w-3 text-red-400" />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <PriorityBadge p={task.priority} />
                                          <span className="text-[var(--color-text-muted)]">{task.estimate}h</span>
                                        </div>
                                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          {col.key !== "backlog" && (
                                            <button
                                              onClick={() => moveTask(game.slug, task.id, "backward")}
                                              className="rounded p-0.5 hover:bg-[var(--color-surface)]"
                                            >
                                              <ChevronRight className="h-3 w-3 text-[var(--color-text-muted)] rotate-180" />
                                            </button>
                                          )}
                                          {col.key !== "done" && (
                                            <button
                                              onClick={() => moveTask(game.slug, task.id, "forward")}
                                              className="rounded p-0.5 hover:bg-[var(--color-surface)]"
                                            >
                                              <ChevronRight className="h-3 w-3 text-[var(--color-text-muted)]" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                                        {task.assignee}
                                      </div>
                                    </div>
                                  ))}
                                  {colTasks.length === 0 && (
                                    <div className="py-3 text-center text-[10px] text-[var(--color-text-muted)]/40">
                                      —
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* GDD Viewer */}
                      <div>
                        <h4 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                          Game Design Document
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {GDD_SECTIONS.map((section) => {
                            const key = `${game.slug}-${section}`;
                            const open = gddExpanded[key];
                            return (
                              <button
                                key={section}
                                onClick={() => setGddExpanded((p) => ({ ...p, [key]: !open }))}
                                className={cn(
                                  "rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3 text-left transition-colors hover:border-[var(--color-gold)]/30",
                                  open && "border-[var(--color-gold)]/30"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[12px] font-medium text-[var(--color-text)]">{section}</span>
                                  <ChevronDown className={cn("h-3 w-3 text-[var(--color-text-muted)] transition-transform", open && "rotate-180")} />
                                </div>
                                {open && (
                                  <p className="mt-2 text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                                    Section GDD chargee depuis lore_entries (universe=&apos;jurassic-wars&apos;, category=&apos;game_design&apos;). Connecter Supabase pour afficher le contenu.
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Actions */}
                      <div>
                        <h4 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                          AI Actions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {AI_ACTIONS.map((action) => {
                            const ActionIcon = action.icon;
                            const loading = aiLoading === `${game.slug}-${action.key}`;
                            return (
                              <button
                                key={action.key}
                                onClick={() => runAI(game, action.key)}
                                disabled={!!aiLoading}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-[12px] transition-all",
                                  "hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]",
                                  "disabled:opacity-50 disabled:cursor-not-allowed",
                                  "text-[var(--color-text-muted)]"
                                )}
                              >
                                {loading ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <ActionIcon className="h-3.5 w-3.5" />
                                )}
                                <div className="text-left">
                                  <div className="font-medium text-[var(--color-text)]">{action.label}</div>
                                  <div className="text-[10px]">{action.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* AI Result */}
                        <AnimatePresence>
                          {aiResult && aiResult.game === game.slug && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-3"
                            >
                              <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[#0F0F1A] p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                                    <span className="text-[12px] font-bold text-[var(--color-gold)] uppercase tracking-wider">
                                      Resultat IA
                                    </span>
                                  </div>
                                  <button onClick={() => setAiResult(null)}>
                                    <X className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                                  </button>
                                </div>
                                <div className="prose prose-invert prose-sm max-w-none text-[12px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap font-mono">
                                  {aiResult.result}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Studio Team Panel ───────────────────────────── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14]">
        <button
          onClick={() => setTeamOpen(!teamOpen)}
          className="flex w-full items-center justify-between p-5 hover:bg-[var(--color-surface)]/50 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[var(--color-gold)]" />
            <div className="text-left">
              <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Studio Team
              </h2>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                3 Directors &middot; 3 Leads &middot; 4 Specialists
              </p>
            </div>
          </div>
          <motion.div animate={{ rotate: teamOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {teamOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--color-border-subtle)] p-5">
                {([1, 2, 3] as AgentTier[]).map((tier) => {
                  const tierAgents = STUDIO_TEAM.filter((a) => a.tier === tier);
                  const tierLabels: Record<number, string> = {
                    1: "Tier 1 — Directors",
                    2: "Tier 2 — Leads",
                    3: "Tier 3 — Specialists",
                  };
                  return (
                    <div key={tier} className="mb-5 last:mb-0">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                        {tierLabels[tier]}
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {tierAgents.map((agent, i) => {
                          const AgentIcon = agent.icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
                          return (
                            <div
                              key={`${agent.name}-${agent.role}-${i}`}
                              className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3 hover:border-[var(--color-gold)]/20 transition-colors"
                            >
                              <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                                style={{ backgroundColor: `${agent.color}15` }}
                              >
                                <AgentIcon className="h-4 w-4" style={{ color: agent.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-medium text-[var(--color-text)] truncate">{agent.name}</span>
                                  <div className={cn(
                                    "h-1.5 w-1.5 rounded-full shrink-0",
                                    agent.status === "active" ? "bg-emerald-400" : "bg-gray-500"
                                  )} />
                                </div>
                                <span className="text-[11px] text-[var(--color-text-muted)] truncate block">{agent.role}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
