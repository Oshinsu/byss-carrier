"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  Mail,
  Send,
  Copy,
  Check,
  Sparkles,
  Clock,
  ChevronDown,
  RefreshCw,
  FileText,
  User,
  Zap,
  MessageSquare,
  Gift,
  CalendarDays,
  PenLine,
  Trash2,
  ExternalLink,
  Flame,
  Snowflake,
  TrendingUp,
  Building,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { useSupabase } from "@/hooks/use-supabase";
import { onEmailSent } from "@/lib/synergies";
import type { Prospect, Interaction } from "@/types";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Email Composer v2
   Sorel-powered contextual email generator
   MODE_CADIFOR — Bible de Vente — Full prospect context
   ═══════════════════════════════════════════════════════ */

/* ── Types ──────────────────────────────────────────── */
type EmailType =
  | "premier_contact"
  | "relance"
  | "proposition"
  | "remerciement"
  | "invitation"
  | "custom";

interface EmailTypeConfig {
  key: EmailType;
  label: string;
  description: string;
  icon: typeof Mail;
}

interface GeneratedEmail {
  id: string;
  subject: string;
  body: string;
  prospect_name: string;
  email_type: EmailType;
  timestamp: string;
}

interface BibleEntry {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  tags: string[];
}

/* ── Email Type Config ──────────────────────────────── */
const EMAIL_TYPES: EmailTypeConfig[] = [
  {
    key: "premier_contact",
    label: "Premier Contact",
    description: "Prospection a froid — premier message",
    icon: Zap,
  },
  {
    key: "relance",
    label: "Relance",
    description: "Follow-up apres silence",
    icon: RefreshCw,
  },
  {
    key: "proposition",
    label: "Proposition",
    description: "Devis / offre commerciale",
    icon: FileText,
  },
  {
    key: "remerciement",
    label: "Remerciement",
    description: "Post-meeting / post-signature",
    icon: Gift,
  },
  {
    key: "invitation",
    label: "Invitation",
    description: "Evenement, webinar, demo",
    icon: CalendarDays,
  },
  {
    key: "custom",
    label: "Custom",
    description: "Prompt libre — tu decides",
    icon: PenLine,
  },
];

/* ── Pricing Labels ─────────────────────────────────── */
const PRICING_LABELS: Record<string, { label: string; color: string }> = {
  essentiel: { label: "Essentiel", color: "text-blue-400" },
  croissance: { label: "Croissance", color: "text-cyan-400" },
  domination: { label: "Domination", color: "text-fuchsia-400" },
};

/* ── Phase Labels ───────────────────────────────────── */
const PHASE_COLORS: Record<string, string> = {
  prospect: "bg-gray-500/20 text-gray-400",
  contacte: "bg-blue-500/20 text-blue-400",
  rdv: "bg-cyan-500/20 text-cyan-400",
  demo: "bg-violet-500/20 text-violet-400",
  proposition: "bg-amber-500/20 text-amber-400",
  negociation: "bg-orange-500/20 text-orange-400",
  signe: "bg-emerald-500/20 text-emerald-400",
  perdu: "bg-red-500/20 text-red-400",
  inactif: "bg-gray-500/20 text-gray-500",
};

/* ── LocalStorage key ───────────────────────────────── */
const HISTORY_KEY = "byss-email-history";

