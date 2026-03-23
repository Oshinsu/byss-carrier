"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Play,
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Clock,
  UserPlus,
  Handshake,
  Coffee,
  Video,
  Plus,
  Zap,
  BarChart3,
  Timer,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  orchestrator,
  WORKFLOW_TEMPLATES,
  formatDurationMs,
  type Workflow,
  type WorkflowStep,
  type StepAction,
  type StepStatus,
} from "@/lib/orchestrator/engine";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Orchestrateur Dashboard
// Control center for all automated workflows.
// Dense. Power-user. No waste.
// ═══════════════════════════════════════════════════════

/* ─── Icon map for templates ────────────────────────────── */
const templateIcons: Record<string, React.ElementType> = {
  UserPlus,
  Handshake,
  Coffee,
  Video,
};

/* ─── Icon map for step actions ─────────────────────────── */
const actionIcons: Record<StepAction, React.ElementType> = {
  analyze: Activity,
  email: Zap,
  propose: BarChart3,
  invoice: TrendingUp,
  schedule: Clock,
  notify: Zap,
  create: Plus,
  generate: Activity,
  fetch: Loader2,
  score: TrendingUp,
  track: Timer,
  update: CheckCircle2,
};

/* ─── Status badge ──────────────────────────────────────── */
function StatusBadge({ status }: { status: StepStatus | "pending" | "running" | "done" | "failed" }) {
  const config: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    pending: { icon: Circle, color: "text-[var(--color-text-muted)]", bg: "bg-transparent" },
    running: { icon: Loader2, color: "text-[var(--color-gold)]", bg: "bg-[var(--color-gold-glow)]" },
    done: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  };
  const c = config[status] ?? config.pending;
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium", c.color, c.bg)}>
      <Icon className={cn("h-3 w-3", status === "running" && "animate-spin")} />
      {status}
    </span>
  );
}

/* ─── Step row in workflow detail ────────────────────────── */
function StepRow({ step }: { step: WorkflowStep }) {
  const ActionIcon = actionIcons[step.action] ?? Activity;
  const duration =
    step.startedAt && step.completedAt
      ? formatDurationMs(step.completedAt.getTime() - step.startedAt.getTime())
      : step.startedAt
        ? "..."
        : "\u2014";

  return (
    <tr className="border-b border-[var(--color-border-subtle)] last:border-b-0">
      <td className="py-1.5 pl-4 pr-2">
        <ActionIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
      </td>
      <td className="py-1.5 pr-3 font-mono text-[11px] text-[var(--color-text-muted)]">
        {step.id}
      </td>
      <td className="py-1.5 pr-3 text-xs text-[var(--color-text)]">
        {step.label}
      </td>
      <td className="py-1.5 pr-3 font-mono text-[11px] text-[var(--color-text-secondary)]">
        {step.target}
      </td>
      <td className="py-1.5 pr-3">
        <StatusBadge status={step.status} />
      </td>
      <td className="py-1.5 pr-4 text-right font-mono text-[11px] text-[var(--color-text-muted)]">
        {duration}
      </td>
    </tr>
  );
}

