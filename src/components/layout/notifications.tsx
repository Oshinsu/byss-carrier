"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  AlertTriangle,
  Receipt,
  Settings,
  Bot,
  Clock,
  Users,
  CheckCheck,
  Trash2,
  X,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type {
  NotificationType,
  NotificationRow,
} from "@/lib/notifications";
import {
  markNotificationRead,
  markAllNotificationsRead,
  clearReadNotifications,
} from "@/lib/notifications";

/* ═══════════════════════════════════════════════════════
   TYPE CONFIG — icon, colors per notification type
   ═══════════════════════════════════════════════════════ */

const typeConfig: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    border: string;
    dot: string;
  }
> = {
  prospect: {
    icon: Users,
    color: "text-[#00B4D8]",
    bg: "bg-[#00B4D8]/10",
    border: "border-[#00B4D8]/20",
    dot: "bg-[#00B4D8]",
  },
  invoice: {
    icon: Receipt,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  system: {
    icon: Settings,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
  },
  agent: {
    icon: Bot,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    dot: "bg-purple-500",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
  reminder: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
};

/* ═══════════════════════════════════════════════════════
   TIME AGO — relative time display in French
   ═══════════════════════════════════════════════════════ */

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "a l'instant";
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  const weeks = Math.floor(days / 7);
  return `il y a ${weeks}sem`;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export function Notifications() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ─── Fetch notifications from Supabase ─── */
  const fetchNotifications = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setNotifications(data as NotificationRow[]);
    setLoading(false);
  }, []);

  /* ─── Initial load + Realtime subscription ─── */
  useEffect(() => {
    fetchNotifications();

    const supabase = createClient();
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as NotificationRow;
          setNotifications((prev) => [newNotif, ...prev]);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updated = payload.new as NotificationRow;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n)),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "notifications" },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  /* ─── Close on click outside ─── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* ─── Close on Escape ─── */
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ─── Actions ─── */
  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
  };

  const handleClearRead = async () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    await clearReadNotifications();
  };

  const handleClick = async (notification: NotificationRow) => {
    // Don't navigate if it has pending action buttons — user should approve/reject first
    if ((notification.metadata as Record<string, unknown>)?.pending_action_id) return;

    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
      await markNotificationRead(notification.id);
    }
    setOpen(false);
    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  /* ─── Gate: Approve / Reject pending actions ─── */
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (notification: NotificationRow) => {
    const actionId = (notification.metadata as Record<string, unknown>)?.pending_action_id as string;
    if (!actionId) return;
    setActionLoading(actionId);
    try {
      const supabase = createClient();
      await supabase
        .from("pending_actions")
        .update({
          status: "approved",
          approved_by: "gary",
          decided_at: new Date().toISOString(),
        })
        .eq("id", actionId)
        .eq("status", "pending");
      // Mark notification as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
      await markNotificationRead(notification.id);
    } catch (err) {
      console.error("[notifications] approve failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (notification: NotificationRow) => {
    const actionId = (notification.metadata as Record<string, unknown>)?.pending_action_id as string;
    if (!actionId) return;
    setActionLoading(actionId);
    try {
      const supabase = createClient();
      await supabase
        .from("pending_actions")
        .update({
          status: "rejected",
          decided_at: new Date().toISOString(),
        })
        .eq("id", actionId)
        .eq("status", "pending");
      // Mark notification as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
      await markNotificationRead(notification.id);
    } catch (err) {
      console.error("[notifications] reject failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
          "border border-[#2A2A3E] bg-[#0F0F1A] text-[#8A8A9A]",
          "hover:border-[#00B4D8]/40 hover:text-[#E0E0E8]",
          open && "border-[#00B4D8]/40 text-[#00B4D8]",
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
          >
            {unreadCount}
          </motion.div>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full z-50 mt-2 w-[400px]",
              "rounded-xl border border-[#2A2A3E] bg-[#0F0F1A]/95 backdrop-blur-xl",
              "shadow-2xl shadow-black/40",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A3E] px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[#E0E0E8]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#00B4D8]/15 px-2 py-0.5 text-[10px] font-bold text-[#00B4D8]">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-[#8A8A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#00B4D8]"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[#8A8A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#E0E0E8]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
              {loading ? (
                <div className="space-y-0">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 border-b border-[#2A2A3E]/50 px-4 py-3"
                    >
                      <div className="mt-0.5 h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[#1A1A2E]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-32 animate-pulse rounded bg-[#1A1A2E]" />
                        <div className="h-3 w-48 animate-pulse rounded bg-[#1A1A2E]" />
                        <div className="h-2.5 w-16 animate-pulse rounded bg-[#1A1A2E]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-8 w-8 text-[#2A2A3E]" />
                  <p className="mt-3 text-xs text-[#6A6A7A]">
                    Aucune notification
                  </p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const config =
                    typeConfig[notification.type] || typeConfig.system;
                  const Icon = config.icon;

                  return (
                    <motion.button
                      key={notification.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleClick(notification)}
                      className={cn(
                        "group flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-150",
                        "hover:bg-[#1A1A2E]",
                        !notification.read && "bg-[#1A1A2E]/40",
                        index < notifications.length - 1 &&
                          "border-b border-[#2A2A3E]/50",
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                          config.bg,
                          config.border,
                        )}
                      >
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[13px] font-semibold font-[family-name:var(--font-satoshi)]",
                              notification.read
                                ? "text-[#8A8A9A]"
                                : "text-[#E0E0E8]",
                            )}
                          >
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <div
                              className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full",
                                config.dot,
                              )}
                            />
                          )}
                        </div>
                        {notification.message && (
                          <p
                            className={cn(
                              "mt-0.5 text-[12px] leading-relaxed truncate",
                              notification.read
                                ? "text-[#6A6A7A]"
                                : "text-[#8A8A9A]",
                            )}
                          >
                            {notification.message}
                          </p>
                        )}
                        <span className="mt-1 block text-[10px] text-[#6A6A7A]">
                          {timeAgo(notification.created_at)}
                        </span>

                        {/* Gate: Approve / Reject buttons for pending actions */}
                        {(notification.metadata as Record<string, unknown>)?.pending_action_id &&
                          !notification.read && (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(notification);
                                }}
                                disabled={
                                  actionLoading ===
                                  ((notification.metadata as Record<string, unknown>)
                                    ?.pending_action_id as string)
                                }
                                className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                              >
                                <ShieldCheck className="h-3 w-3" />
                                Approuver
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(notification);
                                }}
                                disabled={
                                  actionLoading ===
                                  ((notification.metadata as Record<string, unknown>)
                                    ?.pending_action_id as string)
                                }
                                className="flex items-center gap-1 rounded-md bg-red-500/15 px-2.5 py-1 text-[11px] font-medium text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                              >
                                <ShieldX className="h-3 w-3" />
                                Rejeter
                              </button>
                            </div>
                          )}
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 border-t border-[#2A2A3E] px-4 py-2.5">
              {notifications.some((n) => n.read) && (
                <button
                  onClick={handleClearRead}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-[#8A8A9A] transition-colors hover:bg-[#1A1A2E] hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                  Effacer les lues
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/");
                }}
                className="rounded-md px-2 py-1.5 text-[11px] font-medium text-[#8A8A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#00B4D8]"
              >
                Voir tout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
