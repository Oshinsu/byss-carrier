"use client";

import { motion, AnimatePresence } from "motion/react";
import { Zap, RefreshCw, FileText, Gift, CalendarDays, PenLine, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmailType = "premier_contact" | "relance" | "proposition" | "remerciement" | "invitation" | "custom";

interface EmailTypeConfig {
  key: EmailType;
  label: string;
  description: string;
  icon: typeof Zap;
}

export const EMAIL_TYPES: EmailTypeConfig[] = [
  { key: "premier_contact", label: "Premier Contact", description: "Prospection a froid \u2014 premier message", icon: Zap },
  { key: "relance", label: "Relance", description: "Follow-up apres silence", icon: RefreshCw },
  { key: "proposition", label: "Proposition", description: "Devis / offre commerciale", icon: FileText },
  { key: "remerciement", label: "Remerciement", description: "Post-meeting / post-signature", icon: Gift },
  { key: "invitation", label: "Invitation", description: "Evenement, webinar, demo", icon: CalendarDays },
  { key: "custom", label: "Custom", description: "Prompt libre \u2014 tu decides", icon: PenLine },
];

export function EmailTypeSelector({
  emailType, onTypeChange, customPrompt, onCustomPromptChange,
}: {
  emailType: EmailType;
  onTypeChange: (type: EmailType) => void;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
}) {
  return (
    <>
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
        <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <MessageSquare className="h-3.5 w-3.5" />Type d&apos;email
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EMAIL_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = emailType === type.key;
            return (
              <motion.button key={type.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onTypeChange(type.key)}
                className={cn("flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
                  isActive ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.05)]" : "border-[var(--color-border-subtle)] bg-[var(--color-bg)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)]")}>
                <Icon className={cn("h-4 w-4", isActive ? "text-cyan-400" : "text-[var(--color-text-muted)]")} />
                <span className={cn("text-xs font-medium", isActive ? "text-cyan-400" : "text-[var(--color-text)]")}>{type.label}</span>
                <span className="text-[10px] leading-tight text-[var(--color-text-muted)]">{type.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {emailType === "custom" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-400">Prompt libre</label>
              <textarea value={customPrompt} onChange={(e) => onCustomPromptChange(e.target.value)} rows={3}
                placeholder="Decris ce que tu veux. Sorel s'en charge."
                className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-cyan-500/50 focus:outline-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
