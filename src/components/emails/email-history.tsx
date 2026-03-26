"use client";

import { motion, AnimatePresence } from "motion/react";
import { Clock, Mail, Trash2 } from "lucide-react";
import { EMAIL_TYPES, type EmailType } from "./email-type-selector";

export interface GeneratedEmail {
  id: string;
  subject: string;
  body: string;
  prospect_name: string;
  email_type: EmailType;
  timestamp: string;
}

export function EmailHistory({
  show, history, onLoad, onDelete,
}: {
  show: boolean;
  history: GeneratedEmail[];
  onLoad: (email: GeneratedEmail) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]">
          <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
            <h3 className="flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
              <Clock className="h-4 w-4 text-cyan-400" />Emails generes recemment
            </h3>
          </div>
          {history.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">Aucun email genere. Invoque Sorel.</div>
          ) : (
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {history.map((email) => (
                <div key={email.id} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--color-surface)]">
                  <button onClick={() => onLoad(email)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[var(--color-text)]">{email.subject}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {email.prospect_name} &middot;{" "}
                        {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(email.timestamp))}
                      </p>
                    </div>
                  </button>
                  <span className="shrink-0 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                    {EMAIL_TYPES.find((t) => t.key === email.email_type)?.label ?? email.email_type}
                  </span>
                  <button onClick={() => onDelete(email.id)} className="shrink-0 rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
