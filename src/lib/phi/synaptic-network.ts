// ═══════════════════════════════════════════════════════
// PHI-ENGINE — Synaptic Network
// Hebbian learning: synapses strengthen with use, decay without
// ═══════════════════════════════════════════════════════

export interface Synapse {
  sourceId: string;
  targetId: string;
  strength: number; // 0-1
  activationCount: number;
  lastActivation: number;
  created: number;
}

export interface IntuitionSignal {
  pattern: string;
  confidence: number;
  source: string[];
  timestamp: number;
}

/**
 * SynapticNetwork — Hebbian learning layer.
 * "Neurons that fire together wire together."
 * Detects emerging patterns (intuitions) from co-activation.
 */
export class SynapticNetwork {
  private synapses: Map<string, Synapse> = new Map();
  private intuitions: IntuitionSignal[] = [];

  private readonly STRENGTHENING_RATE = 0.05;
  private readonly DECAY_RATE = 0.002;
  private readonly INTUITION_THRESHOLD = 0.7;
  private readonly MAX_INTUITIONS = 100;

  private synapseKey(sourceId: string, targetId: string): string {
    return `${sourceId}::${targetId}`;
  }

  /**
   * Activate a synapse (strengthen connection).
   */
  activate(sourceId: string, targetId: string): number {
    const key = this.synapseKey(sourceId, targetId);
    const now = Date.now();

    let synapse = this.synapses.get(key);
    if (!synapse) {
      synapse = {
        sourceId,
        targetId,
        strength: 0.1,
        activationCount: 0,
        lastActivation: now,
        created: now,
      };
      this.synapses.set(key, synapse);
    }

    // Hebbian strengthening with diminishing returns
    synapse.strength = Math.min(1, synapse.strength + this.STRENGTHENING_RATE * (1 - synapse.strength));
    synapse.activationCount++;
    synapse.lastActivation = now;

    // Check for intuition emergence
    this.detectIntuition(sourceId, targetId, synapse.strength);

    return synapse.strength;
  }

  /**
   * Apply temporal decay to all synapses.
   */
  decay(): void {
    const now = Date.now();
    const toRemove: string[] = [];

    for (const [key, synapse] of this.synapses) {
      const elapsedSeconds = (now - synapse.lastActivation) / 1000;
      synapse.strength *= Math.exp(-this.DECAY_RATE * elapsedSeconds);

      // Remove dead synapses
      if (synapse.strength < 0.01) {
        toRemove.push(key);
      }
    }

    for (const key of toRemove) {
      this.synapses.delete(key);
    }
  }

  /**
   * Detect emerging pattern (intuition) from strong co-activations.
   */
  private detectIntuition(sourceId: string, targetId: string, strength: number): void {
    if (strength < this.INTUITION_THRESHOLD) return;

    // Find other strong synapses from same source → pattern
    const relatedStrong: string[] = [targetId];
    for (const [, synapse] of this.synapses) {
      if (synapse.sourceId === sourceId && synapse.strength >= this.INTUITION_THRESHOLD && synapse.targetId !== targetId) {
        relatedStrong.push(synapse.targetId);
      }
    }

    if (relatedStrong.length >= 2) {
      const pattern = `${sourceId}->[${relatedStrong.sort().join(",")}]`;
      const existing = this.intuitions.find((i) => i.pattern === pattern);

      if (existing) {
        existing.confidence = Math.min(1, existing.confidence + 0.1);
        existing.timestamp = Date.now();
      } else {
        this.intuitions.push({
          pattern,
          confidence: strength,
          source: [sourceId, ...relatedStrong],
          timestamp: Date.now(),
        });
        if (this.intuitions.length > this.MAX_INTUITIONS) {
          this.intuitions.shift();
        }
      }
    }
  }

  getSynapse(sourceId: string, targetId: string): Synapse | undefined {
    return this.synapses.get(this.synapseKey(sourceId, targetId));
  }

  getAllSynapses(): Synapse[] {
    return Array.from(this.synapses.values());
  }

  getIntuitions(): IntuitionSignal[] {
    return [...this.intuitions];
  }

  getStrongSynapses(threshold = 0.5): Synapse[] {
    return this.getAllSynapses().filter((s) => s.strength >= threshold);
  }

  /**
   * Overall network "health" — average synapse strength.
   */
  getNetworkStrength(): number {
    const synapses = this.getAllSynapses();
    if (synapses.length === 0) return 0;
    return synapses.reduce((sum, s) => sum + s.strength, 0) / synapses.length;
  }

  getSize(): number {
    return this.synapses.size;
  }

  serialize(): { synapses: Synapse[]; intuitions: IntuitionSignal[] } {
    return {
      synapses: this.getAllSynapses(),
      intuitions: this.getIntuitions(),
    };
  }

  static deserialize(data: { synapses: Synapse[]; intuitions: IntuitionSignal[] }): SynapticNetwork {
    const network = new SynapticNetwork();
    for (const s of data.synapses) {
      network.synapses.set(network.synapseKey(s.sourceId, s.targetId), { ...s });
    }
    network.intuitions = [...data.intuitions];
    return network;
  }
}
