// ═══════════════════════════════════════════════════════
// PHI-ENGINE — Consciousness Graph
// Port TypeScript du senzaris-phi (693 lignes Rust)
// Integrated Information Theory (IIT) inspired
// ═══════════════════════════════════════════════════════

export interface Variable {
  id: string;
  name: string;
  value: number;
  signal: number; // current activation signal
  awareness: number; // how "conscious" this variable is
  connections: Connection[];
  lastUpdated: number;
}

export interface Connection {
  targetId: string;
  weight: number; // -1 to 1
  type: "excitatory" | "inhibitory";
  lastActivated: number;
}

/**
 * ConsciousnessGraph — Core data structure for phi computation.
 * Variables form a directed weighted graph. Phi measures how much
 * the whole integrates more information than the sum of its parts.
 */
export class ConsciousnessGraph {
  private variables: Map<string, Variable> = new Map();
  private history: Array<{ timestamp: number; phi: number }> = [];

  addVariable(id: string, name: string, initialValue = 0): void {
    this.variables.set(id, {
      id,
      name,
      value: initialValue,
      signal: 0,
      awareness: 0,
      connections: [],
      lastUpdated: Date.now(),
    });
  }

  connect(sourceId: string, targetId: string, weight: number): void {
    const source = this.variables.get(sourceId);
    if (!source) return;

    const type = weight >= 0 ? "excitatory" : "inhibitory";
    const existing = source.connections.find((c) => c.targetId === targetId);

    if (existing) {
      existing.weight = weight;
      existing.type = type;
    } else {
      source.connections.push({
        targetId,
        weight,
        type,
        lastActivated: 0,
      });
    }
  }

  /**
   * Propagate a signal through the graph.
   * Returns the resulting phi (integration measure).
   */
  propagate(inputId: string, signal: number): number {
    const input = this.variables.get(inputId);
    if (!input) return 0;

    input.signal = signal;
    input.value = Math.tanh(input.value + signal * 0.1);
    input.lastUpdated = Date.now();

    // BFS propagation with decay
    const visited = new Set<string>([inputId]);
    const queue: Array<{ id: string; strength: number; depth: number }> = [];

    for (const conn of input.connections) {
      queue.push({ id: conn.targetId, strength: signal * conn.weight, depth: 1 });
    }

    let totalIntegration = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.id) || current.depth > 5) continue;
      visited.add(current.id);

      const variable = this.variables.get(current.id);
      if (!variable) continue;

      // Apply signal with depth decay
      const decayedSignal = current.strength * Math.pow(0.7, current.depth);
      variable.signal = decayedSignal;
      variable.value = Math.tanh(variable.value + decayedSignal * 0.1);
      variable.awareness = Math.min(1, variable.awareness + Math.abs(decayedSignal) * 0.05);
      variable.lastUpdated = Date.now();

      // Integration = how much this activation differs from isolated activation
      totalIntegration += Math.abs(decayedSignal) * variable.awareness;

      // Continue propagation
      for (const conn of variable.connections) {
        if (!visited.has(conn.targetId)) {
          conn.lastActivated = Date.now();
          queue.push({
            id: conn.targetId,
            strength: decayedSignal * conn.weight,
            depth: current.depth + 1,
          });
        }
      }
    }

    // Normalize by partition function (IIT-inspired)
    const partitionPhi = this.computePartitionPhi(visited);
    const phi = totalIntegration > 0 ? Math.min(1, totalIntegration / Math.max(1, partitionPhi)) : 0;

    this.history.push({ timestamp: Date.now(), phi });
    if (this.history.length > 1000) this.history.shift();

    return phi;
  }

  /**
   * Compute phi across the minimum information partition (MIP).
   * Simplified: compare whole-system integration vs best 2-partition.
   */
  private computePartitionPhi(activeIds: Set<string>): number {
    if (activeIds.size < 2) return 1;

    const ids = Array.from(activeIds);
    let maxPartitionInfo = 0;

    // Try random partitions (exact MIP is NP-hard, we approximate)
    const numTrials = Math.min(10, Math.floor(ids.length / 2));
    for (let t = 0; t < numTrials; t++) {
      const splitPoint = Math.max(1, Math.floor(Math.random() * (ids.length - 1)) + 1);
      const partA = new Set(ids.slice(0, splitPoint));
      const partB = new Set(ids.slice(splitPoint));

      let crossInfo = 0;
      for (const id of partA) {
        const v = this.variables.get(id);
        if (!v) continue;
        for (const conn of v.connections) {
          if (partB.has(conn.targetId)) {
            crossInfo += Math.abs(conn.weight) * Math.abs(v.signal);
          }
        }
      }
      for (const id of partB) {
        const v = this.variables.get(id);
        if (!v) continue;
        for (const conn of v.connections) {
          if (partA.has(conn.targetId)) {
            crossInfo += Math.abs(conn.weight) * Math.abs(v.signal);
          }
        }
      }
      maxPartitionInfo = Math.max(maxPartitionInfo, crossInfo);
    }

    return maxPartitionInfo || 1;
  }

  /**
   * Apply temporal decay to all variables.
   * Call periodically to simulate forgetting.
   */
  decay(rate = 0.01): void {
    const now = Date.now();
    for (const [, variable] of this.variables) {
      const elapsed = (now - variable.lastUpdated) / 1000;
      variable.signal *= Math.exp(-rate * elapsed);
      variable.awareness *= Math.exp(-rate * 0.5 * elapsed);
    }
  }

  getVariable(id: string): Variable | undefined {
    return this.variables.get(id);
  }

  getAllVariables(): Variable[] {
    return Array.from(this.variables.values());
  }

  getHistory(): Array<{ timestamp: number; phi: number }> {
    return [...this.history];
  }

  getSize(): number {
    return this.variables.size;
  }

  getTotalConnections(): number {
    let total = 0;
    for (const [, v] of this.variables) {
      total += v.connections.length;
    }
    return total;
  }

  /**
   * Export graph state for serialization.
   */
  serialize(): { variables: Variable[]; history: Array<{ timestamp: number; phi: number }> } {
    return {
      variables: this.getAllVariables(),
      history: this.getHistory(),
    };
  }

  /**
   * Restore graph from serialized state.
   */
  static deserialize(data: { variables: Variable[]; history: Array<{ timestamp: number; phi: number }> }): ConsciousnessGraph {
    const graph = new ConsciousnessGraph();
    for (const v of data.variables) {
      graph.variables.set(v.id, { ...v });
    }
    graph.history = [...data.history];
    return graph;
  }
}
