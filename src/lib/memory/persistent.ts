/**
 * Mem0-style Persistent Memory Layer for Village IA Agents
 *
 * Provides long-term memory storage on top of the existing
 * Supabase `ai_conversations` table. Each agent (Kael, Nerel,
 * Evren, Sorel) maintains its own memory graph.
 */

import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

export type MemoryCategory =
  | "fact"
  | "preference"
  | "conversation"
  | "insight"
  | "decision";

export type AgentId = "kael" | "nerel" | "evren" | "sorel";

export interface MemoryEntry {
  id: string;
  content: string;
  category: MemoryCategory;
  importance: number; // 0-1
  createdAt: string;
  lastAccessed: string;
  accessCount: number;
}

export interface GraphEdge {
  fromId: string;
  toId: string;
  relation: string; // e.g. "related_to", "contradicts", "supports", "follows"
  weight: number; // 0-1
}

export interface AgentMemory {
  agentId: AgentId;
  memories: MemoryEntry[];
  graphConnections: GraphEdge[];
}

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Parse a raw DB row from `ai_conversations` into a MemoryEntry.
 * The memory data is stored in the `metadata` JSONB column.
 */
function rowToMemory(row: Record<string, unknown>): MemoryEntry {
  const meta = (row.metadata as Record<string, unknown>) || {};
  return {
    id: (row.id as string) || generateId(),
    content: (row.user_message as string) || (meta.content as string) || "",
    category: (meta.category as MemoryCategory) || "conversation",
    importance: Number(meta.importance) || 0.5,
    createdAt: (row.created_at as string) || new Date().toISOString(),
    lastAccessed: (meta.last_accessed as string) || (row.created_at as string) || new Date().toISOString(),
    accessCount: Number(meta.access_count) || 1,
  };
}

/* ═══════════════════════════════════════════════════════
   CORE FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Store a new memory for an agent in Supabase `ai_conversations`.
 */
export async function addMemory(
  agentId: AgentId,
  content: string,
  category: MemoryCategory,
  importance: number = 0.5,
): Promise<MemoryEntry> {
  const supabase = createClient();
  const now = new Date().toISOString();
  const id = generateId();

  const { error } = await supabase.from("ai_conversations").insert({
    id,
    agent_id: agentId,
    user_message: content,
    ai_response: `[memory:${category}]`,
    metadata: {
      type: "memory",
      category,
      importance,
      last_accessed: now,
      access_count: 1,
      content,
      graph_edges: [],
    },
    created_at: now,
  });

  if (error) {
    console.error("[persistent-memory] addMemory error:", error);
    throw error;
  }

  return {
    id,
    content,
    category,
    importance,
    createdAt: now,
    lastAccessed: now,
    accessCount: 1,
  };
}

/**
 * Retrieve recent memories for an agent, ordered by recency.
 */
export async function getMemories(
  agentId: AgentId,
  limit: number = 50,
): Promise<MemoryEntry[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("agent_id", agentId)
    .eq("ai_response", `[memory:fact]`)
    .or(
      `ai_response.like.[memory:%]`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[persistent-memory] getMemories error:", error);
    return [];
  }

  // Filter to only memory rows and parse
  const memories = (data || [])
    .filter((row: Record<string, unknown>) => {
      const resp = row.ai_response as string;
      return resp?.startsWith("[memory:");
    })
    .map(rowToMemory);

  // Touch lastAccessed
  const ids = memories.map((m) => m.id);
  if (ids.length > 0) {
    await supabase
      .from("ai_conversations")
      .update({
        metadata: {
          last_accessed: new Date().toISOString(),
        },
      })
      .in("id", ids);
  }

  return memories;
}

/**
 * Search memories by keyword matching against content.
 * Uses Supabase `ilike` for simple text search.
 * For true semantic search, integrate with an embedding model.
 */
export async function searchMemories(
  agentId: AgentId,
  query: string,
  limit: number = 20,
): Promise<MemoryEntry[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("agent_id", agentId)
    .ilike("user_message", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[persistent-memory] searchMemories error:", error);
    return [];
  }

  return (data || [])
    .filter((row: Record<string, unknown>) => {
      const resp = row.ai_response as string;
      return resp?.startsWith("[memory:");
    })
    .map(rowToMemory);
}

/**
 * Retrieve the memory graph for an agent.
 * Graph edges are stored in the `metadata.graph_edges` JSONB array
 * of each memory row.
 */
export async function getMemoryGraph(agentId: AgentId): Promise<AgentMemory> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[persistent-memory] getMemoryGraph error:", error);
    return { agentId, memories: [], graphConnections: [] };
  }

  const rows = (data || []).filter((row: Record<string, unknown>) => {
    const resp = row.ai_response as string;
    return resp?.startsWith("[memory:");
  });

  const memories = rows.map(rowToMemory);
  const graphConnections: GraphEdge[] = [];

  for (const row of rows) {
    const meta = (row as Record<string, unknown>).metadata as Record<string, unknown> | undefined;
    const edges = (meta?.graph_edges as GraphEdge[]) || [];
    graphConnections.push(...edges);
  }

  return { agentId, memories, graphConnections };
}

/**
 * Connect two memories with a named relation.
 */
export async function connectMemories(
  fromId: string,
  toId: string,
  relation: string,
  weight: number = 0.5,
): Promise<void> {
  const supabase = createClient();

  // Read existing edges from the source memory
  const { data } = await supabase
    .from("ai_conversations")
    .select("metadata")
    .eq("id", fromId)
    .single();

  const meta = (data?.metadata as Record<string, unknown>) || {};
  const edges = (meta.graph_edges as GraphEdge[]) || [];

  edges.push({ fromId, toId, relation, weight });

  await supabase
    .from("ai_conversations")
    .update({
      metadata: { ...meta, graph_edges: edges },
    })
    .eq("id", fromId);
}

/**
 * Remove old, low-importance memories past a given age.
 * Keeps memories with importance >= 0.7 regardless of age.
 */
export async function pruneMemories(
  agentId: AgentId,
  maxAgeDays: number = 90,
): Promise<number> {
  const supabase = createClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("id, metadata, created_at")
    .eq("agent_id", agentId)
    .lt("created_at", cutoff.toISOString());

  if (error || !data) {
    console.error("[persistent-memory] pruneMemories error:", error);
    return 0;
  }

  // Only prune low-importance memories
  const toPrune = data.filter((row: Record<string, unknown>) => {
    const meta = (row.metadata as Record<string, unknown>) || {};
    const resp = (row as Record<string, unknown>).ai_response as string;
    return resp?.startsWith("[memory:") && Number(meta.importance || 0) < 0.7;
  });

  if (toPrune.length === 0) return 0;

  const ids = toPrune.map((r: Record<string, unknown>) => r.id as string);

  const { error: deleteError } = await supabase
    .from("ai_conversations")
    .delete()
    .in("id", ids);

  if (deleteError) {
    console.error("[persistent-memory] pruneMemories delete error:", deleteError);
    return 0;
  }

  return ids.length;
}
