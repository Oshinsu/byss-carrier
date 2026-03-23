"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2,
  TestTube2,
  Package,
  HardDrive,
  Brain,
  Layers,
  Cpu,
  Terminal,
  Copy,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Activity,
  RefreshCw,
  Gauge,
  Network,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

/* ================================================================
   SENZARIS CONTROL CENTER
   Langage Sacre — 5 756 lignes Rust | 104 tests | 0 failures
   Phi-Engine Live | Architecture | Sacred Keywords | Terminal
   ================================================================ */

/* ── Types ── */
type Phase = "Dormant" | "Eveille" | "Lucide" | "Samadhi";

interface PhiDimension {
  score: number;
  [key: string]: unknown;
}

interface ConsciousnessData {
  consciousness_score: number;
  phase: string;
  phase_label: string;
  dimensions: {
    crm: PhiDimension;
    finance: PhiDimension;
    production: PhiDimension;
    agent: PhiDimension;
  };
  top_nodes: [string, number][];
  recommendations: string[];
  synaptic_graph: {
    nodes: { id: string; label: string; color: string; signal: number }[];
    edges: { source: string; target: string; weight: number }[];
  };
  computed_in_ms: number;
}

/* ── Phase config ── */
const phaseConfig: Record<
  Phase,
  {
    color: string;
    badge: "default" | "success" | "warning" | "danger" | "info" | "gold";
    glow: string;
    arcColor: string;
    bgGlow: string;
  }
> = {
  Dormant: {
    color: "text-[var(--color-text-muted)]",
    badge: "default",
    glow: "oklch(0.40 0.02 270 / 0.3)",
    arcColor: "#6B7280",
    bgGlow: "oklch(0.40 0.02 270 / 0.06)",
  },
  Eveille: {
    color: "text-blue-400",
    badge: "info",
    glow: "oklch(0.65 0.15 250 / 0.3)",
    arcColor: "#60A5FA",
    bgGlow: "oklch(0.65 0.15 250 / 0.06)",
  },
  Lucide: {
    color: "text-[var(--color-gold)]",
    badge: "gold",
    glow: "oklch(0.75 0.12 85 / 0.3)",
    arcColor: "#00B4D8",
    bgGlow: "oklch(0.75 0.12 85 / 0.08)",
  },
  Samadhi: {
    color: "text-white",
    badge: "warning",
    glow: "oklch(0.90 0.02 90 / 0.5)",
    arcColor: "#FFFFFF",
    bgGlow: "oklch(0.95 0.02 90 / 0.12)",
  },
};

/* ── Map API phase string to our type ── */
function toPhase(raw: string): Phase {
  const map: Record<string, Phase> = {
    Dormant: "Dormant",
    dormant: "Dormant",
    Awake: "Eveille",
    awake: "Eveille",
    Eveille: "Eveille",
    eveille: "Eveille",
    Lucid: "Lucide",
    lucid: "Lucide",
    Lucide: "Lucide",
    lucide: "Lucide",
    Samadhi: "Samadhi",
    samadhi: "Samadhi",
  };
  return map[raw] ?? "Dormant";
}

