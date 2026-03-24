"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Landmark,
  Video,
  Bot,
  Waves,
  ArrowUpRight,
  Flame,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════════
   Shared Widget Shell
   ═══════════════════════════════════════════════════════════ */

interface WidgetShellProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  href: string;
  delay?: number;
  children: React.ReactNode;
  loading?: boolean;
}

function WidgetShell({
  title,
  icon: Icon,
  iconColor,
  href,
  delay = 0,
  children,
  loading,
}: WidgetShellProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-4 transition-all duration-300 hover:border-[var(--color-gold-muted)]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
        style={{ background: iconColor }}
      />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: `${iconColor}15` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            {title}
          </span>
        </div>
        <ArrowUpRight className="h-3 w-3 text-[var(--color-text-muted)]/40 transition-colors group-hover:text-[var(--color-gold)]" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-muted)]/40" />
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </motion.a>
  );
}

/* ─── Stat Row helper ─────────────────────────────────── */
function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-[var(--color-text-muted)]">
        {label}
      </span>
      <span
        className="text-xs font-semibold"
        style={{ color: color || "var(--color-text)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. Revenue Projection Widget
   ═══════════════════════════════════════════════════════════ */

export function RevenueProjectionWidget({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<{
    revenueMonth: number;
    paidCount: number;
    pendingCount: number;
    pendingAmount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthISO = monthStart.toISOString().slice(0, 10);

      const [paidRes, pendingRes] = await Promise.all([
        supabase
          .from("invoices")
          .select("amount_ttc")
          .eq("status", "paid")
          .gte("payment_date", monthISO),
        supabase
          .from("invoices")
          .select("amount_ttc, status")
          .in("status", ["draft", "sent", "overdue"]),
      ]);

      const paid = paidRes.data ?? [];
      const pending = pendingRes.data ?? [];
      setData({
        revenueMonth: paid.reduce(
          (s, i) => s + (i.amount_ttc ?? 0),
          0,
        ),
        paidCount: paid.length,
        pendingCount: pending.length,
        pendingAmount: pending.reduce(
          (s, i) => s + (i.amount_ttc ?? 0),
          0,
        ),
      });
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    n >= 1000
      ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K\u20AC`
      : `${Math.round(n)}\u20AC`;

  return (
    <WidgetShell
      title="Revenue"
      icon={Banknote}
      iconColor="#10B981"
      href="/finance"
      delay={delay}
      loading={loading}
    >
      {data && (
        <div className="space-y-2">
          <div className="text-xl font-bold text-[var(--color-text)]">
            {fmt(data.revenueMonth)}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            ce mois | {data.paidCount} factures payees
          </div>
          <div className="mt-1.5 h-px w-full bg-[var(--color-border-subtle)]" />
          <StatRow
            label="En attente"
            value={`${data.pendingCount} — ${fmt(data.pendingAmount)}`}
            color={data.pendingCount > 0 ? "#F59E0B" : undefined}
          />
        </div>
      )}
    </WidgetShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. Pipeline Health Widget
   ═══════════════════════════════════════════════════════════ */

export function PipelineHealthWidget({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<{
    hot: number;
    stale: number;
    total: number;
    velocity: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const [allRes, hotRes, staleRes, recentSignedRes] = await Promise.all([
        supabase
          .from("prospects")
          .select("id", { count: "exact", head: true })
          .not("phase", "in", '("perdu","inactif")'),
        supabase
          .from("prospects")
          .select("id", { count: "exact", head: true })
          .eq("ai_score", "fire"),
        supabase
          .from("prospects")
          .select("id", { count: "exact", head: true })
          .lt("last_contact", sevenDaysAgo)
          .not("phase", "in", '("signe","perdu","inactif")'),
        supabase
          .from("prospects")
          .select("id", { count: "exact", head: true })
          .eq("phase", "signe")
          .gte("updated_at", sevenDaysAgo),
      ]);

      setData({
        hot: hotRes.count ?? 0,
        stale: staleRes.count ?? 0,
        total: allRes.count ?? 0,
        velocity: recentSignedRes.count ?? 0,
      });
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, []);

  return (
    <WidgetShell
      title="Pipeline"
      icon={Flame}
      iconColor="#F59E0B"
      href="/pipeline"
      delay={delay}
      loading={loading}
    >
      {data && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[var(--color-text)]">
              {data.hot}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              brulants
            </span>
          </div>
          <StatRow label="Total actifs" value={data.total} />
          <StatRow
            label="Dormants >7j"
            value={data.stale}
            color={data.stale > 3 ? "var(--color-red)" : undefined}
          />
          <StatRow
            label="Signes /semaine"
            value={data.velocity}
            color="#10B981"
          />
        </div>
      )}
    </WidgetShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. Marches Publics Widget
   ═══════════════════════════════════════════════════════════ */

export function MarchesWidget({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<{
    openCount: number;
    goCount: number;
    nextDeadline: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);

      const [openRes, goRes, deadlineRes] = await Promise.all([
        supabase
          .from("marches_publics")
          .select("id", { count: "exact", head: true })
          .gte("date_limite", today),
        supabase
          .from("marches_publics")
          .select("id", { count: "exact", head: true })
          .eq("go_nogo", "GO"),
        supabase
          .from("marches_publics")
          .select("date_limite")
          .gte("date_limite", today)
          .order("date_limite", { ascending: true })
          .limit(1),
      ]);

      setData({
        openCount: openRes.count ?? 0,
        goCount: goRes.count ?? 0,
        nextDeadline: deadlineRes.data?.[0]?.date_limite ?? null,
      });
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, []);

  return (
    <WidgetShell
      title="Marches"
      icon={Landmark}
      iconColor="#F59E0B"
      href="/marches"
      delay={delay}
      loading={loading}
    >
      {data && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[var(--color-text)]">
              {data.openCount}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              ouverts
            </span>
          </div>
          <StatRow label="GO" value={data.goCount} color="#10B981" />
          {data.nextDeadline && (
            <StatRow
              label="Prochaine deadline"
              value={new Intl.DateTimeFormat("fr-FR", {
                day: "numeric",
                month: "short",
              }).format(new Date(data.nextDeadline))}
              color="#F59E0B"
            />
          )}
        </div>
      )}
    </WidgetShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. Production Widget
   ═══════════════════════════════════════════════════════════ */

export function ProductionWidget({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<{
    activeJobs: number;
    completedToday: number;
    queueSize: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayISO = todayStart.toISOString();

      const [videoActive, imageActive, videoToday, musicQueue] =
        await Promise.all([
          supabase
            .from("videos")
            .select("id", { count: "exact", head: true })
            .in("status", ["processing", "rendering", "pending"]),
          supabase
            .from("image_jobs")
            .select("id", { count: "exact", head: true })
            .in("status", ["processing", "pending"]),
          supabase
            .from("videos")
            .select("id", { count: "exact", head: true })
            .eq("status", "completed")
            .gte("updated_at", todayISO),
          supabase
            .from("music_jobs")
            .select("id", { count: "exact", head: true })
            .in("status", ["pending", "processing"]),
        ]);

      setData({
        activeJobs: (videoActive.count ?? 0) + (imageActive.count ?? 0),
        completedToday: videoToday.count ?? 0,
        queueSize: musicQueue.count ?? 0,
      });
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, []);

  return (
    <WidgetShell
      title="Production"
      icon={Video}
      iconColor="#A855F7"
      href="/production"
      delay={delay}
      loading={loading}
    >
      {data && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[var(--color-text)]">
              {data.activeJobs}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              jobs actifs
            </span>
          </div>
          <StatRow
            label="Termines aujourd'hui"
            value={data.completedToday}
            color="#10B981"
          />
          <StatRow label="Queue musique" value={data.queueSize} />
        </div>
      )}
    </WidgetShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. Agent Health Widget
   ═══════════════════════════════════════════════════════════ */

export function AgentHealthWidget({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<{
    totalCalls: number;
    costToday: number;
    avgLatency: number;
    successRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: logs } = await supabase
        .from("agent_logs")
        .select("cost_usd, duration_ms, success")
        .gte("created_at", todayStart.toISOString());

      const items = logs ?? [];
      const totalCalls = items.length;
      const costToday = items.reduce(
        (s, l) => s + (l.cost_usd ?? 0),
        0,
      );
      const latencies = items
        .filter((l) => l.duration_ms)
        .map((l) => l.duration_ms ?? 0);
      const avgLatency =
        latencies.length > 0
          ? latencies.reduce((a, b) => a + b, 0) / latencies.length
          : 0;
      const successCount = items.filter((l) => l.success).length;
      const successRate =
        totalCalls > 0 ? (successCount / totalCalls) * 100 : 100;

      setData({
        totalCalls,
        costToday: Math.round(costToday * 100) / 100,
        avgLatency: Math.round(avgLatency),
        successRate: Math.round(successRate),
      });
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, []);

  return (
    <WidgetShell
      title="Agents IA"
      icon={Bot}
      iconColor="#8B5CF6"
      href="/admin/traces"
      delay={delay}
      loading={loading}
    >
      {data && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[var(--color-text)]">
              {data.totalCalls}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              appels aujourd'hui
            </span>
          </div>
          <StatRow label="Cout" value={`$${data.costToday.toFixed(2)}`} />
          <StatRow label="Latence moy." value={`${data.avgLatency}ms`} />
          <StatRow
            label="Succes"
            value={`${data.successRate}%`}
            color={
              data.successRate >= 95
                ? "#10B981"
                : data.successRate >= 80
                  ? "#F59E0B"
                  : "var(--color-red)"
            }
          />
        </div>
      )}
    </WidgetShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. Gulf Stream Widget
   ═══════════════════════════════════════════════════════════ */

export function GulfStreamWidget({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<{
    openPositions: number;
    totalPnL: number;
    bestPerformer: string | null;
    bestPnL: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();

      const { data: positions } = await supabase
        .from("gulf_positions")
        .select("title, pnl, status")
        .eq("status", "open");

      const items = positions ?? [];
      const totalPnL = items.reduce((s, p) => s + (p.pnl ?? 0), 0);
      const best = items.sort(
        (a, b) => (b.pnl ?? 0) - (a.pnl ?? 0),
      )[0];

      setData({
        openPositions: items.length,
        totalPnL: Math.round(totalPnL * 100) / 100,
        bestPerformer: best?.title ?? null,
        bestPnL: best?.pnl ?? 0,
      });
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, []);

  const pnlColor =
    (data?.totalPnL ?? 0) >= 0 ? "#10B981" : "var(--color-red)";

  return (
    <WidgetShell
      title="Gulf Stream"
      icon={Waves}
      iconColor="#06B6D4"
      href="/gulf-stream"
      delay={delay}
      loading={loading}
    >
      {data && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold" style={{ color: pnlColor }}>
              {data.totalPnL >= 0 ? "+" : ""}
              {data.totalPnL.toFixed(2)}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              PnL
            </span>
          </div>
          <StatRow label="Positions" value={data.openPositions} />
          {data.bestPerformer && (
            <StatRow
              label="Top"
              value={`${data.bestPerformer.slice(0, 20)} (+${data.bestPnL.toFixed(1)})`}
              color="#10B981"
            />
          )}
        </div>
      )}
    </WidgetShell>
  );
}
