"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — PageHeader
   Title + accent word + subtitle + right-side actions.
   Clash Display. Cyan accent. Consistent page top. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

interface PageHeaderProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  titleAccent,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-[var(--color-gold)]">{titleAccent}</span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="mt-3 flex items-center gap-2 sm:mt-0">{actions}</div>
      )}
    </motion.div>
  );
}
