"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical, HelpCircle, Search, BarChart3, GitMerge, Lightbulb,
  CheckCircle2, FileText, Compass, FileSearch, ShieldCheck, Cpu,
  TrendingUp, Scale, DollarSign, Globe, Palette, Copy, Save,
  ArrowRight, Zap, Clock, ChevronDown, Trash2, RotateCcw,
  Swords, Bot, Brain, Target, Infinity, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import {
  RESEARCH_STAGES, RESEARCH_MODES, DEPTH_CONFIG, RESEARCH_DOMAINS,
  DOMAIN_AGENTS, MODEL_DISPLAY, createStageMap,
  saveToHistory, loadHistory, saveGraph, loadGraph, mergeIntoGraph,
  type ResearchMode, type ResearchDepth, type ResearchDomain,
  type ResearchStageId, type StageStatus, type ResearchResult,
  type ResearchHistoryEntry, type KnowledgeGraph, type KnowledgeNode, type KnowledgeEdge,
} from "@/lib/research";
import { onResearchCompleted } from "@/lib/synergies";

/* ═══════════════════════════════════════════════════════
   BYSS Research Lab
   EurekaClaw x K-Dense x AgentScope
   ═══════════════════════════════════════════════════════ */

// ── Icon Map ──
const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  HelpCircle, Search, BarChart3, GitMerge, Lightbulb, CheckCircle2, FileText,
};

const MODE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass, FileSearch, ShieldCheck,
};

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu, TrendingUp, Swords, Scale, DollarSign, Globe, Palette,
};

const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  evren: Cpu, sorel: Target, nerel: Brain, kael: Infinity,
};

