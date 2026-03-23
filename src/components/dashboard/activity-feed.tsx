"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Mail,
  FileText,
  UserPlus,
  CreditCard,
  MessageSquare,
  Zap,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ─── Types ─────────────────────────────────────────── */
type ActivityType =
  | "email"
  | "invoice"
  | "prospect"
  | "payment"
  | "message"
  | "ai"
  | "call"
  | "task";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  unread: boolean;
}

/* ─── Icon Mapping ──────────────────────────────────── */
const typeIcons: Record<ActivityType, React.ElementType> = {
  email: Mail,
  invoice: FileText,
  prospect: UserPlus,
  payment: CreditCard,
  message: MessageSquare,
  ai: Zap,
  call: Phone,
  task: CheckCircle2,
};

const typeColors: Record<ActivityType, string> = {
  email: "text-[var(--color-blue)]",
  invoice: "text-[var(--color-gold)]",
  prospect: "text-[var(--color-green)]",
  payment: "text-[var(--color-green)]",
  message: "text-[var(--color-blue)]",
  ai: "text-[var(--color-amber)]",
  call: "text-[var(--color-fire)]",
  task: "text-[var(--color-green)]",
};

/* ─── Format relative time ──────────────────────────── */
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

/* ─── Activity Feed Component ───────────────────────── */
export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        if (data && data.length > 0) {
          setActivities(
            data.map((a) => ({
              id: a.id,
              type: (Object.keys(typeIcons).includes(a.type)
                ? a.type
                : "task") as ActivityType,
              title: a.title,
              timestamp: formatRelativeTime(a.created_at),
              unread: !a.is_read,
            }))
          );
        }
      } catch (err) {
        console.error("Activity feed fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const unreadCount = activities.filter((a) => a.unread).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] transition-colors hover:border-[var(--color-gold-muted)]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-4">
        <div>
          <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
            Activite Recente
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {loading ? "..." : `${unreadCount} nouvelles`}
          </p>
        </div>
        <button className="text-xs text-[var(--color-gold-muted)] transition-colors hover:text-[var(--color-gold)]">
          Tout voir
        </button>
      </div>

      {/* Activity List */}
      <div className="max-h-[440px] overflow-y-auto">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-[var(--color-border-subtle)] px-5 py-3.5 last:border-b-0"
              >
                <div className="h-2 w-2 rounded-full bg-transparent" />
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[#1A1A2E]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#1A1A2E]" />
                  <div className="h-2.5 w-1/3 animate-pulse rounded bg-[#1A1A2E]" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-xs text-[var(--color-text-muted)]">
            Aucune activite recente
          </div>
        ) : (
          activities.map((activity, i) => {
            const Icon = typeIcons[activity.type];
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group flex cursor-pointer items-start gap-3 border-b border-[var(--color-border-subtle)] px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--color-surface-2)]"
              >
                {/* Unread indicator */}
                <div className="flex pt-1">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      activity.unread
                        ? "bg-[var(--color-gold)]"
                        : "bg-transparent"
                    )}
                  />
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]",
                    "transition-colors group-hover:bg-[var(--color-surface)]"
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", typeColors[activity.type])}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <p
                    className={cn(
                      "truncate text-sm",
                      activity.unread
                        ? "font-medium text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)]"
                    )}
                  >
                    {activity.title}
                  </p>
                  <time className="text-[11px] text-[var(--color-text-muted)]">
                    {activity.timestamp}
                  </time>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
