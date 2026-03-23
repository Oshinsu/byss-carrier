// ═══════════════════════════════════════════════════════
// INTER-AGENT — Message Bus
// Communication protocol between Les Sept Enfants
// ═══════════════════════════════════════════════════════

import type { AgentMessage, EnfantName, AgentName, MessagePriority, MessageType } from "@/types";

type MessageHandler = (message: AgentMessage) => void | Promise<void>;

interface Subscription {
  agentId: EnfantName | AgentName;
  handler: MessageHandler;
  filter?: { priority?: MessagePriority; type?: MessageType };
}

/**
 * MessageBus — Central nervous system for agent communication.
 * All messages flow through here. ΩTHAR can veto any message.
 */
export class MessageBus {
  private subscriptions: Subscription[] = [];
  private messageLog: AgentMessage[] = [];
  private readonly MAX_LOG_SIZE = 500;
  private messageCounter = 0;
  private ethicalGuard: ((msg: AgentMessage) => boolean) | null = null;

  /**
   * Register an ethical guard (ΩTHAR's veto function).
   */
  setEthicalGuard(guard: (msg: AgentMessage) => boolean): void {
    this.ethicalGuard = guard;
  }

  /**
   * Subscribe an agent to receive messages.
   */
  subscribe(
    agentId: EnfantName | AgentName,
    handler: MessageHandler,
    filter?: { priority?: MessagePriority; type?: MessageType }
  ): () => void {
    const sub: Subscription = { agentId, handler, filter };
    this.subscriptions.push(sub);

    // Return unsubscribe function
    return () => {
      const idx = this.subscriptions.indexOf(sub);
      if (idx >= 0) this.subscriptions.splice(idx, 1);
    };
  }

  /**
   * Send a message from one agent to another (or broadcast).
   */
  async send(
    from: EnfantName | AgentName,
    to: EnfantName | AgentName | "broadcast",
    type: MessageType,
    priority: MessagePriority,
    content: Record<string, unknown>,
    phiAtSend: number | null = null
  ): Promise<boolean> {
    const message: AgentMessage = {
      id: `msg_${++this.messageCounter}_${Date.now()}`,
      from,
      to,
      type,
      priority,
      content,
      ethical_clearance: true,
      phi_at_send: phiAtSend,
      timestamp: new Date().toISOString(),
    };

    // ΩTHAR ethical check
    if (this.ethicalGuard) {
      const cleared = this.ethicalGuard(message);
      message.ethical_clearance = cleared;
      if (!cleared) {
        this.log(message);
        return false;
      }
    }

    this.log(message);

    // Route message
    const targets = this.subscriptions.filter((sub) => {
      // Check destination match
      if (to !== "broadcast" && sub.agentId !== to) return false;

      // Check filter match
      if (sub.filter?.priority && sub.filter.priority !== priority) return false;
      if (sub.filter?.type && sub.filter.type !== type) return false;

      return true;
    });

    // For broadcasts, send to all except sender
    const broadcastTargets =
      to === "broadcast"
        ? this.subscriptions.filter((sub) => sub.agentId !== from)
        : targets;

    for (const target of broadcastTargets) {
      try {
        await target.handler(message);
      } catch (error) {
        console.error(`[MessageBus] Error delivering to ${target.agentId}:`, error);
      }
    }

    return true;
  }

  /**
   * Send a request and wait for a response.
   */
  async request(
    from: EnfantName | AgentName,
    to: EnfantName | AgentName,
    content: Record<string, unknown>,
    priority: MessagePriority = "medium",
    timeoutMs = 10000
  ): Promise<AgentMessage | null> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        unsub();
        resolve(null);
      }, timeoutMs);

      const unsub = this.subscribe(from, (response) => {
        if (response.from === to && response.type === "response") {
          clearTimeout(timer);
          unsub();
          resolve(response);
        }
      }, { type: "response" });

      this.send(from, to, "request", priority, content);
    });
  }

  private log(message: AgentMessage): void {
    this.messageLog.push(message);
    if (this.messageLog.length > this.MAX_LOG_SIZE) {
      this.messageLog.shift();
    }
  }

  getLog(limit = 50): AgentMessage[] {
    return this.messageLog.slice(-limit);
  }

  getLogByAgent(agentId: EnfantName | AgentName, limit = 20): AgentMessage[] {
    return this.messageLog
      .filter((m) => m.from === agentId || m.to === agentId)
      .slice(-limit);
  }

  getStats(): {
    totalMessages: number;
    byPriority: Record<MessagePriority, number>;
    byType: Record<MessageType, number>;
    vetoed: number;
  } {
    const stats = {
      totalMessages: this.messageLog.length,
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 } as Record<MessagePriority, number>,
      byType: { request: 0, response: 0, broadcast: 0 } as Record<MessageType, number>,
      vetoed: 0,
    };

    for (const msg of this.messageLog) {
      stats.byPriority[msg.priority]++;
      stats.byType[msg.type]++;
      if (!msg.ethical_clearance) stats.vetoed++;
    }

    return stats;
  }

  clear(): void {
    this.messageLog = [];
    this.messageCounter = 0;
  }
}

// Singleton instance
export const messageBus = new MessageBus();
