// ═══════════════════════════════════════════════════════
// MEMORY SYSTEM — 5-Layer Orchestrator
// Unified memory interface for all agents
//
// Layer 1: short_term  → Volatile session cache (Zustand)
// Layer 2: episodic    → Daily event logs (Supabase)
// Layer 3: semantic    → Knowledge concepts (Supabase + embeddings)
// Layer 4: procedural  → Skills & recipes (Supabase)
// Layer 5: meta        → Patterns & summaries (Supabase)
// ═══════════════════════════════════════════════════════

import { create } from "zustand";
import type {
  EnfantName,
  AgentName,
  MemoryLayer,
  EpisodicMemory,
  SemanticMemory,
  ProceduralMemory,
  MetaMemory,
} from "@/types";

// ── Layer 1: Short-Term Memory (Zustand) ──

interface ShortTermEntry {
  key: string;
  value: unknown;
  expiresAt: number;
  createdAt: number;
}

interface ShortTermStore {
  memories: Map<string, Map<string, ShortTermEntry>>; // agentName -> key -> entry
  set: (agent: string, key: string, value: unknown, ttlMs?: number) => void;
  get: (agent: string, key: string) => unknown | undefined;
  getAll: (agent: string) => ShortTermEntry[];
  clear: (agent: string) => void;
  cleanup: () => void;
}

export const useShortTermMemory = create<ShortTermStore>((set, get) => ({
  memories: new Map(),

  set: (agent, key, value, ttlMs = 300_000) => {
    const entry: ShortTermEntry = {
      key,
      value,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now(),
    };
    set((state) => {
      const memories = new Map(state.memories);
      if (!memories.has(agent)) memories.set(agent, new Map());
      memories.get(agent)!.set(key, entry);
      return { memories };
    });
  },

  get: (agent, key) => {
    const agentMem = get().memories.get(agent);
    if (!agentMem) return undefined;
    const entry = agentMem.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      agentMem.delete(key);
      return undefined;
    }
    return entry.value;
  },

  getAll: (agent) => {
    const agentMem = get().memories.get(agent);
    if (!agentMem) return [];
    const now = Date.now();
    return Array.from(agentMem.values()).filter((e) => now <= e.expiresAt);
  },

  clear: (agent) => {
    set((state) => {
      const memories = new Map(state.memories);
      memories.delete(agent);
      return { memories };
    });
  },

  cleanup: () => {
    const now = Date.now();
    set((state) => {
      const memories = new Map(state.memories);
      for (const [agent, agentMem] of memories) {
        for (const [key, entry] of agentMem) {
          if (now > entry.expiresAt) agentMem.delete(key);
        }
        if (agentMem.size === 0) memories.delete(agent);
      }
      return { memories };
    });
  },
}));

// ── Layers 2-5: Supabase-backed Memory ──

// These functions interact with Supabase tables.
// In production they would use the Supabase client.
// For now, they provide the interface + local fallback.

const localEpisodic: EpisodicMemory[] = [];
const localSemantic: SemanticMemory[] = [];
const localProcedural: ProceduralMemory[] = [];
const localMeta: MetaMemory[] = [];

// ── Layer 2: Episodic Memory ──

export async function addEpisodicMemory(
  agentName: EnfantName | AgentName,
  eventType: string,
  content: string,
  context: Record<string, unknown> = {},
  importanceScore = 0.5
): Promise<EpisodicMemory> {
  const entry: EpisodicMemory = {
    id: `ep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agent_name: agentName,
    date: new Date().toISOString().split("T")[0],
    event_type: eventType,
    content,
    context,
    importance_score: importanceScore,
    created_at: new Date().toISOString(),
  };
  localEpisodic.push(entry);
  if (localEpisodic.length > 1000) localEpisodic.shift();
  return entry;
}

export function getEpisodicMemories(
  agentName: EnfantName | AgentName,
  limit = 20,
  date?: string
): EpisodicMemory[] {
  return localEpisodic
    .filter((m) => m.agent_name === agentName && (!date || m.date === date))
    .slice(-limit);
}

// ── Layer 3: Semantic Memory ──

export async function addSemanticMemory(
  agentName: EnfantName | AgentName,
  concept: string,
  definition: string,
  relationships: Array<{ concept: string; strength: number; type: string }> = []
): Promise<SemanticMemory> {
  // Check for existing concept and update
  const existing = localSemantic.find(
    (m) => m.agent_name === agentName && m.concept === concept
  );
  if (existing) {
    existing.definition = definition;
    existing.relationships = relationships;
    existing.last_accessed = new Date().toISOString();
    existing.access_count++;
    return existing;
  }

  const entry: SemanticMemory = {
    id: `sem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agent_name: agentName,
    concept,
    definition,
    relationships,
    last_accessed: new Date().toISOString(),
    access_count: 1,
    created_at: new Date().toISOString(),
  };
  localSemantic.push(entry);
  return entry;
}