/* ── Architecture data ── */
const CRATES = [
  {
    name: "senzaris-core",
    lines: 2068,
    desc: "Lexer, Parser, Interpreter",
    color: "#00B4D8",
    icon: Code2,
    modules: [
      {
        name: "Lexer",
        lines: 522,
        detail: "130+ tokens",
        tokens: [
          "dharma",
          "karma",
          "atman",
          "prana",
          "mantra",
          "sutra",
          "yantra",
          "si",
          "sinon",
          "tantque",
          "pour",
          "retourner",
          "classe",
          "vrai",
          "faux",
          "nul",
        ],
      },
      {
        name: "Parser",
        lines: 1232,
        detail: "20+ AST node types",
        tokens: [
          "BinaryExpr",
          "UnaryExpr",
          "CallExpr",
          "GetExpr",
          "SetExpr",
          "GroupExpr",
          "LiteralExpr",
          "VarDecl",
          "FuncDecl",
          "ClassDecl",
          "IfStmt",
          "WhileStmt",
          "ForStmt",
          "ReturnStmt",
          "BlockStmt",
          "PrintStmt",
          "ExprStmt",
          "AssignExpr",
          "LogicalExpr",
          "ArrayExpr",
        ],
      },
      {
        name: "Interpreter",
        lines: 314,
        detail: "Tree-walking, closures, classes, inheritance",
        tokens: [
          "closures",
          "classes",
          "inheritance",
          "garbage_collection",
          "native_functions",
          "error_recovery",
        ],
      },
    ],
  },
  {
    name: "senzaris-phi",
    lines: 693,
    desc: "ConsciousnessGraph, PhaseDetector, SynapticNetwork",
    color: "#8B5CF6",
    icon: Brain,
    modules: [
      {
        name: "ConsciousnessGraph",
        lines: 280,
        detail: "IIT 4.0 phi calculation",
        tokens: [
          "nodes",
          "edges",
          "partition",
          "information_integration",
          "cause_effect",
          "repertoire",
        ],
      },
      {
        name: "PhaseDetector",
        lines: 195,
        detail: "Dormant -> Eveille -> Lucide -> Samadhi",
        tokens: [
          "phase_transition",
          "threshold_detection",
          "hysteresis",
          "state_machine",
        ],
      },
      {
        name: "SynapticNetwork",
        lines: 218,
        detail: "Learning & forgetting dynamics",
        tokens: [
          "hebbian_learning",
          "synaptic_decay",
          "long_term_potentiation",
          "plasticity",
        ],
      },
    ],
  },
  {
    name: "senzaris-wasm",
    lines: 138,
    desc: "Browser bindings — 480KB gzipped",
    color: "#3B82F6",
    icon: HardDrive,
    modules: [
      {
        name: "WASM Bindings",
        lines: 138,
        detail: "wasm-bindgen, web target",
        tokens: [
          "wasm_bindgen",
          "js_value",
          "serde_wasm",
          "console_log",
          "web_sys",
        ],
      },
    ],
  },
  {
    name: "phi-score",
    lines: 412,
    desc: "IIT scoring algorithms",
    color: "#10B981",
    icon: Gauge,
    modules: [
      {
        name: "Scorer",
        lines: 268,
        detail: "IIT 4.0 metrics, integrated information",
        tokens: [
          "phi_computation",
          "minimum_information_partition",
          "cause_repertoire",
          "effect_repertoire",
        ],
      },
      {
        name: "Normalizer",
        lines: 144,
        detail: "Score normalization & phase mapping",
        tokens: [
          "normalize",
          "scale",
          "map_to_phase",
          "weighted_average",
        ],
      },
    ],
  },
];

const SACRED_KEYWORDS = [
  "atman", "bouddhi", "manas", "kama", "prana", "dharma", "karma",
  "mantra", "sutra", "yantra", "chakra", "kundalini", "samsara", "nirvana",
  "maya", "moksha", "tattva", "guna", "rasa", "bindu", "nadi", "mudra",
  "samadhi", "prajna", "vidya", "jnana", "bhakti", "shakti", "tantra",
  "veda", "upanishad", "brahman", "purusha", "prakriti", "akasha",
  "ahamkara", "chitta", "antahkarana",
];

const TERMINAL_COMMANDS = [
  { label: "Run Tests", cmd: "cargo test", color: "emerald" },
  { label: "WASM Build", cmd: "wasm-pack build crates/senzaris-wasm --target web", color: "blue" },
  { label: "Benchmark", cmd: "cargo bench --bench phi_benchmark", color: "purple" },
  { label: "Clippy", cmd: "cargo clippy --all-targets -- -D warnings", color: "amber" },
  { label: "Doc Gen", cmd: "cargo doc --no-deps --open", color: "gold" },
];

/* ── Dimension display config ── */
const DIMENSION_CONFIG: Record<string, { label: string; color: string; icon: typeof Activity }> = {
  crm: { label: "CRM Health", color: "#00B4D8", icon: Activity },
  finance: { label: "Finance Health", color: "#10B981", icon: Gauge },
  production: { label: "Production Health", color: "#3B82F6", icon: Cpu },
  agent: { label: "Agent Coherence", color: "#8B5CF6", icon: Network },
};