/* ─── Progress bar for workflow ──────────────────────────── */
function WorkflowProgress({ steps }: { steps: WorkflowStep[] }) {
  const total = steps.length;
  const done = steps.filter((s) => s.status === "done").length;
  const failed = steps.filter((s) => s.status === "failed").length;
  const running = steps.filter((s) => s.status === "running").length;
  const pct = total > 0 ? ((done + failed) / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
        <motion.div
          className={cn(
            "h-full rounded-full",
            failed > 0 ? "bg-red-400" : "bg-[var(--color-gold)]"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <span className="min-w-[3.5rem] text-right font-mono text-[10px] text-[var(--color-text-muted)]">
        {done}/{total}
        {running > 0 && (
          <span className="text-[var(--color-gold)]"> +{running}</span>
        )}
      </span>
    </div>
  );
}

/* ─── Single workflow card (expandable) ──────────────────── */
function WorkflowCard({
  workflow,
  onLaunch,
}: {
  workflow: Workflow;
  onLaunch: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(workflow.status === "running");

  const duration =
    workflow.startedAt && workflow.completedAt
      ? formatDurationMs(workflow.completedAt.getTime() - workflow.startedAt.getTime())
      : workflow.startedAt
        ? formatDurationMs(Date.now() - workflow.startedAt.getTime())
        : "\u2014";

  return (
    <div className="border-b border-[var(--color-border-subtle)] last:border-b-0">
      {/* Header row */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--color-surface-raised)]/50"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
        )}

        <StatusBadge status={workflow.status} />

        <span className="flex-1 text-xs font-medium text-[var(--color-text)]">
          {workflow.name}
        </span>

        <div className="hidden w-48 sm:block">
          <WorkflowProgress steps={workflow.steps} />
        </div>

        <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
          {duration}
        </span>

        <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
          {workflow.id}
        </span>

        {workflow.status === "pending" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLaunch(workflow.id);
            }}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold",
              "bg-[var(--color-gold)] text-black transition-opacity hover:opacity-90"
            )}
          >
            <Play className="h-3 w-3" />
            Lancer
          </button>
        )}
      </div>

      {/* Expanded: step table */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30">
                  <th className="w-8 py-1 pl-4" />
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    ID
                  </th>
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Action
                  </th>
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Target
                  </th>
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                  </th>
                  <th className="py-1 pr-4 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Dur\u00e9e
                  </th>
                </tr>
              </thead>
              <tbody>
                {workflow.steps.map((step) => (
                  <StepRow key={step.id} step={step} />
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Stats card ────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-gold-glow)]">
        <Icon className="h-4 w-4 text-[var(--color-gold)]" />
      </div>
      <div>
        <div className="font-mono text-lg font-bold text-[var(--color-text)]">
          {value}
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)]">
          {label}
          {sub && <span className="ml-1 text-[var(--color-gold-muted)]">{sub}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Template picker dropdown ──────────────────────────── */
function TemplatePicker({ onSelect }: { onSelect: (templateId: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold",
          "bg-[var(--color-gold)] text-black transition-opacity hover:opacity-90"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
        Nouveau Workflow
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute right-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-lg",
              "border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-xl"
            )}
          >
            {WORKFLOW_TEMPLATES.map((t) => {
              const Icon = templateIcons[t.icon] ?? Activity;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelect(t.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-raised)]"
                >
                  <Icon className="mt-0.5 h-4 w-4 text-[var(--color-gold)]" />
                  <div>
                    <div className="text-xs font-medium text-[var(--color-text)]">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      {t.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function OrchestrateurPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [stats, setStats] = useState(orchestrator.getStats());
  const [, setTick] = useState(0); // force re-render on workflow updates

  /* Subscribe to engine updates */
  useEffect(() => {
    const refresh = () => {
      setWorkflows(orchestrator.listAllWorkflows());
      setStats(orchestrator.getStats());
      setTick((t) => t + 1);
    };

    refresh();
    const unsub = orchestrator.subscribe(() => refresh());
    return unsub;
  }, []);

  /* Create workflow from template */
  const handleCreateFromTemplate = useCallback((templateId: string) => {
    const wf = orchestrator.createFromTemplate(templateId, {
      prospectName: "Prospect " + Date.now().toString(36).slice(-4).toUpperCase(),
      dealName: "Deal " + Date.now().toString(36).slice(-4).toUpperCase(),
      videoTitle: "Video " + Date.now().toString(36).slice(-4).toUpperCase(),
    });
    if (wf) {
      setWorkflows(orchestrator.listAllWorkflows());
      setStats(orchestrator.getStats());
    }
  }, []);

  /* Launch workflow */
  const handleLaunch = useCallback((workflowId: string) => {
    orchestrator.executeWorkflow(workflowId);
  }, []);

  const activeWorkflows = workflows.filter(
    (w) => w.status === "pending" || w.status === "running"
  );
  const completedWorkflows = orchestrator.listCompletedWorkflows(10);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
            <Activity className="h-5 w-5 text-[var(--color-gold)]" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 ring-2 ring-[var(--color-bg)]" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
              Orchestrateur
            </h1>
            <span className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
              BYSS EMPIRE
            </span>
          </div>
        </div>

        <TemplatePicker onSelect={handleCreateFromTemplate} />
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Zap}
          label="Workflows aujourd'hui"
          value={stats.workflowsToday}
        />
        <StatCard
          icon={Activity}
          label="Steps ex\u00e9cut\u00e9s"
          value={stats.totalSteps}
        />
        <StatCard
          icon={Timer}
          label="Dur\u00e9e moy."
          value={stats.avgDurationMs > 0 ? formatDurationMs(stats.avgDurationMs) : "\u2014"}
        />
        <StatCard
          icon={TrendingUp}
          label="Taux de succ\u00e8s"
          value={`${stats.successRate}%`}
        />
      </div>

      {/* ── Active Workflows ── */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Workflows Actifs
          </h2>
          <span className="font-mono text-[10px] text-[var(--color-gold-muted)]">
            {activeWorkflows.length} en cours
          </span>
        </div>

        {activeWorkflows.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-[var(--color-text-muted)]">
            Aucun workflow actif. Utilisez &quot;Nouveau Workflow&quot; pour commencer.
          </div>
        ) : (
          activeWorkflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onLaunch={handleLaunch}
            />
          ))
        )}
      </div>

      {/* ── History ── */}
      {completedWorkflows.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Historique
            </h2>
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
              {completedWorkflows.length} dernier{completedWorkflows.length > 1 ? "s" : ""}
            </span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30">
                <th className="py-1.5 pl-4 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  ID
                </th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Nom
                </th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Steps
                </th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Dur\u00e9e
                </th>
                <th className="py-1.5 pr-4 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Termin\u00e9
                </th>
              </tr>
            </thead>
            <tbody>
              {completedWorkflows.map((wf) => {
                const duration =
                  wf.startedAt && wf.completedAt
                    ? formatDurationMs(wf.completedAt.getTime() - wf.startedAt.getTime())
                    : "\u2014";
                const doneSteps = wf.steps.filter((s) => s.status === "done").length;
                return (
                  <tr
                    key={wf.id}
                    className="border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30"
                  >
                    <td className="py-1.5 pl-4 pr-3 font-mono text-[10px] text-[var(--color-text-muted)]">
                      {wf.id}
                    </td>
                    <td className="py-1.5 pr-3 text-xs text-[var(--color-text)]">
                      {wf.name}
                    </td>
                    <td className="py-1.5 pr-3">
                      <StatusBadge status={wf.status} />
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {doneSteps}/{wf.steps.length}
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[11px] text-[var(--color-text-muted)]">
                      {duration}
                    </td>
                    <td className="py-1.5 pr-4 text-right font-mono text-[10px] text-[var(--color-text-muted)]">
                      {wf.completedAt
                        ? new Intl.DateTimeFormat("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }).format(wf.completedAt)
                        : "\u2014"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
