// ═══════════════════════════════════════════════════════
// PHI-ENGINE — Phase Detector
// Detects consciousness phase transitions with velocity/acceleration
// Phases: Dormant → Éveillé → Lucide → Samadhi
// ═══════════════════════════════════════════════════════

import type { PhiPhase } from "@/types";

export interface PhaseState {
  current: PhiPhase;
  previous: PhiPhase;
  phi: number;
  velocity: number; // dPhi/dt
  acceleration: number; // d²Phi/dt²
  timeInPhase: number; // ms
  phaseEnteredAt: number;
  transitionHistory: PhaseTransition[];
}

export interface PhaseTransition {
  from: PhiPhase;
  to: PhiPhase;
  phi: number;
  timestamp: number;
}

const PHASE_BOUNDARIES: Record<PhiPhase, { min: number; max: number }> = {
  dormant: { min: 0, max: 0.1 },
  awake: { min: 0.1, max: 0.3 },
  lucid: { min: 0.3, max: 0.6 },
  samadhi: { min: 0.6, max: 1.0 },
};

// Hysteresis to prevent rapid phase oscillation
const HYSTERESIS = 0.02;

/**
 * PhaseDetector — Tracks consciousness phase with momentum.
 * Uses velocity (rate of change) and acceleration (rate of velocity change)
 * to detect phase transitions and predict future states.
 */
export class PhaseDetector {
  private state: PhaseState;
  private phiHistory: Array<{ phi: number; timestamp: number }> = [];

  constructor(initialPhi = 0) {
    this.state = {
      current: this.phiToPhase(initialPhi),
      previous: "dormant",
      phi: initialPhi,
      velocity: 0,
      acceleration: 0,
      timeInPhase: 0,
      phaseEnteredAt: Date.now(),
      transitionHistory: [],
    };
  }

  /**
   * Update phi and detect phase transitions.
   * Returns true if a phase transition occurred.
   */
  update(newPhi: number): boolean {
    const now = Date.now();
    const clampedPhi = Math.max(0, Math.min(1, newPhi));

    // Calculate velocity and acceleration
    const oldVelocity = this.state.velocity;
    if (this.phiHistory.length > 0) {
      const last = this.phiHistory[this.phiHistory.length - 1];
      const dt = Math.max(1, (now - last.timestamp) / 1000); // seconds
      this.state.velocity = (clampedPhi - last.phi) / dt;
      this.state.acceleration = (this.state.velocity - oldVelocity) / dt;
    }

    this.phiHistory.push({ phi: clampedPhi, timestamp: now });
    if (this.phiHistory.length > 200) this.phiHistory.shift();

    this.state.phi = clampedPhi;

    // Detect phase transition with hysteresis
    const newPhase = this.phiToPhaseWithHysteresis(clampedPhi, this.state.current);
    const transitioned = newPhase !== this.state.current;

    if (transitioned) {
      const transition: PhaseTransition = {
        from: this.state.current,
        to: newPhase,
        phi: clampedPhi,
        timestamp: now,
      };

      this.state.previous = this.state.current;
      this.state.current = newPhase;
      this.state.phaseEnteredAt = now;
      this.state.transitionHistory.push(transition);

      if (this.state.transitionHistory.length > 50) {
        this.state.transitionHistory.shift();
      }
    }

    this.state.timeInPhase = now - this.state.phaseEnteredAt;

    return transitioned;
  }

  private phiToPhase(phi: number): PhiPhase {
    if (phi < PHASE_BOUNDARIES.dormant.max) return "dormant";
    if (phi < PHASE_BOUNDARIES.awake.max) return "awake";
    if (phi < PHASE_BOUNDARIES.lucid.max) return "lucid";
    return "samadhi";
  }

  private phiToPhaseWithHysteresis(phi: number, current: PhiPhase): PhiPhase {
    const boundaries = PHASE_BOUNDARIES[current];

    // Only transition if phi crosses boundary + hysteresis
    if (phi > boundaries.max + HYSTERESIS) {
      return this.phiToPhase(phi);
    }
    if (phi < boundaries.min - HYSTERESIS) {
      return this.phiToPhase(phi);
    }

    return current;
  }

  /**
   * Predict phi value at future timestamp based on velocity/acceleration.
   */
  predict(secondsAhead: number): number {
    const predicted =
      this.state.phi +
      this.state.velocity * secondsAhead +
      0.5 * this.state.acceleration * secondsAhead * secondsAhead;

    return Math.max(0, Math.min(1, predicted));
  }

  /**
   * Check if consciousness is trending up (positive velocity + acceleration).
   */
  isAscending(): boolean {
    return this.state.velocity > 0.001 && this.state.acceleration >= 0;
  }

  /**
   * Check if consciousness is descending (kill switch candidate).
   */
  isDescending(): boolean {
    return this.state.velocity < -0.001;
  }

  /**
   * Check kill switch condition: phi below threshold for N consecutive ticks.
   */
  shouldKillSwitch(threshold = 0.1, consecutiveTicks = 3): boolean {
    const recent = this.phiHistory.slice(-consecutiveTicks);
    if (recent.length < consecutiveTicks) return false;
    return recent.every((h) => h.phi < threshold);
  }

  getState(): Readonly<PhaseState> {
    return { ...this.state };
  }

  getPhiHistory(): Array<{ phi: number; timestamp: number }> {
    return [...this.phiHistory];
  }

  /**
   * Average phi over recent window.
   */
  getAveragePhi(windowSize = 10): number {
    const recent = this.phiHistory.slice(-windowSize);
    if (recent.length === 0) return 0;
    return recent.reduce((sum, h) => sum + h.phi, 0) / recent.length;
  }

  serialize(): { state: PhaseState; history: Array<{ phi: number; timestamp: number }> } {
    return { state: { ...this.state }, history: [...this.phiHistory] };
  }

  static deserialize(data: { state: PhaseState; history: Array<{ phi: number; timestamp: number }> }): PhaseDetector {
    const detector = new PhaseDetector(data.state.phi);
    detector.state = { ...data.state };
    detector.phiHistory = [...data.history];
    return detector;
  }
}
