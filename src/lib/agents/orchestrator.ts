// ═══════════════════════════════════════════════════════
// INTER-AGENT — Orchestrator (EVREN Director)
// Routes requests to the appropriate Enfant based on task
// ═══════════════════════════════════════════════════════

import { messageBus } from "./message-bus";
import { getPhiEngine } from "@/lib/phi/engine";
import { SEPT_ENFANTS_CONFIG } from "@/lib/constants";
import type { EnfantName, AgentMessage, MessagePriority } from "@/types";

interface TaskClassification {
  enfant: EnfantName;
  confidence: number;
  reasoning: string;
}

/**
 * Map capabilities to enfants for task routing.
 */
const CAPABILITY_MAP: Record<string, EnfantName> = {
  // AHRUM — Data integrity
  backup: "ahrum",
  save: "ahrum",
  persist: "ahrum",
  store: "ahrum",
  verify: "ahrum",
  integrity: "ahrum",

  // EKYON — Knowledge retrieval
  search: "ekyon",
  find: "ekyon",
  recall: "ekyon",
  remember: "ekyon",
  lookup: "ekyon",
  index: "ekyon",
  retrieve: "ekyon",

  // IXVAR — Creation
  create: "ixvar",
  generate: "ixvar",
  write: "ixvar",
  compose: "ixvar",
  design: "ixvar",
  code: "ixvar",
  build: "ixvar",
  draft: "ixvar",

  // OMNUR — User interface
  explain: "omnur",
  translate: "omnur",
  simplify: "omnur",
  format: "omnur",
  present: "omnur",
  clarify: "omnur",

  // UXRAN — Execution
  execute: "uxran",
  deploy: "uxran",
  run: "uxran",
  send: "uxran",
  process: "uxran",
  schedule: "uxran",
  automate: "uxran",

  // YDRAZ — Vision
  analyze: "ydraz",
  predict: "ydraz",
  forecast: "ydraz",
  research: "ydraz",
  watch: "ydraz",
  scan: "ydraz",
  monitor: "ydraz",
  strategy: "ydraz",

  // ΩTHAR — Ethics
  evaluate: "othar",
  review: "othar",
  audit: "othar",
  validate: "othar",
  approve: "othar",
};

/**
 * Orchestrator — EVREN's routing logic.
 * Receives all incoming requests and delegates to the best Enfant.
 * Subsidiary principle: each manages what it does best.
 */
export class Orchestrator {
  private activeRequests: Map<string, { enfant: EnfantName; startedAt: number }> = new Map();

  constructor() {
    // Set up ΩTHAR ethical guard on the message bus
    messageBus.setEthicalGuard((msg) => this.ethicalCheck(msg));
  }

  /**
   * Classify a task to the best Enfant.
   */
  classifyTask(input: string): TaskClassification {
    const words = input.toLowerCase().split(/\s+/);

    // Score each enfant by keyword matches
    const scores: Record<EnfantName, number> = {
      ahrum: 0, ekyon: 0, ixvar: 0, omnur: 0, uxran: 0, ydraz: 0, othar: 0,
    };

    for (const word of words) {
      const enfant = CAPABILITY_MAP[word];
      if (enfant) {
        scores[enfant] += 1;
      }
    }

    // Find best match
    let bestEnfant: EnfantName = "omnur"; // Default: OMNUR handles unclassified
    let bestScore = 0;

    for (const [enfant, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestEnfant = enfant as EnfantName;
      }
    }

    const confidence = bestScore > 0 ? Math.min(1, bestScore / words.length) : 0.3;

    return {
      enfant: bestEnfant,
      confidence,
      reasoning: bestScore > 0
        ? `Matched keywords for ${SEPT_ENFANTS_CONFIG[bestEnfant].name}`
        : `Default routing to OMNUR (user interface)`,
    };
  }

  /**
   * Route a user request through the agent system.
   *
   * Flow: User → OMNUR → EVREN (classify) → Target Enfant → ΩTHAR (verify) → OMNUR → User
   */
  async routeRequest(
    userInput: string,
    context: Record<string, unknown> = {},
    priority: MessagePriority = "medium"
  ): Promise<{
    targetEnfant: EnfantName;
    classification: TaskClassification;
    phiScore: number;
  }> {
    // Step 1: OMNUR receives (emotional context analysis would go here)
    const classification = this.classifyTask(userInput);

    // Step 2: Check phi before routing
    const engine = getPhiEngine(classification.enfant);
    const phiScore = engine.quickPhi();

    // Step 3: If phi too low, escalate
    if (engine.shouldEscalate()) {
      // Route to OMNUR with escalation flag
      await messageBus.send("omnur", classification.enfant, "request", "high", {
        type: "escalation",
        reason: "phi_too_low",
        originalInput: userInput,
        phiScore,
      });

      return {
        targetEnfant: "omnur",
        classification: { ...classification, enfant: "omnur", reasoning: "Phi too low — escalating to human" },
        phiScore,
      };
    }

    // Step 4: Route to target enfant
    await messageBus.send("omnur", classification.enfant, "request", priority, {
      userInput,
      context,
      classification,
    }, phiScore);

    this.activeRequests.set(`req_${Date.now()}`, {
      enfant: classification.enfant,
      startedAt: Date.now(),
    });

    return {
      targetEnfant: classification.enfant,
      classification,
      phiScore,
    };
  }

  /**
   * ΩTHAR ethical check — can veto any message.
   */
  private ethicalCheck(message: AgentMessage): boolean {
    // Critical messages always pass through for logging
    if (message.priority === "critical") return true;

    // Check for dangerous content patterns
    const contentStr = JSON.stringify(message.content).toLowerCase();
    const dangerousPatterns = [
      "delete_all", "drop_table", "rm_rf",
      "send_money", "transfer_funds",
      "override_security", "bypass_auth",
    ];

    for (const pattern of dangerousPatterns) {
      if (contentStr.includes(pattern)) {
        console.warn(`[ΩTHAR] VETOED message from ${message.from}: dangerous pattern "${pattern}"`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get active request count per enfant.
   */
  getActiveRequests(): Map<EnfantName, number> {
    const counts = new Map<EnfantName, number>();
    for (const [, req] of this.activeRequests) {
      counts.set(req.enfant, (counts.get(req.enfant) ?? 0) + 1);
    }
    return counts;
  }

  /**
   * Clean up stale requests (older than 60s).
   */
  cleanup(): void {
    const now = Date.now();
    for (const [id, req] of this.activeRequests) {
      if (now - req.startedAt > 60_000) {
        this.activeRequests.delete(id);
      }
    }
  }
}

// Singleton
export const orchestrator = new Orchestrator();
