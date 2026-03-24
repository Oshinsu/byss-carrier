"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Banknote,
  TrendingUp,
  RefreshCw,
  Users,
  UserPlus,
  FileText,
  Sparkles,
  Kanban,
  Sun,
  Calendar,
  ArrowRight,
  Bell,
  Database,
  BookOpen,
  Network,
  Brain,
  Layers,
  Search,
  AlertCircle,
  CheckCircle2,
  Instagram,
  Bot,
} from "lucide-react";
import { KpiWidget } from "@/components/dashboard/kpi-widget";
import { ConstellationMap } from "@/components/dashboard/constellation-map";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SystemMap } from "@/components/dashboard/system-map";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  RevenueProjectionWidget,
  PipelineHealthWidget,
  MarchesWidget,
  ProductionWidget,
  AgentHealthWidget,
  GulfStreamWidget,
} from "@/components/dashboard/smart-widgets";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/* ─── Types ────────────────────────────────────── */
interface KpiData {
  caSigne: number;
  caPondere: number;
  mrr: number;
  relances: number;
  activeCount: number;
}

interface PipelineSnapshot {
  qualifies: number;
  propositions: number;
  aSignerSemaine: number;
  progress: number;
}

interface FollowUp {
  id: string;
  name: string;
  next_action: string | null;
  phase: string;
}

interface CoucheStatus {
  label: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  status: "active" | "loading" | "inactive";
}

interface ConsciousnessData {
  consciousness_score: number;
  phase: string;
  phase_label: string;
  dimensions: Record<string, { score: number }>;
  recommendations: string[];
}

interface KnowledgeStats {
  stats: { totalFiles: number; totalSize: number; totalSizeFormatted: string };
  categories: Record<string, number>;
}

