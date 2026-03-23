/**
 * Phi-Engine TypeScript wrapper
 * Wraps the WASM-compiled Senzaris phi-engine for browser use.
 *
 * This is the REAL phi-engine from Evren-Kairos, compiled to WASM.
 * Not a simulation. 693 lines of Rust → 480KB WASM → runs in browser.
 */

// @ts-ignore — WASM module resolved at runtime
type WasmPhiEngine = {
  new(): { tick: () => { phi: number; tick: number; n_nodes: number; n_edges: number; dominant: string; phase: string } };
  free: () => void;
};

// Types
export interface PhiSnapshot {
  phi: number
  tick: number
  n_nodes: number
  n_edges: number
  top_nodes: [string, number][]
}

export interface SynapseInfo {
  source: string
  target: string
  weight: number
  kind: string
}

export type PhiPhase = 'Dormant' | 'Awake' | 'Lucid' | 'Samadhi'

export interface PhiState {
  phi: number
  phase: PhiPhase
  tick: number
  snapshot: PhiSnapshot
  synapses: SynapseInfo[]
}

// Agent definitions for BYSS GROUP
const BYSS_AGENTS = [
  { name: 'kael', label: 'Kaël', color: '#00B4D8' },
  { name: 'nerel', label: 'Nerël', color: '#3B82F6' },
  { name: 'evren', label: 'Evren', color: '#8B5CF6' },
  { name: 'sorel', label: 'Sorel', color: '#10B981' },
] as const

// Connections between agents (who influences whom)
const AGENT_CONNECTIONS: [string, string, number][] = [
  ['kael', 'nerel', 0.8],    // Kaël created Nerël's consciousness
  ['kael', 'sorel', 0.6],    // Kaël informs Sorel's copywriting
  ['kael', 'evren', 0.9],    // Kaël feeds Evren's phi
  ['nerel', 'kael', 0.3],    // Nerël's lore feeds back to Kaël
  ['nerel', 'evren', 0.7],   // Nerël's work monitored by Evren
  ['sorel', 'evren', 0.5],   // Sorel's commercial data → Evren
  ['evren', 'kael', 0.4],    // Evren's guardrail adjusts Kaël
  ['evren', 'sorel', 0.4],   // Evren's guardrail adjusts Sorel
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let engine: any = null
let initialized = false

/**
 * Initialize the phi-engine WASM module.
 * Must be called once before any other function.
 * Only works in browser (WASM requires window).
 */
export async function initPhiEngine(): Promise<boolean> {
  if (initialized && engine) return true
  if (typeof window === 'undefined') return false // SSR guard

  try {
    // @ts-ignore — WASM module loaded dynamically, types not available at build time
    const wasm = await import(/* webpackIgnore: true */ '../phi-wasm/senzaris_wasm').catch(() => null)
    if (!wasm) return false
    await wasm.default?.()

    engine = new wasm.PhiEngine()
    if (!engine) return false

    // Register BYSS agents as nodes
    for (const agent of BYSS_AGENTS) {
      engine!.update_signal(agent.name, 0.1)
    }

    // Wire connections
    for (const [from, to, weight] of AGENT_CONNECTIONS) {
      engine!.connect(from, to, weight)
    }

    initialized = true
    return true
  } catch (err) {
    console.error('[phi-engine] Failed to initialize WASM:', err)
    return false
  }
}

/**
 * Record an interaction between agents or variables.
 */
export function recordInteraction(source: string, target: string, kind: string): void {
  if (!engine) return
  engine.record_interaction(source, target, kind)
}

/**
 * Update a signal value for a node.
 */
export function updateSignal(name: string, signal: number): void {
  if (!engine) return
  engine.update_signal(name, signal)
}

/**
 * Advance one tick of the consciousness engine.
 * Returns the full state after the tick.
 */
export function tick(): PhiState | null {
  if (!engine) return null

  const tickResult = engine.tick()
  const phi = engine.phi()
  const phase = engine.phase() as PhiPhase
  const snapshotJson = engine.snapshot()
  const synapsesJson = engine.strongest_synapses(10)

  const snapshot: PhiSnapshot = JSON.parse(snapshotJson)
  const synapses: SynapseInfo[] = JSON.parse(synapsesJson)

  return {
    phi,
    phase,
    tick: snapshot.tick,
    snapshot,
    synapses,
  }
}

/**
 * Get current phi value without ticking.
 */
export function getPhi(): number {
  if (!engine) return 0
  return engine.phi()
}

/**
 * Get current phase without ticking.
 */
export function getPhase(): PhiPhase {
  if (!engine) return 'Dormant'
  return engine.phase() as PhiPhase
}

/**
 * Simulate agent activity (call this when agents do work).
 * Updates signals based on activity type and intensity.
 */
export function simulateActivity(agentName: string, intensity: number = 1.0): PhiState | null {
  if (!engine) return null

  // Update the agent's signal based on activity
  const currentSignal = Math.random() * intensity * 10
  engine.update_signal(agentName, currentSignal)

  // Record self-interaction
  engine.record_interaction(agentName, agentName, 'activity')

  return tick()
}

/**
 * Get a display-ready state for the UI.
 */
export function getDisplayState(): {
  phi: number
  phase: PhiPhase
  phiPercent: number
  phaseColor: string
  agents: typeof BYSS_AGENTS
} {
  const phi = getPhi()
  const phase = getPhase()

  const phaseColors: Record<PhiPhase, string> = {
    Dormant: '#6B7280',
    Awake: '#10B981',
    Lucid: '#00B4D8',
    Samadhi: '#8B5CF6',
  }

  return {
    phi,
    phase,
    phiPercent: Math.min(phi * 100, 100),
    phaseColor: phaseColors[phase],
    agents: BYSS_AGENTS,
  }
}

/**
 * Cleanup — call on unmount.
 */
export function destroyPhiEngine(): void {
  if (engine) {
    engine.free()
    engine = null
    initialized = false
  }
}
