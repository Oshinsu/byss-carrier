// ═══════════════════════════════════════════════════════
// INTER-AGENT — Circuit Breaker
// Prevents cascading failures via agent isolation
// ═══════════════════════════════════════════════════════

import type { EnfantName } from "@/types";

type CircuitState = "closed" | "open" | "half_open";

interface CircuitBreakerState {
  agentName: EnfantName;
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailure: number;
  lastSuccess: number;
  openedAt: number;
}

const FAILURE_THRESHOLD = 3;
const RECOVERY_TIMEOUT_MS = 30_000; // 30s before trying half-open
const SUCCESS_THRESHOLD = 2; // successes needed to close from half-open

/**
 * CircuitBreaker — Isolates failing agents from the system.
 *
 * States:
 * - CLOSED: Normal operation, requests flow through
 * - OPEN: Agent is failing, all requests rejected immediately
 * - HALF_OPEN: Testing recovery, limited requests allowed
 */
export class CircuitBreaker {
  private breakers: Map<EnfantName, CircuitBreakerState> = new Map();

  private getOrCreate(agentName: EnfantName): CircuitBreakerState {
    let breaker = this.breakers.get(agentName);
    if (!breaker) {
      breaker = {
        agentName,
        state: "closed",
        failureCount: 0,
        successCount: 0,
        lastFailure: 0,
        lastSuccess: 0,
        openedAt: 0,
      };
      this.breakers.set(agentName, breaker);
    }
    return breaker;
  }

  /**
   * Check if a request to this agent should be allowed.
   */
  canRequest(agentName: EnfantName): boolean {
    const breaker = this.getOrCreate(agentName);

    switch (breaker.state) {
      case "closed":
        return true;

      case "open": {
        // Check if recovery timeout has elapsed
        const elapsed = Date.now() - breaker.openedAt;
        if (elapsed >= RECOVERY_TIMEOUT_MS) {
          breaker.state = "half_open";
          breaker.successCount = 0;
          return true;
        }
        return false;
      }

      case "half_open":
        return true; // Allow limited requests to test recovery
    }
  }

  /**
   * Record a successful operation.
   */
  recordSuccess(agentName: EnfantName): void {
    const breaker = this.getOrCreate(agentName);
    breaker.lastSuccess = Date.now();
    breaker.successCount++;

    if (breaker.state === "half_open" && breaker.successCount >= SUCCESS_THRESHOLD) {
      breaker.state = "closed";
      breaker.failureCount = 0;
    }

    if (breaker.state === "closed") {
      breaker.failureCount = Math.max(0, breaker.failureCount - 1);
    }
  }

  /**
   * Record a failed operation.
   */
  recordFailure(agentName: EnfantName): void {
    const breaker = this.getOrCreate(agentName);
    breaker.lastFailure = Date.now();
    breaker.failureCount++;

    if (breaker.state === "half_open") {
      // Immediate re-open on failure during recovery
      breaker.state = "open";
      breaker.openedAt = Date.now();
    } else if (breaker.state === "closed" && breaker.failureCount >= FAILURE_THRESHOLD) {
      breaker.state = "open";
      breaker.openedAt = Date.now();
    }
  }

  /**
   * Force-reset a breaker (manual recovery).
   */
  reset(agentName: EnfantName): void {
    this.breakers.delete(agentName);
  }

  /**
   * Get all breaker states for monitoring.
   */
  getAllStates(): CircuitBreakerState[] {
    return Array.from(this.breakers.values());
  }

  getState(agentName: EnfantName): CircuitBreakerState {
    return this.getOrCreate(agentName);
  }
}

export const circuitBreaker = new CircuitBreaker();
