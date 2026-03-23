"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — FilterBar
   Search + filter pills + action slot. Reusable toolbar.
   Glass panel. Cyan focus ring. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

interface FilterOption {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  actions?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filters,
  actions,
  className,
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] px-4 py-3",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.10 0.01 270 / 0.6) 0%, oklch(0.08 0.01 270 / 0.8) 100%)",
      }}
    >
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-2 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
        />
      </div>

      {/* Filter pills */}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={filter.onClick}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                "font-[family-name:var(--font-display)]",
                filter.active
                  ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)] border border-[var(--color-gold-muted)]"
                  : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-transparent hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Right-side actions */}
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </motion.div>
  );
}
