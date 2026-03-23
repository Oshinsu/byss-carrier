"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — TabPanel
   Horizontal tab bar. Cyan underline. Badge pills.
   Scrollable on mobile. Clash Display labels. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

interface TabPanelProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({
  tabs,
  activeTab,
  onTabChange,
  children,
  className,
}: TabPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeRect, setActiveRect] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Track the active tab indicator position
  useEffect(() => {
    const el = tabRefs.current.get(activeTab);
    const container = scrollRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setActiveRect({
        left: elRect.left - containerRect.left + container.scrollLeft,
        width: elRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tab bar */}
      <div className="relative border-b border-[var(--color-border-subtle)]">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scrollbar-none px-1"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el);
                }}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "font-[family-name:var(--font-display)]",
                  isActive
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{tab.label}</span>
                {tab.badge != null && (
                  <span
                    className={cn(
                      "ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                      isActive
                        ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                        : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Animated underline */}
          {activeRect && (
            <motion.div
              className="absolute bottom-0 h-[2px] bg-[var(--color-gold)]"
              initial={false}
              animate={{
                left: activeRect.left,
                width: activeRect.width,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </div>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
