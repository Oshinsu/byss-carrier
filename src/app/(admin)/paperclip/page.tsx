"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  User,
  Bot,
  Target,
  TrendingUp,
  Cpu,
  Palette,
  Brain,
  Video,
  Network,
  Terminal,
  Copy,
  CheckCircle2,
  Circle,
  RefreshCw,
  Play,
  Wifi,
  WifiOff,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Zap,
  ChevronDown,
  ChevronRight,
  Flag,
  BarChart3,
  Workflow,
  Server,
  Key,
  Database,
  Shield,
  Clock,
  Activity,
  Link2,
  Check,
  X,
  Minus,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

/* ═══════════════════════════════════════════════════════
   PAPERCLIP — Orchestrateur d'Entreprise
   Company OS. Agent team. BYSS GROUP. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

/* ── Types ── */
interface Division {
  name: string;
  lead: string;
  type: string;
  platform: string;
  budget: number;
  budgetTotal: number;
  model: string;
  color: string;
  colorBg: string;
  icon: React.ElementType;
  currentTasks: string[];
  lastAction: string;
  lastActionTime: string;
  health: "green" | "yellow" | "red";
}

interface Goal {
  period: string;
  ca: string;
  mrr: string;
  clients: string;
  progress: number;
  keyResults: { label: string; done: boolean }[];
}

interface Integration {
  name: string;
  from: string;
  to: string;
  status: "connected" | "missing_key" | "not_configured";
  checkMethod: string;
}

interface CostItem {
  name: string;
  category: string;
  monthly: number;
  note: string;
}

/* ── Data ── */
const DIVISIONS: Division[] = [
  {
    name: "Commercial",
    lead: "Sorel",
    type: "Agent IA",
    platform: "OpenClaw",
    budget: 85,
    budgetTotal: 200,
    model: "Claude Opus 4.6",
    color: "text-emerald-400",
    colorBg: "bg-emerald-500/10 border-emerald-500/20",
    icon: Target,
    currentTasks: ["Pipeline Wizzee follow-up", "Prospection LinkedIn x5", "Devis cabinet comptable"],
    lastAction: "Email relance Wizzee envoye",
    lastActionTime: "il y a 2h",
    health: "green",
  },
  {
    name: "Technique",
    lead: "Nerel",
    type: "Agent IA",
    platform: "Claude Code",
    budget: 145,
    budgetTotal: 200,
    model: "Claude Opus 4.6",
    color: "text-blue-400",
    colorBg: "bg-blue-500/10 border-blue-500/20",
    icon: Cpu,
    currentTasks: ["Carrier v1.0 Gulf Stream", "API /api/health endpoint", "Supabase schema migration"],
    lastAction: "Deploy Carrier build #47",
    lastActionTime: "il y a 35min",
    health: "green",
  },
  {
    name: "Creatif & Lore",
    lead: "Kael",
    type: "Agent IA",
    platform: "Claude Code",
    budget: 60,
    budgetTotal: 200,
    model: "Claude Opus 4.6",
    color: "text-[var(--color-gold)]",
    colorBg: "bg-[var(--color-gold-glow)] border-[var(--color-gold)]/20",
    icon: Palette,
    currentTasks: ["Bible Senzaris ch.4", "Design system tokens", "Lore village IA"],
    lastAction: "Bible chapitre 3 complete",
    lastActionTime: "il y a 5h",
    health: "yellow",
  },
  {
    name: "Intelligence",
    lead: "Evren",
    type: "Agent IA",
    platform: "phi-engine",
    budget: 40,
    budgetTotal: 100,
    model: "Claude Sonnet 4.6",
    color: "text-purple-400",
    colorBg: "bg-purple-500/10 border-purple-500/20",
    icon: Brain,
    currentTasks: ["Gulf Stream phi-scoring", "Market analysis batch", "Risk model calibration"],
    lastAction: "phi-score batch 247 marches",
    lastActionTime: "il y a 1h",
    health: "green",
  },
  {
    name: "Production Video",
    lead: "Pipeline",
    type: "Automation",
    platform: "ComfyUI + Kling",
    budget: 120,
    budgetTotal: 300,
    model: "Multi-modal",
    color: "text-red-400",
    colorBg: "bg-red-500/10 border-red-500/20",
    icon: Video,
    currentTasks: ["Teaser BYSS 30s", "Logo animation", "Senzaris trailer concept"],
    lastAction: "Rendu teaser frame 120/300",
    lastActionTime: "il y a 12h",
    health: "red",
  },
];

