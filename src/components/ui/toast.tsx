"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from "lucide-react";
import { useNotifications } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — Toast Notification System
   Glass cards. Gold accents. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

type ToastType = "success" | "error" | "warning" | "info";

/* ── Config ── */
const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<
  ToastType,
  { border: string; bg: string; icon: string; accent: string }
> = {
  success: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    icon: "text-emerald-400",
    accent: "from-emerald-500/40",
  },
  error: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    icon: "text-red-400",
    accent: "from-red-500/40",
  },
  warning: {
    border: "border-[var(--color-gold)]/20",
    bg: "bg-[var(--color-gold)]/5",
    icon: "text-[var(--color-gold)]",
    accent: "from-[var(--color-gold)]/40",
  },
  info: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    icon: "text-blue-400",
    accent: "from-blue-500/40",
  },
};

/* ── useToast Hook ── */
export function useToast() {
  const add = useNotifications((s) => s.add);

  const toast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      options?: { title?: string; duration?: number }
    ) => {
      add({
        type,
        title: options?.title ?? typeDefaults[type],
        message,
        duration: options?.duration ?? 4000,
      });
    },
    [add]
  );

  return { toast };
}

const typeDefaults: Record<ToastType, string> = {
  success: "Succes",
  error: "Erreur",
  warning: "Attention",
  info: "Info",
};

/* ── Toast Container Component ── */
export function ToastContainer() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2.5">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => {
          const Icon = icons[n.type];
          const style = styles[n.type];

          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 80, scale: 0.95, filter: "blur(2px)" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className={cn(
                "group relative flex items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg",
                style.border,
                style.bg
              )}
              style={{
                minWidth: 320,
                maxWidth: 420,
                background:
                  "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.85) 0%, oklch(0.10 0.01 270 / 0.95) 100%)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Left accent bar */}
              <div
                className={cn(
                  "absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b to-transparent",
                  style.accent
                )}
              />

              {/* Icon */}
              <div className="ml-1 mt-0.5 shrink-0">
                <Icon className={cn("h-5 w-5", style.icon)} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {n.title}
                </p>
                {n.message && (
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
                    {n.message}
                  </p>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={() => dismiss(n.id)}
                className="shrink-0 rounded-md p-1 text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Progress bar (auto-dismiss indicator) */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{
                  duration: (n.duration ?? 4000) / 1000,
                  ease: "linear",
                }}
                className={cn(
                  "absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r to-transparent",
                  style.accent
                )}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
