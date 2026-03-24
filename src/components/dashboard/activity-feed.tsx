"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  FileText,
  UserPlus,
  CreditCard,
  Video,
  Zap,
  TrendingUp,
  Search,
  Bot,
  Calendar,
  Landmark,
  FlaskConical,
  Gamepad2,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { NotificationType } from "@/lib/notifications";

/* ─── Types ─────────────────────────────────────────── */
type FeedEventType =
  | "prospect"
  | "invoice"
  | "system"
  | "agent"
  | "alert"
  | "reminder"
  | "email"
  | "video"
  | "marche"
  | "gulf"
  | "research"
  | "calendar"
  | "game";

interface FeedEvent {
  id: string;
  type: FeedEventType;
  title: string;
  message: string | null;
  actionUrl: string | null;
  timestamp: string;
  isNew: boolean;
  source: "notification" | "agent_log";
}

/* ─── Visual Config ───────────────────────────────────── */
const typeConfig: Record<
  FeedEventType,
  { icon: React.ElementType; color: string; borderColor: string }
> = {
  prospect: {
    icon: UserPlus,
    color: "var(--color-green)",
    borderColor: "rgba(16,185,129,0.5)",
  },
  invoice: {
    icon: FileText,
    color: "var(--color-gold)",
    borderColor: "rgba(0,180,216,0.5)",
  },
  email: {
    icon: Mail,
    color: "var(--color-blue)",
    borderColor: "rgba(59,130,246,0.5)",
  },
  video: {
    icon: Video,
    color: "#A855F7",
    borderColor: "rgba(168,85,247,0.5)",
  },
  marche: {
    icon: Landmark,
    color: "#F59E0B",
    borderColor: "rgba(245,158,11,0.5)",
  },
  gulf: {
    icon: TrendingUp,
    color: "#06B6D4",
    borderColor: "rgba(6,182,212,0.5)",
  },
  research: {
    icon: FlaskConical,
    color: "#EC4899",
    borderColor: "rgba(236,72,153,0.5)",
  },
  agent: {
    icon: Bot,
    color: "#8B5CF6",
    borderColor: "rgba(139,92,246,0.5)",
  },
  calendar: {
    icon: Calendar,
    color: "#3B82F6",
    borderColor: "rgba(59,130,246,0.5)",
  },
  system: {
    icon: Zap,
    color: "var(--color-gold)",
    borderColor: "rgba(0,180,216,0.5)",
  },
  alert: {
    icon: Bell,
    color: "var(--color-red)",
    borderColor: "rgba(239,68,68,0.5)",
  },
  reminder: {
    icon: Calendar,
    color: "#F59E0B",
    borderColor: "rgba(245,158,11,0.5)",
  },
  game: {
    icon: Gamepad2,
    color: "#10B981",
    borderColor: "rgba(16,185,129,0.5)",
  },
};

/* ─── Classify notification type to feed type ─────────── */
function classifyEvent(
  notifType: string,
  metadata?: Record<string, unknown>,
): FeedEventType {
  // Check metadata trigger for more specific classification
  const trigger = (metadata?.trigger as string) || "";
  if (trigger.startsWith("pipeline")) return "prospect";
  if (trigger.startsWith("email")) return "email";
  if (trigger.startsWith("video") || trigger.startsWith("production"))
    return "video";
  if (trigger.startsWith("tender") || trigger.startsWith("marche"))
    return "marche";
  if (trigger.startsWith("gulf")) return "gulf";
  if (trigger.startsWith("research")) return "research";
  if (trigger.startsWith("calendar")) return "calendar";
  if (trigger.startsWith("sprint") || trigger.startsWith("game"))
    return "game";
  if (trigger.startsWith("invoice") || trigger.startsWith("finance"))
    return "invoice";

  // Fallback to notification type
  const typeMap: Record<string, FeedEventType> = {
    prospect: "prospect",
    invoice: "invoice",
    system: "system",
    agent: "agent",
    alert: "alert",
    reminder: "reminder",
  };
  return typeMap[notifType] || "system";
}

/* ─── Format relative time ───────────────────────────── */
function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "a l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

