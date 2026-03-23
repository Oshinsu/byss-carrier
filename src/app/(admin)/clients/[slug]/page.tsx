"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Building2, User, Mail, Phone, Globe, Calendar, Star,
  TrendingUp, FileText, Video, Send, MessageSquare,
  Clock, ChevronRight, Plus, ArrowUpRight, Download,
  CheckCircle, Circle, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/hooks/use-supabase";
import type { Prospect, Interaction, Invoice, Video as VideoType } from "@/types";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Page Client Dynamique
   Toutes les donnees viennent de Supabase. Zero mock.
   Interactions, documents, feedback_timeline inclus.
   ═══════════════════════════════════════════════════════ */

interface Document {
  id: string;
  prospect_id: string;
  title: string | null;
  type: string | null;
  url: string | null;
  file_name: string | null;
  created_at: string;
}

interface FeedbackStep {
  id: string;
  prospect_id: string;
  step: number;
  label: string;
  status: "done" | "current" | "pending";
  note: string | null;
  completed_at: string | null;
  created_at: string;
}

export default function ClientPage() {
  const params = useParams<{ slug: string }>();
  const supabase = useSupabase();

  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [feedbackTimeline, setFeedbackTimeline] = useState<FeedbackStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.slug) return;

    async function load() {
      setLoading(true);
      try {
        // Find prospect by slug (name normalized)
        const { data: prospects, error: pErr } = await supabase
          .from("prospects")
          .select("*")
          .or(`name.ilike.%${params.slug.replace(/-/g, " ")}%,name.ilike.%${params.slug}%`)
          .limit(1);

        if (pErr) throw pErr;
        if (!prospects?.length) {
          setError("Client introuvable");
          setLoading(false);
          return;
        }

        const p = prospects[0] as Prospect;
        setProspect(p);

        // Load related data in parallel
        const [intRes, invRes, vidRes, docRes, fbRes] = await Promise.all([
          supabase
            .from("interactions")
            .select("*")
            .eq("prospect_id", p.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("invoices")
            .select("*")
            .eq("prospect_id", p.id)
            .order("issue_date", { ascending: false }),
          supabase
            .from("videos")
            .select("*")
            .eq("prospect_id", p.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("documents")
            .select("*")
            .eq("prospect_id", p.id),
          supabase
            .from("feedback_timeline")
            .select("*")
            .eq("prospect_id", p.id)
            .order("step"),
        ]);

        setInteractions((intRes.data as Interaction[]) ?? []);
        setInvoices((invRes.data as Invoice[]) ?? []);
        setVideos((vidRes.data as VideoType[]) ?? []);
        setDocuments((docRes.data as Document[]) ?? []);
        setFeedbackTimeline((fbRes.data as FeedbackStep[]) ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.slug, supabase]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pt-4">
        {/* Header skeleton */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-[var(--color-surface-2)]" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--color-surface-2)]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-2)]" />
          </div>
        </div>
        {/* KPI skeletons */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--color-surface-2)]" />
          ))}
        </div>
        {/* Content skeletons */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-48 animate-pulse rounded-xl bg-[var(--color-surface-2)]" />
          <div className="h-48 animate-pulse rounded-xl bg-[var(--color-surface-2)] lg:col-span-2" />
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-[var(--color-surface-2)]" />
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Building2 className="h-12 w-12 text-[var(--color-text-muted)]" />
        <p className="text-lg text-[var(--color-text-muted)]">{error ?? "Client introuvable"}</p>
      </div>
    );
  }

  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount_ht), 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount_ht), 0);

  const typeIcons: Record<string, typeof Mail> = {
    email: Mail, call: Phone, meeting: Calendar,
    whatsapp: MessageSquare, note: FileText, proposal: FileText, invoice: FileText,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-gold-glow)]">
            <Building2 className="h-7 w-7 text-[var(--color-gold)]" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
              {prospect.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]">
              {prospect.sector && (
                <span className="rounded-full bg-[var(--color-gold-glow)] px-3 py-0.5 text-xs font-medium text-[var(--color-gold)]">
                  {prospect.sector}
                </span>
              )}
              <span className={cn(
                "rounded-full px-3 py-0.5 text-xs font-medium",
                prospect.phase === "signe" ? "bg-emerald-500/10 text-emerald-400" :
                prospect.phase === "perdu" ? "bg-red-500/10 text-red-400" :
                "bg-blue-500/10 text-blue-400"
              )}>
                {prospect.phase.charAt(0).toUpperCase() + prospect.phase.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]">
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-lg">
            <Plus className="h-4 w-4" />
            Interaction
          </button>
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Score", value: `${prospect.score}/10`, icon: Star },
          { label: "Probabilite", value: `${prospect.probability}%`, icon: TrendingUp },
          { label: "Panier estime", value: `${Number(prospect.estimated_basket).toLocaleString("fr-FR")} EUR`, icon: FileText },
          { label: "MRR", value: `${Number(prospect.mrr).toLocaleString("fr-FR")} EUR`, icon: TrendingUp },
          { label: "Facture (HT)", value: `${totalInvoiced.toLocaleString("fr-FR")} EUR`, icon: FileText },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
          >
            <kpi.icon className="mb-2 h-4 w-4 text-[var(--color-gold)]" />
            <div className="text-xl font-bold text-[var(--color-text)] font-[family-name:var(--font-clash-display)]">
              {kpi.value}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Contact info + Memorable phrase */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Contact</h3>
          <div className="space-y-3">
            {prospect.key_contact && (
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text)]">{prospect.key_contact}</span>
              </div>
            )}
            {prospect.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
                <a href={`mailto:${prospect.email}`} className="text-[var(--color-gold)] hover:underline">{prospect.email}</a>
              </div>
            )}
            {prospect.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text)]">{prospect.phone}</span>
              </div>
            )}
            {prospect.website && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-[var(--color-text-muted)]" />
                <a href={prospect.website} target="_blank" rel="noopener" className="text-[var(--color-gold)] hover:underline">{prospect.website}</a>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Intelligence</h3>
          {prospect.memorable_phrase && (
            <p className="mb-3 text-sm italic text-[var(--color-gold-muted)]">
              &ldquo;{prospect.memorable_phrase}&rdquo;
            </p>
          )}
          {prospect.pain_points && (
            <div className="mb-3">
              <span className="text-xs font-medium text-[var(--color-text-muted)]">Pain point:</span>
              <p className="mt-1 text-sm text-[var(--color-text)]">{prospect.pain_points}</p>
            </div>
          )}
          {prospect.next_action && (
            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-gold-glow)] p-3">
              <ChevronRight className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">{prospect.next_action}</span>
            </div>
          )}
          {prospect.notes && (
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">{prospect.notes}</p>
          )}
        </div>
      </div>

      {/* Feedback Timeline */}
      {feedbackTimeline.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">
            Parcours client ({feedbackTimeline.length} etapes)
          </h3>
          <div className="flex items-start gap-1">
            {feedbackTimeline.map((step, i) => {
              const StepIcon = step.status === "done" ? CheckCircle
                : step.status === "current" ? AlertCircle
                : Circle;
              return (
                <div key={step.id} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={cn(
                        "h-0.5 flex-1",
                        step.status === "done" ? "bg-emerald-500" :
                        step.status === "current" ? "bg-[var(--color-gold)]" :
                        "bg-[var(--color-border-subtle)]"
                      )} />
                    )}
                    <StepIcon className={cn(
                      "h-5 w-5 shrink-0",
                      step.status === "done" ? "text-emerald-400" :
                      step.status === "current" ? "text-[var(--color-gold)]" :
                      "text-[var(--color-text-muted)]"
                    )} />
                    {i < feedbackTimeline.length - 1 && (
                      <div className={cn(
                        "h-0.5 flex-1",
                        feedbackTimeline[i + 1].status === "done" ? "bg-emerald-500" :
                        feedbackTimeline[i + 1].status === "current" ? "bg-[var(--color-gold)]" :
                        "bg-[var(--color-border-subtle)]"
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    "mt-2 text-center text-[10px] font-medium leading-tight",
                    step.status === "done" ? "text-emerald-400" :
                    step.status === "current" ? "text-[var(--color-gold)]" :
                    "text-[var(--color-text-muted)]"
                  )}>
                    {step.label}
                  </span>
                  {step.note && (
                    <span className="mt-0.5 text-center text-[9px] text-[var(--color-text-muted)]">
                      {step.note}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline (interactions) */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-gold)]">Historique ({interactions.length})</h3>
          <button className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-gold)]">
            <Plus className="h-3 w-3" /> Ajouter
          </button>
        </div>
        {interactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
            Aucune interaction enregistree
          </p>
        ) : (
          <div className="space-y-3">
            {interactions.map((int) => {
              const Icon = typeIcons[int.type] ?? MessageSquare;
              return (
                <div key={int.id} className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[var(--color-gold-glow)]">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)]">
                    <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">{int.subject ?? int.type}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {int.direction === "inbound" ? "← recu" : "→ envoye"}
                      </span>
                      {int.channel && (
                        <span className="rounded-full bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[9px] text-[var(--color-text-muted)]">
                          {int.channel}
                        </span>
                      )}
                    </div>
                    {int.content && <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-2">{int.content}</p>}
                  </div>
                  <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                    {new Date(int.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Documents + Invoices + Videos */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Documents */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Documents ({documents.length})</h3>
          {documents.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-text-muted)]">Aucun document</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-[var(--color-gold-glow)]">
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--color-text)]">
                      {doc.title ?? doc.file_name ?? "Document"}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {doc.type ?? "fichier"} &middot; {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener"
                      className="ml-2 shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Factures ({invoices.length})</h3>
          {invoices.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-text-muted)]">Aucune facture</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-[var(--color-gold-glow)]">
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text)]">{inv.number}</span>
                    <span className="ml-2 text-xs text-[var(--color-text-muted)]">{inv.issue_date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[var(--color-text)]">{Number(inv.amount_ht).toLocaleString("fr-FR")} EUR</span>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                      inv.status === "overdue" ? "bg-red-500/10 text-red-400" :
                      "bg-gray-500/10 text-gray-400"
                    )}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Videos ({videos.length})</h3>
          {videos.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-text-muted)]">Aucune video</p>
          ) : (
            <div className="space-y-2">
              {videos.map((vid) => (
                <div key={vid.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-[var(--color-gold-glow)]">
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text)]">{vid.title ?? "Sans titre"}</span>
                    <span className="ml-2 text-xs text-[var(--color-text-muted)]">{vid.format} | {vid.duration}s</span>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    vid.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                    vid.status === "generating" ? "bg-amber-500/10 text-amber-400" :
                    "bg-gray-500/10 text-gray-400"
                  )}>
                    {vid.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