// ── Knowledge Graph SVG ──
function KnowledgeGraphView({ graph }: { graph: KnowledgeGraph }) {
  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--color-text-muted)]">
        Le graphe se construit avec chaque recherche.
      </div>
    );
  }

  const width = 600;
  const height = 300;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      {/* Edges */}
      {graph.edges.map((edge, i) => {
        const source = graph.nodes.find((n) => n.id === edge.source);
        const target = graph.nodes.find((n) => n.id === edge.target);
        if (!source || !target) return null;
        return (
          <line
            key={`edge-${i}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="#00B4D8"
            strokeOpacity={0.3 + edge.weight * 0.4}
            strokeWidth={1 + edge.weight}
          />
        );
      })}
      {/* Nodes */}
      {graph.nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={node.color || "#00B4D8"}
            fillOpacity={0.2}
            stroke={node.color || "#00B4D8"}
            strokeWidth={1.5}
          />
          <text
            x={node.x}
            y={node.y + node.size + 14}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize={10}
            fontFamily="var(--font-clash-display), sans-serif"
          >
            {node.label.slice(0, 20)}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Pipeline Stage Display ──
function PipelineStages({ stages }: { stages: Record<ResearchStageId, StageStatus> }) {
  return (
    <div className="flex items-center gap-1">
      {RESEARCH_STAGES.map((stage, i) => {
        const status = stages[stage.id];
        const Icon = STAGE_ICONS[stage.icon] || HelpCircle;
        return (
          <div key={stage.id} className="flex items-center">
            <motion.div
              animate={{
                scale: status === "active" ? [1, 1.15, 1] : 1,
                opacity: status === "pending" ? 0.4 : 1,
              }}
              transition={status === "active" ? { repeat: Infinity, duration: 1.2 } : {}}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                status === "done" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                status === "active" && "border-cyan-500/50 bg-cyan-500/10 text-cyan-400",
                status === "error" && "border-red-500/50 bg-red-500/10 text-red-400",
                status === "pending" && "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
              )}
              title={`${stage.label} — ${status}`}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
            {i < RESEARCH_STAGES.length - 1 && (
              <div className={cn(
                "mx-0.5 h-px w-4 transition-colors",
                status === "done" ? "bg-emerald-500/50" : "bg-[var(--color-border-subtle)]",
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ResearchPage() {
  // ── State ──
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<ResearchMode>("explore");
  const [depth, setDepth] = useState<ResearchDepth>("medium");
  const [domain, setDomain] = useState<ResearchDomain>("technology");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [stages, setStages] = useState(createStageMap());
  const [history, setHistory] = useState<ResearchHistoryEntry[]>([]);
  const [graph, setGraph] = useState<KnowledgeGraph>({ nodes: [], edges: [] });
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // ── Init ──
  useEffect(() => {
    setHistory(loadHistory());
    setGraph(loadGraph());
  }, []);

  // ── Derived ──
  const agentInfo = DOMAIN_AGENTS[domain];
  const depthConfig = DEPTH_CONFIG[depth];
  const modelKey = depthConfig.model;
  const modelDisplay = MODEL_DISPLAY[modelKey] ?? { label: modelKey, speed: "", cost: "" };
  const AgentIcon = AGENT_ICONS[agentInfo.agent] ?? Bot;

  // ── Simulate pipeline stages ──
  const animateStages = useCallback(async () => {
    const stageIds = RESEARCH_STAGES.map((s) => s.id);
    for (let i = 0; i < stageIds.length; i++) {
      setStages((prev) => ({ ...prev, [stageIds[i]]: "active" }));
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setStages((prev) => ({ ...prev, [stageIds[i]]: "done" }));
    }
  }, []);

  // ── Execute Research ──
  const handleResearch = useCallback(async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setStages(createStageMap());

    // Start stage animation in parallel
    const stageAnimation = animateStages();

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode, depth, domain }),
      });

      const data = await res.json();
      await stageAnimation;

      if (data.error) {
        setStages((prev) => ({ ...prev, report: "error" }));
        return;
      }

      const researchResult: ResearchResult = {
        id: crypto.randomUUID(),
        question,
        mode,
        depth,
        domain,
        findings: data.findings ?? [],
        sources: data.sources ?? [],
        summary: data.summary ?? "",
        suggestedAgent: data.suggestedAgent ?? agentInfo.agent,
        model: data.model ?? modelKey,
        tokensUsed: data.tokensUsed ?? 0,
        timestamp: new Date().toISOString(),
        stages: Object.fromEntries(RESEARCH_STAGES.map((s) => [s.id, "done"])) as Record<ResearchStageId, StageStatus>,
      };

      setResult(researchResult);

      // Update knowledge graph
      if (data.graphNodes?.length || data.graphEdges?.length) {
        const newNodes: KnowledgeNode[] = (data.graphNodes ?? []).map((n: { id: string; label: string; domain?: string }, idx: number) => ({
          id: n.id || `node-${Date.now()}-${idx}`,
          label: n.label,
          x: 80 + Math.random() * 440,
          y: 40 + Math.random() * 220,
          size: 8 + Math.random() * 12,
          color: RESEARCH_DOMAINS.find((d) => d.id === (n.domain || domain))?.color ?? "#00B4D8",
          domain: n.domain || domain,
        }));
        const newEdges: KnowledgeEdge[] = (data.graphEdges ?? []).map((e: { source: string; target: string; weight?: number; label?: string }) => ({
          source: e.source,
          target: e.target,
          weight: e.weight ?? 0.5,
          label: e.label,
        }));

        setGraph((prev) => {
          const merged = mergeIntoGraph(prev, newNodes, newEdges);
          saveGraph(merged);
          return merged;
        });
      }

      // Save to history
      const historyEntry: ResearchHistoryEntry = {
        id: researchResult.id,
        question,
        mode,
        date: new Date().toISOString(),
        keyFindings: data.summary?.slice(0, 200) ?? "",
        sourcesCount: (data.sources ?? []).length,
        domain,
      };
      saveToHistory(historyEntry);
      setHistory(loadHistory());

      // Synergy: research completed → notifications
      onResearchCompleted(researchResult.id, question, domain);

      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      console.error("[research] Error:", err);
      setStages((prev) => ({ ...prev, report: "error" }));
    } finally {
      setLoading(false);
    }
  }, [question, mode, depth, domain, loading, agentInfo, modelKey, animateStages]);

  // ── Copy result ──
  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = `# ${result.question}\n\n${result.summary}\n\n## Findings\n${result.findings.map((f) => `- [${f.confidence}] ${f.insight}`).join("\n")}\n\n## Sources\n${result.sources.map((s) => `- ${s.title}${s.url ? ` (${s.url})` : ""}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  // ── Deepen research ──
  const handleDeepen = useCallback(() => {
    if (!result) return;
    const nextDepth: ResearchDepth = depth === "quick" ? "medium" : "deep";
    setDepth(nextDepth);
    setQuestion(result.question);
    setTimeout(handleResearch, 100);
  }, [result, depth, handleResearch]);

  // ── Reload from history ──
  const handleReloadHistory = useCallback((entry: ResearchHistoryEntry) => {
    setQuestion(entry.question);
    setMode(entry.mode);
    setDomain(entry.domain);
    setShowHistory(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F1A] p-4 md:p-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <PageHeader
          title="BYSS Research"
          titleAccent="Lab"
          subtitle="EurekaClaw x K-Dense x AgentScope"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ═══ LEFT COLUMN: Input + Pipeline ═══ */}
        <div className="xl:col-span-2 space-y-6">
          {/* ── Research Modes ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Mode de Recherche
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RESEARCH_MODES.map((m) => {
                const MIcon = MODE_ICONS[m.icon] || Search;
                const isActive = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as ResearchMode)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all",
                      isActive
                        ? "border-cyan-500/50 bg-cyan-500/5"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-cyan-500/30",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MIcon className={cn("h-4 w-4", isActive ? "text-cyan-400" : "text-[var(--color-text-muted)]")} />
                      <span className={cn("text-sm font-semibold", isActive ? "text-cyan-400" : "text-[var(--color-text)]")}>
                        {m.label}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {m.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Research Input Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            {/* Question */}
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Quelle est ta question de recherche ?"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleResearch();
              }}
            />

            {/* Controls Row */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Depth Selector */}
              <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-1">
                {(Object.keys(DEPTH_CONFIG) as ResearchDepth[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                      depth === d
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    {DEPTH_CONFIG[d].label}
                  </button>
                ))}
              </div>

              {/* Domain Filter */}
              <div className="relative">
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as ResearchDomain)}
                  className="appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 pr-8 text-xs font-medium text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
                >
                  {RESEARCH_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-text-muted)]" />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Launch Button */}
              <button
                onClick={handleResearch}
                disabled={!question.trim() || loading}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all",
                  "bg-gradient-to-r from-cyan-600 to-cyan-500 text-[#0A0A0F] hover:from-cyan-500 hover:to-cyan-400",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "font-[family-name:var(--font-clash-display)]",
                )}
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <RotateCcw className="h-4 w-4" />
                    </motion.div>
                    Recherche...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Lancer la Recherche
                  </>
                )}
              </button>
            </div>

            {/* Keyboard hint */}
            <div className="mt-2 text-right">
              <span className="text-[10px] text-[var(--color-text-muted)]">
                Ctrl+Enter pour lancer
              </span>
            </div>
          </motion.div>

          {/* ── Pipeline Stages ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Pipeline — 7 Stages
            </h2>
            <PipelineStages stages={stages} />
          </motion.div>

          {/* ── Results Panel ── */}
          <div ref={resultRef}>
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Summary Card */}
                  <div className="rounded-xl border border-cyan-500/20 bg-[#0A0A14] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                        Rapport
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                          {result.tokensUsed} tokens — {result.model}
                        </span>
                      </div>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-sm text-[var(--color-text)] leading-relaxed">
                      {result.summary}
                    </div>
                  </div>

                  {/* Findings Cards */}
                  {result.findings.length > 0 && (
                    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5">
                      <h3 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Decouvertes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.findings.map((f, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                                f.confidence === "eleve" && "bg-emerald-500/15 text-emerald-400",
                                f.confidence === "moyen" && "bg-amber-500/15 text-amber-400",
                                f.confidence === "faible" && "bg-red-500/15 text-red-400",
                              )}>
                                {f.confidence}
                              </span>
                              {f.category && (
                                <span className="text-[9px] text-[var(--color-text-muted)] uppercase">
                                  {f.category}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--color-text)] leading-relaxed">
                              {f.insight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources */}
                  {result.sources.length > 0 && (
                    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5">
                      <h3 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Sources ({result.sources.length})
                      </h3>
                      <div className="space-y-2">
                        {result.sources.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
                              {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-[var(--color-text)] truncate">
                                {s.title}
                              </p>
                              {s.url && (
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-cyan-400 hover:underline truncate block"
                                >
                                  {s.url}
                                </a>
                              )}
                              {s.snippet && (
                                <p className="mt-1 text-[10px] text-[var(--color-text-muted)] line-clamp-2">
                                  {s.snippet}
                                </p>
                              )}
                            </div>
                            <span className={cn(
                              "rounded px-1.5 py-0.5 text-[8px] font-bold uppercase",
                              s.type === "lore" && "bg-purple-500/15 text-purple-400",
                              s.type === "web" && "bg-cyan-500/15 text-cyan-400",
                              s.type === "local" && "bg-amber-500/15 text-amber-400",
                              s.type === "api" && "bg-emerald-500/15 text-emerald-400",
                            )}>
                              {s.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-cyan-500/30"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copie !" : "Copier"}
                    </button>
                    <button
                      className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-cyan-500/30"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleDeepen}
                      disabled={depth === "deep"}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                        "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                      )}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      Approfondir
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN: Agent + Model + Graph + History ═══ */}
        <div className="space-y-6">
          {/* ── Expert Delegation (K-Dense) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            <h2 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Agent Assigne
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <AgentIcon className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold capitalize text-[var(--color-text)]">
                  {agentInfo.agent}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                  {agentInfo.role}
                </p>
              </div>
            </div>
            {agentInfo.agent === "kael" && (
              <p className="mt-2 text-[10px] text-amber-400/80 italic">
                Archive — reference stratégique uniquement
              </p>
            )}
          </motion.div>

          {/* ── Model Routing (K-Dense BYOK) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            <h2 className="mb-3 font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Modele IA
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30">
                <Cpu className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {modelDisplay.label}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {modelDisplay.speed} — {modelDisplay.cost}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(Object.keys(DEPTH_CONFIG) as ResearchDepth[]).map((d) => {
                const m = MODEL_DISPLAY[DEPTH_CONFIG[d].model];
                return (
                  <span
                    key={d}
                    className={cn(
                      "rounded px-2 py-0.5 text-[9px] font-medium",
                      depth === d
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "bg-[var(--color-surface)] text-[var(--color-text-muted)]",
                    )}
                  >
                    {DEPTH_CONFIG[d].label}: {m?.label ?? DEPTH_CONFIG[d].model}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* ── Knowledge Graph ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Knowledge Graph
              </h2>
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {graph.nodes.length} noeuds — {graph.edges.length} liens
              </span>
            </div>
            <div className="h-64 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-2 overflow-hidden">
              <KnowledgeGraphView graph={graph} />
            </div>
            {graph.nodes.length > 0 && (
              <button
                onClick={() => { setGraph({ nodes: [], edges: [] }); saveGraph({ nodes: [], edges: [] }); }}
                className="mt-2 flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Reset graphe
              </button>
            )}
          </motion.div>

          {/* ── Research History ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Historique
              </h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                {showHistory ? "Masquer" : `Voir tout (${history.length})`}
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] italic">
                Aucune recherche. Lance ta premiere exploration.
              </p>
            ) : (
              <div className="space-y-2">
                {(showHistory ? history : history.slice(0, 5)).map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleReloadHistory(entry)}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-left transition-colors hover:border-cyan-500/30"
                  >
                    <p className="text-xs font-medium text-[var(--color-text)] truncate">
                      {entry.question}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[9px] text-cyan-400 uppercase">{entry.mode}</span>
                      <span className="text-[9px] text-[var(--color-text-muted)]">
                        {entry.sourcesCount} sources
                      </span>
                      <span className="text-[9px] text-[var(--color-text-muted)]">
                        <Clock className="mr-0.5 inline h-2.5 w-2.5" />
                        {new Date(entry.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
