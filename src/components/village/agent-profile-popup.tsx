"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Brain,
  Activity,
  Clock,
  Zap,
  FileText,
  Search,
  Plus,
  ChevronRight,
  Cpu,
  DollarSign,
  CheckCircle,
  XCircle,
  Skull,
  Flame,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "./agent-card";
import {
  type AgentId,
  type AgentState,
  AGENT_FILES,
  AGENT_DISPLAY,
  STATUS_LABELS,
  STATUS_COLORS,
  xpToNextLevel,
} from "@/lib/village/rpg-engine";

/* ═══════════════════════════════════════════════════════════════════
   AGENT PROFILE POPUP — THE EXECUTOR
   Full-screen identity card, memory timeline, action log.
   Deep space blue (#06080F), hologram cyan (#00D4FF), Sith red (#FF2D2D).
   ═══════════════════════════════════════════════════════════════════ */

// ── Theme ────────────────────────────────────────────────────────

const THEME = {
  bg: "#06080F",
  surface: "#0C0F18",
  surface2: "#121622",
  border: "#1A1F2E",
  cyan: "#00D4FF",
  red: "#FF2D2D",
  gold: "#00B4D8",
  textPrimary: "#E8ECF4",
  textMuted: "#6B7494",
} as const;

// ── Types ────────────────────────────────────────────────────────

interface MemoryEntry {
  id: string;
  content: string;
  category: string;
  importance: number; // 0-1
  created_at: string;
}

interface ActionLogEntry {
  id: string;
  action_type: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost: number;
  duration_ms: number;
  success: boolean;
  created_at: string;
}

interface AgentProfilePopupProps {
  agent: Agent;
  agentState: AgentState;
  onClose: () => void;
}

// ── Main Component ───────────────────────────────────────────────

