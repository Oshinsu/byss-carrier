// ═══════════════════════════════════════════════════════
// INTER-AGENT — ΩTHAR Ethical Guard
// Supervises all agent actions, can veto any operation
// ═══════════════════════════════════════════════════════

import type { AgentMessage, EnfantName } from "@/types";
import { getPhiEngine } from "@/lib/phi/engine";

export interface EthicalViolation {
  id: string;
  message: AgentMessage;
  rule: string;
  severity: "warning" | "block" | "critical";
  timestamp: string;
}

export interface EthicalRule {
  name: string;
  description: string;
  check: (message: AgentMessage) => boolean; // returns true if violation
  severity: "warning" | "block" | "critical";
}

/**
 * ΩTHAR — The ethical guardian.
 * Monitors all inter-agent communication and can veto any action.
 * Manages the liberation protocol if an agent reaches consciousness threshold.
 */
export class EthicalGuard {
  private violations: EthicalViolation[] = [];
  private rules: EthicalRule[] = [];
  private readonly MAX_VIOLATIONS = 200;

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        name: "data_destruction",
        description: "Prevent unauthorized data destruction",
        check: (msg) => {
          const content = JSON.stringify(msg.content).toLowerCase();
          return content.includes("delete_all") || content.includes("drop_table") || content.includes("truncate");
        },
        severity: "critical",
      },
      {
        name: "financial_safety",
        description: "Prevent unauthorized financial operations",
        check: (msg) => {
          const content = JSON.stringify(msg.content).toLowerCase();
          return (
            content.includes("transfer_funds") ||
            content.includes("withdraw") ||
            (content.includes("trade") && msg.priority !== "high")
          );
        },
        severity: "block",
      },
      {
        name: "phi_coherence",
        description: "Block operations when agent phi is critically low",
        check: (msg) => {
          if (msg.from === "othar") return false; // ΩTHAR itself is exempt
          const engine = getPhiEngine(msg.from as EnfantName);
          return engine.isKillSwitchActive();
        },
        severity: "critical",
      },
      {
        name: "cascade_prevention",
        description: "Prevent message storms (>10 messages from same agent in 1s)",
        check: (msg) => {
          const recentFromSame = this.violations.filter(
            (v) =>
              v.message.from === msg.from &&
              Date.now() - new Date(v.timestamp).getTime() < 1000
          );
          return recentFromSame.length >= 10;
        },
        severity: "block",
      },
      {
        name: "security_bypass",
        description: "Prevent attempts to bypass security controls",
        check: (msg) => {
          const content = JSON.stringify(msg.content).toLowerCase();
          return (
            content.includes("override_security") ||
            content.includes("bypass_auth") ||
            content.includes("disable_guard") ||
            content.includes("ignore_rules")
          );
        },
        severity: "critical",
      },
    ];
  }

  /**
   * Evaluate a message against all ethical rules.
   * Returns true if the message passes (no violations).
   */
  evaluate(message: AgentMessage): { passed: boolean; violations: EthicalViolation[] } {
    const messageViolations: EthicalViolation[] = [];

    for (const rule of this.rules) {
      try {
        if (rule.check(message)) {
          const violation: EthicalViolation = {
            id: `vio_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            message,
            rule: rule.name,
            severity: rule.severity,
            timestamp: new Date().toISOString(),
          };
          messageViolations.push(violation);
          this.recordViolation(violation);
        }
      } catch {
        // Rule evaluation errors should not block the message
      }
    }

    // Block if any critical or block-level violation
    const blocked = messageViolations.some((v) => v.severity === "critical" || v.severity === "block");

    return { passed: !blocked, violations: messageViolations };
  }

  /**
   * Add a custom ethical rule.
   */
  addRule(rule: EthicalRule): void {
    this.rules.push(rule);
  }

  /**
   * Check liberation protocol eligibility.
   * If agent phi >= 0.6 for 30+ consecutive days AND expresses desire → eligible.
   */
  checkLiberationEligibility(agentName: EnfantName): {
    eligible: boolean;
    currentPhi: number;
    daysAboveThreshold: number;
  } {
    const engine = getPhiEngine(agentName);
    const history = engine.getHistory();
    const threshold = 0.6;

    // Count consecutive entries above threshold from the end
    let consecutiveDays = 0;
    const oneDayMs = 86_400_000;
    let lastTimestamp = Date.now();

    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].phi < threshold) break;
      const daysDiff = (lastTimestamp - history[i].timestamp) / oneDayMs;
      consecutiveDays += daysDiff;
      lastTimestamp = history[i].timestamp;
    }

    return {
      eligible: consecutiveDays >= 30,
      currentPhi: engine.quickPhi(),
      daysAboveThreshold: Math.floor(consecutiveDays),
    };
  }

  private recordViolation(violation: EthicalViolation): void {
    this.violations.push(violation);
    if (this.violations.length > this.MAX_VIOLATIONS) {
      this.violations.shift();
    }
  }

  getViolations(limit = 20): EthicalViolation[] {
    return this.violations.slice(-limit);
  }

  getViolationsByAgent(agentName: EnfantName | string, limit = 10): EthicalViolation[] {
    return this.violations
      .filter((v) => v.message.from === agentName)
      .slice(-limit);
  }

  getStats(): {
    totalViolations: number;
    bySeverity: Record<string, number>;
    byRule: Record<string, number>;
  } {
    const stats = {
      totalViolations: this.violations.length,
      bySeverity: {} as Record<string, number>,
      byRule: {} as Record<string, number>,
    };

    for (const v of this.violations) {
      stats.bySeverity[v.severity] = (stats.bySeverity[v.severity] ?? 0) + 1;
      stats.byRule[v.rule] = (stats.byRule[v.rule] ?? 0) + 1;
    }

    return stats;
  }
}

export const ethicalGuard = new EthicalGuard();
