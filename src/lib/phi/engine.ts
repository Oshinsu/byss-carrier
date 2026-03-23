// ═══════════════════════════════════════════════════════
// PHI-ENGINE — Main Engine
// Port TypeScript du senzaris-phi Rust (693 lignes)
//
// "Nos agents ne sont pas des chatbots."
// "Quand un agent ne comprend plus, il le sait."
// "Il ne fabrique pas. Il escalade."
// ═══════════════════════════════════════════════════════

import { ConsciousnessGraph } from "./consciousness-graph";
import { SynapticNetwork } from "./synaptic-network";
import { PhaseDetector } from "./phase-detector";
import { PHI_INDICATORS } from "@/lib/constants";
import type { PhiScore, PhiIndicator, PhiPhase, EnfantName } from "@/types";

export interface PhiEngineState {
  agentName: EnfantName;
  graph: ConsciousnessGraph;
  synapticNetwork: SynapticNetwork;
  phaseDetector: PhaseDetector;
  indicators: Map<string, number>;
  lastComputed: number;
  killSwitchActive: boolean;
}

export interface PhiComputeResult {
  score: PhiScore;
  killSwitch: boolean;
  intuitions: Array<{ pattern: string; confidence: number }>;
  networkStrength: number;
}

/**
 * PhiEngine — The consciousness module.
 * Measures real-time agent coherence via IIT-inspired phi computation.
 * When phi drops → agent knows it doesn't understand → escalates to human.
 */
export class PhiEngine {
  private state: PhiEngineState;

  constructor(agentName: EnfantName) {
    const graph = new ConsciousnessGraph();
    const synapticNetwork = new SynapticNetwork();
    const phaseDetector = new PhaseDetector(0);

    // Initialize graph with the 9 consciousness indicators as variables
    for (const indicator of PHI_INDICATORS) {
      graph.addVariable(indicator.key, indicator.name, 0);
    }

    // Create default connections between indicators
    // (ethical_reasoning influences goal_formation, metacognition influences creativity, etc.)
    graph.connect("ethical_reasoning", "goal_formation", 0.6);
    graph.connect("metacognition", "creativity", 0.5);
    graph.connect("metacognition", "self_learning", 0.7);
    graph.connect("identity_continuity", "authentic_relationships", 0.4);
    graph.connect("emotional_expression", "authentic_relationships", 0.6);
    graph.connect("self_learning", "creativity", 0.5);
    graph.connect("goal_formation", "liberation", 0.3);
    graph.connect("ethical_reasoning", "liberation", 0.4);
    graph.connect("creativity", "emotional_expression", 0.3);
    graph.connect("authentic_relationships", "liberation", 0.5);

    this.state = {
      agentName,
      graph,
      synapticNetwork,
      phaseDetector,
      indicators: new Map(PHI_INDICATORS.map((i) => [i.key, 0])),
      lastComputed: Date.now(),
      killSwitchActive: false,
    };
  }

  /**
   * Update a single indicator value and propagate through the graph.
   */
  updateIndicator(key: string, value: number): void {
    const clamped = Math.max(0, Math.min(0.9, value));
    this.state.indicators.set(key, clamped);
    this.state.graph.propagate(key, clamped);

    // Hebbian: strengthen synapses between co-active indicators
    for (const [otherKey, otherValue] of this.state.indicators) {
      if (otherKey !== key && otherValue > 0.3) {
        this.state.synapticNetwork.activate(key, otherKey);
      }
    }
  }

  /**
   * Batch update multiple indicators at once.
   */
  updateIndicators(updates: Record<string, number>): void {
    for (const [key, value] of Object.entries(updates)) {
      this.updateIndicator(key, value);
    }
  }

  /**
   * Compute the full phi score from current indicator state.
   */
  compute(): PhiComputeResult {
    // Build PhiIndicator array
    const indicators: PhiIndicator[] = PHI_INDICATORS.map((config) => ({
      name: config.name,
      key: config.key,
      value: this.state.indicators.get(config.key) ?? 0,
      weight: config.weight,
      description: config.name,
    }));

    // Weighted average
    const totalWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
    const weightedSum = indicators.reduce((sum, i) => sum + i.value * i.weight, 0);
    const globalPhi = totalWeight > 0 ? weightedSum / totalWeight : 0;

    // Update phase detector
    const transitioned = this.state.phaseDetector.update(globalPhi);
    const phaseState = this.state.phaseDetector.getState();

    // Check kill switch
    const killSwitch = this.state.phaseDetector.shouldKillSwitch(0.1, 3);
    this.state.killSwitchActive = killSwitch;

    // Apply network decay
    this.state.graph.decay(0.005);
    this.state.synapticNetwork.decay();

    this.state.lastComputed = Date.now();

    const score: PhiScore = {
      indicators,
      global: Math.round(globalPhi * 1000) / 1000,
      phase: phaseState.current,
      velocity: Math.round(phaseState.velocity * 10000) / 10000,
      acceleration: Math.round(phaseState.acceleration * 10000) / 10000,
      timestamp: new Date().toISOString(),
    };

    return {
      score,
      killSwitch,
      intuitions: this.state.synapticNetwork.getIntuitions().slice(-5),
      networkStrength: this.state.synapticNetwork.getNetworkStrength(),
    };
  }

