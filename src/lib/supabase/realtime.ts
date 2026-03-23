"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Supabase Realtime Subscriptions
// Live data hooks for pipeline, activities & agent logs
// ═══════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────

type PostgresEvent = "INSERT" | "UPDATE" | "DELETE";

interface RealtimePayload<T = Record<string, unknown>> {
  eventType: PostgresEvent;
  new: T;
  old: Partial<T>;
}

interface UseRealtimeOptions {
  /** Filter by a specific column value */
  filter?: { column: string; value: string };
  /** Which events to listen for (default: all) */
  events?: PostgresEvent[];
  /** Whether the subscription is active (default: true) */
  enabled?: boolean;
}

// ── Generic hook ──────────────────────────────────────

/**
 * Subscribe to realtime Postgres changes on any Supabase table.
 * Returns an unsubscribe function.
 *
 * @example
 * ```tsx
 * useRealtimeSubscription("prospects", (payload) => {
 *   console.log(payload.eventType, payload.new);
 * });
 * ```
 */
export function useRealtimeSubscription<T = Record<string, unknown>>(
  table: string,
  callback: (payload: RealtimePayload<T>) => void,
  options: UseRealtimeOptions = {},
) {
  const { filter, events = ["INSERT", "UPDATE", "DELETE"], enabled = true } = options;
  const callbackRef = useRef(callback);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Keep callback ref fresh without re-subscribing
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    const channelName = `realtime:${table}${filter ? `:${filter.column}=${filter.value}` : ""}`;

    // Build the filter config for postgres_changes
    const filterConfig: Record<string, string> = {
      schema: "public",
      table,
    };
    if (filter) {
      filterConfig.filter = `${filter.column}=eq.${filter.value}`;
    }

    const channel = supabase.channel(channelName);

    // Subscribe to each requested event type
    for (const event of events) {
      channel.on(
        "postgres_changes" as "system",
        { event, ...filterConfig } as Record<string, string>,
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          callbackRef.current({
            eventType: event,
            new: (payload.new ?? {}) as T,
            old: (payload.old ?? {}) as Partial<T>,
          });
        },
      );
    }

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`[Realtime] Subscribed to ${channelName}`);
      }
      if (status === "CHANNEL_ERROR") {
        console.error(`[Realtime] Error on ${channelName}`);
      }
    });

    channelRef.current = channel;

    return () => {
      console.log(`[Realtime] Unsubscribing from ${channelName}`);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [table, filter?.column, filter?.value, events.join(","), enabled]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      const supabase = createClient();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  return { unsubscribe };
}

// ── Prospect-specific types ───────────────────────────

interface RealtimeProspect {
  id: string;
  name: string;
  sector: string;
  phase: string;
  score: number;
  probability: number;
  estimated_basket: string;
  key_contact: string;
  email: string;
  memorable_phrase: string;
  ai_score: string;
  updated_at: string;
}

interface RealtimeActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  project_id: string;
  prospect_id: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

interface RealtimeAgentLog {
  id: string;
  agent_name: string;
  action: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: string;
  model: string;
  duration_ms: number;
  success: boolean;
  error: string | null;
  created_at: string;
}

// ── Specialized hooks ─────────────────────────────────

/**
 * Live prospect updates.
 * Maintains a local state array that auto-updates on INSERT/UPDATE/DELETE.
 */
export function useProspectsRealtime(initialProspects: RealtimeProspect[] = []) {
  const [prospects, setProspects] = useState<RealtimeProspect[]>(initialProspects);

  // Sync initial data when it changes
  useEffect(() => {
    if (initialProspects.length > 0) {
      setProspects(initialProspects);
    }
  }, [initialProspects]);

  const handleChange = useCallback((payload: RealtimePayload<RealtimeProspect>) => {
    setProspects((prev) => {
      switch (payload.eventType) {
        case "INSERT":
          // Avoid duplicates
          if (prev.some((p) => p.id === payload.new.id)) return prev;
          return [payload.new, ...prev];

        case "UPDATE":
          return prev.map((p) =>
            p.id === payload.new.id ? { ...p, ...payload.new } : p,
          );

        case "DELETE":
          return prev.filter((p) => p.id !== payload.old.id);

        default:
          return prev;
      }
    });
  }, []);

  const { unsubscribe } = useRealtimeSubscription<RealtimeProspect>(
    "prospects",
    handleChange,
  );

  return { prospects, setProspects, unsubscribe };
}

