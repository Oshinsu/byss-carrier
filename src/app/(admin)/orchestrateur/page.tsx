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
  Power,
  Pause,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Brain,
  Users,
  Target,
  Shield,
  Waves,
  Database,
  Cpu,
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
import { cronManager, CRON_TASKS, type CronExecution } from "@/lib/orchestrator/cron";
import { buildUnifiedContext, type UnifiedContext } from "@/lib/orchestrator/context";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Orchestrateur Dashboard
// Autopilot. Human-in-the-loop gates.
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

/* ─── Schedule icons ────────────────────────────────────── */
const cronIcons: Record<string, React.ElementType> = {
  daily_insight: Brain,
  auto_relance: Users,
  market_scan: Waves,
  health_check: Shield,
  daily_report: BarChart3,
  embedding_refresh: Database,
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
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">ID</th>
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Action</th>
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Target</th>
                  <th className="py-1 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                  <th className="py-1 pr-4 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Dur&eacute;e</th>
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
                    <div className="text-xs font-medium text-[var(--color-text)]">{t.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{t.description}</div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

/* ─── Autonomous Mode Toggle ───────────────────────────── */
function AutonomousToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(cronManager.autonomousMode);
    const unsub = cronManager.subscribe(() => {
      setEnabled(cronManager.autonomousMode);
    });
    return unsub;
  }, []);

  const toggle = () => {
    cronManager.setAutonomousMode(!enabled);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-5 py-4 transition-all",
        enabled
          ? "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5"
          : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          enabled ? "bg-[var(--color-gold)]/15" : "bg-[var(--color-surface-raised)]"
        )}>
          <Power className={cn(
            "h-5 w-5 transition-colors",
            enabled ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
          )} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-[family-name:var(--font-clash-display)] text-sm font-bold uppercase tracking-wider",
              enabled ? "text-[var(--color-gold)]" : "text-[var(--color-text)]"
            )}>
              Mode Autonome
            </span>
            {enabled && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            )}
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Le vaisseau op&egrave;re seul. Les actions sensibles passent par les gates.
          </p>
        </div>
      </div>

      <button
        onClick={toggle}
        className={cn(
          "relative h-7 w-12 rounded-full transition-colors",
          enabled ? "bg-[var(--color-gold)]" : "bg-[var(--color-surface-raised)]"
        )}
      >
        <motion.div
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
          animate={{ left: enabled ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

/* ─── Cron Tasks Panel ─────────────────────────────────── */
function CronTasksPanel() {
  const [tasks, setTasks] = useState(cronManager.getTasks());
  const [executing, setExecuting] = useState<string | null>(null);

  useEffect(() => {
    const unsub = cronManager.subscribe(() => {
      setTasks(cronManager.getTasks());
    });
    return unsub;
  }, []);

  const toggleTask = (taskId: string) => {
    const current = cronManager.isTaskEnabled(taskId);
    cronManager.setTaskEnabled(taskId, !current);
  };

  const executeNow = async (taskId: string) => {
    setExecuting(taskId);
    await cronManager.executeTask(taskId);
    setExecuting(null);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          T&acirc;ches Cron
        </h2>
        <span className="font-mono text-[10px] text-[var(--color-gold-muted)]">
          {cronManager.getActiveCount()}/{CRON_TASKS.length} actives
        </span>
      </div>

      <div className="divide-y divide-[var(--color-border-subtle)]">
        {tasks.map((task) => {
          const Icon = cronIcons[task.id] ?? Activity;
          const isRunning = executing === task.id;
          const lastRunDate = task.lastRun
            ? new Intl.DateTimeFormat("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
              }).format(new Date(task.lastRun))
            : null;

          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                !task.enabled && "opacity-50"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-raised)]">
                <Icon className="h-4 w-4 text-[var(--color-gold)]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--color-text)]">{task.name}</span>
                  <span className="rounded bg-[var(--color-surface-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--color-text-muted)]">
                    {task.schedule}
                  </span>
                </div>
                <p className="truncate text-[10px] text-[var(--color-text-muted)]">
                  {task.description}
                </p>
                {lastRunDate && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] text-[var(--color-text-muted)]">Dernier: {lastRunDate}</span>
                    {task.lastStatus === "success" && (
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                    )}
                    {task.lastStatus === "fail" && (
                      <XCircle className="h-2.5 w-2.5 text-red-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Execute now */}
                <button
                  onClick={() => executeNow(task.id)}
                  disabled={isRunning}
                  className={cn(
                    "flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition-colors",
                    "border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]",
                    "hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isRunning ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {isRunning ? "..." : "Exec"}
                </button>

                {/* Toggle */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    task.enabled ? "bg-[var(--color-gold)]" : "bg-[var(--color-surface-raised)]"
                  )}
                >
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                    animate={{ left: task.enabled ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Activity Feed ────────────────────────────────────── */
function ActivityFeed() {
  const [executions, setExecutions] = useState<CronExecution[]>([]);

  useEffect(() => {
    setExecutions(cronManager.getExecutions(20));
    const unsub = cronManager.subscribe(() => {
      setExecutions(cronManager.getExecutions(20));
    });
    return unsub;
  }, []);

  if (executions.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Activit&eacute; Cron
          </h2>
        </div>
        <div className="px-4 py-8 text-center text-xs text-[var(--color-text-muted)]">
          Aucune ex&eacute;cution. La forge est froide.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Activit&eacute; Cron
        </h2>
        <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
          {executions.length} derni&egrave;re(s)
        </span>
      </div>

      <div className="max-h-[320px] overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
        {executions.map((exec, i) => {
          const time = new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date(exec.timestamp));

          return (
            <div key={`${exec.taskId}-${i}`} className="flex items-center gap-3 px-4 py-2">
              {exec.status === "success" ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              ) : (
                <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
              )}
              <span className="font-mono text-[10px] text-[var(--color-text-muted)] shrink-0">{time}</span>
              <span className="text-xs font-medium text-[var(--color-text)] truncate">{exec.taskName}</span>
              <span className="flex-1 truncate text-[10px] text-[var(--color-text-muted)]">{exec.message}</span>
              <span className="font-mono text-[10px] text-[var(--color-text-muted)] shrink-0">{exec.durationMs}ms</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Budget Monitor ───────────────────────────────────── */
function BudgetMonitor() {
  const [context, setContext] = useState<UnifiedContext | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContext = useCallback(async () => {
    setLoading(true);
    try {
      const ctx = await buildUnifiedContext();
      setContext(ctx);
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContext();
  }, [loadContext]);

  const threshold = context?.budgetThreshold ?? 100;
  const estimated = context?.estimatedMonthly ?? 0;
  const isOverBudget = estimated > threshold;
  const pctUsed = threshold > 0 ? Math.min((estimated / threshold) * 100, 100) : 0;

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Budget API
        </h2>
        <button
          onClick={loadContext}
          disabled={loading}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </button>
      </div>

      {loading && !context ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--color-gold)]" />
        </div>
      ) : context ? (
        <div className="space-y-4 p-4">
          {/* Today cost */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">Co&ucirc;t aujourd&apos;hui</span>
            <span className="font-mono text-sm font-bold text-[var(--color-text)]">
              ${context.apiCostsToday.toFixed(4)}
            </span>
          </div>

          {/* Monthly estimate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--color-text-muted)]">Estimation mensuelle</span>
              <div className="flex items-center gap-1.5">
                {isOverBudget && <AlertTriangle className="h-3 w-3 text-red-400" />}
                <span className={cn(
                  "font-mono text-sm font-bold",
                  isOverBudget ? "text-red-400" : "text-[var(--color-text)]"
                )}>
                  ${estimated.toFixed(2)}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">/ ${threshold}</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  pctUsed > 90 ? "bg-red-400" : pctUsed > 70 ? "bg-amber-400" : "bg-[var(--color-gold)]"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${pctUsed}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Breakdown by model */}
          {Object.keys(context.costsByModel).length > 0 && (
            <div>
              <span className="text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Par mod&egrave;le
              </span>
              <div className="mt-1.5 space-y-1">
                {Object.entries(context.costsByModel)
                  .sort((a, b) => b[1] - a[1])
                  .map(([model, cost]) => (
                    <div key={model} className="flex items-center justify-between">
                      <span className="truncate text-[10px] text-[var(--color-text-muted)] max-w-[60%]">{model}</span>
                      <span className="font-mono text-[10px] text-[var(--color-text)]">${cost.toFixed(4)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quick context stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
            <div>
              <div className="font-mono text-sm font-bold text-[var(--color-text)]">{context.totalCalls}</div>
              <div className="text-[9px] text-[var(--color-text-muted)]">Appels IA</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[var(--color-text)]">{context.successRate}%</div>
              <div className="text-[9px] text-[var(--color-text-muted)]">Succ&egrave;s</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[var(--color-text)]">{context.avgLatency}ms</div>
              <div className="text-[9px] text-[var(--color-text-muted)]">Latence moy.</div>
            </div>
            <div>
              <div className={cn(
                "font-mono text-sm font-bold",
                context.systemHealth === "nominal" ? "text-emerald-400" :
                context.systemHealth === "degraded" ? "text-amber-400" : "text-red-400"
              )}>
                {context.systemHealth === "nominal" ? "NOM" : context.systemHealth === "degraded" ? "DEG" : "CRIT"}
              </div>
              <div className="text-[9px] text-[var(--color-text-muted)]">Syst&egrave;me</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">
          Donn&eacute;es indisponibles.
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function OrchestrateurPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [stats, setStats] = useState(orchestrator.getStats());
  const [, setTick] = useState(0);

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
              AUTOPILOT &middot; HUMAN-IN-THE-LOOP
            </span>
          </div>
        </div>

        <TemplatePicker onSelect={handleCreateFromTemplate} />
      </div>

      {/* ── Autonomous Mode ── */}
      <AutonomousToggle />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Zap}
          label="Workflows aujourd'hui"
          value={stats.workflowsToday}
        />
        <StatCard
          icon={Activity}
          label="Steps exécutés"
          value={stats.totalSteps}
        />
        <StatCard
          icon={Timer}
          label="Durée moy."
          value={stats.avgDurationMs > 0 ? formatDurationMs(stats.avgDurationMs) : "\u2014"}
        />
        <StatCard
          icon={TrendingUp}
          label="Taux de succès"
          value={`${stats.successRate}%`}
        />
      </div>

      {/* ── Two-column: Cron Tasks + Budget Monitor ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Cron Tasks */}
          <CronTasksPanel />

          {/* Active Workflows */}
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
                Aucun workflow actif. La forge attend l&apos;ordre.
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
        </div>

        {/* Right column: Budget + Activity */}
        <div className="space-y-6">
          <BudgetMonitor />
          <ActivityFeed />
        </div>
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
                <th className="py-1.5 pl-4 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">ID</th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Nom</th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Steps</th>
                <th className="py-1.5 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Dur&eacute;e</th>
                <th className="py-1.5 pr-4 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Termin&eacute;</th>
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
                    <td className="py-1.5 pl-4 pr-3 font-mono text-[10px] text-[var(--color-text-muted)]">{wf.id}</td>
                    <td className="py-1.5 pr-3 text-xs text-[var(--color-text)]">{wf.name}</td>
                    <td className="py-1.5 pr-3"><StatusBadge status={wf.status} /></td>
                    <td className="py-1.5 pr-3 font-mono text-[11px] text-[var(--color-text-secondary)]">{doneSteps}/{wf.steps.length}</td>
                    <td className="py-1.5 pr-3 font-mono text-[11px] text-[var(--color-text-muted)]">{duration}</td>
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
