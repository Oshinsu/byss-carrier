"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  Brain,
  Mail,
  FileText,
  Phone,
  Globe,
  Calendar,
  User,
  Building2,
  Sparkles,
  Loader2,
  Download,
  ExternalLink,
  MessageSquare,
  Video,
  PhoneCall,
  FileCheck,
  Receipt,
  StickyNote,
  ChevronDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/hooks/use-supabase";
import type { Prospect, Interaction, ProspectPhase } from "@/types";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Client Intelligence Center
   The ULTIMATE prospect detail modal — AI-first, dense, powerful
   ═══════════════════════════════════════════════════════ */

/* ── Types ──────────────────────────────────────────── */

interface Document {
  id: string;
  prospect_id: string;
  name: string;
  type: string | null;
  url: string | null;
  created_at: string;
}

interface FeedbackEntry {
  id: string;
  prospect_id: string;
  day: number;
  status: "pending" | "done" | "skipped";
  note: string | null;
  created_at: string;
}

interface ProspectDetailModalProps {
  prospect: Prospect;
  onSave: (updated: Prospect) => void;
  onClose: () => void;
}

/* ── Constants ──────────────────────────────────────── */

const PHASES: { key: ProspectPhase; label: string; color: string }[] = [
  { key: "prospect", label: "Prospect", color: "#6366F1" },
  { key: "contacte", label: "Contacte", color: "#8B5CF6" },
  { key: "rdv", label: "RDV", color: "#A855F7" },
  { key: "demo", label: "Demo", color: "#D946EF" },
  { key: "proposition", label: "Proposition", color: "#F59E0B" },
  { key: "negociation", label: "Negociation", color: "#F97316" },
  { key: "signe", label: "Signe", color: "#10B981" },
  { key: "perdu", label: "Perdu", color: "#EF4444" },
  { key: "inactif", label: "Inactif", color: "#6B7280" },
];

const AI_SCORE_CONFIG = {
  fire: { emoji: "\uD83D\uDD25", label: "Chaud", color: "text-red-400", bg: "bg-red-500/15", ring: "ring-red-500/30" },
  warm: { emoji: "\uD83D\uDFE1", label: "Tiede", color: "text-amber-400", bg: "bg-amber-500/15", ring: "ring-amber-500/30" },
  cold: { emoji: "\uD83D\uDD35", label: "Froid", color: "text-blue-400", bg: "bg-blue-500/15", ring: "ring-blue-500/30" },
};

const INTERACTION_ICONS: Record<string, typeof Mail> = {
  email: Mail,
  call: PhoneCall,
  meeting: Calendar,
  whatsapp: MessageSquare,
  note: StickyNote,
  proposal: FileCheck,
  invoice: Receipt,
  video: Video,
};

const FEEDBACK_DAYS = [1, 3, 7, 14, 30, 60, 90];