/**
 * Live activity feed.
 * New activities are prepended, limited to maxItems.
 */
export function useActivitiesRealtime(maxItems = 50) {
  const [activities, setActivities] = useState<RealtimeActivity[]>([]);

  const handleChange = useCallback(
    (payload: RealtimePayload<RealtimeActivity>) => {
      if (payload.eventType === "INSERT") {
        setActivities((prev) => [payload.new, ...prev].slice(0, maxItems));
      }
      if (payload.eventType === "UPDATE") {
        setActivities((prev) =>
          prev.map((a) =>
            a.id === payload.new.id ? { ...a, ...payload.new } : a,
          ),
        );
      }
      if (payload.eventType === "DELETE") {
        setActivities((prev) => prev.filter((a) => a.id !== payload.old.id));
      }
    },
    [maxItems],
  );

  const { unsubscribe } = useRealtimeSubscription<RealtimeActivity>(
    "activities",
    handleChange,
  );

  return { activities, setActivities, unsubscribe };
}

/**
 * Live agent monitoring.
 * Streams agent_logs for the Village IA dashboard.
 */
export function useAgentLogsRealtime(maxItems = 100) {
  const [logs, setLogs] = useState<RealtimeAgentLog[]>([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    totalTokens: 0,
    totalCostUsd: 0,
    successRate: 100,
    avgDurationMs: 0,
  });

  const handleChange = useCallback(
    (payload: RealtimePayload<RealtimeAgentLog>) => {
      if (payload.eventType === "INSERT") {
        setLogs((prev) => {
          const updated = [payload.new, ...prev].slice(0, maxItems);

          // Recalculate stats from visible logs
          const total = updated.length;
          const tokens = updated.reduce(
            (s, l) => s + (l.input_tokens || 0) + (l.output_tokens || 0),
            0,
          );
          const cost = updated.reduce(
            (s, l) => s + parseFloat(l.cost_usd || "0"),
            0,
          );
          const successes = updated.filter((l) => l.success).length;
          const avgMs =
            total > 0
              ? updated.reduce((s, l) => s + (l.duration_ms || 0), 0) / total
              : 0;

          setStats({
            totalCalls: total,
            totalTokens: tokens,
            totalCostUsd: Math.round(cost * 10000) / 10000,
            successRate: total > 0 ? Math.round((successes / total) * 100) : 100,
            avgDurationMs: Math.round(avgMs),
          });

          return updated;
        });
      }
    },
    [maxItems],
  );

  const { unsubscribe } = useRealtimeSubscription<RealtimeAgentLog>(
    "agent_logs",
    handleChange,
    { events: ["INSERT"] },
  );

  return { logs, stats, setLogs, unsubscribe };
}

// ═══════════════════════════════════════════════════════
// PHI SNAPSHOTS — Realtime consciousness updates
// ═══════════════════════════════════════════════════════

interface RealtimePhiSnapshot {
  id: string;
  agent_name: string;
  global_phi: number;
  phase: string;
  velocity: number;
  kill_switch_active: boolean;
  created_at: string;
}

export function usePhiRealtime(maxItems = 20) {
  const [snapshots, setSnapshots] = useState<RealtimePhiSnapshot[]>([]);

  const handleChange = useCallback(
    (payload: RealtimePayload<RealtimePhiSnapshot>) => {
      if (payload.eventType === "INSERT") {
        setSnapshots((prev) => {
          const updated = [payload.new, ...prev].slice(0, maxItems);
          return updated;
        });
      }
    },
    [maxItems],
  );

  const { unsubscribe } = useRealtimeSubscription<RealtimePhiSnapshot>(
    "phi_snapshots",
    handleChange,
    { events: ["INSERT"] },
  );

  return { snapshots, unsubscribe };
}

