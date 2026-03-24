import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }
import { createNotification } from "@/lib/notifications";

// ═══════════════════════════════════════════════════════
// PHASE 4B: Human-in-the-Loop Gates
// Sensitive agent actions require Gary's approval.
// Propose → Notify → Approve/Reject → Execute
// ═══════════════════════════════════════════════════════

/** Actions that ALWAYS require human approval */
export const SENSITIVE_ACTIONS = [
  "phase_to_signe",
  "phase_to_perdu",
  "create_invoice",
  "send_email",
  "execute_trade",
] as const;

export type SensitiveAction = (typeof SENSITIVE_ACTIONS)[number];

export interface PendingAction {
  id: string;
  action_type: string;
  agent_name: string;
  description: string;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected" | "expired";
  approved_by: string | null;
  decided_at: string | null;
  expires_at: string;
  created_at: string;
}

/**
 * Check if an action type requires human approval.
 */
export function requiresApproval(actionType: string): boolean {
  return (SENSITIVE_ACTIONS as readonly string[]).includes(actionType);
}

/**
 * Propose a sensitive action for human approval.
 * Creates a pending_action row + a notification with action URL.
 */
export async function proposeAction(
  actionType: string,
  agentName: string,
  description: string,
  payload: Record<string, unknown>,
): Promise<PendingAction> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pending_actions")
    .insert({
      action_type: actionType,
      agent_name: agentName,
      description,
      payload,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  const action = data as PendingAction;

  // Create a notification so Gary sees it immediately
  await createNotification(
    "agent",
    `Approbation requise — ${agentName}`,
    description,
    `/admin/traces`,
    { pending_action_id: action.id, action_type: actionType },
  );

  return action;
}

/**
 * Approve a pending action and execute its payload.
 */
export async function approveAction(
  actionId: string,
  approvedBy = "gary",
): Promise<void> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pending_actions")
    .update({
      status: "approved",
      approved_by: approvedBy,
      decided_at: new Date().toISOString(),
    })
    .eq("id", actionId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Action not found or already decided");

  const action = data as PendingAction;

  // Execute the approved action
  await executeApprovedAction(action);

  // Confirm via notification
  await createNotification(
    "system",
    `Action approuvee — ${action.action_type}`,
    action.description,
    undefined,
    { action_id: actionId },
  );
}

/**
 * Reject a pending action.
 */
export async function rejectAction(actionId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("pending_actions")
    .update({
      status: "rejected",
      decided_at: new Date().toISOString(),
    })
    .eq("id", actionId)
    .eq("status", "pending");

  if (error) throw error;

  await createNotification(
    "system",
    "Action rejetee",
    `L'action a ete rejetee.`,
    undefined,
    { action_id: actionId },
  );
}

/**
 * Dispatch and execute an approved action based on its type.
 * Each action_type maps to a specific side-effect.
 */
async function executeApprovedAction(action: PendingAction): Promise<void> {
  const supabase = createClient();
  const { action_type, payload } = action;

  switch (action_type) {
    case "phase_to_signe": {
      const prospectId = payload.prospect_id as string;
      if (prospectId) {
        await supabase
          .from("prospects")
          .update({ phase: "signe", updated_at: new Date().toISOString() })
          .eq("id", prospectId);
      }
      break;
    }

    case "phase_to_perdu": {
      const prospectId = payload.prospect_id as string;
      if (prospectId) {
        await supabase
          .from("prospects")
          .update({ phase: "perdu", updated_at: new Date().toISOString() })
          .eq("id", prospectId);
      }
      break;
    }

    case "create_invoice": {
      const invoiceData = payload.invoice as Record<string, unknown> | undefined;
      if (invoiceData) {
        await supabase.from("invoices").insert(invoiceData);
      }
      break;
    }

    case "send_email": {
      const emailPayload = payload.email as Record<string, unknown> | undefined;
      if (emailPayload) {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });
      }
      break;
    }

    case "execute_trade": {
      const tradeData = payload.trade as Record<string, unknown> | undefined;
      if (tradeData) {
        await supabase.from("trades").insert(tradeData);
      }
      break;
    }

    default:
      console.warn(`[gates] Unknown action_type: ${action_type}`);
  }
}