/* ── Price parser: extracts E=18K C=42K D=135K from notes ── */
function parsePricing(notes: string | null): { essentiel: string; croissance: string; domination: string } | null {
  if (!notes) return null;
  const match = notes.match(/E=(\d+[KkMm]?)\s*C=(\d+[KkMm]?)\s*D=(\d+[KkMm]?)/);
  if (!match) return null;
  const fmt = (v: string) => {
    const upper = v.toUpperCase();
    if (upper.endsWith("K")) return `${parseInt(upper)} 000`;
    if (upper.endsWith("M")) return `${parseInt(upper)} 000 000`;
    return parseInt(upper).toLocaleString("fr-FR");
  };
  return { essentiel: fmt(match[1]), croissance: fmt(match[2]), domination: fmt(match[3]) };
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export function ProspectDetailModal({ prospect, onSave, onClose }: ProspectDetailModalProps) {
  const supabase = useSupabase();

  /* ── State ── */
  const [form, setForm] = useState<Prospect>({ ...prospect });
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [aiAction, setAiAction] = useState<"analyze" | "draft_email" | "proposal" | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const notesRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  /* ── Fetch all related data ── */
  useEffect(() => {
    if (!prospect.id) return;
    setLoadingData(true);

    const fetchAll = async () => {
      const [interRes, docRes, fbRes] = await Promise.all([
        supabase
          .from("interactions")
          .select("*")
          .eq("prospect_id", prospect.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("documents")
          .select("*")
          .eq("prospect_id", prospect.id),
        supabase
          .from("feedback_timeline")
          .select("*")
          .eq("prospect_id", prospect.id),
      ]);

      if (interRes.data) setInteractions(interRes.data as Interaction[]);
      if (docRes.data) setDocuments(docRes.data as Document[]);
      if (fbRes.data) setFeedback(fbRes.data as FeedbackEntry[]);
      setLoadingData(false);
    };

    fetchAll();
  }, [prospect.id, supabase]);

  /* ── Auto-save field to Supabase ── */
  const persistField = useCallback(
    async (field: string, value: unknown) => {
      await supabase
        .from("prospects")
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq("id", prospect.id);
    },
    [supabase, prospect.id],
  );

  /* ── Form updaters ── */
  const updateField = <K extends keyof Prospect>(key: K, value: Prospect[K], persist = false) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (persist) persistField(key, value);
  };

  /* ── Notes auto-save on blur ── */
  const handleNotesBlur = () => {
    persistField("notes", form.notes);
  };

  /* ── Phase change → instant persist ── */
  const handlePhaseChange = (phase: ProspectPhase) => {
    updateField("phase", phase, true);
  };

  /* ── Score click → instant persist ── */
  const handleScoreClick = (score: number) => {
    updateField("score", score, true);
  };

  /* ── Probability change → debounced persist ── */
  const handleProbabilityChange = (value: number) => {
    setForm((prev) => ({ ...prev, probability: value }));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => persistField("probability", value), 500);
  };

  /* ── AI Actions ── */
  const handleAiAction = async (action: "analyze" | "draft_email") => {
    setAiAction(action);
    setAiLoading(true);
    setAiOutput(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: action === "analyze" ? "analyze" : "draft_email",
          data: { prospect: form },
        }),
      });
      const data = await res.json();
      setAiOutput(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
    } catch (err) {
      setAiOutput(`Erreur: ${err instanceof Error ? err.message : "Echec de la requete IA"}`);
    } finally {
      setAiLoading(false);
    }
  };

  /* ── PDF download ── */
  const handlePdfDownload = async () => {
    setPdfLoading(true);
    setAiAction("proposal");

    const pricing = parsePricing(form.notes);

    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: form.name,
          sector: form.sector ?? "Tech",
          pain: form.pain_points ?? "Pas de pain identifie",
          memorablePhrase: form.memorable_phrase ?? "",
          options: {
            essentiel: {
              price: pricing?.essentiel ?? "1 500",
              services: form.services.slice(0, 3).length > 0 ? form.services.slice(0, 3) : ["Audit IA", "1 Agent IA"],
            },
            croissance: {
              price: pricing?.croissance ?? "3 500",
              services: form.services.slice(0, 5).length > 0 ? form.services.slice(0, 5) : ["Audit IA", "3 Agents IA", "Site web"],
            },
            domination: {
              price: pricing?.domination ?? "7 500",
              services: form.services.length > 0 ? form.services : ["Pack complet", "Agents IA illimites", "Support premium"],
            },
          },
          roi: { essentiel: 120, croissance: 250, domination: 400 },
        }),
      });

      if (!res.ok) throw new Error("Echec generation PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposition-${form.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setAiOutput("PDF genere et telecharge avec succes.");
    } catch (err) {
      setAiOutput(`Erreur PDF: ${err instanceof Error ? err.message : "Echec"}`);
    } finally {
      setPdfLoading(false);
    }
  };

  /* ── Save all ── */
  const handleSave = () => {
    onSave(form);
  };

  /* ── Derived ── */
  const aiScoreInfo = AI_SCORE_CONFIG[form.ai_score ?? "cold"];
  const phaseInfo = PHASES.find((p) => p.key === form.phase) ?? PHASES[0];
  const pricing = parsePricing(form.notes);
  const isSigned = form.phase === "signe";

  return (
    <AnimatePresence>
      {/* ── Overlay ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* ── Modal ── */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] shadow-2xl lg:inset-8"
      >
        {/* ═══════════════ HEADER ═══════════════ */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Company icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-gold-glow)] ring-2 ring-[var(--color-gold)]/20">
              <Building2 className="h-5 w-5 text-[var(--color-gold)]" />
            </div>

            {/* Name + meta */}
            <div>
              <h2 className="font-[family-name:var(--font-clash-display)] text-2xl font-bold tracking-tight text-[var(--color-text)]">
                {form.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <span>{form.key_contact}</span>
                <span className="opacity-30">|</span>
                <span>{form.sector}</span>
              </div>
            </div>

            {/* Sector badge */}
            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2.5 py-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{form.sector}</span>
            </div>

            {/* Phase badge */}
            <div
              className="rounded-lg px-2.5 py-1"
              style={{ backgroundColor: `${phaseInfo.color}20`, border: `1px solid ${phaseInfo.color}40` }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: phaseInfo.color }}>
                {phaseInfo.label}
              </span>
            </div>

            {/* AI Score badge */}
            <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 ring-1", aiScoreInfo.bg, aiScoreInfo.ring)}>
              <span className="text-sm">{aiScoreInfo.emoji}</span>
              <span className={cn("text-xs font-bold", aiScoreInfo.color)}>{aiScoreInfo.label}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ═══════════════ BODY ═══════════════ */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── LEFT PANEL (55%) ── */}
          <div className="w-[55%] overflow-y-auto border-r border-[var(--color-border-subtle)] p-5">
            <div className="space-y-4">

              {/* ── Contact Card ── */}
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Contact</div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Key contact */}
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                    <span className="text-sm font-medium text-[var(--color-text)]">{form.key_contact || "—"}</span>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                    {form.email ? (
                      <a href={`mailto:${form.email}`} className="truncate text-sm text-[var(--color-gold)] underline decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)]">
                        {form.email}
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--color-text-muted)]">—</span>
                    )}
                  </div>
                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                    {form.phone ? (
                      <a href={`tel:${form.phone}`} className="text-sm text-[var(--color-gold)] underline decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)]">
                        {form.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--color-text-muted)]">—</span>
                    )}
                  </div>
                  {/* Website */}
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                    {form.website ? (
                      <a href={form.website.startsWith("http") ? form.website : `https://${form.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 truncate text-sm text-[var(--color-gold)] underline decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)]">
                        {form.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--color-text-muted)]">—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Memorable Phrase ── */}
              {form.memorable_phrase && (
                <div className="relative rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4">
                  <span className="absolute left-2 top-1 font-[family-name:var(--font-clash-display)] text-3xl leading-none text-[var(--color-gold)]">&ldquo;</span>
                  <p className="text-center text-lg italic leading-relaxed text-red-400">
                    {form.memorable_phrase}
                  </p>
                  <span className="absolute bottom-1 right-2 font-[family-name:var(--font-clash-display)] text-3xl leading-none text-[var(--color-gold)]">&rdquo;</span>
                </div>
              )}

              {/* ── Pain Points ── */}
              {form.pain_points && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Pain Points
                  </div>
                  <p className="text-sm leading-relaxed text-amber-200/90">{form.pain_points}</p>
                </div>
              )}

              {/* ── 3-Tier Pricing ── */}
              <div className="grid grid-cols-3 gap-2">
                {/* Essentiel */}
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-center">
                  <div className="mb-1 text-lg">&#x1F949;</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Essentiel</div>
                  <div className="mt-1 font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                    {pricing?.essentiel ?? "—"}<span className="text-xs text-[var(--color-text-muted)]"> EUR</span>
                  </div>
                </div>

                {/* Croissance — highlighted */}
                <div className="rounded-xl border-2 border-[var(--color-gold)] bg-[var(--color-gold-glow)] p-3 text-center shadow-[var(--shadow-gold)]">
                  <div className="mb-1 text-lg">&#x1F947;</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-gold)]">Croissance</div>
                  <div className="mt-1 font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
                    {pricing?.croissance ?? "—"}<span className="text-xs text-[var(--color-gold)]/60"> EUR</span>
                  </div>
                </div>

                {/* Domination */}
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 text-center">
                  <div className="mb-1 text-lg">&#x1F48E;</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Domination</div>
                  <div className="mt-1 font-[family-name:var(--font-clash-display)] text-lg font-bold text-purple-300">
                    {pricing?.domination ?? "—"}<span className="text-xs text-purple-400/60"> EUR</span>
                  </div>
                </div>
              </div>

              {/* ── Interaction Timeline ── */}
              <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Historique ({interactions.length})
                </div>
                {loadingData ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-[var(--color-text-muted)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Chargement...
                  </div>
                ) : interactions.length === 0 ? (
                  <p className="py-3 text-xs text-[var(--color-text-muted)]">Aucune interaction enregistree</p>
                ) : (
                  <div className="space-y-1">
                    {interactions.map((inter) => {
                      const Icon = INTERACTION_ICONS[inter.type] ?? MessageSquare;
                      const date = new Date(inter.created_at);
                      return (
                        <div key={inter.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
                            <Icon className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-[var(--color-text)]">{inter.subject ?? inter.type}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{inter.channel ?? inter.direction}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                            <Clock className="h-3 w-3" />
                            {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Notes ── */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Notes</label>
                <textarea
                  ref={notesRef}
                  value={form.notes ?? ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  onBlur={handleNotesBlur}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 transition-colors focus:border-[var(--color-gold-muted)] focus:outline-none"
                  placeholder="Notes libres... (format pricing: E=18K C=42K D=135K)"
                />
              </div>

              {/* ── Score + Probability + Phase row ── */}
              <div className="grid grid-cols-3 gap-3">
                {/* Score */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Score</label>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleScoreClick(i + 1)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          className={cn(
                            "h-5 w-5",
                            i < form.score
                              ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
                              : "text-[var(--color-border)]"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Probability */}
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    <span>Probabilite</span>
                    <span className="text-[var(--color-gold)]">{form.probability}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.probability}
                    onChange={(e) => handleProbabilityChange(Number(e.target.value))}
                    className="w-full accent-[var(--color-gold)]"
                  />
                </div>

                {/* Phase */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Phase</label>
                  <div className="relative">
                    <select
                      value={form.phase}
                      onChange={(e) => handlePhaseChange(e.target.value as ProspectPhase)}
                      className="w-full appearance-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 pr-8 text-xs font-medium text-[var(--color-text)] transition-colors focus:border-[var(--color-gold-muted)] focus:outline-none"
                    >
                      {PHASES.map((p) => (
                        <option key={p.key} value={p.key}>{p.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (45%) ── */}
          <div className="flex w-[45%] flex-col overflow-hidden">
            {/* ── AI Action Buttons ── */}
            <div className="shrink-0 space-y-2 border-b border-[var(--color-border-subtle)] p-5">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Actions IA</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAiAction("analyze")}
                  disabled={aiLoading}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all",
                    aiAction === "analyze" && !aiLoading
                      ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)] text-[var(--color-gold)] shadow-[var(--shadow-gold)]"
                      : "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:border-[var(--color-gold)]",
                    aiLoading && "cursor-not-allowed opacity-50",
                  )}
                >
                  {aiLoading && aiAction === "analyze" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                  Analyser
                </button>

                <button
                  onClick={() => handleAiAction("draft_email")}
                  disabled={aiLoading}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all",
                    aiAction === "draft_email" && !aiLoading
                      ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)] text-[var(--color-gold)] shadow-[var(--shadow-gold)]"
                      : "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:border-[var(--color-gold)]",
                    aiLoading && "cursor-not-allowed opacity-50",
                  )}
                >
                  {aiLoading && aiAction === "draft_email" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                  Email
                </button>

                <button
                  onClick={handlePdfDownload}
                  disabled={pdfLoading}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all",
                    aiAction === "proposal" && !pdfLoading
                      ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)] text-[var(--color-gold)] shadow-[var(--shadow-gold)]"
                      : "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:border-[var(--color-gold)]",
                    pdfLoading && "cursor-not-allowed opacity-50",
                  )}
                >
                  {pdfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                  Proposition
                </button>
              </div>
            </div>

            {/* ── AI Output Area ── */}
            <div className="flex-1 overflow-y-auto p-5">
              {aiOutput ? (
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-gold)]">
                    <Sparkles className="h-3 w-3" />
                    Resultat IA
                  </div>
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-[var(--color-text-muted)]">{aiOutput}</pre>
                </div>
              ) : aiLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="relative">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-gold)]/20 border-t-[var(--color-gold)]" />
                    <Brain className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-[var(--color-gold)]" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">Analyse en cours...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-gold-glow)]">
                    <Brain className="h-6 w-6 text-[var(--color-gold)]" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Selectionne une action IA pour analyser ce prospect
                  </p>
                </div>
              )}

              {/* ── Documents ── */}
              {documents.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    Documents ({documents.length})
                  </div>
                  <div className="space-y-1">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                        <span className="flex-1 truncate text-xs text-[var(--color-text)]">{doc.name}</span>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)]">
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Feedback Timeline (signed clients) ── */}
              {isSigned && (
                <div className="mt-5">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    Suivi Post-Signature
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {FEEDBACK_DAYS.map((day) => {
                      const entry = feedback.find((f) => f.day === day);
                      const isDone = entry?.status === "done";
                      const isSkipped = entry?.status === "skipped";
                      return (
                        <div key={day} className="flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                              isDone
                                ? "border-emerald-500 bg-emerald-500/20"
                                : isSkipped
                                  ? "border-[var(--color-border)] bg-[var(--color-surface)]"
                                  : "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5",
                            )}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <CircleDot className={cn("h-4 w-4", isSkipped ? "text-[var(--color-text-muted)]" : "text-[var(--color-gold)]")} />
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-[var(--color-text-muted)]">J{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════ BOTTOM BAR ═══════════════ */}
        <div className="flex shrink-0 items-center justify-between border-t border-[var(--color-border-subtle)] px-6 py-3">
          <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
            <Clock className="h-3 w-3" />
            Derniere MAJ: {new Date(form.updated_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--color-border-subtle)] px-5 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="rounded-xl border border-[var(--color-gold)] bg-[var(--color-gold)] px-5 py-2 text-xs font-bold text-black transition-all hover:bg-[var(--color-gold-light)] hover:shadow-[var(--shadow-gold)]"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Re-export types for backward compatibility ── */
export type { Prospect as ProspectDetail } from "@/types";