function loadHistory(): GeneratedEmail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(emails: GeneratedEmail[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(emails.slice(0, 10)));
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function EmailComposerPage() {
  const supabase = useSupabase();

  /* ── Supabase data ── */
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [bibleEntries, setBibleEntries] = useState<BibleEntry[]>([]);
  const [loadingProspects, setLoadingProspects] = useState(true);
  const [loadingInteractions, setLoadingInteractions] = useState(false);

  /* ── Local state ── */
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [emailType, setEmailType] = useState<EmailType>("premier_contact");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  /* ── Generated email state ── */
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, copy] = useCopyToClipboard();

  /* ── History ── */
  const [emailHistory, setEmailHistory] = useState<GeneratedEmail[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ── AI usage stats ── */
  const [aiUsage, setAiUsage] = useState<{ inputTokens: number; outputTokens: number } | null>(null);

  /* ── Load history on mount ── */
  useEffect(() => {
    setEmailHistory(loadHistory());
  }, []);

  /* ── Fetch prospects ── */
  useEffect(() => {
    (async () => {
      setLoadingProspects(true);
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("name");
      if (!error && data) {
        setProspects(data as Prospect[]);
        if (data.length > 0 && !selectedProspect) {
          setSelectedProspect(data[0] as Prospect);
        }
      }
      setLoadingProspects(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  /* ── Fetch interactions when prospect changes ── */
  const loadInteractions = useCallback(
    async (prospectId: string) => {
      setLoadingInteractions(true);
      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (!error && data) {
        setInteractions(data as Interaction[]);
      } else {
        setInteractions([]);
      }
      setLoadingInteractions(false);
    },
    [supabase]
  );

  useEffect(() => {
    if (selectedProspect?.id) {
      loadInteractions(selectedProspect.id);
    }
  }, [selectedProspect?.id, loadInteractions]);

  /* ── Fetch bible entries (relevant to prospect sector) ── */
  const loadBibleContext = useCallback(
    async (sector: string | null) => {
      let query = supabase
        .from("lore_entries")
        .select("id, title, content, category, tags")
        .eq("universe", "bible")
        .limit(15);

      // If sector known, try to match relevant categories
      if (sector) {
        query = supabase
          .from("lore_entries")
          .select("id, title, content, category, tags")
          .eq("universe", "bible")
          .limit(15);
      }

      const { data, error } = await query;
      if (!error && data) {
        setBibleEntries(data as BibleEntry[]);
      }
    },
    [supabase]
  );

  useEffect(() => {
    loadBibleContext(selectedProspect?.sector ?? null);
  }, [selectedProspect?.sector, loadBibleContext]);

  /* ── Prospect change handler ── */
  const handleProspectChange = (id: string) => {
    const p = prospects.find((p) => p.id === id);
    if (p) {
      setSelectedProspect(p);
      setHasGenerated(false);
      setEditSubject("");
      setEditBody("");
      setAiUsage(null);
      setSendResult(null);
    }
  };

  /* ── Email type change ── */
  const handleTypeChange = (type: EmailType) => {
    setEmailType(type);
    setHasGenerated(false);
    setEditSubject("");
    setEditBody("");
    setAiUsage(null);
    setSendResult(null);
  };

  /* ── INVOQUER SOREL ── */
  const handleGenerate = async () => {
    if (!selectedProspect) return;
    setGenerating(true);
    setAiUsage(null);
    setSendResult(null);

    try {
      // Build bible context string
      const bibleContext = bibleEntries
        .filter((e) => e.content)
        .map((e) => `[${e.category || "general"}] ${e.title}: ${(e.content || "").slice(0, 500)}`)
        .join("\n")
        .slice(0, 6000);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft_email",
          context: {
            prospect: selectedProspect,
            emailType,
            bibleContext,
            history: interactions,
            customPrompt: emailType === "custom" ? customPrompt : "",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.usage) {
          setAiUsage(data.usage);
        }

        const resultText = data.result || "";
        try {
          const parsed = JSON.parse(resultText);
          setEditSubject(parsed.subject || "");
          setEditBody(parsed.body || "");
          setHasGenerated(true);

          // Save to history
          const newEmail: GeneratedEmail = {
            id: crypto.randomUUID(),
            subject: parsed.subject || "",
            body: parsed.body || "",
            prospect_name: selectedProspect.name,
            email_type: emailType,
            timestamp: new Date().toISOString(),
          };
          const updated = [newEmail, ...emailHistory].slice(0, 10);
          setEmailHistory(updated);
          saveHistory(updated);
        } catch {
          setEditSubject(`${selectedProspect.name} — BYSS GROUP`);
          setEditBody(resultText);
          setHasGenerated(true);
        }
      }
    } catch (err) {
      console.error("Sorel generation error:", err);
      setEditSubject(`${selectedProspect.name} — Transformation IA`);
      setEditBody(
        `Bonjour${selectedProspect.key_contact ? ` ${selectedProspect.key_contact.split(" ")[0]}` : ""},\n\nErreur de generation. Sorel est momentanement indisponible.\n\nReessayez dans quelques instants.`
      );
      setHasGenerated(true);
    }

    setGenerating(false);
  };

  /* ── Copy ── */
  const handleCopy = () => {
    const signature = `\n\nGary Bissol\nFondateur — BYSS GROUP SAS\nFort-de-France, Martinique`;
    copy(`Objet: ${editSubject}\n\n${editBody}${signature}`);
  };

  /* ── Send via Resend ── */
  const handleSendResend = async () => {
    if (!selectedProspect?.email || !editSubject || !editBody) return;
    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_direct",
          to: selectedProspect.email,
          subject: editSubject,
          body: editBody.replace(/\n/g, "<br/>"),
          prospectId: selectedProspect.id,
          prospectName: selectedProspect.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSendResult({ success: true, message: "Email envoye avec succes — Relance J+7 programmee" });

        // ── Synergy: Email → Calendar follow-up J+7 ──
        onEmailSent(
          selectedProspect.id,
          selectedProspect.name,
          emailType,
        );
      } else {
        setSendResult({ success: false, message: data.error || "Erreur d'envoi" });
      }
    } catch {
      setSendResult({ success: false, message: "Erreur reseau" });
    }

    setSending(false);
  };

  /* ── Load from history ── */
  const handleLoadHistory = (email: GeneratedEmail) => {
    setEditSubject(email.subject);
    setEditBody(email.body);
    setHasGenerated(true);
    setShowHistory(false);
    setSendResult(null);

    // Find matching prospect
    const match = prospects.find((p) => p.name === email.prospect_name);
    if (match) setSelectedProspect(match);

    // Set email type
    setEmailType(email.email_type);
  };

  /* ── Delete history entry ── */
  const handleDeleteHistory = (id: string) => {
    const updated = emailHistory.filter((e) => e.id !== id);
    setEmailHistory(updated);
    saveHistory(updated);
  };

  /* ── Derived ── */
  const prenom = selectedProspect?.key_contact?.split(" ")[0] ?? null;
  const pricingInfo = selectedProspect?.option_chosen
    ? PRICING_LABELS[selectedProspect.option_chosen]
    : null;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Email"
        titleAccent="Composer"
        subtitle="Generation contextuelle par Sorel — MODE_CADIFOR"
        actions={
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all",
              showHistory
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            Historique ({emailHistory.length})
          </button>
        }
      />

      {/* ── History Panel ── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]"
          >
            <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
              <h3 className="flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
                <Clock className="h-4 w-4 text-cyan-400" />
                Emails generes recemment
              </h3>
            </div>
            {emailHistory.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">
                Aucun email genere. Invoque Sorel.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {emailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--color-surface)]"
                  >
                    <button
                      onClick={() => handleLoadHistory(email)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-[var(--color-text)]">
                          {email.subject}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {email.prospect_name} &middot;{" "}
                          {new Intl.DateTimeFormat("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(email.timestamp))}
                        </p>
                      </div>
                    </button>
                    <span className="shrink-0 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                      {EMAIL_TYPES.find((t) => t.key === email.email_type)?.label ?? email.email_type}
                    </span>
                    <button
                      onClick={() => handleDeleteHistory(email.id)}
                      className="shrink-0 rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Layout ── */}
      <div className="flex gap-6">
        {/* ── Left Panel (Config) ── */}
        <div className="w-[380px] shrink-0 space-y-4">
          {/* Prospect Selector */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <User className="h-3.5 w-3.5" />
              Prospect
            </label>
            {loadingProspects ? (
              <div className="h-10 animate-pulse rounded-lg bg-[var(--color-surface-2)]" />
            ) : (
              <div className="relative">
                <select
                  value={selectedProspect?.id ?? ""}
                  onChange={(e) => handleProspectChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-2.5 pr-10 text-sm text-[var(--color-text)] transition-colors focus:border-cyan-500/50 focus:outline-none"
                >
                  {prospects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.key_contact ? `— ${p.key_contact}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              </div>
            )}

            {/* Prospect Context Card — Visual Upgrade */}
            {selectedProspect && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-4"
              >
                <div className="flex items-center gap-3">
                  {/* Sector Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Building className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
                      {selectedProspect.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {selectedProspect.sector && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">{selectedProspect.sector}</span>
                      )}
                    </div>
                  </div>
                  {/* Phase Badge */}
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                      PHASE_COLORS[selectedProspect.phase] ?? "bg-gray-500/20 text-gray-400"
                    )}
                  >
                    {selectedProspect.phase}
                  </span>
                </div>

                {/* AI Score Stars */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={cn(
                          "h-3.5 w-3.5",
                          si < (selectedProspect.score || 0)
                            ? "fill-cyan-400 text-cyan-400"
                            : "text-[var(--color-border-subtle)]"
                        )}
                      />
                    ))}
                  </div>
                  {/* AI Score Badge */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      selectedProspect.ai_score === "fire"
                        ? "bg-orange-500/20 text-orange-400"
                        : selectedProspect.ai_score === "warm"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    )}
                  >
                    {selectedProspect.ai_score === "fire" && <Flame className="h-3 w-3" />}
                    {selectedProspect.ai_score === "warm" && <TrendingUp className="h-3 w-3" />}
                    {selectedProspect.ai_score === "cold" && <Snowflake className="h-3 w-3" />}
                    {selectedProspect.ai_score ?? "cold"}
                  </span>
                  {pricingInfo && (
                    <span className={cn("text-[10px] font-medium", pricingInfo.color)}>
                      {pricingInfo.label}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[var(--color-text-muted)]">Email:</span>{" "}
                    <span className="text-[var(--color-text)]">
                      {selectedProspect.email ? "oui" : "non"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)]">Basket:</span>{" "}
                    <span className="font-medium text-cyan-400">
                      {selectedProspect.estimated_basket ? `${Number(selectedProspect.estimated_basket).toLocaleString("fr-FR")} \u20AC` : "—"}
                    </span>
                  </div>
                </div>

                {selectedProspect.pain_points && (
                  <div className="text-[11px]">
                    <span className="text-[var(--color-text-muted)]">Douleurs:</span>{" "}
                    <span className="text-cyan-400">{selectedProspect.pain_points}</span>
                  </div>
                )}

                {/* Interactions summary */}
                <div className="border-t border-[var(--color-border-subtle)] pt-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    {loadingInteractions
                      ? "Chargement..."
                      : `${interactions.length} interaction${interactions.length !== 1 ? "s" : ""}`}
                  </span>
                  {interactions.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {interactions.slice(0, 3).map((i) => (
                        <div key={i.id} className="flex items-center gap-2 text-[10px]">
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 font-medium",
                              i.direction === "outbound"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            )}
                          >
                            {i.type}
                          </span>
                          <span className="truncate text-[var(--color-text-muted)]">
                            {i.subject || i.content?.slice(0, 40) || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Email Type Selector */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
            <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <MessageSquare className="h-3.5 w-3.5" />
              Type d&apos;email
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EMAIL_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = emailType === type.key;
                return (
                  <motion.button
                    key={type.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTypeChange(type.key)}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
                      isActive
                        ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-bg)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-cyan-400" : "text-[var(--color-text-muted)]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive ? "text-cyan-400" : "text-[var(--color-text)]"
                      )}
                    >
                      {type.label}
                    </span>
                    <span className="text-[10px] leading-tight text-[var(--color-text-muted)]">
                      {type.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt (only for custom type) */}
          <AnimatePresence>
            {emailType === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Prompt libre
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    placeholder="Decris ce que tu veux. Sorel s'en charge."
                    className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INVOQUER SOREL — HERO BUTTON (AI FIRST, BIGGEST ELEMENT) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={generating || !selectedProspect}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-lg font-bold transition-all",
              "bg-gradient-to-r from-cyan-600 to-cyan-400 text-white shadow-[0_0_40px_rgba(6,182,212,0.25)]",
              "hover:shadow-[0_0_50px_rgba(0,180,216,0.35)]",
              (generating || !selectedProspect) && "opacity-60 cursor-not-allowed"
            )}
          >
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                Sorel redige...
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                INVOQUER SOREL
              </>
            )}
          </motion.button>

          {/* Relance Automatique J+7 */}
          <button
            onClick={async () => {
              const j7Prospects = prospects.filter(
                (p) => !["perdu", "inactif", "signe"].includes(p.phase) && p.email
              );
              if (j7Prospects.length === 0) return;
              for (const p of j7Prospects.slice(0, 5)) {
                try {
                  await fetch("/api/email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "send_direct",
                      to: p.email,
                      subject: `Relance — ${p.name} x BYSS GROUP`,
                      body: `Bonjour${p.key_contact ? ` ${p.key_contact.split(" ")[0]}` : ""},<br/><br/>Je reviens vers vous concernant notre echange. Avez-vous eu le temps d'y reflechir ?<br/><br/>Gary Bissol<br/>BYSS GROUP`,
                      prospectId: p.id,
                      prospectName: p.name,
                    }),
                  });
                } catch { /* continue */ }
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-cyan-500/30 hover:text-cyan-400 hover:shadow-[0_0_30px_rgba(0,180,216,0.2)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Relance Automatique J+7
          </button>

          {/* Email History Stats */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-text-muted)]">Emails generes</span>
              <span className="font-bold text-[var(--color-text)]">{emailHistory.length}</span>
            </div>
          </div>

          {/* AI Usage Stats */}
          {aiUsage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-[10px] text-[var(--color-text-muted)]"
            >
              <span className="text-cyan-400">Sorel</span> &middot;{" "}
              {aiUsage.inputTokens + aiUsage.outputTokens} tokens &middot; claude-sonnet-4-6
            </motion.div>
          )}

          {/* MODE_CADIFOR Rules */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                MODE_CADIFOR
              </span>
            </div>
            <ul className="space-y-1">
              {[
                "Compression. 15 mots max par statement.",
                'Jamais "n\'hesitez pas".',
                "5-8 lignes. Pas de monologue.",
                "Objectif = RDV physique.",
                "Phrase memorable obligatoire.",
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-[10px] text-cyan-400/70">
                  <span className="mt-0.5 text-cyan-400">+</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right Panel (Email Preview) ── */}
        <div className="flex-1 space-y-4">
          {/* Email Preview / Editor */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] overflow-hidden">
            {/* Preview header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span className="font-medium">
                  {hasGenerated ? "Email genere par Sorel" : "Apercu de l'email"}
                </span>
                {hasGenerated && (
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                    IA
                  </span>
                )}
              </div>
              {hasGenerated && (
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-muted)] transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                  >
                    <RefreshCw className={cn("h-3 w-3", generating && "animate-spin")} />
                    Regenerer
                  </motion.button>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              {!hasGenerated ? (
                /* ── Empty state — MODE_CADIFOR ── */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-4 rounded-full bg-cyan-500/10 p-5">
                    <Sparkles className="h-10 w-10 text-cyan-400" />
                  </div>
                  <p className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">
                    L&apos;email n&apos;existe pas encore.
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">
                    Selectionne un prospect. Invoque Sorel. Le mot juste arrive.
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !selectedProspect}
                    className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all hover:shadow-[0_0_40px_rgba(0,180,216,0.3)] disabled:opacity-50"
                  >
                    <Sparkles className="h-5 w-5" />
                    Invoquer Sorel
                  </button>
                </motion.div>
              ) : (
                /* ── Generated email ── */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* To field */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-[var(--color-text-muted)]">A:</span>
                    <span className="text-[var(--color-text)]">
                      {prenom ?? selectedProspect?.key_contact ?? "..."}{" "}
                      &lt;{selectedProspect?.email ?? "email non renseigne"}&gt;
                    </span>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                      Objet:
                    </label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                      Corps:
                    </label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={14}
                      className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--color-text)] transition-colors focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Signature */}
                  <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
                    <p className="text-xs font-medium text-[var(--color-text)]">Gary Bissol</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Fondateur &mdash; BYSS GROUP SAS, Fort-de-France
                    </p>
                  </div>

                  {/* Send result */}
                  <AnimatePresence>
                    {sendResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "rounded-lg border px-4 py-2.5 text-xs font-medium",
                          sendResult.success
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                        )}
                      >
                        {sendResult.success ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5" />
                            {sendResult.message}
                          </span>
                        ) : (
                          sendResult.message
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all",
                        copied
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-cyan-500/30 hover:text-[var(--color-text)]"
                      )}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copie !" : "Copier"}
                    </button>

                    <button
                      onClick={handleSendResend}
                      disabled={sending || !selectedProspect?.email}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all",
                        selectedProspect?.email
                          ? "bg-cyan-600 text-white hover:bg-cyan-500"
                          : "border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed"
                      )}
                    >
                      {sending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </motion.div>
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Envoyer via Resend
                        </>
                      )}
                    </button>

                    {emailType === "proposition" && (
                      <button
                        onClick={() => {
                          // Open prospect detail or generate PDF
                          window.open(`/fiches?prospect=${selectedProspect?.id}`, "_blank");
                        }}
                        className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-cyan-500/30 hover:text-[var(--color-text)]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Devis
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Bible de Vente Context ── */}
          {bibleEntries.length > 0 && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] overflow-hidden">
              <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  Bible de Vente — {bibleEntries.length} entree{bibleEntries.length !== 1 ? "s" : ""} chargee{bibleEntries.length !== 1 ? "s" : ""}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 p-4">
                {bibleEntries.map((entry) => (
                  <span
                    key={entry.id}
                    className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[10px] text-[var(--color-text-muted)]"
                    title={entry.content?.slice(0, 200) ?? ""}
                  >
                    {entry.category ? `${entry.category}/` : ""}
                    {entry.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Sent History Table (from Supabase interactions) ── */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] overflow-hidden">
            <div className="border-b border-[var(--color-border-subtle)] px-5 py-3">
              <h3 className="flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
                <Send className="h-4 w-4 text-cyan-400" />
                Interactions recentes
                {selectedProspect && (
                  <span className="text-xs font-normal text-[var(--color-text-muted)]">
                    &mdash; {selectedProspect.name}
                  </span>
                )}
              </h3>
            </div>
            {loadingInteractions ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-surface-2)]" />
                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-2)]" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-[var(--color-surface-2)]" />
                  </div>
                ))}
              </div>
            ) : interactions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">
                {selectedProspect
                  ? "Aucune interaction avec ce prospect."
                  : "Selectionne un prospect."}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] text-left">
                    <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Date
                    </th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Type
                    </th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Direction
                    </th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Objet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interactions.map((row, idx) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-[var(--color-border-subtle)] last:border-0 transition-colors hover:bg-[var(--color-surface)]"
                    >
                      <td className="px-5 py-2.5 text-xs text-[var(--color-text-muted)]">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "numeric",
                          month: "short",
                        }).format(new Date(row.created_at))}
                      </td>
                      <td className="px-5 py-2.5">
                        <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-5 py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-medium",
                            row.direction === "outbound"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          )}
                        >
                          {row.direction === "outbound" ? "Envoye" : "Recu"}
                        </span>
                      </td>
                      <td className="max-w-[300px] truncate px-5 py-2.5 text-xs text-[var(--color-text-muted)]">
                        {row.subject || row.content?.slice(0, 50) || "Sans objet"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