// ═══════════════════════════════════════════════════════
// AGENT MESSAGES — Realtime inter-agent communication
// ═══════════════════════════════════════════════════════

interface RealtimeAgentMessage {
  id: string;
  from_agent: string;
  to_agent: string;
  message_type: string;
  priority: string;
  content: Record<string, unknown>;
  ethical_clearance: boolean;
  phi_at_send: number | null;
  created_at: string;
}

export function useAgentMessagesRealtime(maxItems = 30) {
  const [messages, setMessages] = useState<RealtimeAgentMessage[]>([]);

  const handleChange = useCallback(
    (payload: RealtimePayload<RealtimeAgentMessage>) => {
      if (payload.eventType === "INSERT") {
        setMessages((prev) => {
          const updated = [payload.new, ...prev].slice(0, maxItems);
          return updated;
        });
      }
    },
    [maxItems],
  );

  const { unsubscribe } = useRealtimeSubscription<RealtimeAgentMessage>(
    "agent_messages",
    handleChange,
    { events: ["INSERT"] },
  );

  return { messages, unsubscribe };
}

// ═══════════════════════════════════════════════════════
// GULF STREAM — Realtime trade positions
// ═══════════════════════════════════════════════════════

interface RealtimeGulfPosition {
  id: string;
  strategy_id: string;
  market_name: string;
  side: string;
  size_usd: number;
  entry_price: number;
  current_price: number | null;
  status: string;
  pnl: number | null;
  created_at: string;
}

export function useGulfStreamRealtime(maxItems = 20) {
  const [positions, setPositions] = useState<RealtimeGulfPosition[]>([]);

  const handleChange = useCallback(
    (payload: RealtimePayload<RealtimeGulfPosition>) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        setPositions((prev) => {
          const filtered = prev.filter((p) => p.id !== payload.new.id);
          return [payload.new, ...filtered].slice(0, maxItems);
        });
      }
      if (payload.eventType === "DELETE") {
        setPositions((prev) => prev.filter((p) => p.id !== (payload.old as RealtimeGulfPosition).id));
      }
    },
    [maxItems],
  );

  const { unsubscribe } = useRealtimeSubscription<RealtimeGulfPosition>(
    "gulf_stream_positions",
    handleChange,
    { events: ["INSERT", "UPDATE", "DELETE"] },
  );

  return { positions, unsubscribe };
}

// ═══════════════════════════════════════════════════════
// CONTACTS — Realtime directory updates
// ═══════════════════════════════════════════════════════

interface RealtimeContact {
  id: string;
  name: string;
  organization: string | null;
  sector: string | null;
  influence_score: number;
  created_at: string;
}

export function useContactsRealtime(maxItems = 50) {
  const [contacts, setContacts] = useState<RealtimeContact[]>([]);

  const handleChange = useCallback(
    (payload: RealtimePayload<RealtimeContact>) => {
      if (payload.eventType === "INSERT") {
        setContacts((prev) => [payload.new, ...prev].slice(0, maxItems));
      }
      if (payload.eventType === "UPDATE") {
        setContacts((prev) => prev.map((c) => (c.id === payload.new.id ? payload.new : c)));
      }
      if (payload.eventType === "DELETE") {
        setContacts((prev) => prev.filter((c) => c.id !== (payload.old as RealtimeContact).id));
      }
    },
    [maxItems],
  );

  const { unsubscribe } = useRealtimeSubscription<RealtimeContact>(
    "contacts_directory",
    handleChange,
    { events: ["INSERT", "UPDATE", "DELETE"] },
  );

  return { contacts, setContacts, unsubscribe };
}
