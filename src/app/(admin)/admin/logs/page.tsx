"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Activity, RefreshCw, CheckCircle2, XCircle, Clock, Cpu, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AgentLog {
  id: string;
  agent: string;
  action: string;
  model: string;
  tokens: number;
  cost: number;
  duration: number;
  success: boolean;
  created_at: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("agent_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) setLogs(data as AgentLog[]);
    setLoading(false);
  }

  useEffect(() => { fetchLogs(); }, []);

  const totalTokens = logs.reduce((s, l) => s + (l.tokens || 0), 0);
  const totalCost = logs.reduce((s, l) => s + (l.cost || 0), 0);
  const successRate = logs.length > 0 ? Math.round((logs.filter((l) => l.success).length / logs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Activity className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Agent Logs
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            {loading ? "Chargement..." : `${logs.length} logs — Activite des agents IA`}
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <Cpu className="h-4 w-4 text-[var(--color-gold)]" />
          <div>
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{totalTokens.toLocaleString()}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Tokens total</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <DollarSign className="h-4 w-4 text-[var(--color-gold)]" />
          <div>
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">${totalCost.toFixed(2)}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Cout total</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{successRate}%</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Taux succes</div>
          </div>
        </div>
      </div>

      {/* Logs table */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        {loading ? (
          <div className="px-4 py-12 text-center text-xs text-[var(--color-text-muted)]">Chargement des logs...</div>
        ) : logs.length === 0 ? (
          <div className="px-4 py-12 text-center text-xs text-[var(--color-text-muted)]">Aucun log enregistre.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30">
                <th className="py-2 pl-4 pr-2 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Agent</th>
                <th className="py-2 pr-2 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Action</th>
                <th className="py-2 pr-2 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Model</th>
                <th className="py-2 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Tokens</th>
                <th className="py-2 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Cost</th>
                <th className="py-2 pr-2 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Duree</th>
                <th className="py-2 pr-4 text-center text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">OK</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30"
                >
                  <td className="py-2 pl-4 pr-2 text-xs font-medium text-[var(--color-gold)]">{log.agent}</td>
                  <td className="py-2 pr-2 text-xs text-[var(--color-text)]">{log.action}</td>
                  <td className="py-2 pr-2 font-mono text-[10px] text-[var(--color-text-muted)]">{log.model}</td>
                  <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">{(log.tokens || 0).toLocaleString()}</td>
                  <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">${(log.cost || 0).toFixed(3)}</td>
                  <td className="py-2 pr-2 text-right font-mono text-[10px] text-[var(--color-text-muted)]">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{log.duration || 0}ms</span>
                  </td>
                  <td className="py-2 pr-4 text-center">
                    {log.success ? <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="mx-auto h-3.5 w-3.5 text-red-400" />}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
