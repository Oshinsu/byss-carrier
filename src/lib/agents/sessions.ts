import { createClient } from "@/lib/supabase/server";

// ═══════════════════════════════════════════════════════
// PHASE 3B: Agent Session Persistence
// Load/save conversation state per agent for continuity.
// 24h TTL. Max 20 messages per window.
// ═══════════════════════════════════════════════════════

export interface AgentSession {
  id: string;
  agent_name: string;
  user_id: string;
  state_json: {
    messages?: Array<{ role: string; content: string }>;
    context?: Record<string, unknown>;
  };
  checkpoint_at: string;
  expires_at: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Load the most recent non-expired session for an agent + user.
 */
export async function loadSession(
  agentName: string,
  userId = "gary",
): Promise<AgentSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agent_sessions")
    .select("*")
    .eq("agent_name", agentName)
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("checkpoint_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as AgentSession;
}

/**
 * Save or update session state. Upserts on agent_name + user_id.
 * Extends expiry to 24h from now.
 */
export async function saveSession(
  agentName: string,
  state: object,
  userId = "gary",
): Promise<void> {
  const supabase = await createClient();

  // Try to find existing session
  const existing = await loadSession(agentName, userId);

  if (existing) {
    await supabase
      .from("agent_sessions")
      .update({
        state_json: state,
        checkpoint_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("agent_sessions").insert({
      agent_name: agentName,
      user_id: userId,
      state_json: state,
      checkpoint_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }
}

/**
 * Build a message array from an existing session + a new user message.
 * Trims to maxMessages (sliding window), preserving the system message.
 */
export function buildMessagesFromSession(
  session: AgentSession | null,
  newMessage: string,
  maxMessages = 20,
): Message[] {
  const messages: Message[] = [];

  // Restore previous messages from session
  if (session?.state_json?.messages) {
    for (const msg of session.state_json.messages) {
      messages.push({
        role: msg.role as Message["role"],
        content: msg.content,
      });
    }
  }

  // Append the new user message
  messages.push({ role: "user", content: newMessage });

  // Sliding window: keep the last N messages
  if (messages.length > maxMessages) {
    return messages.slice(-maxMessages);
  }

  return messages;
}