/* ─── Activity Feed Component ─────────────────────────── */
export function ActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FeedEventType | "all">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial data: notifications + agent_logs
  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient();
      try {
        const [notifRes, agentRes] = await Promise.all([
          supabase
            .from("notifications")
            .select("id, type, title, message, action_url, created_at, metadata, read")
            .order("created_at", { ascending: false })
            .limit(50),
          supabase
            .from("agent_logs")
            .select("id, agent_name, action, model, success, created_at, cost_usd")
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

        const feed: FeedEvent[] = [];

        // Map notifications
        if (notifRes.data) {
          for (const n of notifRes.data) {
            feed.push({
              id: n.id,
              type: classifyEvent(n.type, n.metadata as Record<string, unknown>),
              title: n.title,
              message: n.message,
              actionUrl: n.action_url,
              timestamp: n.created_at,
              isNew: !n.read,
              source: "notification",
            });
          }
        }

        // Map agent logs
        if (agentRes.data) {
          for (const a of agentRes.data) {
            feed.push({
              id: `agent-${a.id}`,
              type: "agent",
              title: `${a.agent_name} — ${a.action}`,
              message: `${a.model} | ${a.success ? "OK" : "FAIL"} | $${(a.cost_usd ?? 0).toFixed(4)}`,
              actionUrl: "/admin/traces",
              timestamp: a.created_at,
              isNew: false,
              source: "agent_log",
            });
          }
        }

        // Sort by timestamp descending
        feed.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        setEvents(feed);
      } catch (err) {
        console.error("[activity-feed] fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // Real-time subscription on notifications table
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("activity-feed-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const n = payload.new as {
            id: string;
            type: string;
            title: string;
            message: string | null;
            action_url: string | null;
            created_at: string;
            metadata: Record<string, unknown>;
          };
          const newEvent: FeedEvent = {
            id: n.id,
            type: classifyEvent(n.type, n.metadata),
            title: n.title,
            message: n.message,
            actionUrl: n.action_url,
            timestamp: n.created_at,
            isNew: true,
            source: "notification",
          };
          setEvents((prev) => [newEvent, ...prev].slice(0, 70));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter events
  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  const newCount = events.filter((e) => e.isNew).length;

  // Filter buttons
  const filterOptions: Array<{ key: FeedEventType | "all"; label: string }> = [
    { key: "all", label: "Tout" },
    { key: "prospect", label: "Pipeline" },
    { key: "invoice", label: "Finance" },
    { key: "video", label: "Production" },
    { key: "marche", label: "Marches" },
    { key: "gulf", label: "Gulf" },
    { key: "agent", label: "Agents" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border-subtle)] transition-colors hover:border-[var(--color-gold-muted)]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="border-b border-[var(--color-border-subtle)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
              Flux Systeme
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              {loading
                ? "..."
                : `${newCount} nouvelles | ${events.length} evenements`}
            </p>
          </div>
          <div className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--color-green)]" />
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-all",
                filter === opt.key
                  ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-[var(--color-border-subtle)] px-5 py-3 last:border-b-0"
              >
                <div className="h-7 w-0.5 shrink-0 animate-pulse rounded-full bg-[#1A1A2E]" />
                <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-[#1A1A2E]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-[#1A1A2E]" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-[#1A1A2E]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-2 h-5 w-5 text-[var(--color-text-muted)]/40" />
            <p className="text-xs text-[var(--color-text-muted)]">
              Le silence avant la tempete.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredEvents.map((event, i) => {
              const config = typeConfig[event.type] || typeConfig.system;
              const Icon = config.icon;
              return (
                <motion.a
                  key={event.id}
                  href={event.actionUrl || "#"}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, delay: i < 10 ? i * 0.03 : 0 }}
                  className="group flex items-start gap-3 border-b border-[var(--color-border-subtle)] px-5 py-3 transition-colors last:border-b-0 hover:bg-[var(--color-surface-2)]"
                >
                  {/* Colored left border */}
                  <div
                    className="mt-0.5 h-7 w-0.5 shrink-0 rounded-full"
                    style={{ backgroundColor: config.borderColor }}
                  />

                  {/* Icon */}
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${config.color}12` }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: config.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <p
                      className={cn(
                        "truncate text-xs",
                        event.isNew
                          ? "font-medium text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]",
                      )}
                    >
                      {event.title}
                    </p>
                    {event.message && (
                      <p className="truncate text-[10px] text-[var(--color-text-muted)]/70">
                        {event.message}
                      </p>
                    )}
                    <time className="text-[10px] text-[var(--color-text-muted)]/50">
                      {formatRelativeTime(event.timestamp)}
                    </time>
                  </div>

                  {/* New dot */}
                  {event.isNew && (
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                  )}
                </motion.a>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
