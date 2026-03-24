"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, Search, Clock, TrendingUp, Filter, ExternalLink,
  AlertTriangle, Sparkles, ChevronDown, ChevronRight, Target,
  Briefcase, Users, Globe, Lightbulb, Loader2, X, FileText,
  ArrowRight, Zap, Shield, Brain, Send, Trophy, CheckCircle2,
  XCircle, FileEdit, Download, GripVertical, Plus, Trash2,
  RefreshCw, Save, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  scoreTenderRelevance,
  MARCHES_PLATFORMS,
  ACHAT_INNOVANT_TARGETS,
  TENDER_CATEGORIES,
  BYSS_CPV_CODES,
} from "@/lib/data/cpv-codes";
import {
  MARCHE_STATUSES,
  MARCHE_PIPELINE,
  MEMOIRE_SECTIONS,
  getStatusColor,
  type MarcheStatus,
  type MarcheRow,
} from "@/lib/marches";
import MarcheDetailModal from "@/components/marches/marche-detail-modal";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onMarcheStatusChanged } from "@/lib/synergies";

/* ── Types ── */
interface Tender {
  id: string;
  intitule: string;
  acheteur: string;
  nature: string;
  datePublication: string;
  dateLimite: string;
  descripteur: string;
  familleActivite: string;
  departement: string;
  typeAvis: string;
  codeCPV: string;
  procedure: string;
  urlAvis: string;
}

type TabId = "veille" | "pipeline" | "analyse" | "memoire";
type SortMode = "publication" | "deadline" | "relevance";

/* ── Helpers ── */
function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - Date.now()) / 86_400_000);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

