"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Cpu,
  Zap,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

// ═══════════════════════════════════════════════════════
// PHASE 2D: Agent Traces Dashboard
// KPIs + agent breakdown + recent traces table
// EXECUTOR cyan theme
// ═══════════════════════════════════════════════════════

interface AgentLogRow {
  id: string;
  agent_name: string;
  action: string;
  model: string | null;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  duration_ms: number | null;
  success: boolean;
  error: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface AgentBreakdown {
  agent: string;
  calls: number;
  cost: number;
}

export default function TracesPage() {
  const [logs, setLogs] = useState<AgentLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("agent_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setLogs(data as AgentLogRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── KPIs (today only) ──
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(
    (l) => new Date(l.created_at) >= todayStart,
  );
  const totalCostToday = todayLogs.reduce((s, l) => s + Number(l.cost_usd || 0), 0);
  const totalCallsToday = todayLogs.length;
  const avgLatency =
    todayLogs.length > 0
      ? Math.round(
          todayLogs.reduce((s, l) => s + (l.duration_ms || 0), 0) /
            todayLogs.length,
        )
      : 0;
  const successRate =
    todayLogs.length > 0
      ? Math.round(
          (todayLogs.filter((l) => l.success).length / todayLogs.length) * 100,
        )
      : 100;

  // ── Agent breakdown ──
  const breakdown: AgentBreakdown[] = [];
  const agentMap = new Map<string, { calls: number; cost: number }>();
  for (const log of logs) {
    const key = log.agent_name || "unknown";
    const entry = agentMap.get(key) || { calls: 0, cost: 0 };
    entry.calls += 1;
    entry.cost += Number(log.cost_usd || 0);
    agentMap.set(key, entry);
  }
  for (const [agent, stats] of agentMap) {
    breakdown.push({ agent, ...stats });
  }
  breakdown.sort((a, b) => b.cost - a.cost);
  const maxCalls = Math.max(...breakdown.map((b) => b.calls), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Agent"
        titleAccent="Traces"
        subtitle="Audit trail — couts, latence, succes par agent"
        actions={
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[#00B4D8]/40 hover:text-[#00B4D8]"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cout aujourd'hui"
          value={`$${totalCostToday.toFixed(3)}`}
          icon={DollarSign}
          loading={loading}
          delay={0}
          iconColor="text-[#00B4D8]"
        />
        <StatCard
          title="Appels aujourd'hui"
          value={totalCallsToday}
          icon={Zap}
          loading={loading}
          delay={0.05}
          iconColor="text-[#00B4D8]"
        />
        <StatCard
          title="Latence moyenne"
          value={`${avgLatency}ms`}
          icon={Clock}
          loading={loading}
          delay={0.1}
          iconColor="text-[#00B4D8]"
        />
        <StatCard
          title="Taux de succes"
          value={`${successRate}%`}
          icon={CheckCircle2}
          loading={loading}
          delay={0.15}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Agent Breakdown */}
      {breakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#00B4D8]" />
            <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
              Repartition par agent
            </h2>
          </div>
          <div className="space-y-3">
            {breakdown.map((b) => (
              <div key={b.agent} className="flex items-center gap-3">
                <span className="w-32 truncate text-xs font-medium text-[#00B4D8]">
                  {b.agent}
                </span>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded-md bg-[var(--color-surface-raised)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(b.calls / maxCalls) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-md bg-[#00B4D8]/30"
                    />
                  </div>
                </div>
                <span className="w-16 text-right font-mono text-[10px] text-[var(--color-text-muted)]">
                  {b.calls} calls
                </span>
                <span className="w-20 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">
                  ${b.cost.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Traces Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-3">
          <Activity className="h-4 w-4 text-[#00B4D8]" />
          <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            Traces recentes
          </h2>
          <span className="text-[10px] text-[var(--color-text-muted)]">
            ({logs.length})
          </span>
        </div>

        {loading ? (
          <div className="px-4 py-12 text-center text-xs text-[var(--color-text-muted)]">
            Chargement des traces...
          </div>
        ) : logs.length === 0 ? (
          <div className="px-4 py-12 text-center text-xs text-[var(--color-text-muted)]">
            Aucune trace enregistree. La forge est froide.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30">
                  <th className="py-2.5 pl-4 pr-2 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Agent
                  </th>
                  <th className="py-2.5 pr-2 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Action
                  </th>
                  <th className="py-2.5 pr-2 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Model
                  </th>
                  <th className="py-2.5 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    In
                  </th>
                  <th className="py-2.5 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Out
                  </th>
                  <th className="py-2.5 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Cout
                  </th>
                  <th className="py-2.5 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Duree
                  </th>
                  <th className="py-2.5 pr-4 text-center text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    OK
                  </th>
                  <th className="py-2.5 pr-4 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30"
                  >
                    <td className="py-2 pl-4 pr-2 text-xs font-medium text-[#00B4D8]">
                      {log.agent_name}
                    </td>
                    <td className="py-2 pr-2 text-xs text-[var(--color-text)]">
                      {log.action}
                    </td>
                    <td className="py-2 pr-2 font-mono text-[10px] text-[var(--color-text-muted)]">
                      {log.model || "—"}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">
                      {(log.input_tokens || 0).toLocaleString()}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">
                      {(log.output_tokens || 0).toLocaleString()}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">
                      ${Number(log.cost_usd || 0).toFixed(4)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.duration_ms || 0}ms
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-center">
                      {log.success ? (
                        <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="mx-auto h-3.5 w-3.5 text-red-400" />
                      )}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[10px] text-[var(--color-text-muted)]">
                      {new Date(log.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
