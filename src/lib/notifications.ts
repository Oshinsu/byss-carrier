import { createClient } from "@/lib/supabase/client";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Notification Helper
// Centralised notification creation for all modules
// ═══════════════════════════════════════════════════════

export type NotificationType =
  | "prospect"
  | "invoice"
  | "system"
  | "agent"
  | "alert"
  | "reminder";

export interface NotificationRow {
  id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  read: boolean;
  action_url: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

/**
 * Insert a notification into Supabase.
 * Fire-and-forget — errors are silently caught so callers are never blocked.
 */
export async function createNotification(
  type: NotificationType,
  title: string,
  message?: string,
  actionUrl?: string,
  metadata?: Record<string, unknown>,
) {
  try {
    const supabase = createClient();
    await supabase.from("notifications").insert({
      type,
      title,
      message: message ?? null,
      action_url: actionUrl ?? null,
      metadata: metadata ?? {},
    });
  } catch (err) {
    // Silent — notifications must never break the main flow
    console.error("[notifications] insert failed:", err);
  }
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(id: string) {
  const supabase = createClient();
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead() {
  const supabase = createClient();
  await supabase.from("notifications").update({ read: true }).eq("read", false);
}

/**
 * Delete all read notifications.
 */
export async function clearReadNotifications() {
  const supabase = createClient();
  await supabase.from("notifications").delete().eq("read", true);
}