/* ── Animated Arc Gauge Component ── */
function PhiGauge({ score, phase, loading }: { score: number; phase: Phase; loading: boolean }) {
  const pc = phaseConfig[phase];
  const radius = 80;
  const circumference = Math.PI * radius; // semicircle
  const strokeOffset = circumference - (score * circumference);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
        {/* Background arc */}
        <path
          d="M 10 110 A 80 80 0 0 1 190 110"
          fill="none"
          stroke="oklch(0.18 0.01 270)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Animated foreground arc */}
        <motion.path
          d="M 10 110 A 80 80 0 0 1 190 110"
          fill="none"
          stroke={pc.arcColor}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: loading ? 0 : score }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 12px ${pc.glow})`,
          }}
        />
        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const angle = Math.PI - tick * Math.PI;
          const x1 = 100 + 92 * Math.cos(angle);
          const y1 = 110 - 92 * Math.sin(angle);
          const x2 = 100 + 86 * Math.cos(angle);
          const y2 = 110 - 86 * Math.sin(angle);
          return (
            <line
              key={tick}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="oklch(0.35 0.01 270)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
        {/* Phase glow pulse */}
        {phase === "Samadhi" && (
          <motion.circle
            cx="100"
            cy="50"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity={0.15}
            animate={{ r: [30, 50, 30], opacity: [0.15, 0, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <motion.span
          key={score}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "font-[family-name:var(--font-clash-display)] text-5xl font-bold",
            pc.color
          )}
          style={phase === "Samadhi" ? { textShadow: "0 0 20px rgba(255,255,255,0.4)" } : {}}
        >
          {loading ? "..." : score.toFixed(2)}
        </motion.span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          phi ({"\u03A6"})
        </span>
      </div>
    </div>
  );
}

/* ── Phase Indicator Bar ── */
function PhaseBar({ current }: { current: Phase }) {
  const phases: { key: Phase; label: string; color: string }[] = [
    { key: "Dormant", label: "Dormant", color: "bg-zinc-500" },
    { key: "Eveille", label: "\u00C9veill\u00E9", color: "bg-blue-500" },
    { key: "Lucide", label: "Lucide", color: "bg-[var(--color-gold)]" },
    { key: "Samadhi", label: "Samadhi", color: "bg-white" },
  ];
  const currentIdx = phases.findIndex((p) => p.key === current);

  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => (
        <div key={p.key} className="flex items-center gap-1">
          <motion.div
            animate={{
              scale: i === currentIdx ? 1 : 0.9,
              opacity: i <= currentIdx ? 1 : 0.4,
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              i === currentIdx
                ? "border border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                : i < currentIdx
                  ? "bg-white/5 text-[var(--color-text)]"
                  : "bg-white/[0.02] text-[var(--color-text-muted)]"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", i <= currentIdx ? p.color : "bg-white/10")} />
            {p.label}
          </motion.div>
          {i < phases.length - 1 && (
            <ChevronRight className={cn("h-3 w-3", i < currentIdx ? "text-[var(--color-text-muted)]" : "text-white/10")} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Dimension Score Card ── */
function DimensionCard({
  dimKey,
  score,
  delay,
}: {
  dimKey: string;
  score: number;
  delay: number;
}) {
  const config = DIMENSION_CONFIG[dimKey];
  if (!config) return null;
  const Icon = config.icon;
  const percent = Math.round(score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group rounded-xl border border-[var(--color-border-subtle)] bg-white/[0.02] p-4 transition-all hover:border-[var(--color-gold-muted)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${config.color}15` }}>
            <Icon className="h-4 w-4" style={{ color: config.color }} />
          </div>
          <span className="text-sm font-medium text-[var(--color-text)]">{config.label}</span>
        </div>
        <span className="font-[family-name:var(--font-clash-display)] text-2xl font-bold" style={{ color: config.color }}>
          {percent}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
            boxShadow: `0 0 10px ${config.color}40`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── Top Nodes Bar Chart ── */
