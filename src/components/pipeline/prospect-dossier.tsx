"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Building2,
  TrendingUp,
  AlertTriangle,
  Swords,
  Puzzle,
  DollarSign,
  BarChart3,
  BookOpen,
  ListChecks,
  Download,
  Mail,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface DossierData {
  executive_summary: string;
  company_profile: {
    name: string;
    siret: string | null;
    naf: string | null;
    workforce: string | null;
    creation: string | null;
    legal_form: string | null;
    address: string | null;
  };
  market_context: string;
  pain_points: Array<{
    pain: string;
    impact: string;
    byss_solution: string;
  }>;
  competitive_landscape: string;
  proposed_solution: {
    description: string;
    modules: string[];
    timeline: string;
    differentiators: string[];
  };
  pricing: {
    essential: { price: string; includes: string[] };
    croissance: { price: string; includes: string[] };
    domination: { price: string; includes: string[] };
  };
  roi_projection: {
    investment: string;
    monthly_savings: string;
    annual_roi: string;
    payback_months: number;
  };
  case_studies: Array<{
    client: string;
    sector: string;
    result: string;
    quote: string;
  }>;
  next_steps: Array<{
    action: string;
    deadline: string;
    owner: string;
  }>;
}

interface ProspectDossierProps {
  prospectId: string;
  prospectName: string;
  sector: string;
  onClose: () => void;
}

/* ═══════════════════════════════════════════════════════
   SECTION CONFIG
   ═══════════════════════════════════════════════════════ */

