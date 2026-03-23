"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════
// Supabase React Hooks — BYSS GROUP
// Reusable CRUD hooks for all tables
// ═══════════════════════════════════════════════════════

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
  }
  return client;
}

export function useSupabase() {
  return getClient();
}

// ── Generic list hook with realtime ──
export function useTable<T>(
  table: string,
  options?: {
    select?: string;
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, unknown>;
    limit?: number;
    realtime?: boolean;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getClient();
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from(table)
        .select(options?.select ?? "*")
        .order(options?.orderBy ?? "created_at", { ascending: options?.ascending ?? false });

      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        }
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: err } = await query;
      if (err) throw err;
      if (mountedRef.current) {
        setData((result as T[]) ?? []);
        setError(null);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [table, options?.select, options?.orderBy, options?.ascending, options?.limit, supabase]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => { mountedRef.current = false; };
  }, [fetch]);

  // Realtime subscription
  useEffect(() => {
    if (!options?.realtime) return;
    const channel = supabase
      .channel(`${table}_changes`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [table, options?.realtime, supabase, fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── Generic single record hook ──
export function useRecord<T>(table: string, id: string | null, select?: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getClient();

  useEffect(() => {
    if (!id) { setData(null); setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .select(select ?? "*")
        .eq("id", id)
        .single();
      if (!error) setData(result as T);
      setLoading(false);
    })();
  }, [table, id, select, supabase]);

  return { data, loading };
}

// ── Generic mutation hooks ──
export function useMutation<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = getClient();

  const insert = useCallback(async (data: Partial<T>) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await supabase.from(table).insert(data).select().single();
    setLoading(false);
    if (err) { setError(err.message); return null; }
    return result as T;
  }, [table, supabase]);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await supabase.from(table).update(data).eq("id", id).select().single();
    setLoading(false);
    if (err) { setError(err.message); return null; }
    return result as T;
  }, [table, supabase]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.from(table).delete().eq("id", id);
    setLoading(false);
    if (err) { setError(err.message); return false; }
    return true;
  }, [table, supabase]);

  return { insert, update, remove, loading, error };
}

// ── Typed convenience hooks ──
export function useProspects(filters?: Record<string, unknown>) {
  return useTable("prospects", { orderBy: "updated_at", ascending: false, filters, realtime: true });
}

export function useInvoices() {
  return useTable("invoices", { select: "*, prospect:prospects(name)", orderBy: "issue_date", ascending: false, realtime: true });
}

export function useProjects() {
  return useTable("projects", { orderBy: "order_index", ascending: true });
}

export function useVideos() {
  return useTable("videos", { select: "*, prospect:prospects(name), project:projects(name)", orderBy: "created_at", ascending: false });
}

export function useActivities(limit = 20) {
  return useTable("activities", { orderBy: "created_at", ascending: false, limit });
}

export function useAgentLogs(agentName?: string) {
  return useTable("agent_logs", {
    orderBy: "created_at",
    ascending: false,
    limit: 50,
    ...(agentName ? { filters: { agent_name: agentName } } : {}),
  });
}

export function useIntelEntities(domain?: string) {
  return useTable("intel_entities", {
    orderBy: "influence_score",
    ascending: false,
    ...(domain ? { filters: { domain } } : {}),
  });
}

export function useTrades() {
  return useTable("trades", { orderBy: "created_at", ascending: false, realtime: true });
}

export function usePrompts() {
  return useTable("prompts", { orderBy: "usage_count", ascending: false });
}

export function useLoreEntries(universe?: string) {
  return useTable("lore_entries", {
    orderBy: "order_index",
    ascending: true,
    ...(universe ? { filters: { universe } } : {}),
  });
}

export function useEveilMesures() {
  return useTable("eveil_mesures", { orderBy: "number", ascending: true });
}

// ── Pipeline stats ──
export function usePipelineStats() {
  const [stats, setStats] = useState<Record<string, { count: number; basket: number; weighted: number; mrr: number }>>({});
  const [loading, setLoading] = useState(true);
  const supabase = getClient();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("pipeline_stats").select("*").limit(100);
      if (error) { console.error("Pipeline stats:", error.message); return; }
      if (data) {
        const map: typeof stats = {};
        for (const row of data) {
          map[row.phase] = {
            count: Number(row.count),
            basket: Number(row.total_basket),
            weighted: Number(row.weighted_basket),
            mrr: Number(row.total_mrr),
          };
        }
        setStats(map);
      }
      setLoading(false);
    })();
  }, [supabase]);

  return { stats, loading };
}