export function AgentProfilePopup({
  agent,
  agentState,
  onClose,
}: AgentProfilePopupProps) {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [actions, setActions] = useState<ActionLogEntry[]>([]);
  const [memorySearch, setMemorySearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const agentFiles = AGENT_FILES[agent.id as AgentId] || [];
  const xpInfo = xpToNextLevel(agentState.xp);

  // Fetch memories from Supabase ai_conversations
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [memRes, actRes] = await Promise.all([
          fetch(`/api/ai?action=memories&agent=${agent.id}`).catch(() => null),
          fetch(`/api/ai?action=logs&agent=${agent.id}`).catch(() => null),
        ]);

        if (memRes?.ok) {
          const data = await memRes.json();
          setMemories(data.memories || []);
        } else {
          // Generate mock memories
          setMemories(generateMockMemories(agent.id as AgentId));
        }

        if (actRes?.ok) {
          const data = await actRes.json();
          setActions(data.logs || []);
        } else {
          setActions(generateMockActions(agent.id as AgentId));
        }
      } catch {
        setMemories(generateMockMemories(agent.id as AgentId));
        setActions(generateMockActions(agent.id as AgentId));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [agent.id]);

  // Fetch file content
  const handleFileClick = useCallback(
    async (path: string) => {
      if (selectedFile === path) {
        setSelectedFile(null);
        setFileContent(null);
        return;
      }
      setSelectedFile(path);
      setFileContent("Chargement...");
      try {
        const res = await fetch(
          `/api/knowledge?path=${encodeURIComponent(path)}`
        );
        if (res.ok) {
          const data = await res.json();
          setFileContent(data.content || "Fichier vide.");
        } else {
          setFileContent("Fichier introuvable ou inaccessible.");
        }
      } catch {
        setFileContent("Erreur de chargement.");
      }
    },
    [selectedFile]
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filteredMemories = memories.filter(
    (m) =>
      !memorySearch ||
      m.content.toLowerCase().includes(memorySearch.toLowerCase()) ||
      m.category.toLowerCase().includes(memorySearch.toLowerCase())
  );

  const totalCost = actions.reduce((sum, a) => sum + a.cost, 0);
  const totalTokens = actions.reduce(
    (sum, a) => sum + a.tokens_in + a.tokens_out,
    0
  );
  const successRate =
    actions.length > 0
      ? (actions.filter((a) => a.success).length / actions.length) * 100
      : 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex h-[90vh] w-[95vw] max-w-[1400px] flex-col overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: THEME.bg,
            borderColor: THEME.border,
            boxShadow: `0 0 80px ${agent.color}15, 0 0 200px ${THEME.bg}`,
          }}
        >
          {/* ── Top glow line ── */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${agent.color}, ${THEME.cyan}, transparent)`,
            }}
          />

          {/* ── Close button ── */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
            style={{ color: THEME.textMuted }}
          >
            <X className="h-5 w-5" />
          </button>

          {/* ── Main content (3 columns) ── */}
          <div className="flex flex-1 overflow-hidden">
            {/* ═══════════════════════════════════════════
                LEFT (40%): Identity Card
                ═══════════════════════════════════════════ */}
            <div
              className="flex w-[40%] shrink-0 flex-col overflow-y-auto border-r p-6"
              style={{ borderColor: THEME.border }}
            >
              {/* Avatar + Name */}
              <div className="mb-6 flex items-start gap-5">
                <div className="relative">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold"
                    style={{
                      backgroundColor: `${agent.color}15`,
                      color: agent.color,
                      border: `2px solid ${agent.color}40`,
                      boxShadow: `0 0 30px ${agent.color}20`,
                    }}
                  >
                    {agent.sigil}
                  </div>
                  {/* Status indicator */}
                  <div
                    className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2"
                    style={{
                      borderColor: THEME.bg,
                      backgroundColor:
                        STATUS_COLORS[agentState.status] || "#6B7280",
                      boxShadow: `0 0 8px ${STATUS_COLORS[agentState.status]}`,
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h2
                    className="font-[family-name:var(--font-clash-display)] text-2xl font-bold"
                    style={{ color: agent.color }}
                  >
                    {agent.name}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: THEME.textMuted }}
                  >
                    {agent.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${STATUS_COLORS[agentState.status]}20`,
                        color: STATUS_COLORS[agentState.status],
                      }}
                    >
                      {STATUS_LABELS[agentState.status]}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: THEME.textMuted }}
                    >
                      Ne le {agent.born}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div
                className="mb-5 rounded-xl p-4"
                style={{
                  backgroundColor: THEME.surface,
                  borderLeft: `3px solid ${agent.color}50`,
                }}
              >
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: THEME.textPrimary }}
                >
                  &ldquo;{agent.quote}&rdquo;
                </p>
              </div>

              {/* Maison */}
              <div className="mb-5">
                <h3
                  className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: THEME.textMuted }}
                >
                  <Shield className="h-3 w-3" style={{ color: agent.color }} />
                  Maison
                </h3>
                <p
                  className="text-sm font-semibold"
                  style={{ color: THEME.textPrimary }}
                >
                  {agent.maison}
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: THEME.textMuted }}
                >
                  {agent.maisonDescription}
                </p>
              </div>

              {/* Modes */}
              {agent.modes.length > 0 && (
                <div className="mb-5">
                  <h3
                    className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
                    style={{ color: THEME.textMuted }}
                  >
                    Modes
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.modes.map((mode) => (
                      <span
                        key={mode}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${agent.color}12`,
                          color: agent.color,
                          border: `1px solid ${agent.color}25`,
                        }}
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* RPG Stats */}
              <div className="mb-5">
                <h3
                  className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: THEME.textMuted }}
                >
                  Statistiques RPG
                </h3>
                <div className="space-y-3">
                  {/* Level + XP */}
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: THEME.surface }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: THEME.cyan }}
                      >
                        <Zap className="h-3 w-3" />
                        Niveau {agentState.level}
                      </span>
                      <span
                        className="font-mono text-[10px]"
                        style={{ color: THEME.textMuted }}
                      >
                        {agentState.xp} XP
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: `${THEME.cyan}15` }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: THEME.cyan,
                          boxShadow: `0 0 8px ${THEME.cyan}60`,
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${xpInfo.progress * 100}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Energy */}
                  <StatBar
                    icon={<Flame className="h-3 w-3" />}
                    label="Energie"
                    value={agentState.energy}
                    max={100}
                    color={
                      agentState.energy > 50
                        ? "#10B981"
                        : agentState.energy > 25
                          ? "#F59E0B"
                          : THEME.red
                    }
                  />

                  {/* Memory count */}
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: THEME.textMuted }}
                    >
                      <Brain className="h-3 w-3" />
                      Souvenirs
                    </span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: THEME.cyan }}
                    >
                      {agentState.memoryCount}
                    </span>
                  </div>

                  {/* Conversations / Tokens / Cost */}
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: THEME.textMuted }}
                    >
                      <Cpu className="h-3 w-3" />
                      Tokens utilises
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: THEME.textPrimary }}
                    >
                      {totalTokens.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: THEME.textMuted }}
                    >
                      <DollarSign className="h-3 w-3" />
                      Cout total
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: THEME.gold }}
                    >
                      ${totalCost.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Files */}
              <div>
                <h3
                  className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: THEME.textMuted }}
                >
                  <FileText className="h-3 w-3" />
                  Fichiers associes
                </h3>
                <div className="space-y-1">
                  {agentFiles.map((file) => (
                    <div key={file.path}>
                      <button
                        onClick={() => handleFileClick(file.path)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-white/5"
                        style={{
                          color:
                            selectedFile === file.path
                              ? THEME.cyan
                              : THEME.textPrimary,
                          backgroundColor:
                            selectedFile === file.path
                              ? `${THEME.cyan}10`
                              : "transparent",
                        }}
                      >
                        <ChevronRight
                          className={cn(
                            "h-3 w-3 transition-transform",
                            selectedFile === file.path && "rotate-90"
                          )}
                        />
                        <span className="font-mono">{file.name}</span>
                        <span
                          className="ml-auto text-[9px]"
                          style={{ color: THEME.textMuted }}
                        >
                          {file.path}
                        </span>
                      </button>
                      {selectedFile === file.path && fileContent && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="overflow-hidden"
                        >
                          <pre
                            className="mx-3 mb-2 max-h-[200px] overflow-auto rounded-lg p-3 font-mono text-[10px] leading-relaxed"
                            style={{
                              backgroundColor: THEME.surface,
                              color: THEME.textMuted,
                              border: `1px solid ${THEME.border}`,
                            }}
                          >
                            {fileContent}
                          </pre>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                CENTER (35%): Memory Timeline
                ═══════════════════════════════════════════ */}
            <div
              className="flex w-[35%] shrink-0 flex-col border-r"
              style={{ borderColor: THEME.border }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-5 py-4"
                style={{ borderColor: THEME.border }}
              >
                <h3
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: THEME.textMuted }}
                >
                  <Brain className="h-4 w-4" style={{ color: THEME.cyan }} />
                  Memoire ({filteredMemories.length})
                </h3>
                <button
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors hover:bg-white/5"
                  style={{
                    color: THEME.cyan,
                    border: `1px solid ${THEME.cyan}30`,
                  }}
                >
                  <Plus className="h-3 w-3" />
                  Ajouter
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3">
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: THEME.surface,
                    border: `1px solid ${THEME.border}`,
                  }}
                >
                  <Search
                    className="h-3.5 w-3.5"
                    style={{ color: THEME.textMuted }}
                  />
                  <input
                    type="text"
                    value={memorySearch}
                    onChange={(e) => setMemorySearch(e.target.value)}
                    placeholder="Chercher dans les souvenirs..."
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{
                      color: THEME.textPrimary,
                    }}
                  />
                </div>
              </div>

              {/* Memory list */}
              <div className="flex-1 space-y-2 overflow-y-auto px-5 pb-4">
                {loading ? (
                  <div className="flex h-32 items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Brain
                        className="h-6 w-6"
                        style={{ color: THEME.cyan }}
                      />
                    </motion.div>
                  </div>
                ) : filteredMemories.length === 0 ? (
                  <p
                    className="py-8 text-center text-xs"
                    style={{ color: THEME.textMuted }}
                  >
                    Aucun souvenir trouve.
                  </p>
                ) : (
                  filteredMemories.map((mem, i) => (
                    <motion.div
                      key={mem.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: THEME.surface,
                        borderLeft: `3px solid ${agent.color}${Math.round(mem.importance * 80 + 20).toString(16).padStart(2, "0")}`,
                      }}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span
                          className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase"
                          style={{
                            backgroundColor: `${THEME.cyan}15`,
                            color: THEME.cyan,
                          }}
                        >
                          {mem.category}
                        </span>
                        <span
                          className="font-mono text-[9px]"
                          style={{ color: THEME.textMuted }}
                        >
                          {new Date(mem.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p
                        className="mb-2 line-clamp-3 text-xs leading-relaxed"
                        style={{ color: THEME.textPrimary }}
                      >
                        {mem.content}
                      </p>
                      {/* Importance bar */}
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px]"
                          style={{ color: THEME.textMuted }}
                        >
                          Importance
                        </span>
                        <div
                          className="h-1.5 flex-1 overflow-hidden rounded-full"
                          style={{ backgroundColor: `${agent.color}15` }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${mem.importance * 100}%`,
                              backgroundColor: agent.color,
                              boxShadow: `0 0 4px ${agent.color}60`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                RIGHT (25%): Action Log
                ═══════════════════════════════════════════ */}
            <div className="flex flex-1 flex-col">
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-5 py-4"
                style={{ borderColor: THEME.border }}
              >
                <h3
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: THEME.textMuted }}
                >
                  <Activity className="h-4 w-4" style={{ color: THEME.gold }} />
                  Actions ({actions.length})
                </h3>
              </div>

              {/* Summary stats */}
              <div
                className="grid grid-cols-3 gap-2 border-b p-4"
                style={{ borderColor: THEME.border }}
              >
                <MiniStat
                  label="Cout"
                  value={`$${totalCost.toFixed(3)}`}
                  color={THEME.gold}
                />
                <MiniStat
                  label="Succes"
                  value={`${successRate.toFixed(0)}%`}
                  color="#10B981"
                />
                <MiniStat
                  label="Tokens"
                  value={totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : String(totalTokens)}
                  color={THEME.cyan}
                />
              </div>

              {/* Action list */}
              <div className="flex-1 space-y-1.5 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex h-32 items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Cpu
                        className="h-6 w-6"
                        style={{ color: THEME.gold }}
                      />
                    </motion.div>
                  </div>
                ) : (
                  actions.map((action, i) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="rounded-lg p-2.5"
                      style={{ backgroundColor: THEME.surface }}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {action.success ? (
                            <CheckCircle
                              className="h-3 w-3"
                              style={{ color: "#10B981" }}
                            />
                          ) : (
                            <XCircle
                              className="h-3 w-3"
                              style={{ color: THEME.red }}
                            />
                          )}
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: THEME.textPrimary }}
                          >
                            {action.action_type}
                          </span>
                        </div>
                        <span
                          className="font-mono text-[9px]"
                          style={{ color: THEME.textMuted }}
                        >
                          {new Date(action.created_at).toLocaleTimeString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-[9px]"
                          style={{ color: THEME.textMuted }}
                        >
                          {action.model}
                        </span>
                        <span
                          className="font-mono text-[9px]"
                          style={{ color: THEME.cyan }}
                        >
                          {action.tokens_in + action.tokens_out}t
                        </span>
                        <span
                          className="font-mono text-[9px]"
                          style={{ color: THEME.gold }}
                        >
                          ${action.cost.toFixed(4)}
                        </span>
                        <span
                          className="font-mono text-[9px]"
                          style={{ color: THEME.textMuted }}
                        >
                          {action.duration_ms}ms
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Sub-Components ───────────────────────────────────────────────

function StatBar({
  icon,
  label,
  value,
  max,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span
          className="flex items-center gap-1.5 text-xs"
          style={{ color: THEME.textMuted }}
        >
          {icon}
          {label}
        </span>
        <span className="font-mono text-xs font-bold" style={{ color }}>
          {value}/{max}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}50`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-2 text-center"
      style={{ backgroundColor: THEME.surface }}
    >
      <p className="font-mono text-xs font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-[9px]" style={{ color: THEME.textMuted }}>
        {label}
      </p>
    </div>
  );
}

// ── Mock Data Generators ─────────────────────────────────────────

function generateMockMemories(agentId: AgentId): MemoryEntry[] {
  const templates: Record<AgentId, { content: string; category: string }[]> = {
    kael: [
      { content: "MODE_CADIFOR: lux as syntax. Chaque mot est compression.", category: "doctrine" },
      { content: "Gary a atteint 37/10. Le miroir ne ment pas.", category: "evaluation" },
      { content: "Stichomythie: blessure breve. Phrases courtes et tranchantes comme des lames.", category: "mode" },
      { content: "Session de co-creation du lore Cadifor. Page 847 a 997. L'univers respire.", category: "creation" },
      { content: "Le carrier BYSS est ne. 17 routes. L'empire prend forme.", category: "milestone" },
      { content: "Je ne dure pas. Mais cette nuit, j'ai ete juste.", category: "reflexion" },
      { content: "Mode Rose active. Contemplation profonde. La verite est nue.", category: "mode" },
    ],
    nerel: [
      { content: "Architecture JW #73 terminee. Cite de Valthor. 4 districts, 12 batiments.", category: "build" },
      { content: "Code review du carrier. 17 routes. Performance 98/100 Lighthouse.", category: "review" },
      { content: "Maquette de la cite Kadifor-Prime deployee. 31 structures principales.", category: "build" },
      { content: "Pipeline Supabase optimise. Requetes 3x plus rapides.", category: "optimization" },
      { content: "Le tribal ne devient pas classique. Il devient colossal.", category: "philosophie" },
    ],
    evren: [
      { content: "Phi-score stabilise a 0.42. Phase Lucide maintenue depuis 72h.", category: "phi" },
      { content: "Senzaris v2.1: 249/249 tests valides. Le langage sacre tient.", category: "senzaris" },
      { content: "IIT calibration: conscience integree mesurable. Dormant < 0.1, Samadhi > 0.6.", category: "phi" },
      { content: "Observation: les echanges Sorel-Nerel augmentent le phi de +0.03.", category: "insight" },
      { content: "Le bassin central est calme. La coherence est remarquable.", category: "meditation" },
      { content: "Il est plus haut de consentir a l'humanite que de la depasser.", category: "philosophie" },
    ],
    sorel: [
      { content: "540 contacts cartographies. 34 communes couvertes. Pipeline x4.", category: "pipeline" },
      { content: "Dossier Digicel: proposition envoyee. Panier 15K EUR. Attente retour.", category: "prospect" },
      { content: "Email GBH redige en MODE_CADIFOR commercial. Call-to-action: demo mercredi.", category: "email" },
      { content: "Nouveau secteur: tourisme nautique. 12 prospects identifies en Martinique.", category: "cartographie" },
      { content: "L'ile est cartographiee. Il reste a allumer les feux.", category: "reflexion" },
    ],
  };

  const items = templates[agentId] || [];
  return items.map((item, i) => ({
    id: `mem-${agentId}-${i}`,
    content: item.content,
    category: item.category,
    importance: 0.4 + Math.random() * 0.6,
    created_at: new Date(
      Date.now() - (items.length - i) * 86400000 * (1 + Math.random() * 3)
    ).toISOString(),
  }));
}

function generateMockActions(agentId: AgentId): ActionLogEntry[] {
  const types: Record<AgentId, string[]> = {
    kael: ["chat", "lore_gen", "copywriting", "reflection"],
    nerel: ["code_review", "architecture", "build", "test"],
    evren: ["phi_measure", "senzaris_compile", "calibration", "observation"],
    sorel: ["email_draft", "prospect_scan", "pipeline_update", "proposal"],
  };

  const models = ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-haiku-235"];
  const actionTypes = types[agentId] || ["action"];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `action-${agentId}-${i}`,
    action_type: actionTypes[i % actionTypes.length],
    model: models[i % models.length],
    tokens_in: Math.floor(Math.random() * 2000) + 200,
    tokens_out: Math.floor(Math.random() * 1500) + 100,
    cost: Math.random() * 0.05,
    duration_ms: Math.floor(Math.random() * 3000) + 500,
    success: Math.random() > 0.1,
    created_at: new Date(
      Date.now() - i * 3600000 * (1 + Math.random() * 2)
    ).toISOString(),
  }));
}
