"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useNotifications } from "@/lib/store";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: "border-emerald-500/30 bg-emerald-500/10",
  error: "border-red-500/30 bg-red-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};

const iconColors = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export function NotificationToast() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => {
          const Icon = icons[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn("flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md", colors[n.type])}
              style={{ minWidth: 300, maxWidth: 400 }}
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColors[n.type])} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-text)]">{n.title}</p>
                {n.message && <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{n.message}</p>}
              </div>
              <button onClick={() => dismiss(n.id)} className="shrink-0 p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
