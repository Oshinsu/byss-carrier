"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShortcutDef } from "@/hooks/use-keyboard-shortcuts";

// ═══════════════════════════════════════════════
// BYSS GROUP — Shortcuts Cheat Sheet
// Full-screen glass modal. Dense. Fast reference.
// ═══════════════════════════════════════════════

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
  shortcuts: ShortcutDef[];
}

function KbdKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-[24px] items-center justify-center rounded-[4px] px-1.5",
        "border border-[var(--color-border)] bg-[var(--color-surface-raised)]",
        "font-mono text-[11px] font-medium text-[var(--color-gold)]",
        "shadow-[0_1px_0_1px_oklch(0_0_0/0.4)]"
      )}
    >
      {children}
    </kbd>
  );
}

function formatKeyCombo(shortcut: ShortcutDef) {
  const parts: React.ReactNode[] = [];

  if (shortcut.meta) {
    parts.push(<KbdKey key="meta">{"\u2318"}</KbdKey>);
    parts.push(
      <span key="plus" className="mx-0.5 text-[10px] text-[var(--color-text-muted)]">
        +
      </span>
    );
  }

  if (shortcut.shift) {
    parts.push(<KbdKey key="shift">{"\u21E7"}</KbdKey>);
    parts.push(
      <span key="plus2" className="mx-0.5 text-[10px] text-[var(--color-text-muted)]">
        +
      </span>
    );
  }

  const displayKey =
    shortcut.key === "Escape"
      ? "Esc"
      : shortcut.key === "?"
        ? "?"
        : shortcut.key.toUpperCase();

  parts.push(<KbdKey key="key">{displayKey}</KbdKey>);

  return <span className="flex items-center gap-0">{parts}</span>;
}

export function ShortcutsModal({ open, onClose, shortcuts }: ShortcutsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const groups: Record<string, ShortcutDef[]> = {};
  for (const s of shortcuts) {
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push(s);
  }

  const groupOrder = ["Navigation", "Actions", "Systeme"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "oklch(0.05 0.01 270 / 0.85)",
            backdropFilter: "blur(20px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "w-full max-w-3xl rounded-xl border border-[var(--color-border-subtle)]",
              "bg-[var(--color-surface)] shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
                  <Keyboard className="h-4 w-4 text-[var(--color-gold)]" />
                </div>
                <h2 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
                  Raccourcis Clavier
                </h2>
                <span className="text-[10px] tracking-widest text-[var(--color-gold-muted)]">
                  BYSS EMPIRE
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
              {groupOrder.map((groupName) => {
                const items = groups[groupName];
                if (!items) return null;
                return (
                  <div
                    key={groupName}
                    className="border-r border-[var(--color-border-subtle)] p-5 last:border-r-0"
                  >
                    <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-muted)]">
                      {groupName === "Systeme" ? "Systeme" : groupName}
                    </h3>
                    <div className="space-y-2">
                      {items.map((s) => (
                        <div
                          key={s.key + (s.meta ? "-meta" : "")}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {s.label}
                          </span>
                          {formatKeyCombo(s)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--color-border-subtle)] px-6 py-3">
              <p className="text-center text-[10px] text-[var(--color-text-muted)]">
                Appuyez sur <KbdKey>Esc</KbdKey> ou <KbdKey>?</KbdKey> pour fermer
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
