"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Eye,
  FileText,
  BarChart3,
  UserPlus,
  RotateCcw,
  AlertTriangle,
  Check,
  Clock,
  Link2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Feedback Loop Page
   Suivi post-livraison des clients signes
   ═══════════════════════════════════════════════════════ */

/* ── Types ──────────────────────────────────────────── */
interface TimelineStep {
  key: string;
  label: string;
  dayOffset: number;
  icon: React.ElementType;
  completed: boolean;
  completedDate?: string;
  note?: string;
  hasFile?: boolean;
  nps?: number | null;
  proposalLink?: string;
  renewalStatus?: "renewed" | "pending" | "lost";
}

interface SignedClient {
  id: string;
  company: string;
  contact: string;
  deliveryDate: string; // ISO date
  option: string;
  mrr: number;
  nps: number | null;
  timeline: TimelineStep[];
}

interface FeedbackTimelineRow {
  id: string;
  prospect_id: string;
  step_key: string;
  label: string;
  day_offset: number;
  completed: boolean;
  completed_date: string | null;
  note: string | null;
  has_file: boolean;
  nps: number | null;
  proposal_link: string | null;
  renewal_status: string | null;
  delivery_date: string | null;
}

/* ── Helper: calculate target date ──────────────────── */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function isOverdue(deliveryDate: string, dayOffset: number, completed: boolean): boolean {
  if (completed) return false;
  const target = new Date(deliveryDate);
  target.setDate(target.getDate() + dayOffset);
  return new Date() > target;
}

/* ── Icon mapping for timeline steps ──────────────── */
const STEP_ICONS: Record<string, React.ElementType> = {
  j1: MessageSquare,
  j7: Eye,
  j14: FileText,
  j30: BarChart3,
  j60: UserPlus,
  j90: RotateCcw,
};

/* ── Default timeline template ─────────────────────── */
const DEFAULT_TIMELINE: Omit<TimelineStep, "completed" | "completedDate" | "note" | "hasFile" | "nps" | "proposalLink" | "renewalStatus">[] = [
  { key: "j1", label: "WhatsApp envoye", dayOffset: 1, icon: MessageSquare },
  { key: "j7", label: 'Check-in "combien de vues ?"', dayOffset: 7, icon: Eye },
  { key: "j14", label: "Mini-rapport envoye", dayOffset: 14, icon: FileText },
  { key: "j30", label: "Rapport mensuel + NPS", dayOffset: 30, icon: BarChart3 },
  { key: "j60", label: "Proposition d'expansion", dayOffset: 60, icon: UserPlus },
  { key: "j90", label: "Rapport trimestriel + renouvellement", dayOffset: 90, icon: RotateCcw },
];

