"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Sparkles, Clock, Zap, RefreshCw, FileText, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useSupabase } from "@/hooks/use-supabase";
import { onEmailSent } from "@/lib/synergies";
import type { Prospect, Interaction } from "@/types";
import { ProspectSelector } from "@/components/emails/prospect-selector";
import { EmailTypeSelector, type EmailType } from "@/components/emails/email-type-selector";
import { EmailPreview } from "@/components/emails/email-preview";
import { EmailHistory, type GeneratedEmail } from "@/components/emails/email-history";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Email Composer v2
   Sorel-powered contextual email generator
   ═══════════════════════════════════════════════════════ */

interface BibleEntry { id: string; title: string; content: string | null; category: string | null; tags: string[]; }

const HISTORY_KEY = "byss-email-history";
function loadHistory(): GeneratedEmail[] { if (typeof window === "undefined") return []; try { const raw = localStorage.getItem(HISTORY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
function saveHistory(emails: GeneratedEmail[]) { if (typeof window === "undefined") return; localStorage.setItem(HISTORY_KEY, JSON.stringify(emails.slice(0, 10))); }

export default function EmailComposerPage() {
  const supabase = useSupabase();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [bibleEntries, setBibleEntries] = useState<BibleEntry[]>([]);
  const [loadingProspects, setLoadingProspects] = useState(true);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [emailType, setEmailType] = useState<EmailType>("premier_contact");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, copy] = useCopyToClipboard();
  const [emailHistory, setEmailHistory] = useState<GeneratedEmail[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [aiUsage, setAiUsage] = useState<{ inputTokens: number; outputTokens: number } | null>(null);

  useEffect(() => { setEmailHistory(loadHistory()); }, []);

  useEffect(() => {
    (async () => {
      setLoadingProspects(true);
      const { data, error } = await supabase.from("prospects").select("*").order("name");
      if (!error && data) { setProspects(data as Prospect[]); if (data.length > 0 && !selectedProspect) setSelectedProspect(data[0] as Prospect); }
      setLoadingProspects(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const loadInteractions = useCallback(async (prospectId: string) => {
    setLoadingInteractions(true);
    const { data, error } = await supabase.from("interactions").select("*").eq("prospect_id", prospectId).order("created_at", { ascending: false }).limit(10);
    if (!error && data) setInteractions(data as Interaction[]); else setInteractions([]);
    setLoadingInteractions(false);
  }, [supabase]);

  useEffect(() => { if (selectedProspect?.id) loadInteractions(selectedProspect.id); }, [selectedProspect?.id, loadInteractions]);

  const loadBibleContext = useCallback(async (sector: string | null) => {
    const query = supabase.from("lore_entries").select("id, title, content, category, tags").eq("universe", "bible").limit(15);
    const { data, error } = await query;
    if (!error && data) setBibleEntries(data as BibleEntry[]);
  }, [supabase]);

  useEffect(() => { loadBibleContext(selectedProspect?.sector ?? null); }, [selectedProspect?.sector, loadBibleContext]);

  const handleProspectChange = (id: string) => {
    const p = prospects.find((p) => p.id === id);
    if (p) { setSelectedProspect(p); setHasGenerated(false); setEditSubject(""); setEditBody(""); setAiUsage(null); setSendResult(null); }
  };

  const handleTypeChange = (type: EmailType) => { setEmailType(type); setHasGenerated(false); setEditSubject(""); setEditBody(""); setAiUsage(null); setSendResult(null); };

  const handleGenerate = async () => {
    if (!selectedProspect) return;
    setGenerating(true); setAiUsage(null); setSendResult(null);
    try {
      const bibleContext = bibleEntries.filter((e) => e.content).map((e) => `[${e.category || "general"}] ${e.title}: ${(e.content || "").slice(0, 500)}`).join("\n").slice(0, 6000);
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft_email", context: { prospect: selectedProspect, emailType, bibleContext, history: interactions, customPrompt: emailType === "custom" ? customPrompt : "" } }) });
      if (res.ok) {
        const data = await res.json();
        if (data.usage) setAiUsage(data.usage);
        const resultText = data.result || "";
        try {
          const parsed = JSON.parse(resultText);
          setEditSubject(parsed.subject || ""); setEditBody(parsed.body || ""); setHasGenerated(true);
          const newEmail: GeneratedEmail = { id: crypto.randomUUID(), subject: parsed.subject || "", body: parsed.body || "", prospect_name: selectedProspect.name, email_type: emailType, timestamp: new Date().toISOString() };
          const updated = [newEmail, ...emailHistory].slice(0, 10); setEmailHistory(updated); saveHistory(updated);
        } catch { setEditSubject(`${selectedProspect.name} \u2014 BYSS GROUP`); setEditBody(resultText); setHasGenerated(true); }
      }
    } catch (err) { console.error("Sorel generation error:", err); setEditSubject(`${selectedProspect.name} \u2014 Transformation IA`);
      setEditBody(`Bonjour${selectedProspect.key_contact ? ` ${selectedProspect.key_contact.split(" ")[0]}` : ""},\n\nErreur de generation. Sorel est momentanement indisponible.\n\nReessayez dans quelques instants.`);
      setHasGenerated(true); }
    setGenerating(false);
  };

  const handleCopy = () => { const sig = `\n\nGary Bissol\nFondateur \u2014 BYSS GROUP SAS\nFort-de-France, Martinique`; copy(`Objet: ${editSubject}\n\n${editBody}${sig}`); };

  const handleSendResend = async () => {
    if (!selectedProspect?.email || !editSubject || !editBody) return;
    setSending(true); setSendResult(null);
    try {
      const res = await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_direct", to: selectedProspect.email, subject: editSubject, body: editBody.replace(/\n/g, "<br/>"), prospectId: selectedProspect.id, prospectName: selectedProspect.name }) });
      const data = await res.json();
      if (data.success) { setSendResult({ success: true, message: "Email envoye avec succes \u2014 Relance J+7 programmee" }); onEmailSent(selectedProspect.id, selectedProspect.name, emailType); }
      else { setSendResult({ success: false, message: data.error || "Erreur d'envoi" }); }
    } catch { setSendResult({ success: false, message: "Erreur reseau" }); }
    setSending(false);
  };

  const handleLoadHistory = (email: GeneratedEmail) => {
    setEditSubject(email.subject); setEditBody(email.body); setHasGenerated(true); setShowHistory(false); setSendResult(null);
    const match = prospects.find((p) => p.name === email.prospect_name); if (match) setSelectedProspect(match);
    setEmailType(email.email_type);
  };

  const handleDeleteHistory = (id: string) => { const updated = emailHistory.filter((e) => e.id !== id); setEmailHistory(updated); saveHistory(updated); };

  return (
    <div className="space-y-6">
      <PageHeader title="Email" titleAccent="Composer" subtitle="Generation contextuelle par Sorel \u2014 MODE_CADIFOR"
        actions={
          <button onClick={() => setShowHistory(!showHistory)}
            className={cn("flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all",
              showHistory ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400" : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]")}>
            <Clock className="h-3.5 w-3.5" />Historique ({emailHistory.length})
          </button>
        }
      />

      <EmailHistory show={showHistory} history={emailHistory} onLoad={handleLoadHistory} onDelete={handleDeleteHistory} />

      <div className="flex gap-6">
        <div className="w-[380px] shrink-0 space-y-4">
          <ProspectSelector prospects={prospects} selectedProspect={selectedProspect} interactions={interactions}
            loadingProspects={loadingProspects} loadingInteractions={loadingInteractions} onProspectChange={handleProspectChange} />
          <EmailTypeSelector emailType={emailType} onTypeChange={handleTypeChange} customPrompt={customPrompt} onCustomPromptChange={setCustomPrompt} />

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerate} disabled={generating || !selectedProspect}
            className={cn("flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-lg font-bold transition-all",
              "bg-gradient-to-r from-cyan-600 to-cyan-400 text-white shadow-[0_0_40px_rgba(6,182,212,0.25)]",
              "hover:shadow-[0_0_50px_rgba(0,180,216,0.35)]", (generating || !selectedProspect) && "opacity-60 cursor-not-allowed")}>
            {generating ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Sparkles className="h-6 w-6" /></motion.div>Sorel redige...</>
              : <><Sparkles className="h-6 w-6" />INVOQUER SOREL</>}
          </motion.button>

          <button onClick={async () => {
            const j7Prospects = prospects.filter((p) => !["perdu", "inactif", "signe"].includes(p.phase) && p.email);
            if (j7Prospects.length === 0) return;
            for (const p of j7Prospects.slice(0, 5)) {
              try { await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "send_direct", to: p.email, subject: `Relance \u2014 ${p.name} x BYSS GROUP`,
                  body: `Bonjour${p.key_contact ? ` ${p.key_contact.split(" ")[0]}` : ""},<br/><br/>Je reviens vers vous concernant notre echange. Avez-vous eu le temps d'y reflechir ?<br/><br/>Gary Bissol<br/>BYSS GROUP`,
                  prospectId: p.id, prospectName: p.name }) }); } catch { /* continue */ }
            }
          }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-cyan-500/30 hover:text-cyan-400 hover:shadow-[0_0_30px_rgba(0,180,216,0.2)]">
            <RefreshCw className="h-3.5 w-3.5" />Relance Automatique J+7
          </button>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-3">
            <div className="flex items-center justify-between text-xs"><span className="text-[var(--color-text-muted)]">Emails generes</span><span className="font-bold text-[var(--color-text)]">{emailHistory.length}</span></div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="mb-2 flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-cyan-400" /><span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">MODE_CADIFOR</span></div>
            <ul className="space-y-1">
              {["Compression. 15 mots max par statement.", 'Jamais "n\'hesitez pas".', "5-8 lignes. Pas de monologue.", "Objectif = RDV physique.", "Phrase memorable obligatoire."].map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-[10px] text-cyan-400/70"><span className="mt-0.5 text-cyan-400">+</span><span>{rule}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <EmailPreview hasGenerated={hasGenerated} generating={generating} editSubject={editSubject} editBody={editBody}
          selectedProspect={selectedProspect} copied={copied} sending={sending} sendResult={sendResult}
          emailType={emailType} aiUsage={aiUsage} onSubjectChange={setEditSubject} onBodyChange={setEditBody}
          onGenerate={handleGenerate} onCopy={handleCopy} onSend={handleSendResend}
          onOpenDevis={() => window.open(`/fiches?prospect=${selectedProspect?.id}`, "_blank")} />
      </div>

      {/* Bible de Vente + Interactions table remain inline as they're simple render blocks */}
      {bibleEntries.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] overflow-hidden">
          <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
              <FileText className="h-3.5 w-3.5 text-cyan-400" />Bible de Vente \u2014 {bibleEntries.length} entree{bibleEntries.length !== 1 ? "s" : ""} chargee{bibleEntries.length !== 1 ? "s" : ""}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 p-4">
            {bibleEntries.map((entry) => (
              <span key={entry.id} className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[10px] text-[var(--color-text-muted)]" title={entry.content?.slice(0, 200) ?? ""}>
                {entry.category ? `${entry.category}/` : ""}{entry.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interactions table */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] overflow-hidden">
        <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
          <h3 className="flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            <Send className="h-4 w-4 text-cyan-400" />Interactions recentes
            {selectedProspect && <span className="text-xs font-normal text-[var(--color-text-muted)]">&mdash; {selectedProspect.name}</span>}
          </h3>
        </div>
        {loadingInteractions ? (
          <div className="space-y-2 p-5">{Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4"><div className="h-4 w-16 animate-pulse rounded bg-[var(--color-surface-2)]" /><div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-2)]" /><div className="h-4 flex-1 animate-pulse rounded bg-[var(--color-surface-2)]" /></div>
          ))}</div>
        ) : interactions.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">{selectedProspect ? "Aucune interaction avec ce prospect." : "Selectionne un prospect."}</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-[var(--color-border-subtle)] text-left">
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Date</th>
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Type</th>
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Direction</th>
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Objet</th>
            </tr></thead>
            <tbody>
              {interactions.map((row, idx) => (
                <motion.tr key={row.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className="border-b border-[var(--color-border-subtle)] last:border-0 transition-colors hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-2.5 text-xs text-[var(--color-text-muted)]">{new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(row.created_at))}</td>
                  <td className="px-5 py-2.5"><span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">{row.type}</span></td>
                  <td className="px-5 py-2.5"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", row.direction === "outbound" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400")}>{row.direction === "outbound" ? "Envoye" : "Recu"}</span></td>
                  <td className="max-w-[300px] truncate px-5 py-2.5 text-xs text-[var(--color-text-muted)]">{row.subject || row.content?.slice(0, 50) || "Sans objet"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
