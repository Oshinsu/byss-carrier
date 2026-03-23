"use client";

import { useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — Modal Component
   Blur backdrop. Spring physics. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── Escape key ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  /* ── Backdrop click ── */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "oklch(0 0 0 / 0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] shadow-2xl",
              sizeMap[size],
              size === "full" ? "h-full" : "max-h-[85vh]",
              className
            )}
            style={{
              background:
                "linear-gradient(180deg, oklch(0.13 0.01 270) 0%, oklch(0.10 0.01 270) 100%)",
              boxShadow:
                "0 0 40px oklch(0 0 0 / 0.5), 0 0 80px oklch(0.75 0.12 85 / 0.03)",
            }}
          >
            {/* ── Header ── */}
            {title && (
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Close button when no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {/* ── Footer ── */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border-subtle)] px-6 py-4">
                {footer}
              </div>
            )}

            {/* Top gold accent */}
            <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Utility Buttons for Modal Footer ── */
export function ModalButton({
  variant = "default",
  children,
  className,
  ...props
}: {
  variant?: "default" | "primary" | "danger";
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantStyles = {
    default:
      "border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]",
    primary:
      "bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-black font-semibold hover:shadow-[var(--shadow-gold)]",
    danger:
      "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
  };

  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 text-sm transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