function formatCurrency(n: number | null): string {
  if (!n) return "—";
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

/* ═══════════════════════════════════════════════════════════════
   MARCHÉS PUBLICS — Full Ecosystem
   Veille | Pipeline | Analyse | Mémoire Technique
   ═══════════════════════════════════════════════════════════════ */
export default function MarchesPublicsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("veille");

  /* ── BOAMP State (Veille tab) ── */
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [importing, setImporting] = useState<string | null>(null);
  const [batchImporting, setBatchImporting] = useState(false);

  /* ── Supabase State (Pipeline/Analyse/Mémoire) ── */
  const [marches, setMarches] = useState<MarcheRow[]>([]);
  const [marchesLoading, setMarchesLoading] = useState(false);
  const [selectedMarche, setSelectedMarche] = useState<MarcheRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  /* ── Analyse State ── */
  const [analyzeTarget, setAnalyzeTarget] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  /* ── Mémoire State ── */
  const [memoireTarget, setMemoireTarget] = useState("");
  const [generatingMemoire, setGeneratingMemoire] = useState(false);
  const [memoireSections, setMemoireSections] = useState<Record<string, string>>({});
  const [savingMemoire, setSavingMemoire] = useState(false);

  /* ── Sections expand state ── */
  const [achatsOpen, setAchatsOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);

  const supabase = createClient();
  const { toast } = useToast();

  /* ── Fetch BOAMP tenders ── */
  const fetchTenders = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const action = query ? "search" : "latest";
      const params = new URLSearchParams({ action });
      if (query) params.set("q", query);
      params.set("limit", "50");
      const res = await fetch(`/api/boamp?${params}`);
      if (!res.ok) throw new Error("Erreur BOAMP");
      const data = await res.json();
      setTenders(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur chargement");
      setTenders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Fetch saved marchés from Supabase ── */
  const fetchMarches = useCallback(async () => {
    setMarchesLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("marches_publics")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setMarches((data as MarcheRow[]) ?? []);
    } catch {
      setMarches([]);
    } finally {
      setMarchesLoading(false);
    }
  }, []);

  /* Fetch BOAMP on mount (default tab), defer Supabase marches until needed */
  useEffect(() => { fetchTenders(); }, [fetchTenders]);
  useEffect(() => {
    if (activeTab === "pipeline" || activeTab === "analyse" || activeTab === "memoire") {
      if (marches.length === 0 && !marchesLoading) fetchMarches();
    }
  }, [activeTab, marches.length, marchesLoading, fetchMarches]);

  /* ── Search handler ── */
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
      fetchTenders(searchQuery.trim());
    } else {
      setActiveSearch("");
      fetchTenders();
    }
  };

  /* ── Import tender to Supabase ── */
  const importTender = async (tender: Tender, score: number) => {
    setImporting(tender.id);
    try {
      const res = await fetch("/api/boamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", tender, relevanceScore: score }),
      });
      if (!res.ok) throw new Error("Erreur import");
      const data = await res.json();
      if (data.duplicate) {
        toast("Marche deja importe", "info");
      } else {
        toast("Marche importe dans le pipeline", "success");
      }
      await fetchMarches();
    } catch (err) {
      console.error("Import error:", err);
      toast("Erreur import marche", "error");
    } finally {
      setImporting(null);
    }
  };

  /* ── Batch import top 10 ── */
  const batchImport = async () => {
    setBatchImporting(true);
    const top10 = processedTenders.slice(0, 10);
    for (const t of top10) {
      await importTender(t, t.relevance);
    }
    toast(`${top10.length} marches importes`, "success");
    setBatchImporting(false);
  };

  /* ── Update marché status ── */
  const updateMarcheStatus = async (id: string, status: MarcheStatus) => {
    const { error: updateErr } = await supabase
      .from("marches_publics")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (updateErr) {
      toast("Erreur mise a jour statut", "error");
      return;
    }
    toast(`Statut → ${status.toUpperCase()}`, "success");
    // Trigger synergy
    try {
      const m = marches.find((x) => x.id === id);
      if (m) {
        await onMarcheStatusChanged(id, m.title, m.acheteur || "Inconnu", status, m.budget_proposed ?? 0);
      }
    } catch { /* synergy fire-and-forget */ }
    setMarches((prev) => prev.map((m) => m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m));
    if (selectedMarche?.id === id) setSelectedMarche((prev) => prev ? { ...prev, status } : prev);
  };

  /* ── Save marché partial data ── */
  const saveMarche = async (id: string, data: Partial<MarcheRow>) => {
    const { error: saveErr } = await supabase
      .from("marches_publics")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (saveErr) {
      toast("Erreur sauvegarde", "error");
      return;
    }
    toast("Marche sauvegarde", "success");
    setMarches((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
  };

  /* ── Delete marché ── */
  const deleteMarche = async (id: string) => {
    const { error: delErr } = await supabase.from("marches_publics").delete().eq("id", id);
    if (delErr) {
      toast("Erreur suppression", "error");
      return;
    }
    toast("Marche supprime", "success");
    setMarches((prev) => prev.filter((m) => m.id !== id));
    setDetailOpen(false);
  };

  /* ── Link to CRM ── */
  const linkToCRM = async (m: MarcheRow) => {
    // Create prospect from acheteur
    const { data, error: crmErr } = await supabase
      .from("prospects")
      .insert({
        name: m.acheteur || "Prospect marché public",
        sector: "Public",
        stage: "contact_froid",
        source: "Marché public",
        notes: `Marché: ${m.title}`,
        basket: m.budget_proposed || m.budget_estimated || 0,
      })
      .select("id")
      .single();
    if (crmErr) {
      toast("Erreur liaison CRM", "error");
      return;
    }
    if (data) {
      await supabase.from("marches_publics").update({ prospect_id: data.id }).eq("id", m.id);
      setMarches((prev) => prev.map((x) => x.id === m.id ? { ...x, prospect_id: data.id } : x));
      toast("Prospect cree et lie au marche", "success");
    }
  };

  /* ── Create invoice stub ── */
  const createInvoice = (m: MarcheRow) => {
    // Navigate to finance with pre-filled data
    window.location.href = `/finance?newInvoice=true&client=${encodeURIComponent(m.acheteur || "")}&amount=${m.budget_proposed || ""}&ref=${encodeURIComponent(m.title)}`;
  };

  /* ── AI Analysis ── */
  const runAnalysis = async () => {
    if (!analyzeTarget) return;
    const target = marches.find((m) => m.id === analyzeTarget);
    if (!target) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/boamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze", marcheId: target.id }),
      });
      if (!res.ok) throw new Error("Erreur analyse");
      const data = await res.json();
      setAnalysisResult(data.analysis || "Analyse indisponible");
      toast(`Analyse terminee — ${data.goNoGo || ""}`, "success");
      await fetchMarches(); // Refresh to get saved analysis
    } catch {
      setAnalysisResult("Erreur lors de l'analyse IA.");
      toast("Erreur analyse IA", "error");
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Generate Mémoire ── */
  const generateMemoire = async () => {
    if (!memoireTarget) return;
    const target = marches.find((m) => m.id === memoireTarget);
    if (!target) return;
    setGeneratingMemoire(true);
    try {
      const res = await fetch("/api/boamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_memoire", marcheId: target.id }),
      });
      if (!res.ok) throw new Error("Erreur génération");
      const data = await res.json();
      setMemoireSections(data.sections || {});
      toast("Memoire technique genere", "success");
    } catch {
      setMemoireSections({});
      toast("Erreur generation memoire", "error");
    } finally {
      setGeneratingMemoire(false);
    }
  };

  /* ── Save Mémoire ── */
  const saveMemoire = async () => {
    if (!memoireTarget) return;
    setSavingMemoire(true);
    const content = Object.entries(memoireSections)
      .map(([key, val]) => {
        const section = MEMOIRE_SECTIONS.find((s) => s.id === key);
        return `## ${section?.label || key}\n\n${val}`;
      })
      .join("\n\n---\n\n");
    const { error: memErr } = await supabase
      .from("marches_publics")
      .update({ memoire_technique: content, updated_at: new Date().toISOString() })
      .eq("id", memoireTarget);
    if (memErr) {
      toast("Erreur sauvegarde memoire", "error");
    } else {
      toast("Memoire technique sauvegarde", "success");
    }
    await fetchMarches();
    setSavingMemoire(false);
  };

  /* ── Filter & Sort BOAMP tenders ── */
  const processedTenders = useMemo(() => {
    let filtered = [...tenders];
    if (categoryFilter !== "tous") {
      const cat = TENDER_CATEGORIES.find((c) => c.id === categoryFilter);
      if (cat && "keywords" in cat) {
        filtered = filtered.filter((t) => {
          const text = `${t.intitule} ${t.descripteur} ${t.familleActivite}`.toLowerCase();
          return (cat.keywords as readonly string[]).some((kw) => text.includes(kw));
        });
      }
    }
    const scored = filtered.map((t) => ({
      ...t,
      relevance: scoreTenderRelevance(t.intitule, t.descripteur),
      daysLeft: daysUntil(t.dateLimite),
    }));
    switch (sortMode) {
      case "deadline":
        scored.sort((a, b) => { if (a.daysLeft === null) return 1; if (b.daysLeft === null) return -1; return a.daysLeft - b.daysLeft; });
        break;
      case "relevance":
        scored.sort((a, b) => b.relevance - a.relevance);
        break;
      default:
        scored.sort((a, b) => { if (!a.datePublication) return 1; if (!b.datePublication) return -1; return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime(); });
    }
    return scored;
  }, [tenders, categoryFilter, sortMode]);

  /* ── KPI ── */
  const kpis = useMemo(() => {
    const now = new Date();
    const ouverts = tenders.filter((t) => !t.dateLimite || new Date(t.dateLimite) > now);
    const pertinents = tenders.filter((t) => scoreTenderRelevance(t.intitule, t.descripteur) >= 40);
    const urgents = tenders.filter((t) => { const d = daysUntil(t.dateLimite); return d !== null && d >= 0 && d <= 7; });
    const enPipeline = marches.filter((m) => !["no_go", "lost"].includes(m.status)).length;
    const gagnes = marches.filter((m) => m.status === "won").length;
    const pipelineValue = marches
      .filter((m) => ["go", "drafting", "submitted"].includes(m.status))
      .reduce((acc, m) => acc + (m.budget_proposed || m.budget_estimated || 0), 0);
    return { ouverts: ouverts.length, pertinents: pertinents.length, urgents: urgents.length, enPipeline, gagnes, pipelineValue };
  }, [tenders, marches]);

  /* ── Pipeline grouped ── */
  const pipelineGroups = useMemo(() => {
    return MARCHE_PIPELINE.map((phase) => ({
      ...phase,
      items: marches.filter((m) => m.status === phase.id),
    }));
  }, [marches]);

  /* ── GO marchés for mémoire ── */
  const goMarches = useMemo(() => {
    return marches.filter((m) => ["go", "drafting"].includes(m.status));
  }, [marches]);

  /* ── Tab definitions ── */
  const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "veille", label: "Veille", icon: Search },
    { id: "pipeline", label: "Pipeline", icon: TrendingUp },
    { id: "analyse", label: "Analyse IA", icon: Brain },
    { id: "memoire", label: "Mémoire Technique", icon: FileText },
  ];

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#06080F] p-4 md:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="font-[family-name:var(--font-clash-display)] text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-[var(--color-text)]">Marchés </span>
              <span className="text-cyan-400">Publics</span>
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Veille BOAMP + Pipeline + Analyse IA + Mémoire Technique
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              BOAMP Live — 972
            </div>
            <span className="text-[var(--color-border-subtle)]">|</span>
            <span>{marches.length} en pipeline</span>
            <span className="text-[var(--color-border-subtle)]">|</span>
            <span className="text-emerald-400 font-medium">{kpis.gagnes} gagnés</span>
          </div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Ouverts", value: kpis.ouverts, icon: Building2, color: "cyan" },
            { label: "Pertinents", value: kpis.pertinents, icon: Target, color: "cyan" },
            { label: "Urgents (<7j)", value: kpis.urgents, icon: AlertTriangle, color: kpis.urgents > 0 ? "red" : "cyan" },
            { label: "En pipeline", value: kpis.enPipeline, icon: TrendingUp, color: "cyan" },
            { label: "Gagnés", value: kpis.gagnes, icon: Trophy, color: "green" },
            { label: "Pipeline EUR", value: formatCurrency(kpis.pipelineValue), icon: Briefcase, color: "cyan" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3"
            >
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                <kpi.icon className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className={cn(
                "mt-1.5 font-[family-name:var(--font-clash-display)] text-xl font-bold",
                kpi.color === "red" ? "text-red-400" : kpi.color === "green" ? "text-emerald-400" : "text-cyan-400",
              )}>
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition",
                activeTab === tab.id
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
           TAB 1: VEILLE — BOAMP Live Feed
           ═══════════════════════════════════════════════════ */}
        {activeTab === "veille" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Filter Bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Rechercher un marché..."
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <button onClick={handleSearch} className="rounded-lg bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20">
                  Chercher
                </button>
                <button onClick={() => fetchTenders(activeSearch || undefined)} className="rounded-lg p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">
                  <RefreshCw className="h-4 w-4" />
                </button>
                {activeSearch && (
                  <button onClick={() => { setActiveSearch(""); setSearchQuery(""); fetchTenders(); }} className="rounded-lg p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {TENDER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition",
                      categoryFilter === cat.id ? "bg-cyan-500/20 text-cyan-400" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--color-text-muted)]" />
                <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none">
                  <option value="relevance">Pertinence</option>
                  <option value="publication">Date publication</option>
                  <option value="deadline">Date limite</option>
                </select>
              </div>
            </div>

            {/* Batch import */}
            {processedTenders.length > 0 && (
              <div className="flex items-center justify-between">
                {activeSearch && (
                  <span className="text-sm text-[var(--color-text-muted)]">
                    <Search className="mr-1.5 inline h-3.5 w-3.5" />
                    &quot;{activeSearch}&quot; — {processedTenders.length} résultats
                  </span>
                )}
                <button
                  onClick={batchImport}
                  disabled={batchImporting}
                  className="ml-auto flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                >
                  {batchImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Importer les 10 plus pertinents
                </button>
              </div>
            )}

            {/* Loading / Error */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                <span className="ml-3 text-sm text-[var(--color-text-muted)]">Interrogation BOAMP...</span>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{error}</div>
            )}

            {/* Tender Cards */}
            {!loading && !error && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {processedTenders.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-[var(--color-text-muted)]">
                    <Building2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p className="font-[family-name:var(--font-clash-display)] text-lg">Le territoire est vierge.</p>
                  </div>
                ) : (
                  processedTenders.map((tender, i) => {
                    const alreadyImported = marches.some((m) => m.boamp_id === tender.id);
                    return (
                      <VeilleTenderCard
                        key={tender.id || i}
                        tender={tender}
                        relevance={tender.relevance}
                        daysLeft={tender.daysLeft}
                        alreadyImported={alreadyImported}
                        importing={importing === tender.id}
                        onImport={() => importTender(tender, tender.relevance)}
                        index={i}
                      />
                    );
                  })
                )}
              </div>
            )}

            {/* Achats Innovants */}
            <CollapsibleSection
              icon={<Lightbulb className="h-5 w-5 text-amber-400" />}
              title="Achats Innovants"
              subtitle="< 100K EUR HT — sans publicité, sans concurrence"
              open={achatsOpen}
              onToggle={() => setAchatsOpen(!achatsOpen)}
            >
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 text-sm text-amber-200/80">
                  <strong>Article R2122-9</strong> — Marchés innovants &lt; 100K EUR HT. BYSS GROUP peut prospecter directement.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ACHAT_INNOVANT_TARGETS.map((org) => (
                    <div key={org.name} className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] p-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">{org.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{org.fullName}</p>
                      </div>
                      <span className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                        org.type === "collectivite" && "bg-purple-500/15 text-purple-400",
                        org.type === "etat" && "bg-blue-500/15 text-blue-400",
                        org.type === "commune" && "bg-emerald-500/15 text-emerald-400",
                        org.type === "epci" && "bg-cyan-500/15 text-cyan-400",
                        org.type === "sante" && "bg-red-500/15 text-red-400",
                        org.type === "education" && "bg-amber-500/15 text-amber-400",
                      )}>{org.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Platforms */}
            <CollapsibleSection
              icon={<Globe className="h-5 w-5 text-cyan-400" />}
              title="Plateformes"
              open={platformsOpen}
              onToggle={() => setPlatformsOpen(!platformsOpen)}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MARCHES_PLATFORMS.map((p) => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] p-3 transition hover:border-cyan-500/30">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-cyan-400 transition">{p.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{p.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] group-hover:text-cyan-400 transition" />
                  </a>
                ))}
              </div>
            </CollapsibleSection>

            {/* CPV Reference */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
              <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                <Shield className="h-4 w-4" />
                Codes CPV BYSS GROUP
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...BYSS_CPV_CODES.primary, ...BYSS_CPV_CODES.secondary].map((cpv) => (
                  <span key={cpv.code} className="rounded bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]">
                    <span className="font-mono text-cyan-400/70">{cpv.code}</span>
                    <span className="ml-1.5">{cpv.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════
           TAB 2: PIPELINE — Kanban Board
           ═══════════════════════════════════════════════════ */}
        {activeTab === "pipeline" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {marchesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              </div>
            ) : marches.length === 0 ? (
              <div className="py-20 text-center text-[var(--color-text-muted)]">
                <TrendingUp className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="font-[family-name:var(--font-clash-display)] text-lg">Le pipeline est vide.</p>
                <p className="mt-1 text-sm">Importez des marchés depuis l&apos;onglet Veille.</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {pipelineGroups.map((group) => (
                  <div key={group.id} className="min-w-[280px] flex-1">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">{group.label}</h3>
                      <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-bold text-[var(--color-text-muted)]">
                        {group.items.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {group.items.map((m) => (
                        <PipelineCard
                          key={m.id}
                          marche={m}
                          onClick={() => { setSelectedMarche(m); setDetailOpen(true); }}
                        />
                      ))}
                      {group.items.length === 0 && (
                        <div className="rounded-lg border border-dashed border-[var(--color-border-subtle)] p-4 text-center text-xs text-[var(--color-text-muted)]">
                          Aucun marché
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NO GO / Lost section */}
            {marches.filter((m) => ["no_go", "lost"].includes(m.status)).length > 0 && (
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Archivés (NO GO / Perdus)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {marches.filter((m) => ["no_go", "lost"].includes(m.status)).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedMarche(m); setDetailOpen(true); }}
                      className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] p-2.5 text-left text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                    >
                      {m.status === "no_go" ? <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" /> : <X className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                      <span className="line-clamp-1">{m.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════
           TAB 3: ANALYSE IA
           ═══════════════════════════════════════════════════ */}
        {activeTab === "analyse" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {marches.length === 0 ? (
              <div className="py-20 text-center text-[var(--color-text-muted)]">
                <Brain className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="font-[family-name:var(--font-clash-display)] text-lg">Rien à analyser.</p>
                <p className="mt-1 text-sm">Importez des marchés depuis l&apos;onglet Veille.</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 space-y-4">
                  <h3 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                    Analyse approfondie
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Claude analyse le marché vs les capacités BYSS, identifie les compétences manquantes, propose des partenaires GME, estime l&apos;effort et génère une recommandation GO/NO-GO.
                  </p>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Marché à analyser
                      </label>
                      <select
                        value={analyzeTarget}
                        onChange={(e) => setAnalyzeTarget(e.target.value)}
                        className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
                      >
                        <option value="">Sélectionner...</option>
                        {marches.map((m) => (
                          <option key={m.id} value={m.id}>{m.title} — {m.acheteur}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={runAnalysis}
                      disabled={!analyzeTarget || analyzing}
                      className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                    >
                      {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                      Analyser avec Claude
                    </button>
                  </div>
                </div>

                {/* Analysis Result */}
                {analyzing && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
                    <p className="mt-4 text-sm text-[var(--color-text-muted)]">Sorel analyse le marché...</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">Capacités BYSS, compétences, partenaires, effort, pricing</p>
                  </div>
                )}

                {analysisResult && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-cyan-500/20 bg-[#0F0F1A] p-6"
                  >
                    <h4 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-lg font-bold text-cyan-400">
                      <Brain className="h-5 w-5" />
                      Résultat de l&apos;analyse
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-[var(--color-text-muted)]">
                      {analysisResult}
                    </div>
                  </motion.div>
                )}

                {/* Previously analyzed */}
                {marches.filter((m) => m.ai_analysis).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Analyses précédentes</h4>
                    {marches.filter((m) => m.ai_analysis).map((m) => (
                      <div key={m.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-[var(--color-text)] line-clamp-1">{m.title}</h5>
                          {m.go_no_go && (
                            <span className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-bold",
                              m.go_no_go === "GO" ? "bg-emerald-500/10 text-emerald-400" :
                              m.go_no_go === "NO-GO" ? "bg-red-500/10 text-red-400" :
                              "bg-amber-500/10 text-amber-400",
                            )}>{m.go_no_go}</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 whitespace-pre-wrap">{m.ai_analysis}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════
           TAB 4: MÉMOIRE TECHNIQUE
           ═══════════════════════════════════════════════════ */}
        {activeTab === "memoire" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {goMarches.length === 0 ? (
              <div className="py-20 text-center text-[var(--color-text-muted)]">
                <FileText className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="font-[family-name:var(--font-clash-display)] text-lg">Aucun marché GO.</p>
                <p className="mt-1 text-sm">Passez un marché en statut GO pour générer un mémoire technique.</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 space-y-4">
                  <h3 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                    Génération Mémoire Technique
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Claude génère un squelette structuré basé sur l&apos;analyse du CCTP. Chaque section est éditable.
                  </p>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Marché GO
                      </label>
                      <select
                        value={memoireTarget}
                        onChange={(e) => { setMemoireTarget(e.target.value); setMemoireSections({}); }}
                        className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-cyan-500/50 focus:outline-none"
                      >
                        <option value="">Sélectionner...</option>
                        {goMarches.map((m) => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={generateMemoire}
                      disabled={!memoireTarget || generatingMemoire}
                      className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                    >
                      {generatingMemoire ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Générer le squelette
                    </button>
                  </div>
                </div>

                {/* Mémoire sections */}
                {Object.keys(memoireSections).length > 0 && (
                  <div className="space-y-4">
                    {MEMOIRE_SECTIONS.map((section) => (
                      <div key={section.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                        <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                          {section.label}
                        </label>
                        <textarea
                          value={memoireSections[section.id] || ""}
                          onChange={(e) => setMemoireSections((prev) => ({ ...prev, [section.id]: e.target.value }))}
                          rows={6}
                          placeholder={section.placeholder}
                          className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/30 focus:border-cyan-500/50 focus:outline-none resize-y"
                        />
                      </div>
                    ))}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={saveMemoire}
                        disabled={savingMemoire}
                        className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                      >
                        {savingMemoire ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => window.open(`/api/invoice-pdf?type=memoire&id=${memoireTarget}`, "_blank")}
                        className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-6 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:border-cyan-500/30 hover:text-cyan-400"
                      >
                        <FileText className="h-4 w-4" />
                        Exporter PDF
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing mémoires */}
                {marches.filter((m) => m.memoire_technique).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Mémoires existants</h4>
                    {marches.filter((m) => m.memoire_technique).map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
                        <div>
                          <h5 className="text-sm font-medium text-[var(--color-text)]">{m.title}</h5>
                          <p className="text-xs text-[var(--color-text-muted)]">{m.acheteur}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setMemoireTarget(m.id); /* parse sections */ }}
                            className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          >
                            <Eye className="mr-1 inline h-3 w-3" />
                            Voir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

      </div>

      {/* Detail Modal */}
      <MarcheDetailModal
        marche={selectedMarche}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onStatusChange={updateMarcheStatus}
        onSave={saveMarche}
        onDelete={deleteMarche}
        onLinkCRM={linkToCRM}
        onCreateInvoice={createInvoice}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VEILLE TENDER CARD — BOAMP tender with import button
   ═══════════════════════════════════════════════════════════════ */
function VeilleTenderCard({
  tender, relevance, daysLeft, alreadyImported, importing, onImport, index,
}: {
  tender: Tender & { relevance: number; daysLeft: number | null };
  relevance: number;
  daysLeft: number | null;
  alreadyImported: boolean;
  importing: boolean;
  onImport: () => void;
  index: number;
}) {
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  const expired = daysLeft !== null && daysLeft < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      className={cn(
        "group rounded-xl border bg-[#0F0F1A] p-4 transition",
        alreadyImported
          ? "border-cyan-500/20 bg-cyan-500/[0.02]"
          : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-subtle)]/80",
        expired && "opacity-50",
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
          {tender.nature || "Marché"}
        </span>
        <div className="flex items-center gap-1.5">
          {alreadyImported && (
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Importé</span>
          )}
          {daysLeft !== null && !expired && (
            <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", urgent ? "bg-red-500/15 text-red-400 animate-pulse" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}>
              J-{daysLeft}
            </span>
          )}
          {expired && <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-text-muted)]">Clos</span>}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)] line-clamp-2">{tender.intitule}</h3>

      {/* Buyer */}
      <p className="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Building2 className="h-3 w-3" />{tender.acheteur}
      </p>

      {/* Dates */}
      <div className="mb-3 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Pub. {formatDate(tender.datePublication)}</span>
        {tender.dateLimite && (
          <span className={cn("flex items-center gap-1", urgent && "text-red-400 font-medium")}>
            <AlertTriangle className="h-3 w-3" />Lim. {formatDate(tender.dateLimite)}
          </span>
        )}
      </div>

      {/* Tags */}
      {tender.descripteur && (
        <div className="mb-3 flex flex-wrap gap-1">
          {tender.descripteur.split(/[,;]/).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">{tag.trim()}</span>
          ))}
        </div>
      )}

      {/* Relevance bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Pertinence</span>
          <span className={cn("text-xs font-bold", relevance >= 60 ? "text-emerald-400" : relevance >= 30 ? "text-amber-400" : "text-[var(--color-text-muted)]")}>
            {relevance}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-[var(--color-surface)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${relevance}%` }}
            transition={{ duration: 0.8, delay: index * 0.03 }}
            className={cn("h-1 rounded-full", relevance >= 60 ? "bg-emerald-400" : relevance >= 30 ? "bg-amber-400" : "bg-gray-500/30")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!alreadyImported ? (
          <button
            onClick={onImport}
            disabled={importing}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {importing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            Importer
          </button>
        ) : (
          <span className="text-xs text-emerald-400/60">Dans le pipeline</span>
        )}
        {tender.urlAvis && (
          <a href={tender.urlAvis} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]">
            <ExternalLink className="h-3 w-3" />Ouvrir
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PIPELINE CARD — Kanban card for saved marchés
   ═══════════════════════════════════════════════════════════════ */
function PipelineCard({ marche, onClick }: { marche: MarcheRow; onClick: () => void }) {
  const daysLeft = daysUntil(marche.date_limite);
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3.5 text-left transition hover:border-cyan-500/30"
    >
      <h4 className="text-sm font-medium text-[var(--color-text)] line-clamp-2 mb-1.5">{marche.title}</h4>
      <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-2">
        <Building2 className="h-3 w-3" />{marche.acheteur || "—"}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {daysLeft !== null && daysLeft >= 0 && (
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", urgent ? "bg-red-500/15 text-red-400" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}>
              J-{daysLeft}
            </span>
          )}
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", marche.relevance_score >= 60 ? "bg-emerald-500/10 text-emerald-400" : marche.relevance_score >= 30 ? "bg-amber-500/10 text-amber-400" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}>
            {marche.relevance_score}%
          </span>
        </div>
        {(marche.budget_proposed || marche.budget_estimated) && (
          <span className="text-xs font-medium text-cyan-400">
            {formatCurrency(marche.budget_proposed || marche.budget_estimated)}
          </span>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION — Reusable accordion
   ═══════════════════════════════════════════════════════════════ */
function CollapsibleSection({
  icon, title, subtitle, open, onToggle, children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">{title}</h2>
            {subtitle && <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>}
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="h-5 w-5 text-[var(--color-text-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border-t border-[var(--color-border-subtle)] p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