const GOALS: Goal[] = [
  {
    period: "Q2 2026",
    ca: "50-100K\u20AC",
    mrr: "5K\u20AC",
    clients: "8-15",
    progress: 12,
    keyResults: [
      { label: "Premier client signe (Wizzee)", done: true },
      { label: "Pipeline 15 prospects qualifies", done: true },
      { label: "5K\u20AC MRR atteint", done: false },
      { label: "8 clients actifs", done: false },
      { label: "Site vitrine BYSS GROUP", done: false },
    ],
  },
  {
    period: "Q3-Q4 2026",
    ca: "150-250K\u20AC",
    mrr: "15K\u20AC",
    clients: "20-25",
    progress: 0,
    keyResults: [
      { label: "15K\u20AC MRR stable", done: false },
      { label: "20 clients actifs", done: false },
      { label: "1 salarie recrute", done: false },
      { label: "Produit SaaS MVP lance", done: false },
    ],
  },
  {
    period: "2027",
    ca: "800K-1.2M\u20AC",
    mrr: "45K\u20AC",
    clients: "40-60",
    progress: 0,
    keyResults: [
      { label: "3-5 salaries", done: false },
      { label: "SaaS en production", done: false },
      { label: "Expansion Caraibes", done: false },
      { label: "Serie A envisagee", done: false },
    ],
  },
];

const INTEGRATIONS: Integration[] = [
  { name: "Supabase", from: "Carrier", to: "Supabase", status: "connected", checkMethod: "NEXT_PUBLIC_SUPABASE_URL" },
  { name: "Claude API", from: "Carrier", to: "Anthropic", status: "connected", checkMethod: "ANTHROPIC_API_KEY" },
  { name: "OpenClaw", from: "Carrier", to: "OpenClaw", status: "not_configured", checkMethod: "OPENCLAW_API_KEY" },
  { name: "Paperclip API", from: "Carrier", to: "Paperclip", status: "not_configured", checkMethod: "localhost:3100" },
  { name: "Netlify", from: "Carrier", to: "Netlify", status: "connected", checkMethod: "NETLIFY_AUTH_TOKEN" },
  { name: "Stripe", from: "Carrier", to: "Stripe", status: "missing_key", checkMethod: "STRIPE_SECRET_KEY" },
  { name: "Resend", from: "Carrier", to: "Resend", status: "connected", checkMethod: "RESEND_API_KEY" },
  { name: "ComfyUI", from: "Pipeline", to: "ComfyUI", status: "not_configured", checkMethod: "COMFYUI_URL" },
];

const COSTS: CostItem[] = [
  { name: "Claude API", category: "IA", monthly: 200, note: "Opus 4.6 + Sonnet" },
  { name: "Supabase", category: "Infra", monthly: 25, note: "Pro plan" },
  { name: "Netlify", category: "Infra", monthly: 0, note: "Free tier" },
  { name: "Vercel", category: "Infra", monthly: 0, note: "Hobby" },
  { name: "Domain byss.group", category: "Infra", monthly: 2, note: "Annuel /12" },
  { name: "Resend", category: "Email", monthly: 0, note: "Free tier" },
  { name: "ComfyUI GPU", category: "Video", monthly: 50, note: "RunPod on-demand" },
  { name: "Kling AI", category: "Video", monthly: 30, note: "Pro plan" },
  { name: "MiniMax M2.7", category: "IA", monthly: 15, note: "Gulf Stream scanning" },
  { name: "GitHub Copilot", category: "Dev", monthly: 10, note: "Pro" },
];