const SECTIONS = [
  { key: "executive_summary", label: "Executive Summary", icon: Sparkles, accent: "text-cyan-400" },
  { key: "company_profile", label: "Profil Entreprise", icon: Building2, accent: "text-blue-400" },
  { key: "market_context", label: "Contexte Marche", icon: TrendingUp, accent: "text-emerald-400" },
  { key: "pain_points", label: "Points de Douleur", icon: AlertTriangle, accent: "text-red-400" },
  { key: "competitive_landscape", label: "Paysage Concurrentiel", icon: Swords, accent: "text-orange-400" },
  { key: "proposed_solution", label: "Solution Proposee", icon: Puzzle, accent: "text-purple-400" },
  { key: "pricing", label: "Strategie Tarifaire", icon: DollarSign, accent: "text-amber-400" },
  { key: "roi_projection", label: "Projection ROI", icon: BarChart3, accent: "text-green-400" },
  { key: "case_studies", label: "Etudes de Cas", icon: BookOpen, accent: "text-indigo-400" },
  { key: "next_steps", label: "Prochaines Etapes", icon: ListChecks, accent: "text-teal-400" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export function ProspectDossier({
  prospectId,
  prospectName,
  sector,
  onClose,
}: ProspectDossierProps) {
  const [dossier, setDossier] = useState<DossierData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(SECTIONS.map((s) => s.key))
  );
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const { toast } = useToast();

  /* ── Load existing dossier ──────────────────────── */
  const loadDossier = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dossier?prospectId=${prospectId}`);
      const json = await res.json();
      if (json.dossier?.data) {
        setDossier(
          typeof json.dossier.data === "string"
            ? JSON.parse(json.dossier.data)
            : json.dossier.data
        );
      }
    } catch {
      // No saved dossier
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  // Auto-load on mount
  useState(() => {
    loadDossier();
  });

  /* ── Generate full dossier ─────────────────────── */
  const generateDossier = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", prospectId }),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setDossier(json.dossier);
      setMeta(json.meta || null);
      toast({
        title: "Dossier genere",
        description: `${Object.keys(json.dossier).length} sections. ${json.meta?.duration_ms || 0}ms.`,
      });
    } catch (err) {
      toast({
        title: "Erreur generation",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  /* ── Regenerate one section ────────────────────── */
  const regenerateSection = async (section: string) => {
    setRegeneratingSection(section);
    try {
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regenerate_section",
          prospectId,
          section,
        }),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setDossier((prev) => {
        if (!prev) return prev;
        return { ...prev, [section]: json.data };
      });

      toast({ title: "Section regeneree", description: section });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur regeneration",
        variant: "destructive",
      });
    } finally {
      setRegeneratingSection(null);
    }
  };

  /* ── Copy section ──────────────────────────────── */
  const copySection = (key: string) => {
    if (!dossier) return;
    const val = (dossier as Record<string, unknown>)[key];
    const text = typeof val === "string" ? val : JSON.stringify(val, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  /* ── Toggle section ────────────────────────────── */
  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /* ── Export PDF (open in new tab) ───────────────── */
  const exportPDF = () => {
    toast({
      title: "Export PDF",
      description: "Fonctionnalite en cours de deploiement.",
    });
  };

  /* ── Send email ────────────────────────────────── */
  const sendEmail = () => {
    const subject = encodeURIComponent(`Dossier Commercial — ${prospectName}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver ci-joint le dossier commercial prepare par BYSS GROUP.\n\nCordialement,\nBYSS GROUP`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  /* ── Save dossier ──────────────────────────────── */
  const saveDossier = async () => {
    if (!dossier) return;
    setSaving(true);
    try {
      // The dossier is already saved during generation,
      // but this allows saving manual edits
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", prospectId }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast({ title: "Dossier sauvegarde" });
    } catch {
      toast({ title: "Erreur sauvegarde", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mx-4 my-8 w-full max-w-5xl rounded-2xl border border-[#2A2A3E]/60 bg-[#0A0A0F]"
      >
        {/* ── Header ──────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-[#2A2A3E]/60 bg-[#0A0A0F]/95 px-6 py-4 backdrop-blur-md">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <FileText className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-[family-name:var(--font-clash-display)] text-xl font-bold text-[#E0E0E8]">
                  {prospectName}
                </h2>
                <p className="text-xs text-[#6A6A7A]">
                  Dossier Commercial BYSS GROUP
                  {sector && (
                    <span className="ml-2 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                      {sector}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Meta badge */}
          {meta && (
            <div className="mr-4 hidden text-right text-[10px] text-[#6A6A7A] sm:block">
              <p>{(meta.model as string) || "Claude"}</p>
              <p>{(meta.duration_ms as number) || 0}ms</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#6A6A7A] transition-colors hover:bg-[#1A1A2E] hover:text-[#E0E0E8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────── */}
        <div className="px-6 py-6">
          {/* No dossier state */}
          {!dossier && !loading && !generating && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <FileText className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#E0E0E8]">
                Aucun dossier genere
              </h3>
              <p className="mb-6 text-center text-sm text-[#6A6A7A]">
                10 sections. SIRENE + Bible + Intelligence + RAG.
                <br />
                Le McKinsey martiniquais en un clic.
              </p>
              <button
                onClick={generateDossier}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
              >
                <Sparkles className="h-4 w-4" />
                Generer le dossier
              </button>
            </div>
          )}

          {/* Loading state */}
          {(loading || generating) && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-cyan-400" />
              <p className="text-sm text-[#8A8A9A]">
                {generating
                  ? "Generation en cours... SIRENE + Bible + RAG + Claude"
                  : "Chargement du dossier..."}
              </p>
              {generating && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["SIRENE", "Bible", "Intel", "RAG", "Claude"].map(
                    (step, i) => (
                      <motion.span
                        key={step}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.5 }}
                        className="rounded-full bg-[#1A1A2E] px-3 py-1 text-[10px] font-semibold text-cyan-400"
                      >
                        {step}
                      </motion.span>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dossier sections */}
          {dossier && !generating && (
            <div className="space-y-3">
              {SECTIONS.map((sec, idx) => {
                const isExpanded = expandedSections.has(sec.key);
                const Icon = sec.icon;
                const isRegenerating = regeneratingSection === sec.key;

                return (
                  <motion.div
                    key={sec.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="overflow-hidden rounded-xl border border-[#2A2A3E]/60 bg-[#0F0F1A]/80"
                  >
                    {/* Section header */}
                    <button
                      onClick={() => toggleSection(sec.key)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#1A1A2E]/50"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A1A2E]",
                          sec.accent
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-medium uppercase tracking-wider text-[#6A6A7A]">
                          Section {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-[#E0E0E8]">
                          {sec.label}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Regenerate */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            regenerateSection(sec.key);
                          }}
                          disabled={isRegenerating}
                          className="rounded-md p-1.5 text-[#6A6A7A] transition-colors hover:bg-[#2A2A3E] hover:text-cyan-400 disabled:opacity-50"
                          title="Regenerer"
                        >
                          <RefreshCw
                            className={cn(
                              "h-3.5 w-3.5",
                              isRegenerating && "animate-spin"
                            )}
                          />
                        </button>
                        {/* Copy */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copySection(sec.key);
                          }}
                          className="rounded-md p-1.5 text-[#6A6A7A] transition-colors hover:bg-[#2A2A3E] hover:text-cyan-400"
                          title="Copier"
                        >
                          {copiedSection === sec.key ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {/* Expand/Collapse */}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#6A6A7A]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#6A6A7A]" />
                        )}
                      </div>
                    </button>

                    {/* Section content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#2A2A3E]/40 px-4 py-4">
                            {isRegenerating ? (
                              <div className="flex items-center gap-2 py-4 text-sm text-[#6A6A7A]">
                                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                                Regeneration en cours...
                              </div>
                            ) : (
                              <SectionContent
                                sectionKey={sec.key}
                                dossier={dossier}
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer Actions ─────────────────────── */}
        {dossier && !generating && (
          <div className="sticky bottom-0 flex flex-wrap items-center gap-2 rounded-b-2xl border-t border-[#2A2A3E]/60 bg-[#0A0A0F]/95 px-6 py-4 backdrop-blur-md">
            <button
              onClick={generateDossier}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-4 py-2 text-xs font-medium text-[#8A8A9A] transition-colors hover:bg-cyan-500/15 hover:text-cyan-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerer tout
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-4 py-2 text-xs font-medium text-[#8A8A9A] transition-colors hover:bg-cyan-500/15 hover:text-cyan-400"
            >
              <Download className="h-3.5 w-3.5" />
              Exporter PDF
            </button>
            <button
              onClick={sendEmail}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-4 py-2 text-xs font-medium text-[#8A8A9A] transition-colors hover:bg-cyan-500/15 hover:text-cyan-400"
            >
              <Mail className="h-3.5 w-3.5" />
              Envoyer par email
            </button>
            <div className="flex-1" />
            <button
              onClick={saveDossier}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Sauvegarder
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION RENDERERS
   ═══════════════════════════════════════════════════════ */

function SectionContent({
  sectionKey,
  dossier,
}: {
  sectionKey: SectionKey;
  dossier: DossierData;
}) {
  switch (sectionKey) {
    case "executive_summary":
      return <ExecutiveSummary data={dossier.executive_summary} />;
    case "company_profile":
      return <CompanyProfile data={dossier.company_profile} />;
    case "market_context":
      return <MarketContext data={dossier.market_context} />;
    case "pain_points":
      return <PainPoints data={dossier.pain_points} />;
    case "competitive_landscape":
      return <CompetitiveLandscape data={dossier.competitive_landscape} />;
    case "proposed_solution":
      return <ProposedSolution data={dossier.proposed_solution} />;
    case "pricing":
      return <PricingGrid data={dossier.pricing} />;
    case "roi_projection":
      return <ROIProjection data={dossier.roi_projection} />;
    case "case_studies":
      return <CaseStudies data={dossier.case_studies} />;
    case "next_steps":
      return <NextSteps data={dossier.next_steps} />;
    default:
      return <p className="text-sm text-[#6A6A7A]">Section inconnue.</p>;
  }
}

/* ── 1. Executive Summary ────────────────────────── */
function ExecutiveSummary({ data }: { data: string }) {
  return (
    <div className="rounded-lg border-l-4 border-cyan-500 bg-cyan-500/5 px-4 py-3">
      <p className="text-base font-semibold leading-relaxed text-[#E0E0E8]">
        {data}
      </p>
    </div>
  );
}

/* ── 2. Company Profile ──────────────────────────── */
function CompanyProfile({
  data,
}: {
  data: DossierData["company_profile"];
}) {
  const fields = [
    { label: "SIRET", value: data.siret },
    { label: "NAF", value: data.naf },
    { label: "Effectif", value: data.workforce },
    { label: "Creation", value: data.creation },
    { label: "Forme juridique", value: data.legal_form },
    { label: "Adresse", value: data.address },
  ];

  return (
    <div>
      <h4 className="mb-3 text-base font-bold text-[#E0E0E8]">{data.name}</h4>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {fields.map((f) => (
          <div
            key={f.label}
            className="rounded-lg bg-[#1A1A2E]/80 px-3 py-2"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6A6A7A]">
              {f.label}
            </p>
            <p className="text-sm font-medium text-[#C0C0D0]">
              {f.value || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 3. Market Context ───────────────────────────── */
function MarketContext({ data }: { data: string }) {
  return (
    <p className="text-sm leading-relaxed text-[#C0C0D0]">{data}</p>
  );
}

/* ── 4. Pain Points ──────────────────────────────── */
function PainPoints({
  data,
}: {
  data: DossierData["pain_points"];
}) {
  return (
    <div className="space-y-3">
      {(data || []).map((pp, i) => (
        <div
          key={i}
          className="rounded-lg border border-red-500/10 bg-red-500/5 p-3"
        >
          <div className="mb-2 flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-red-400">{pp.pain}</p>
              <p className="mt-1 text-xs text-[#8A8A9A]">
                Impact: {pp.impact}
              </p>
            </div>
          </div>
          <div className="ml-7 rounded-md bg-cyan-500/5 px-3 py-2">
            <p className="text-xs text-cyan-400">
              <span className="font-semibold">BYSS:</span> {pp.byss_solution}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 5. Competitive Landscape ────────────────────── */
function CompetitiveLandscape({ data }: { data: string }) {
  return (
    <p className="text-sm leading-relaxed text-[#C0C0D0]">{data}</p>
  );
}

/* ── 6. Proposed Solution ────────────────────────── */
function ProposedSolution({
  data,
}: {
  data: DossierData["proposed_solution"];
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#C0C0D0]">{data.description}</p>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6A6A7A]">
          Modules
        </p>
        <div className="flex flex-wrap gap-2">
          {(data.modules || []).map((m, i) => (
            <span
              key={i}
              className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6A6A7A]">
            Timeline
          </p>
          <p className="text-sm font-medium text-[#E0E0E8]">
            {data.timeline}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6A6A7A]">
          Differenciateurs
        </p>
        <ul className="space-y-1">
          {(data.differentiators || []).map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-[#C0C0D0]"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 7. Pricing Grid ─────────────────────────────── */
function PricingGrid({ data }: { data: DossierData["pricing"] }) {
  const tiers = [
    {
      key: "essential",
      label: "Essential",
      data: data.essential,
      border: "border-[#2A2A3E]",
      badge: "bg-[#1A1A2E] text-[#8A8A9A]",
    },
    {
      key: "croissance",
      label: "Croissance",
      data: data.croissance,
      border: "border-cyan-500/40",
      badge: "bg-cyan-500/10 text-cyan-400",
    },
    {
      key: "domination",
      label: "Domination",
      data: data.domination,
      border: "border-purple-500/40",
      badge: "bg-purple-500/10 text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tiers.map((t) => (
        <div
          key={t.key}
          className={cn(
            "rounded-xl border p-4",
            t.border
          )}
        >
          <span
            className={cn(
              "mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              t.badge
            )}
          >
            {t.label}
          </span>
          <p className="mb-3 text-lg font-bold text-[#E0E0E8]">
            {t.data?.price || "Sur devis"}
          </p>
          <ul className="space-y-1.5">
            {(t.data?.includes || []).map((inc, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-[#C0C0D0]"
              >
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-400" />
                {inc}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── 8. ROI Projection ───────────────────────────── */
function ROIProjection({
  data,
}: {
  data: DossierData["roi_projection"];
}) {
  const metrics = [
    { label: "Investissement", value: data.investment, color: "text-amber-400" },
    {
      label: "Economies/mois",
      value: data.monthly_savings,
      color: "text-green-400",
    },
    { label: "ROI annuel", value: data.annual_roi, color: "text-cyan-400" },
    {
      label: "Retour sur invest.",
      value: `${data.payback_months} mois`,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl bg-[#1A1A2E]/80 p-4 text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6A6A7A]">
            {m.label}
          </p>
          <p className={cn("mt-1 text-lg font-bold", m.color)}>
            {m.value}
          </p>
        </div>
      ))}

      {/* Visual payback bar */}
      <div className="col-span-full mt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6A6A7A]">0</span>
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#1A1A2E]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((data.payback_months / 12) * 100, 100)}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-green-400"
            />
          </div>
          <span className="text-xs text-[#6A6A7A]">12 mois</span>
        </div>
        <p className="mt-1 text-center text-[10px] text-[#6A6A7A]">
          Retour sur investissement en {data.payback_months} mois
        </p>
      </div>
    </div>
  );
}

/* ── 9. Case Studies ─────────────────────────────── */
function CaseStudies({
  data,
}: {
  data: DossierData["case_studies"];
}) {
  return (
    <div className="space-y-3">
      {(data || []).map((cs, i) => (
        <div
          key={i}
          className="rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[#E0E0E8]">{cs.client}</p>
              <p className="text-[10px] font-semibold uppercase text-indigo-400">
                {cs.sector}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#C0C0D0]">{cs.result}</p>
          {cs.quote && (
            <p className="mt-2 border-l-2 border-indigo-500/40 pl-3 text-xs italic text-[#8A8A9A]">
              &laquo; {cs.quote} &raquo;
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── 10. Next Steps ──────────────────────────────── */
function NextSteps({
  data,
}: {
  data: DossierData["next_steps"];
}) {
  return (
    <div className="space-y-2">
      {(data || []).map((step, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg bg-[#1A1A2E]/50 px-3 py-2.5"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-[10px] font-bold text-teal-400">
            {i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#E0E0E8]">
              {step.action}
            </p>
            <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-[#6A6A7A]">
              <span>Deadline: {step.deadline}</span>
              <span>Owner: {step.owner}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