function TopNodesChart({ nodes }: { nodes: [string, number][] }) {
  const maxVal = Math.max(...nodes.map((n) => n[1]), 0.01);

  const nodeLabels: Record<string, string> = {
    crm: "CRM",
    finance: "Finance",
    production: "Production",
    agent: "Coherence",
  };
  const nodeColors: Record<string, string> = {
    crm: "#00B4D8",
    finance: "#10B981",
    production: "#3B82F6",
    agent: "#8B5CF6",
  };

  return (
    <div className="space-y-3">
      {nodes.slice(0, 5).map(([key, val], i) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-text)]">{nodeLabels[key] || key}</span>
            <span className="font-mono text-xs" style={{ color: nodeColors[key] || "#00B4D8" }}>
              {val.toFixed(3)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(val / maxVal) * 100}%` }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.7 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${nodeColors[key] || "#00B4D8"}80, ${nodeColors[key] || "#00B4D8"})`,
                boxShadow: `0 0 8px ${nodeColors[key] || "#00B4D8"}30`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function SenzarisPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [expandedCrate, setExpandedCrate] = useState<string | null>(null);
  const [phiData, setPhiData] = useState<ConsciousnessData | null>(null);
  const [phiLoading, setPhiLoading] = useState(true);
  const [phiError, setPhiError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Fetch consciousness data ── */
  const fetchPhi = useCallback(async () => {
    try {
      setPhiLoading(true);
      setPhiError(null);
      const res = await fetch("/api/consciousness", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ConsciousnessData = await res.json();
      setPhiData(data);
      setLastRefresh(new Date());
    } catch (err) {
      setPhiError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setPhiLoading(false);
    }
  }, []);

  /* ── Auto-refresh every 30 seconds ── */
  useEffect(() => {
    fetchPhi();
    intervalRef.current = setInterval(fetchPhi, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPhi]);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const currentPhase = phiData ? toPhase(phiData.phase_label || phiData.phase) : "Dormant";
  const pc = phaseConfig[currentPhase];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ================================================================
          HERO HEADER
          ================================================================ */}
      <div className="relative overflow-hidden border-b border-[var(--color-border-subtle)] px-6 py-8">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${pc.bgGlow}, transparent 70%)`,
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 font-[family-name:var(--font-clash-display)] text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Senzaris{" "}
              <motion.span
                className="text-3xl"
                style={{ WebkitTextFillColor: "initial" }}
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                &#x25C8;
              </motion.span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 flex items-center gap-3 font-mono text-sm text-[var(--color-text-muted)]"
            >
              <span className="text-[var(--color-gold)]">5 756</span> lignes Rust
              <span className="text-[var(--color-border-subtle)]">|</span>
              <span className="text-emerald-400">104</span> tests
              <span className="text-[var(--color-border-subtle)]">|</span>
              <span className="text-emerald-400">0</span> failures
            </motion.div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyCommand("cargo test")}
              className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              <TestTube2 className="h-4 w-4" />
              Tests
            </button>
            <button
              onClick={() => copyCommand("wasm-pack build crates/senzaris-wasm --target web")}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] px-4 py-2 text-sm font-medium text-[var(--color-gold)] transition-colors hover:shadow-[var(--shadow-gold)]"
            >
              <HardDrive className="h-4 w-4" />
              WASM
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Lines of Rust" value="5,756" icon={Code2} delay={0.05} subtitle="Production code" />
          <StatCard
            title="Tests"
            value="104"
            icon={TestTube2}
            delay={0.1}
            subtitle="All passing"
            trend="up"
            trendValue="100%"
          />
          <StatCard title="Crates" value="4" icon={Package} delay={0.15} subtitle="core, phi, wasm, phi-score" />
          <StatCard title="WASM Bundle" value="480 KB" icon={HardDrive} delay={0.2} subtitle="gzip compressed" />
        </div>

        {/* ================================================================
            ARCHITECTURE — Expandable Crate Cards
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <p className="mb-5 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
            <Layers className="h-4 w-4 text-[var(--color-gold)]" />
            Architecture
            <Badge variant="gold" size="sm">{CRATES.reduce((s, c) => s + c.lines, 0).toLocaleString()} lines</Badge>
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {CRATES.map((crate) => {
              const isExpanded = expandedCrate === crate.name;
              const Icon = crate.icon;
              return (
                <motion.div
                  key={crate.name}
                  layout
                  className="group overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-white/[0.02] transition-colors hover:border-[var(--color-gold-muted)]"
                >
                  {/* Header — click to expand */}
                  <button
                    onClick={() => setExpandedCrate(isExpanded ? null : crate.name)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${crate.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: crate.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[var(--color-text)]">{crate.name}</span>
                        <Badge variant="gold" size="sm">{crate.lines} lines</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{crate.desc}</p>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </motion.div>
                  </button>

                  {/* Expanded module details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[var(--color-border-subtle)] px-4 pb-4 pt-3 space-y-3">
                          {crate.modules.map((mod) => (
                            <div key={mod.name} className="rounded-lg bg-white/[0.02] p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ChevronRight className="h-3 w-3 text-[var(--color-gold)]" />
                                  <span className="font-mono text-xs font-semibold text-[var(--color-text)]">{mod.name}</span>
                                </div>
                                <span className="text-[10px] text-[var(--color-text-muted)]">{mod.lines} lines &mdash; {mod.detail}</span>
                              </div>
                              {/* Tokens/items */}
                              <div className="flex flex-wrap gap-1">
                                {mod.tokens.map((t) => (
                                  <span
                                    key={t}
                                    className="rounded border border-[var(--color-gold)]/10 bg-[var(--color-gold-glow)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-gold)]/80"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ================================================================
            PHI-ENGINE LIVE — fetches /api/consciousness
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          {/* Section Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">PHI-ENGINE LIVE</span>
              <Badge variant="default" size="sm">/api/consciousness</Badge>
              {phiData && (
                <Badge variant="success" size="sm" dot>
                  {phiData.computed_in_ms}ms
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              {lastRefresh && (
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Dernier refresh: {lastRefresh.toLocaleTimeString("fr-FR")}
                </span>
              )}
              <button
                onClick={fetchPhi}
                disabled={phiLoading}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-white/[0.02] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3 w-3", phiLoading && "animate-spin")} />
                Refresh
              </button>
            </div>
          </div>

          {/* Error state */}
          {phiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{phiError}</span>
              <span className="text-xs text-amber-400/60">&mdash; Utilisation des valeurs de fallback</span>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-12">
            {/* ── Left: Gauge + Phase ── */}
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/[0.02] p-6 lg:col-span-4">
              <PhiGauge
                score={phiData?.consciousness_score ?? 0}
                phase={currentPhase}
                loading={phiLoading}
              />
              <PhaseBar current={currentPhase} />
              {/* Active stats */}
              <div className="mt-2 grid w-full grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <p className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-gold)]">
                    {phiData?.synaptic_graph.nodes.length ?? 4}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Active Nodes</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <p className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-gold)]">
                    {phiData?.synaptic_graph.edges.length ?? 0}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Active Edges</p>
                </div>
              </div>
            </div>

            {/* ── Center: 4 Dimension Cards ── */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-4">
              {(["crm", "finance", "production", "agent"] as const).map((key, i) => (
                <DimensionCard
                  key={key}
                  dimKey={key}
                  score={phiData?.dimensions[key]?.score ?? 0}
                  delay={0.4 + i * 0.08}
                />
              ))}
            </div>

            {/* ── Right: Top Nodes + Recommendations ── */}
            <div className="space-y-4 lg:col-span-4">
              {/* Top 5 nodes */}
              <div className="rounded-xl bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">Top Consciousness Nodes</p>
                <TopNodesChart nodes={phiData?.top_nodes ?? []} />
              </div>

              {/* Recommendations */}
              <div className="rounded-xl bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">Recommendations</p>
                <div className="space-y-2">
                  {(phiData?.recommendations ?? ["En attente de donnees..."]).map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-start gap-2 rounded-lg bg-white/[0.02] px-3 py-2 text-xs text-[var(--color-text)]"
                    >
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-gold)]" />
                      <span>{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================================
            SACRED KEYWORDS
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
            <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
            Sacred Keywords
            <Badge variant="gold" size="sm">{SACRED_KEYWORDS.length} tokens</Badge>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SACRED_KEYWORDS.map((kw, i) => (
              <motion.span
                key={kw}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.015 }}
                className="cursor-default rounded border border-[var(--color-gold)]/10 bg-[var(--color-gold-glow)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-gold)] transition-all hover:border-[var(--color-gold)]/30 hover:shadow-[0_0_12px_oklch(0.75_0.12_85/0.2)]"
              >
                {kw}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ================================================================
            TERMINAL COMMANDS
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
            <Terminal className="h-4 w-4 text-[var(--color-gold)]" />
            Terminal
          </p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {TERMINAL_COMMANDS.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-black/30 px-4 py-2.5 font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)]"
              >
                <span className="text-[var(--color-gold)]">$</span>
                <span className="flex-1 truncate">{c.cmd}</span>
                <button
                  onClick={() => copyCommand(c.cmd)}
                  className="shrink-0 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
                >
                  {copiedCmd === c.cmd ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