/* ── Loading Skeleton ──────────────────────────────── */
function FeedbackSkeleton() {
  return (
    <div className="space-y-8">
      {/* KPI skeletons */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-[#1A1A2E] animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-[#1A1A2E] animate-pulse" />
            </div>
            <div className="h-8 w-20 rounded bg-[#1A1A2E] animate-pulse mb-2" />
            <div className="h-4 w-32 rounded bg-[#1A1A2E] animate-pulse" />
          </div>
        ))}
      </div>
      {/* Client list skeletons */}
      <div className="space-y-3">
        <div className="h-5 w-32 rounded bg-[#1A1A2E] animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] p-5">
            <div className="flex items-center gap-4">
              <div className="h-4 w-4 rounded bg-[#1A1A2E] animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-[#1A1A2E] animate-pulse" />
                <div className="h-3 w-64 rounded bg-[#1A1A2E] animate-pulse" />
              </div>
              <div className="h-2 w-24 rounded-full bg-[#1A1A2E] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── KPI calculation helpers ────────────────────────── */
function calculateKPIs(clients: SignedClient[]) {
  const npsValues = clients.filter((c) => c.nps !== null).map((c) => c.nps!);
  const avgNps = npsValues.length > 0 ? npsValues.reduce((a, b) => a + b, 0) / npsValues.length : 0;

  // Calculate real rates from timeline data
  const clientsWithTimeline = clients.filter((c) => c.timeline.length > 0);
  const renewedCount = clientsWithTimeline.filter((c) =>
    c.timeline.some((s) => s.renewalStatus === "renewed")
  ).length;
  const upsellCount = clientsWithTimeline.filter((c) =>
    c.timeline.some((s) => s.key === "j60" && s.completed)
  ).length;

  const total = clientsWithTimeline.length || 1;

  // Referral rate: clients who completed J+90 with NPS >= 8 are likely referrers
  const referralCount = clientsWithTimeline.filter((c) =>
    c.timeline.some((s) => s.key === "j90" && s.completed && (s.nps ?? 0) >= 8)
  ).length;

  // Churn rate: clients who have NOT renewed AND whose J+90 is completed
  const completedJ90 = clientsWithTimeline.filter((c) =>
    c.timeline.some((s) => s.key === "j90" && s.completed)
  );
  const churnedCount = completedJ90.filter((c) =>
    c.timeline.some((s) => s.renewalStatus === "lost")
  ).length;
  const churnBase = completedJ90.length || 1;

  return {
    avgNps: avgNps.toFixed(1),
    referralRate: ((referralCount / total) * 100).toFixed(1),
    upsellRate: ((upsellCount / total) * 100).toFixed(1),
    renewalRate: ((renewedCount / total) * 100).toFixed(1),
    churnRate: ((churnedCount / churnBase) * 100).toFixed(1),
  };
}

/* ── KPI Card ───────────────────────────────────────── */
function KpiCard({
  title,
  value,
  suffix,
  icon: Icon,
  trend,
  trendValue,
  delay = 0,
}: {
  title: string;
  value: string;
  suffix?: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  delay?: number;
}) {
  const trendConfig = {
    up: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    down: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
    neutral: { icon: Minus, color: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-surface-2)]" },
  };
  const TrendIcon = trendConfig[trend].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-5 transition-colors hover:border-[var(--color-gold-muted)]"
      style={{
        background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-gold)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.06]" />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Icon className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div className={cn("flex items-center gap-1 rounded-full px-2 py-1", trendConfig[trend].bg)}>
          <TrendIcon className={cn("h-3 w-3", trendConfig[trend].color)} />
          <span className={cn("text-[11px] font-medium", trendConfig[trend].color)}>{trendValue}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-gold)]">
          {value}
          {suffix && <span className="ml-1 text-base font-normal text-[var(--color-text-muted)]">{suffix}</span>}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{title}</p>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function FeedbackPage() {
  const [clients, setClients] = useState<SignedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [togglingStep, setTogglingStep] = useState<string | null>(null);

  /* ─── Fetch from Supabase ─── */
  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase
        .from("prospects")
        .select("*")
        .eq("phase", "signe"),
      supabase
        .from("feedback_timeline")
        .select("*")
        .order("delivery_date"),
    ]).then(([prospectsRes, timelineRes]) => {
      const prospects = prospectsRes.data || [];
      const timelineRows = (timelineRes.data || []) as FeedbackTimelineRow[];

      // Group timeline entries by prospect_id
      const timelineMap = new Map<string, FeedbackTimelineRow[]>();
      for (const row of timelineRows) {
        if (!timelineMap.has(row.prospect_id)) timelineMap.set(row.prospect_id, []);
        timelineMap.get(row.prospect_id)!.push(row);
      }

      const mappedClients: SignedClient[] = prospects.map((p: Record<string, unknown>) => {
        const prospectId = p.id as string;
        const prospectTimeline = timelineMap.get(prospectId) || [];

        // Build timeline: use real data if exists, else use default template
        let timeline: TimelineStep[];
        if (prospectTimeline.length > 0) {
          timeline = prospectTimeline.map((row) => ({
            key: row.step_key || row.id,
            label: row.label || "",
            dayOffset: row.day_offset || 0,
            icon: STEP_ICONS[row.step_key] || Clock,
            completed: Boolean(row.completed),
            completedDate: row.completed_date || undefined,
            note: row.note || undefined,
            hasFile: Boolean(row.has_file),
            nps: row.nps,
            proposalLink: row.proposal_link || undefined,
            renewalStatus: (row.renewal_status as "renewed" | "pending" | "lost") || undefined,
          }));
        } else {
          // Default empty timeline
          timeline = DEFAULT_TIMELINE.map((t) => ({
            ...t,
            completed: false,
            nps: null,
          }));
        }

        // Get NPS from timeline j30 step if available
        const j30Step = timeline.find((s) => s.key === "j30");
        const nps = j30Step?.nps ?? null;

        return {
          id: prospectId,
          company: (p.name as string) || "Sans nom",
          contact: (p.key_contact as string) || "",
          deliveryDate: ((p.delivery_date as string) || (p.signed_date as string) || new Date().toISOString()).split("T")[0],
          option: (p.offer as string) || (p.option as string) || "Essentiel",
          mrr: Number(p.mrr) || Number(p.estimated_basket) || 0,
          nps,
          timeline,
        };
      });

      setClients(mappedClients);
      if (mappedClients.length > 0) setExpandedClient(mappedClients[0].id);
      setLoading(false);
    });
  }, []);

  /* ─── Toggle a timeline step as done/undone in Supabase ─── */
  const toggleStep = async (clientId: string, stepKey: string) => {
    const toggleId = `${clientId}-${stepKey}`;
    setTogglingStep(toggleId);
    const supabase = createClient();

    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const step = client.timeline.find((s) => s.key === stepKey);
    if (!step) return;

    const newCompleted = !step.completed;
    const now = new Date().toISOString();

    // Try to update existing row first
    const { data: existing } = await supabase
      .from("feedback_timeline")
      .select("id")
      .eq("prospect_id", clientId)
      .eq("step_key", stepKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("feedback_timeline")
        .update({
          completed: newCompleted,
          completed_date: newCompleted ? now.split("T")[0] : null,
        })
        .eq("id", existing.id);
    } else {
      // Insert a new row for this step
      const template = DEFAULT_TIMELINE.find((t) => t.key === stepKey);
      await supabase.from("feedback_timeline").insert({
        prospect_id: clientId,
        step_key: stepKey,
        label: template?.label || step.label,
        day_offset: template?.dayOffset || step.dayOffset,
        completed: newCompleted,
        completed_date: newCompleted ? now.split("T")[0] : null,
        delivery_date: client.deliveryDate,
      });
    }

    // Update local state
    setClients((prev) =>
      prev.map((c) =>
        c.id !== clientId
          ? c
          : {
              ...c,
              timeline: c.timeline.map((s) =>
                s.key !== stepKey
                  ? s
                  : { ...s, completed: newCompleted, completedDate: newCompleted ? now.split("T")[0] : undefined }
              ),
            }
      )
    );

    // Fire notification on step completion
    if (newCompleted) {
      await createNotification(
        "system",
        "Etape feedback validee",
        `${client.company} — ${step.label}`,
        "/feedback",
      );
    }

    setTogglingStep(null);
  };

  const kpis = useMemo(() => calculateKPIs(clients), [clients]);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Feedback"
          titleAccent="Loop"
          subtitle="Apres la signature, le travail commence."
        />
        <FeedbackSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <PageHeader
        title="Feedback"
        titleAccent="Loop"
        subtitle="Apres la signature, le travail commence."
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard
          title="NPS Moyen"
          value={kpis.avgNps}
          suffix="/10"
          icon={Star}
          trend={Number(kpis.avgNps) >= 8 ? "up" : Number(kpis.avgNps) >= 6 ? "neutral" : "down"}
          trendValue={Number(kpis.avgNps) > 0 ? `${kpis.avgNps}/10` : "N/A"}
          delay={0}
        />
        <KpiCard
          title="Taux de Referral"
          value={kpis.referralRate}
          suffix="%"
          icon={UserPlus}
          trend="neutral"
          trendValue="--"
          delay={0.05}
        />
        <KpiCard
          title="Taux d'Upsell"
          value={kpis.upsellRate}
          suffix="%"
          icon={TrendingUp}
          trend={Number(kpis.upsellRate) > 50 ? "up" : "neutral"}
          trendValue={`${kpis.upsellRate}%`}
          delay={0.1}
        />
        <KpiCard
          title="Taux de Renouvellement"
          value={kpis.renewalRate}
          suffix="%"
          icon={RotateCcw}
          trend={Number(kpis.renewalRate) > 80 ? "up" : "neutral"}
          trendValue={`${kpis.renewalRate}%`}
          delay={0.15}
        />
        <KpiCard
          title="Taux de Churn"
          value={kpis.churnRate}
          suffix="%"
          icon={AlertTriangle}
          trend="neutral"
          trendValue="0%"
          delay={0.2}
        />
      </div>

      {/* ── Client List ── */}
      <div className="space-y-3">
        <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
          Clients signes
        </h2>

        {clients.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-16">
            <RotateCcw className="mb-3 h-10 w-10 text-[var(--color-text-muted)]" />
            <p className="text-sm text-[var(--color-text-muted)]">
              Pas encore de client livre.
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              La patience est l&apos;arme.
            </p>
          </div>
        )}

        {clients.map((client, clientIdx) => {
          const isExpanded = expandedClient === client.id;
          const completedSteps = client.timeline.filter((s) => s.completed).length;
          const totalSteps = client.timeline.length;
          const overdueCount = client.timeline.filter((s) =>
            isOverdue(client.deliveryDate, s.dayOffset, s.completed)
          ).length;

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: clientIdx * 0.08 }}
              className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
            >
              {/* ── Client Row ── */}
              <button
                onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-surface-2)]"
              >
                {/* Expand icon */}
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                </motion.div>

                {/* Company info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
                      {client.company}
                    </h3>
                    <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                      {client.option}
                    </span>
                    {overdueCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        {overdueCount} en retard
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {client.contact} &bull; Livre le {formatDate(client.deliveryDate)} &bull;{" "}
                    <span className="text-[var(--color-gold)]">{client.mrr.toLocaleString("fr-FR")} EUR/mois</span>
                  </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  {client.nps !== null && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[var(--color-text-muted)]">NPS</span>
                      <span className={cn(
                        "font-bold",
                        client.nps >= 9 ? "text-emerald-400" : client.nps >= 7 ? "text-[var(--color-gold)]" : "text-red-400"
                      )}>
                        {client.nps}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
                        transition={{ duration: 0.6, delay: clientIdx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]"
                      />
                    </div>
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      {completedSteps}/{totalSteps}
                    </span>
                  </div>
                </div>
              </button>

              {/* ── Expanded Timeline ── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[var(--color-border-subtle)] px-5 py-5">
                      <div className="relative ml-8 space-y-0">
                        {/* Vertical line */}
                        <div className="absolute left-[11px] top-0 h-full w-px bg-[var(--color-border-subtle)]" />

                        {client.timeline.map((step, stepIdx) => {
                          const StepIcon = step.icon;
                          const overdue = isOverdue(client.deliveryDate, step.dayOffset, step.completed);
                          const targetDate = addDays(client.deliveryDate, step.dayOffset);

                          return (
                            <motion.div
                              key={step.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIdx * 0.06 }}
                              className="relative flex gap-4 pb-6 last:pb-0"
                            >
                              {/* Dot — clickable toggle */}
                              <button
                                onClick={() => toggleStep(client.id, step.key)}
                                disabled={togglingStep === `${client.id}-${step.key}`}
                                title={step.completed ? "Marquer comme non fait" : "Marquer comme fait"}
                                className={cn(
                                  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-[var(--color-gold)]/40 disabled:opacity-50",
                                  step.completed
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : overdue
                                      ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/40"
                                      : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
                                )}
                              >
                                {togglingStep === `${client.id}-${step.key}` ? (
                                  <Clock className="h-3 w-3 animate-spin" />
                                ) : step.completed ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : overdue ? (
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                              </button>

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <StepIcon className={cn(
                                    "h-4 w-4 shrink-0",
                                    step.completed ? "text-emerald-400" : overdue ? "text-red-400" : "text-[var(--color-text-muted)]"
                                  )} />
                                  <span className={cn(
                                    "text-sm font-medium",
                                    step.completed ? "text-[var(--color-text)] line-through decoration-emerald-500/40" : overdue ? "text-red-400" : "text-[var(--color-text-muted)]"
                                  )}>
                                    J+{step.dayOffset}: {step.label}
                                  </span>
                                  {overdue && (
                                    <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-400">
                                      En retard
                                    </span>
                                  )}
                                </div>

                                <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                                  <span>Cible: {formatDate(targetDate)}</span>
                                  {step.completedDate && (
                                    <span className="text-emerald-400">Fait le {formatDate(step.completedDate)}</span>
                                  )}
                                </div>

                                {/* Extra info based on step type */}
                                {step.note && (
                                  <div className="mt-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                                    {step.note}
                                  </div>
                                )}

                                {step.hasFile && step.completed && (
                                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-gold)]">
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>Rapport joint</span>
                                  </div>
                                )}

                                {step.nps !== undefined && step.nps !== null && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-[var(--color-text-muted)]">NPS:</span>
                                    <div className="flex items-center gap-0.5">
                                      {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={cn(
                                            "h-3 w-3 rounded-sm text-[8px] flex items-center justify-center font-bold",
                                            i < step.nps!
                                              ? step.nps! >= 9
                                                ? "bg-emerald-500/30 text-emerald-400"
                                                : step.nps! >= 7
                                                  ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                                                  : "bg-red-500/20 text-red-400"
                                              : "bg-[var(--color-surface-2)] text-transparent"
                                          )}
                                        >
                                          {i + 1}
                                        </div>
                                      ))}
                                    </div>
                                    <span className={cn(
                                      "text-sm font-bold",
                                      step.nps >= 9 ? "text-emerald-400" : step.nps >= 7 ? "text-[var(--color-gold)]" : "text-red-400"
                                    )}>
                                      {step.nps}/10
                                    </span>
                                  </div>
                                )}

                                {step.nps === null && step.key === "j30" && !step.completed && (
                                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] px-3 py-2">
                                    <Star className="h-4 w-4 text-[var(--color-gold)]" />
                                    <span className="text-xs text-[var(--color-gold)]">NPS en attente de collecte</span>
                                  </div>
                                )}

                                {step.proposalLink && step.completed && (
                                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-gold)]">
                                    <Link2 className="h-3.5 w-3.5" />
                                    <span>Proposition liee</span>
                                  </div>
                                )}

                                {step.renewalStatus && (
                                  <div className={cn(
                                    "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                                    step.renewalStatus === "renewed"
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : step.renewalStatus === "pending"
                                        ? "bg-amber-500/15 text-amber-400"
                                        : "bg-red-500/15 text-red-400"
                                  )}>
                                    <RotateCcw className="h-3 w-3" />
                                    {step.renewalStatus === "renewed" ? "Renouvele" : step.renewalStatus === "pending" ? "En attente" : "Perdu"}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
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
  );
}
