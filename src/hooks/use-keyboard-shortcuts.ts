"use client";

import { useEffect, useCallback, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// ═══════════════════════════════════════════════
// BYSS GROUP — Global Keyboard Shortcuts
// Power-user navigation. Fast. No friction.
// ═══════════════════════════════════════════════

export interface ShortcutDef {
  key: string;
  meta?: boolean;
  shift?: boolean;
  label: string;
  group: "Navigation" | "Actions" | "Systeme";
  action: () => void;
}

interface UseKeyboardShortcutsOptions {
  router: AppRouterInstance;
  onCommandBar?: () => void;
  onNewProspect?: () => void;
  onEmailComposer?: () => void;
  onNewInvoice?: () => void;
  onFocusSearch?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts({
  router,
  onCommandBar,
  onNewProspect,
  onEmailComposer,
  onNewInvoice,
  onFocusSearch,
  onCloseModal,
}: UseKeyboardShortcutsOptions) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const shortcuts: ShortcutDef[] = [
    // ── Navigation ──
    {
      key: "k",
      meta: true,
      label: "Command Bar",
      group: "Systeme",
      action: () => onCommandBar?.(),
    },
    {
      key: "1",
      meta: true,
      label: "Dashboard",
      group: "Navigation",
      action: () => router.push("/"),
    },
    {
      key: "2",
      meta: true,
      label: "Pipeline",
      group: "Navigation",
      action: () => router.push("/pipeline"),
    },
    {
      key: "3",
      meta: true,
      label: "Finance",
      group: "Navigation",
      action: () => router.push("/finance"),
    },
    {
      key: "4",
      meta: true,
      label: "Village IA",
      group: "Navigation",
      action: () => router.push("/village"),
    },
    {
      key: "5",
      meta: true,
      label: "Production",
      group: "Navigation",
      action: () => router.push("/production"),
    },
    // ── Actions ──
    {
      key: "n",
      meta: true,
      label: "Nouveau prospect",
      group: "Actions",
      action: () => onNewProspect?.(),
    },
    {
      key: "e",
      meta: true,
      label: "Email composer",
      group: "Actions",
      action: () => onEmailComposer?.(),
    },
    {
      key: "i",
      meta: true,
      label: "Nouvelle facture",
      group: "Actions",
      action: () => onNewInvoice?.(),
    },
    {
      key: "f",
      meta: true,
      label: "Recherche (focus)",
      group: "Actions",
      action: () => onFocusSearch?.(),
    },
    // ── Systeme ──
    {
      key: "Escape",
      label: "Fermer modal/panel",
      group: "Systeme",
      action: () => {
        if (shortcutsOpen) {
          setShortcutsOpen(false);
        } else {
          onCloseModal?.();
        }
      },
    },
    {
      key: "?",
      label: "Raccourcis clavier",
      group: "Systeme",
      action: () => setShortcutsOpen(true),
    },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // ? key — only when not typing in an input
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !isInput) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // Escape — always works
      if (e.key === "Escape") {
        if (shortcutsOpen) {
          setShortcutsOpen(false);
        } else {
          onCloseModal?.();
        }
        return;
      }

      // Meta/Ctrl shortcuts
      if (e.metaKey || e.ctrlKey) {
        const match = shortcuts.find(
          (s) => s.meta && s.key === e.key.toLowerCase()
        );
        if (match) {
          e.preventDefault();
          match.action();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shortcutsOpen, router, onCommandBar, onNewProspect, onEmailComposer, onNewInvoice, onFocusSearch, onCloseModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts,
    shortcutsOpen,
    setShortcutsOpen,
  };
}