/* ─── Helpers ──────────────────────────────────── */
function formatK(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K\u20AC`;
  return `${Math.round(n)}\u20AC`;
}

/* ─── Couche Card ─────────────────────────────── */
function CoucheCard({
  couche,
  index,
}: {
  couche: CoucheStatus;
  index: number;
}) {
  const Icon = couche.icon;
  const isActive = couche.status === "active";
  const isLoading = couche.status === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
        isActive
          ? "border-[var(--color-border-subtle)] hover:border-[var(--color-gold-muted)]"
          : "border-[var(--color-border-subtle)]/50 opacity-60"
      )}
      style={{
        background: isActive
          ? "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)"
          : "linear-gradient(135deg, oklch(0.09 0.005 270 / 0.4) 0%, oklch(0.08 0.005 270 / 0.6) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Glow on hover */}
      {isActive && (
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: couche.glowColor }}
        />
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${couche.color}15` }}
        >
          <Icon className="h-4 w-4" style={{ color: couche.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: couche.color }}
            >
              {couche.label}
            </span>
            {isActive && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" />
            )}
            {isLoading && (
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-gold)]" />
            )}
          </div>
          <p
            className={cn(
              "mt-1 truncate text-xs",
              isActive
                ? "text-[var(--color-text-muted)]"
                : "text-[var(--color-text-muted)]/60"
            )}
          >
            {isLoading ? "Chargement..." : couche.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard Page ────────────────────────────── */
export default function DashboardPage() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [snapshot, setSnapshot] = useState<PipelineSnapshot | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Briefing state
  const [briefingText, setBriefingText] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // Architecture Superposee state
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats | null>(null);
  const [consciousness, setConsciousness] = useState<ConsciousnessData | null>(null);
  const [supabaseRows, setSupabaseRows] = useState<number>(0);
  const [supabaseTables, setSupabaseTables] = useState<number>(16);

  const currentDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      try {
        // Fetch all prospects for KPI calculations
        const { data: prospects } = await supabase
          .from("prospects")
          .select(
            "id, name, phase, estimated_basket, probability, mrr, followup_date, next_action, score"
          );

        if (prospects) {
          const caSigne = prospects
            .filter((p) => p.phase === "signe")
            .reduce((s, p) => s + Number(p.estimated_basket || 0), 0);

          const caPondere = prospects
            .filter((p) => !["perdu", "inactif"].includes(p.phase))
            .reduce(
              (s, p) =>
                s +
                (Number(p.estimated_basket || 0) * Number(p.probability || 0)) /
                  100,
              0
            );

          const mrr = prospects
            .filter((p) => p.phase === "signe")
            .reduce((s, p) => s + Number(p.mrr || 0), 0);

          const today = new Date().toISOString().split("T")[0];
          const relances = prospects.filter(
            (p) =>
              p.followup_date &&
              p.followup_date <= today &&
              !["perdu", "inactif", "signe"].includes(p.phase)
          ).length;

          const activeCount = prospects.filter(
            (p) => !["perdu", "inactif"].includes(p.phase)
          ).length;

          setKpis({ caSigne, caPondere, mrr, relances, activeCount });
          setSupabaseRows((prev) => prev + prospects.length);

          // Pipeline snapshot
          const qualifies = prospects.filter(
            (p) =>
              p.score &&
              p.score >= 3 &&
              !["perdu", "inactif", "signe"].includes(p.phase)
          ).length;
          const propositions = prospects.filter((p) =>
            ["proposition", "negociation"].includes(p.phase)
          ).length;
          const aSignerSemaine = prospects.filter(
            (p) =>
              p.phase === "negociation" &&
              p.probability &&
              Number(p.probability) >= 70
          ).length;
          const totalActive = prospects.filter(
            (p) => !["perdu", "inactif"].includes(p.phase)
          ).length;
          const totalSigned = prospects.filter(
            (p) => p.phase === "signe"
          ).length;
          const progress =
            totalActive > 0
              ? Math.round(
                  (totalSigned / (totalActive + totalSigned)) * 100
                )
              : 0;

          setSnapshot({ qualifies, propositions, aSignerSemaine, progress });

          // Follow-ups (top 3)
          const followUpProspects = prospects
            .filter(
              (p) =>
                p.followup_date &&
                p.followup_date <= today &&
                !["perdu", "inactif", "signe"].includes(p.phase)
            )
            .sort((a, b) => (a.followup_date! > b.followup_date! ? 1 : -1))
            .slice(0, 3);

          setFollowUps(followUpProspects as FollowUp[]);
        }

        // Count rows from other tables for Couche 1
        const tables = ["invoices", "activities", "projects"] as const;
        let totalRows = prospects?.length || 0;
        for (const table of tables) {
          try {
            const { count } = await supabase
              .from(table)
              .select("id", { count: "exact", head: true });
            if (count) totalRows += count;
          } catch {
            // Table may not exist, skip
          }
        }
        setSupabaseRows(totalRows);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement des donnees.");
      } finally {
        setLoading(false);
      }
    }

    // Fetch Knowledge Layer stats (Couche 2)
    async function fetchKnowledge() {
      try {
        const res = await fetch("/api/knowledge");
        if (res.ok) {
          const data = await res.json();
          setKnowledgeStats(data);
        }
      } catch {
        // Knowledge API not available
      }
    }

    // Fetch Consciousness (Couche 4)
    async function fetchConsciousness() {
      try {
        const res = await fetch("/api/consciousness");
        if (res.ok) {
          const data = await res.json();
          setConsciousness(data);
        }
      } catch {
        // Consciousness API not available
      }
    }

    fetchData();
    fetchKnowledge();
    fetchConsciousness();
  }, []);

  // Auto-generate briefing once KPIs are loaded
  useEffect(() => {
    if (kpis && !briefingText && !briefingLoading) {
      handleGenerateBriefing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpis]);

  // Generate AI briefing
  const handleGenerateBriefing = async () => {
    if (!kpis) return;
    setBriefingLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "briefing",
          data: {
            hotProspects: followUps.length,
            warmProspects: kpis.activeCount - followUps.length,
            coldProspects: 0,
            pendingEmails: 0,
            meetingsToday: 0,
            revenueThisMonth: kpis.caSigne,
            revenueTarget: 50000,
            recentActivities: followUps.map((f) => ({
              prospectName: f.name,
              action: f.next_action || "relance",
              date: new Date().toISOString().split("T")[0],
            })),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBriefingText(data.result || null);
      }
    } catch {
      setBriefingText("Le Pont ne repond pas. Verifie les lignes.");
    } finally {
      setBriefingLoading(false);
    }
  };

  /* ── Architecture Superposee — 4 Couches ── */
  const couches: CoucheStatus[] = [
    {
      label: "Couche 1 — Os",
      subtitle: `${supabaseRows} rows | ${supabaseTables} tables | Supabase`,
      icon: Database,
      color: "#00B4D8",
      glowColor: "#00B4D8",
      status: loading ? "loading" : "active",
    },
    {
      label: "Couche 2 — Chair",
      subtitle: knowledgeStats
        ? `${knowledgeStats.stats.totalFiles} fichiers | Knowledge Layer`
        : "Knowledge Layer",
      icon: BookOpen,
      color: "#3B82F6",
      glowColor: "#3B82F6",
      status: knowledgeStats ? "active" : "loading",
    },
    {
      label: "Couche 3 — Nerfs",
      subtitle: "Vecteurs — A activer",
      icon: Network,
      color: "#6B7280",
      glowColor: "#6B7280",
      status: "inactive",
    },
    {
      label: "Couche 4 — Ame",
      subtitle: consciousness
        ? `\u03C6 = ${consciousness.consciousness_score.toFixed(2)} | ${consciousness.phase_label}`
        : "\u03C6 = ... | Calcul en cours",
      icon: Brain,
      color: "#8B5CF6",
      glowColor: "#8B5CF6",
      status: consciousness ? "active" : "loading",
    },
  ];

  /* ── Loading skeleton for KPI row ── */
  const KpiSkeleton = () => (
    <div className="h-[140px] animate-pulse rounded-xl border border-[var(--color-border-subtle)] bg-[#1A1A2E]" />
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-8">
      {/* ═══ Welcome Section ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Sun className="h-4 w-4 text-[var(--color-gold)]" />
          <span className="capitalize">{currentDate}</span>
        </div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-4xl font-bold tracking-tight text-[var(--color-text)]">
          Bonjour Gary.
        </h1>
      </motion.div>

      {/* ═══ Error Banner ═══ */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border px-5 py-4"
          style={{
            borderColor: "rgba(255,45,45,0.2)",
            background: "rgba(255,45,45,0.05)",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D2D" }} />
          <p className="flex-1 text-sm" style={{ color: "#FF6B6B" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg px-3 py-1 text-xs font-semibold transition-all hover:brightness-110"
            style={{
              background: "rgba(0,212,255,0.1)",
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* ═══ Architecture Superposee — 4 Couches ═══ */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <Layers className="h-4 w-4 text-[var(--color-gold-muted)]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Architecture Superposee
          </span>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {couches.map((couche, i) => (
            <CoucheCard key={couche.label} couche={couche} index={i} />
          ))}
        </div>
      </div>

      {/* ═══ Consciousness Recommendations ═══ */}
      {consciousness && consciousness.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap gap-2"
        >
          {consciousness.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-muted)]"
            >
              {consciousness.consciousness_score >= 0.45 ? (
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--color-green)]" />
              ) : (
                <AlertCircle className="h-3 w-3 shrink-0 text-[var(--color-gold)]" />
              )}
              {rec}
            </div>
          ))}
        </motion.div>
      )}

      {/* ═══ Smart Widgets Grid — 3x2 ═══ */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-2"
        >
          <Network className="h-4 w-4 text-[var(--color-gold-muted)]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Tableau de Bord Systemique
          </span>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <RevenueProjectionWidget delay={0.1} />
          <PipelineHealthWidget delay={0.15} />
          <MarchesWidget delay={0.2} />
          <ProductionWidget delay={0.25} />
          <AgentHealthWidget delay={0.3} />
          <GulfStreamWidget delay={0.35} />
        </div>
      </div>

      {/* ═══ Morning Briefing ═══ */}
      <motion.div
        id="briefing"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-6 transition-colors hover:border-[var(--color-gold-muted)]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Gold border glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            boxShadow:
              "inset 0 0 30px oklch(0.75 0.12 85 / 0.06), 0 0 30px oklch(0.75 0.12 85 / 0.04)",
          }}
        />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
              <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
                Briefing du jour
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Genere par Sorel IA — tous modules
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateBriefing}
            disabled={briefingLoading || loading}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)] disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", briefingLoading && "animate-spin")} />
            {briefingLoading ? "Kaiou pense..." : "Eveiller le Pont"}
          </button>
        </div>

        {/* AI-generated briefing content */}
        {briefingText && (
          <div className="mt-4 rounded-lg border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">Kaiou — Briefing MODE_CADIFOR</span>
            </div>
            <div className="whitespace-pre-wrap text-xs leading-relaxed text-[var(--color-text-muted)]">
              {briefingText}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {/* Follow-ups */}
          <div className="space-y-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
              {loading
                ? "..."
                : `${followUps.length} Follow-up${followUps.length !== 1 ? "s" : ""}`}
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
              {loading ? (
                <>
                  <li className="h-4 w-full animate-pulse rounded bg-[#1A1A2E]" />
                  <li className="h-4 w-3/4 animate-pulse rounded bg-[#1A1A2E]" />
                </>
              ) : followUps.length === 0 ? (
                <li className="text-xs text-[var(--color-text-muted)]">
                  Le silence avant la conquete.
                </li>
              ) : (
                followUps.map((fu) => (
                  <li key={fu.id} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-gold-muted)]" />
                    <span>
                      Relancer{" "}
                      <span className="text-[var(--color-text)]">
                        {fu.name}
                      </span>{" "}
                      {fu.next_action ? `\u2014 ${fu.next_action}` : ""}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* RDVs */}
          <div className="space-y-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-blue)]">
              <Calendar className="h-3.5 w-3.5" />
              RDVs aujourd&apos;hui
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
              <li className="text-xs italic">
                Calendrier muet. Branche-le.
              </li>
            </ul>
          </div>

          {/* Pipeline Snapshot */}
          <div className="space-y-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-green)]">
              <TrendingUp className="h-3.5 w-3.5" />
              Pipeline
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-[#1A1A2E]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#1A1A2E]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#1A1A2E]" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Qualifies
                  </span>
                  <span className="font-medium text-[var(--color-text)]">
                    {snapshot?.qualifies ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Propositions
                  </span>
                  <span className="font-medium text-[var(--color-text)]">
                    {snapshot?.propositions ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    A signer
                  </span>
                  <span className="font-medium text-[var(--color-gold)]">
                    {snapshot?.aSignerSemaine ?? 0}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]"
                    style={{ width: `${snapshot?.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ═══ KPI Row ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiWidget
              title="CA Signe"
              value={formatK(kpis?.caSigne ?? 0)}
              icon={Banknote}
              trend="up"
              trendValue=""
              delay={0.15}
            />
            <KpiWidget
              title="CA Pondere"
              value={formatK(kpis?.caPondere ?? 0)}
              icon={TrendingUp}
              trend="up"
              trendValue=""
              delay={0.2}
            />
            <KpiWidget
              title="MRR Mensuel"
              value={formatK(kpis?.mrr ?? 0)}
              icon={RefreshCw}
              trend="neutral"
              trendValue=""
              delay={0.25}
            />
            <KpiWidget
              title="Relances"
              value={String(kpis?.relances ?? 0)}
              icon={Bell}
              trend={kpis && kpis.relances > 0 ? "up" : "neutral"}
              trendValue={
                kpis && kpis.relances > 0
                  ? `${kpis.relances} en attente`
                  : "0"
              }
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* ═══ Superposition Map + Activity Feed ═══ */}
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <SystemMap />
        </div>
        <div className="xl:col-span-2">
          <ActivityFeed />
        </div>
      </div>

      {/* ═══ Constellation Map (Projects) ═══ */}
      <ConstellationMap />

      {/* ═══ Quick Actions ═══ */}
      <QuickActions />
    </div>
  );
}