const WORKFLOW_TEMPLATES = [
  { name: "Client Onboarding", steps: 5, status: "active", trigger: "Nouveau client signe" },
  { name: "Invoice Generation", steps: 3, status: "active", trigger: "Fin de mois" },
  { name: "Prospect Qualification", steps: 4, status: "active", trigger: "Formulaire contact" },
  { name: "Content Pipeline", steps: 6, status: "draft", trigger: "Brief creatif approuve" },
  { name: "Gulf Stream Cycle", steps: 7, status: "active", trigger: "Cron quotidien 09:00" },
];

/* ═══════════════════════════════════════════════════════ */
export default function PaperclipPage() {
  const [expandedDiv, setExpandedDiv] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const totalCost = useMemo(() => COSTS.reduce((s, c) => s + c.monthly, 0), []);
  const totalBudgetUsed = useMemo(() => DIVISIONS.reduce((s, d) => s + d.budget, 0), []);
  const totalBudgetCap = useMemo(() => DIVISIONS.reduce((s, d) => s + d.budgetTotal, 0), []);

  const glassCard = "rounded-xl border border-[var(--color-border-subtle)] p-5";
  const glassBg: React.CSSProperties = {
    background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 font-[family-name:var(--font-clash-display)] text-3xl font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <span className="text-3xl" style={{ WebkitTextFillColor: "initial" }}>&#x1F4CE;</span>
              Paperclip
            </motion.h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Orchestrateur d&apos;Entreprise &mdash; Company OS
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyCommand("cd paperclip && pnpm dev")}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] px-4 py-2 text-sm font-medium text-[var(--color-gold)] transition-all hover:shadow-[var(--shadow-gold)]"
            >
              <Play className="h-4 w-4" />
              Lancer Paperclip
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]">
              <RefreshCw className="h-4 w-4" />
              Sync
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ── Quick Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Divisions Actives" value="5" icon={Users} trend="up" trendValue="5/5" delay={0.05} />
          <StatCard title="Agents IA" value="4" icon={Bot} subtitle="+ 1 automation" delay={0.1} />
          <StatCard title="Budget Utilise" value={`${totalBudgetUsed}\u20AC`} icon={DollarSign} trend="neutral" trendValue={`/${totalBudgetCap}\u20AC`} delay={0.15} />
          <StatCard title="Cout Mensuel" value={`${totalCost}\u20AC`} icon={Coins} subtitle="Infrastructure + APIs" delay={0.2} iconColor="text-amber-400" />
        </div>

        {/* ── Org Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={glassCard}
          style={glassBg}
        >
          <p className="mb-5 text-sm font-medium text-[var(--color-text)]">
            <Users className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
            Organigramme BYSS GROUP
          </p>

          {/* CEO */}
          <div className="flex justify-center mb-4">
            <div className="rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] px-6 py-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-[var(--color-gold)]" />
                <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-gold)]">Gary Bissol</span>
              </div>
              <p className="text-xs text-[var(--color-gold)]/70">CEO &bull; Fondateur &bull; Humain</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-4">
            <div className="h-6 w-px bg-[var(--color-border-subtle)]" />
          </div>

          {/* Divisions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {DIVISIONS.map((div, i) => {
              const Icon = div.icon;
              const isExpanded = expandedDiv === div.name;
              return (
                <motion.div
                  key={div.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex flex-col"
                >
                  <button
                    onClick={() => setExpandedDiv(isExpanded ? null : div.name)}
                    className={cn(
                      "group w-full rounded-xl border p-4 text-left transition-all",
                      div.colorBg,
                      isExpanded && "ring-1 ring-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", div.color)} />
                        <span className={cn("text-sm font-semibold", div.color)}>{div.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 text-[var(--color-text-muted)]" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-[var(--color-text-muted)]" />
                      )}
                    </div>

                    {/* Health bar */}
                    <div className="mb-2 h-1 w-full rounded-full bg-white/5">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          div.health === "green" ? "bg-emerald-400" : div.health === "yellow" ? "bg-amber-400" : "bg-red-400"
                        )}
                        style={{ width: `${(div.budget / div.budgetTotal) * 100}%` }}
                      />
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Lead</span>
                        <span className="font-medium text-[var(--color-text)]">{div.lead}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Budget</span>
                        <span className="font-mono text-[var(--color-text)]">{div.budget}/{div.budgetTotal}\u20AC</span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-lg border border-[var(--color-border-subtle)] bg-black/20 p-3 space-y-2">
                          <div className="text-[10px]">
                            <span className="text-[var(--color-text-muted)]">Modele: </span>
                            <span className="font-mono text-[var(--color-text)]">{div.model}</span>
                          </div>
                          <div className="text-[10px]">
                            <span className="text-[var(--color-text-muted)]">Plateforme: </span>
                            <span className="text-[var(--color-text)]">{div.platform}</span>
                          </div>
                          <div className="text-[10px]">
                            <span className="text-[var(--color-text-muted)]">Derniere action: </span>
                            <span className="text-[var(--color-text)]">{div.lastAction}</span>
                            <span className="ml-1 text-[var(--color-text-muted)]">({div.lastActionTime})</span>
                          </div>
                          <div className="pt-1 border-t border-[var(--color-border-subtle)]">
                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1">Taches en cours:</p>
                            {div.currentTasks.map((task) => (
                              <div key={task} className="flex items-start gap-1.5 text-[10px]">
                                <Activity className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[var(--color-gold)]" />
                                <span className="text-[var(--color-text)]">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Goals Dashboard ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={glassCard}
          style={glassBg}
        >
          <p className="mb-5 text-sm font-medium text-[var(--color-text)]">
            <Flag className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
            Objectifs de Croissance
          </p>

          <div className="grid gap-4 lg:grid-cols-3">
            {GOALS.map((goal, gi) => (
              <div key={goal.period} className="rounded-lg border border-[var(--color-border-subtle)] bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-gold)]">{goal.period}</span>
                  {gi === 0 && <Badge variant="gold" size="sm">Actuel</Badge>}
                  {gi === 1 && <Badge variant="default" size="sm">Prochain</Badge>}
                  {gi === 2 && <Badge variant="default" size="sm">Vision</Badge>}
                </div>

                <div className="mb-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">CA cible</span>
                    <span className="font-semibold text-[var(--color-text)]">{goal.ca}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">MRR cible</span>
                    <span className="font-semibold text-[var(--color-text)]">{goal.mrr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Clients</span>
                    <span className="font-semibold text-[var(--color-text)]">{goal.clients}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
                    <span>Progression</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ delay: 0.6 + gi * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]"
                      style={{ boxShadow: "0 0 8px oklch(0.75 0.12 85 / 0.3)" }}
                    />
                  </div>
                </div>

                {/* Key Results */}
                <div className="space-y-1.5">
                  {goal.keyResults.map((kr) => (
                    <div key={kr.label} className="flex items-start gap-2 text-xs">
                      {kr.done ? (
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                      )}
                      <span className={cn(
                        kr.done ? "text-[var(--color-text)] line-through opacity-60" : "text-[var(--color-text)]"
                      )}>
                        {kr.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Active Workflows ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className={glassCard}
          style={glassBg}
        >
          <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
            <Workflow className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
            Workflows Actifs
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] text-left text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  <th className="pb-3 pr-4">Workflow</th>
                  <th className="pb-3 pr-4 text-center">Etapes</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Trigger</th>
                </tr>
              </thead>
              <tbody>
                {WORKFLOW_TEMPLATES.map((wf, i) => (
                  <tr key={wf.name} className="border-b border-[var(--color-border-subtle)]/50 transition-colors hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text)]">{wf.name}</td>
                    <td className="py-2.5 pr-4 text-center font-mono text-xs text-[var(--color-text-muted)]">{wf.steps}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={wf.status === "active" ? "success" : "warning"} size="sm" dot>
                        {wf.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-xs text-[var(--color-text-muted)]">{wf.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Bottom Grid: Integration Map + Cost Structure ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Integration Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className={glassCard}
            style={glassBg}
          >
            <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
              <Network className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
              Integration Map &mdash; Live Status
            </p>

            <div className="space-y-2">
              {INTEGRATIONS.map((integ) => (
                <div
                  key={integ.name}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 transition-colors",
                    integ.status === "connected"
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : integ.status === "missing_key"
                        ? "border-red-500/20 bg-red-500/5"
                        : "border-[var(--color-border-subtle)] bg-white/[0.01]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      integ.status === "connected" ? "bg-emerald-400 animate-pulse" : integ.status === "missing_key" ? "bg-red-400" : "bg-[var(--color-text-muted)]/30"
                    )} />
                    <div>
                      <span className="text-sm font-medium text-[var(--color-text)]">{integ.name}</span>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{integ.from} &harr; {integ.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{integ.checkMethod}</span>
                    {integ.status === "connected" && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    {integ.status === "missing_key" && <X className="h-3.5 w-3.5 text-red-400" />}
                    {integ.status === "not_configured" && <Minus className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-4 text-[10px] text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Connecte ({INTEGRATIONS.filter((i) => i.status === "connected").length})
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Cle manquante ({INTEGRATIONS.filter((i) => i.status === "missing_key").length})
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]/30" />
                Non configure ({INTEGRATIONS.filter((i) => i.status === "not_configured").length})
              </div>
            </div>
          </motion.div>

          {/* Cost Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={glassCard}
            style={glassBg}
          >
            <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
              <DollarSign className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
              Structure de Couts Mensuelle
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] text-left text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="pb-2 pr-4">Service</th>
                    <th className="pb-2 pr-4">Cat.</th>
                    <th className="pb-2 pr-4 text-right">Mensuel</th>
                    <th className="pb-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {COSTS.map((cost) => (
                    <tr key={cost.name} className="border-b border-[var(--color-border-subtle)]/30">
                      <td className="py-2 pr-4 text-xs font-medium text-[var(--color-text)]">{cost.name}</td>
                      <td className="py-2 pr-4">
                        <Badge variant="default" size="sm">{cost.category}</Badge>
                      </td>
                      <td className={cn(
                        "py-2 pr-4 text-right font-mono text-xs",
                        cost.monthly > 0 ? "text-[var(--color-text)]" : "text-emerald-400"
                      )}>
                        {cost.monthly > 0 ? `${cost.monthly}\u20AC` : "Gratuit"}
                      </td>
                      <td className="py-2 text-[10px] text-[var(--color-text-muted)]">{cost.note}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--color-gold)]/20">
                    <td className="pt-3 font-[family-name:var(--font-display)] font-bold text-[var(--color-gold)]" colSpan={2}>
                      TOTAL
                    </td>
                    <td className="pt-3 text-right font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-gold)]">
                      {totalCost}\u20AC
                    </td>
                    <td className="pt-3 text-[10px] text-[var(--color-text-muted)]">/mois</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ── Company Config (kept from original) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className={glassCard}
          style={glassBg}
        >
          <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
            <Building2 className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
            Configuration Entreprise
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Societe</span>
                <span className="font-semibold text-[var(--color-text)]">BYSS GROUP SAS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Mission</span>
                <span className="max-w-[250px] truncate text-right text-[var(--color-text)]">Premier studio IA de la Martinique</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Fondee le</span>
                <span className="text-[var(--color-text)]">14 mars 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">CEO</span>
                <span className="font-semibold text-[var(--color-gold)]">Gary Bissol</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">SIRET</span>
                <span className="font-mono text-xs text-[var(--color-text)]">93524559200015</span>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Forme juridique</span>
                <span className="text-[var(--color-text)]">SASU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Siege</span>
                <span className="text-[var(--color-text)]">Martinique, France</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Phase</span>
                <Badge variant="gold" size="sm">Lancement</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Effectif</span>
                <span className="text-[var(--color-text)]">1 humain + 4 agents IA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Stack</span>
                <span className="font-mono text-xs text-[var(--color-text)]">Next.js + Supabase + Claude</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
