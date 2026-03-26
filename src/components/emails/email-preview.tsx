"use client";

import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, Copy, Check, Sparkles, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prospect } from "@/types";

export function EmailPreview({
  hasGenerated, generating, editSubject, editBody, selectedProspect,
  copied, sending, sendResult, emailType, aiUsage,
  onSubjectChange, onBodyChange, onGenerate, onCopy, onSend, onOpenDevis,
}: {
  hasGenerated: boolean;
  generating: boolean;
  editSubject: string;
  editBody: string;
  selectedProspect: Prospect | null;
  copied: boolean;
  sending: boolean;
  sendResult: { success: boolean; message: string } | null;
  emailType: string;
  aiUsage: { inputTokens: number; outputTokens: number } | null;
  onSubjectChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onSend: () => void;
  onOpenDevis: () => void;
}) {
  const prenom = selectedProspect?.key_contact?.split(" ")[0] ?? null;

  return (
    <div className="flex-1 space-y-4">
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Mail className="h-4 w-4 text-cyan-400" />
            <span className="font-medium">{hasGenerated ? "Email genere par Sorel" : "Apercu de l'email"}</span>
            {hasGenerated && <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">IA</span>}
          </div>
          {hasGenerated && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onGenerate} disabled={generating}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-muted)] transition-colors hover:border-cyan-500/30 hover:text-cyan-400">
              <RefreshCw className={cn("h-3 w-3", generating && "animate-spin")} />Regenerer
            </motion.button>
          )}
        </div>

        <div className="p-5 space-y-4">
          {!hasGenerated ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-cyan-500/10 p-5"><Sparkles className="h-10 w-10 text-cyan-400" /></div>
              <p className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">L&apos;email n&apos;existe pas encore.</p>
              <p className="mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">Selectionne un prospect. Invoque Sorel. Le mot juste arrive.</p>
              <button onClick={onGenerate} disabled={generating || !selectedProspect}
                className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all hover:shadow-[0_0_40px_rgba(0,180,216,0.3)] disabled:opacity-50">
                <Sparkles className="h-5 w-5" />Invoquer Sorel
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-[var(--color-text-muted)]">A:</span>
                <span className="text-[var(--color-text)]">{prenom ?? selectedProspect?.key_contact ?? "..."} &lt;{selectedProspect?.email ?? "email non renseigne"}&gt;</span>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Objet:</label>
                <input type="text" value={editSubject} onChange={(e) => onSubjectChange(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors focus:border-cyan-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Corps:</label>
                <textarea value={editBody} onChange={(e) => onBodyChange(e.target.value)} rows={14}
                  className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--color-text)] transition-colors focus:border-cyan-500/50 focus:outline-none" />
              </div>
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
                <p className="text-xs font-medium text-[var(--color-text)]">Gary Bissol</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Fondateur &mdash; BYSS GROUP SAS, Fort-de-France</p>
              </div>

              <AnimatePresence>
                {sendResult && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={cn("rounded-lg border px-4 py-2.5 text-xs font-medium",
                      sendResult.success ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400")}>
                    {sendResult.success ? <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5" />{sendResult.message}</span> : sendResult.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <button onClick={onCopy}
                  className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all",
                    copied ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-cyan-500/30 hover:text-[var(--color-text)]")}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copie !" : "Copier"}
                </button>
                <button onClick={onSend} disabled={sending || !selectedProspect?.email}
                  className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all",
                    selectedProspect?.email ? "bg-cyan-600 text-white hover:bg-cyan-500" : "border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed")}>
                  {sending ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Send className="h-3.5 w-3.5" /></motion.div>Envoi...</> : <><Send className="h-3.5 w-3.5" />Envoyer via Resend</>}
                </button>
                {emailType === "proposition" && (
                  <button onClick={onOpenDevis}
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-cyan-500/30 hover:text-[var(--color-text)]">
                    <ExternalLink className="h-3.5 w-3.5" />Devis
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {aiUsage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="text-cyan-400">Sorel</span> &middot; {aiUsage.inputTokens + aiUsage.outputTokens} tokens &middot; claude-sonnet-4-6
        </motion.div>
      )}
    </div>
  );
}
