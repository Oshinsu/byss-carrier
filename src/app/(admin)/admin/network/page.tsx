"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { Network, CheckCircle2, XCircle, Key, Server, RefreshCw, AlertTriangle } from "lucide-react";
import { SkeletonCard, SkeletonTable } from "@/components/ui/loading-skeleton";

/* ─── Types ─────────────────────────────────────────── */
type ServerStatus = "online" | "offline" | "degraded" | "checking" | "no-endpoint" | "cors-blocked";

interface ServerConfig {
  name: string;
  type: string;
  healthUrl: string | null; // null = no endpoint to check
  apiKey: boolean;
}

interface ServerState {
  status: ServerStatus;
  latency: string;
}

/* ─── Server Definitions ────────────────────────────── */
const SERVERS: ServerConfig[] = [
  { name: "Supabase", type: "Database", healthUrl: "https://supabase.com", apiKey: true },
  { name: "OpenClaw", type: "MCP Server", healthUrl: null, apiKey: true },
  { name: "Paperclip", type: "MCP Server", healthUrl: null, apiKey: true },
  { name: "Gulf Stream", type: "MCP Server", healthUrl: null, apiKey: true },
  { name: "n8n", type: "Automation", healthUrl: null, apiKey: true },
  { name: "Anthropic API", type: "LLM", healthUrl: "https://api.anthropic.com", apiKey: true },
  { name: "OpenAI API", type: "LLM", healthUrl: "https://api.openai.com", apiKey: true },
  { name: "Midjourney", type: "Image Gen", healthUrl: null, apiKey: true },
  { name: "ElevenLabs", type: "Voice", healthUrl: "https://api.elevenlabs.io", apiKey: true },
  { name: "Kling 3.0", type: "Video Gen", healthUrl: null, apiKey: true },
  { name: "Resend", type: "Email", healthUrl: "https://api.resend.com", apiKey: true },
  { name: "Vercel", type: "Hosting", healthUrl: "https://vercel.com", apiKey: true },
  { name: "Airtable", type: "CRM", healthUrl: "https://api.airtable.com", apiKey: true },
  { name: "360dialog", type: "WhatsApp", healthUrl: null, apiKey: true },
  { name: "Senzaris", type: "MCP Server", healthUrl: null, apiKey: false },
];

/* ─── Status Display Config ─────────────────────────── */
const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
  online:       { color: "text-emerald-400", bg: "bg-emerald-400", icon: CheckCircle2, label: "online" },
  degraded:     { color: "text-amber-400",   bg: "bg-amber-400",   icon: AlertTriangle, label: "degraded" },
  offline:      { color: "text-red-400",     bg: "bg-red-400",     icon: XCircle, label: "offline" },
  checking:     { color: "text-blue-400",    bg: "bg-blue-400",    icon: RefreshCw, label: "checking..." },
  "no-endpoint":  { color: "text-zinc-500",    bg: "bg-zinc-500",    icon: Server, label: "no endpoint" },
  "cors-blocked": { color: "text-amber-400",   bg: "bg-amber-400",   icon: AlertTriangle, label: "CORS blocked" },
};

/* ─── Health Check Logic ────────────────────────────── */
async function checkServer(url: string): Promise<{ status: ServerStatus; latency: string }> {
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      signal: AbortSignal.timeout(5000),
    });
    const ms = Math.round(performance.now() - start);
    // mode: "no-cors" returns opaque response with status 0 — that means the server responded
    if (res.status === 0 || (res.status >= 200 && res.status < 400)) {
      return { status: "online", latency: `${ms}ms` };
    }
    if (res.status >= 400 && res.status < 500) {
      // 401/403 etc. — server is alive but returned client error (expected for APIs without auth)
      return { status: "online", latency: `${ms}ms` };
    }
    return { status: "degraded", latency: `${ms}ms` };
  } catch (err: unknown) {
    const ms = Math.round(performance.now() - start);
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return { status: "offline", latency: "timeout" };
    }
    if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
      // Could be CORS or network error — if we got a fast response, likely CORS
      if (ms < 4000) {
        return { status: "cors-blocked", latency: `${ms}ms` };
      }
      return { status: "offline", latency: "timeout" };
    }
    return { status: "offline", latency: "error" };
  }
}

/* ─── Component ─────────────────────────────────────── */
export default function NetworkPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [serverStates, setServerStates] = useState<Record<string, ServerState>>(() => {
    const initial: Record<string, ServerState> = {};
    for (const srv of SERVERS) {
      initial[srv.name] = srv.healthUrl
        ? { status: "checking", latency: "—" }
        : { status: "no-endpoint", latency: "—" };
    }
    return initial;
  });

  const pingAll = useCallback(async () => {
    setRefreshing(true);

    // Mark all servers with URLs as "checking"
    setServerStates((prev) => {
      const next = { ...prev };
      for (const srv of SERVERS) {
        if (srv.healthUrl) {
          next[srv.name] = { status: "checking", latency: "—" };
        }
      }
      return next;
    });

    // Fire all health checks in parallel, update each as it resolves
    const checks = SERVERS.map(async (srv) => {
      if (!srv.healthUrl) return;
      const result = await checkServer(srv.healthUrl);
      setServerStates((prev) => ({ ...prev, [srv.name]: result }));
    });

    await Promise.allSettled(checks);
    setRefreshing(false);
    setLoading(false);
  }, []);

  // Run health checks on mount
  useEffect(() => {
    pingAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const online = Object.values(serverStates).filter((s) => s.status === "online").length;
  const degraded = Object.values(serverStates).filter((s) =>
    s.status === "degraded" || s.status === "cors-blocked"
  ).length;

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable rows={8} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Network className="h-5 w-5 text-[var(--color-gold)]" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 ring-2 ring-[var(--color-bg)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Reseau BYSS
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            {SERVERS.length} services — live health checks
          </p>
        </div>
        <button
          onClick={pingAll}
          disabled={refreshing}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Ping All
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <Server className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{online}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <Server className="h-4 w-4 text-amber-400" />
          <div>
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{degraded}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Degraded</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <Key className="h-4 w-4 text-[var(--color-gold)]" />
          <div>
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{SERVERS.filter((s) => s.apiKey).length}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">API Keys</div>
          </div>
        </div>
      </div>

      {/* Server table */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30">
              <th className="py-2 pl-4 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Service</th>
              <th className="py-2 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Type</th>
              <th className="py-2 pr-3 text-center text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
              <th className="py-2 pr-3 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Latency</th>
              <th className="py-2 pr-4 text-center text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Key</th>
            </tr>
          </thead>
          <tbody>
            {SERVERS.map((srv, i) => {
              const state = serverStates[srv.name] ?? { status: "offline", latency: "—" };
              const cfg = STATUS_CONFIG[state.status] ?? STATUS_CONFIG.offline;
              return (
                <motion.tr
                  key={srv.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30"
                >
                  <td className="py-2.5 pl-4 pr-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${cfg.bg} ${state.status === "checking" ? "animate-pulse" : ""}`} />
                      <span className="text-sm font-medium text-[var(--color-text)]">{srv.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-xs text-[var(--color-text-muted)]">{srv.type}</td>
                  <td className={`py-2.5 pr-3 text-center text-[10px] font-medium ${cfg.color}`}>{cfg.label}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-[10px] text-[var(--color-text-secondary)]">{state.latency}</td>
                  <td className="py-2.5 pr-4 text-center">
                    {srv.apiKey ? <Key className="mx-auto h-3 w-3 text-[var(--color-gold)]" /> : <span className="text-[10px] text-red-400">missing</span>}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