export function searchSemanticMemory(
  agentName: EnfantName | AgentName,
  query: string,
  limit = 10
): SemanticMemory[] {
  const queryLower = query.toLowerCase();
  return localSemantic
    .filter(
      (m) =>
        m.agent_name === agentName &&
        (m.concept.toLowerCase().includes(queryLower) ||
          m.definition.toLowerCase().includes(queryLower))
    )
    .sort((a, b) => b.access_count - a.access_count)
    .slice(0, limit);
}

// ── Layer 4: Procedural Memory ──

export async function addProceduralMemory(
  agentName: EnfantName | AgentName,
  skillName: string,
  procedure: string
): Promise<ProceduralMemory> {
  const existing = localProcedural.find(
    (m) => m.agent_name === agentName && m.skill_name === skillName
  );
  if (existing) {
    existing.procedure = procedure;
    existing.usage_count++;
    existing.last_used = new Date().toISOString();
    return existing;
  }

  const entry: ProceduralMemory = {
    id: `proc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agent_name: agentName,
    skill_name: skillName,
    procedure,
    success_rate: 1.0,
    usage_count: 1,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  localProcedural.push(entry);
  return entry;
}

export function getProceduralMemory(
  agentName: EnfantName | AgentName,
  skillName?: string
): ProceduralMemory[] {
  return localProcedural.filter(
    (m) => m.agent_name === agentName && (!skillName || m.skill_name === skillName)
  );
}

// ── Layer 5: Meta Memory ──

export async function addMetaMemory(
  agentName: EnfantName | AgentName,
  patternType: string,
  summary: string,
  phiScore: number,
  confidence = 0.5
): Promise<MetaMemory> {
  const entry: MetaMemory = {
    id: `meta_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agent_name: agentName,
    pattern_type: patternType,
    summary,
    phi_score_at_time: phiScore,
    confidence,
    created_at: new Date().toISOString(),
  };
  localMeta.push(entry);
  if (localMeta.length > 500) localMeta.shift();
  return entry;
}

export function getMetaMemories(
  agentName: EnfantName | AgentName,
  patternType?: string,
  limit = 10
): MetaMemory[] {
  return localMeta
    .filter(
      (m) => m.agent_name === agentName && (!patternType || m.pattern_type === patternType)
    )
    .slice(-limit);
}

// ── Unified Memory Interface ──

export interface MemoryQuery {
  agent: EnfantName | AgentName;
  layer?: MemoryLayer;
  query?: string;
  limit?: number;
}

export interface MemoryResult {
  layer: MemoryLayer;
  entries: Array<EpisodicMemory | SemanticMemory | ProceduralMemory | MetaMemory>;
}

/**
 * Query across all memory layers for an agent.
 */
export function queryMemory(params: MemoryQuery): MemoryResult[] {
  const results: MemoryResult[] = [];
  const { agent, layer, query, limit = 10 } = params;

  if (!layer || layer === "episodic") {
    results.push({
      layer: "episodic",
      entries: getEpisodicMemories(agent, limit),
    });
  }

  if (!layer || layer === "semantic") {
    results.push({
      layer: "semantic",
      entries: query ? searchSemanticMemory(agent, query, limit) : [],
    });
  }

  if (!layer || layer === "procedural") {
    results.push({
      layer: "procedural",
      entries: getProceduralMemory(agent),
    });
  }

  if (!layer || layer === "meta") {
    results.push({
      layer: "meta",
      entries: getMetaMemories(agent, undefined, limit),
    });
  }

  return results;
}