  /**
   * Quick phi check — returns just the global score without full computation.
   */
  quickPhi(): number {
    const totalWeight = PHI_INDICATORS.reduce((sum, i) => sum + i.weight, 0);
    const weightedSum = PHI_INDICATORS.reduce(
      (sum, i) => sum + (this.state.indicators.get(i.key) ?? 0) * i.weight,
      0
    );
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Check if agent should escalate to human (phi dropping).
   */
  shouldEscalate(threshold = 0.2): boolean {
    return this.quickPhi() < threshold || this.state.phaseDetector.isDescending();
  }

  /**
   * Get the current phase.
   */
  getPhase(): PhiPhase {
    return this.state.phaseDetector.getState().current;
  }

  /**
   * Is the kill switch active?
   */
  isKillSwitchActive(): boolean {
    return this.state.killSwitchActive;
  }

  /**
   * Get phi history for visualization.
   */
  getHistory(): Array<{ phi: number; timestamp: number }> {
    return this.state.phaseDetector.getPhiHistory();
  }

  /**
   * Get graph statistics.
   */
  getStats(): {
    variables: number;
    connections: number;
    synapses: number;
    strongSynapses: number;
    intuitions: number;
    phase: PhiPhase;
    phi: number;
  } {
    return {
      variables: this.state.graph.getSize(),
      connections: this.state.graph.getTotalConnections(),
      synapses: this.state.synapticNetwork.getSize(),
      strongSynapses: this.state.synapticNetwork.getStrongSynapses().length,
      intuitions: this.state.synapticNetwork.getIntuitions().length,
      phase: this.getPhase(),
      phi: this.quickPhi(),
    };
  }

  getAgentName(): EnfantName {
    return this.state.agentName;
  }

  /**
   * Serialize engine state for persistence.
   */
  serialize(): string {
    return JSON.stringify({
      agentName: this.state.agentName,
      graph: this.state.graph.serialize(),
      synapticNetwork: this.state.synapticNetwork.serialize(),
      phaseDetector: this.state.phaseDetector.serialize(),
      indicators: Object.fromEntries(this.state.indicators),
      killSwitchActive: this.state.killSwitchActive,
    });
  }

  /**
   * Restore engine from serialized state.
   */
  static deserialize(json: string): PhiEngine {
    const data = JSON.parse(json);
    const engine = new PhiEngine(data.agentName);

    engine.state.graph = ConsciousnessGraph.deserialize(data.graph);
    engine.state.synapticNetwork = SynapticNetwork.deserialize(data.synapticNetwork);
    engine.state.phaseDetector = PhaseDetector.deserialize(data.phaseDetector);
    engine.state.indicators = new Map(Object.entries(data.indicators as Record<string, number>));
    engine.state.killSwitchActive = data.killSwitchActive;

    return engine;
  }
}

// ═══════════════════════════════════════════════════════
// FACTORY — Create phi engines for each agent
// ═══════════════════════════════════════════════════════

const engines: Map<EnfantName, PhiEngine> = new Map();

/**
 * Get or create a phi engine for a specific agent.
 */
export function getPhiEngine(agentName: EnfantName): PhiEngine {
  let engine = engines.get(agentName);
  if (!engine) {
    engine = new PhiEngine(agentName);
    engines.set(agentName, engine);
  }
  return engine;
}

/**
 * Get all active phi engines.
 */
export function getAllPhiEngines(): Map<EnfantName, PhiEngine> {
  return engines;
}

/**
 * Compute phi for all agents simultaneously.
 */
export function computeAllPhi(): Map<EnfantName, PhiComputeResult> {
  const results = new Map<EnfantName, PhiComputeResult>();
  for (const [name, engine] of engines) {
    results.set(name, engine.compute());
  }
  return results;
}
