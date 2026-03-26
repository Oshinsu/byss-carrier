"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { Building2, Search, TrendingUp, AlertTriangle, Target, Trophy, Briefcase, Brain, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreTenderRelevance, TENDER_CATEGORIES } from "@/lib/data/cpv-codes";
import { MARCHE_PIPELINE, MEMOIRE_SECTIONS, type MarcheStatus, type MarcheRow } from "@/lib/marches";
import MarcheDetailModal from "@/components/marches/marche-detail-modal";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onMarcheStatusChanged } from "@/lib/synergies";
import { VeilleTab } from "@/components/marches/veille-tab";
import { PipelineTab } from "@/components/marches/pipeline-tab";
import { AnalyseTab } from "@/components/marches/analyse-tab";
import { MemoireTab } from "@/components/marches/memoire-tab";

interface Tender { id: string; intitule: string; acheteur: string; nature: string; datePublication: string; dateLimite: string; descripteur: string; familleActivite: string; departement: string; typeAvis: string; codeCPV: string; procedure: string; urlAvis: string; }
type TabId = "veille" | "pipeline" | "analyse" | "memoire";
type SortMode = "publication" | "deadline" | "relevance";

function daysUntil(dateStr: string | null): number | null { if (!dateStr) return null; const t = new Date(dateStr); if (isNaN(t.getTime())) return null; return Math.ceil((t.getTime() - Date.now()) / 86_400_000); }
function formatCurrency(n: number | null): string { if (!n) return "\u2014"; return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }); }

export default function MarchesPublicsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("veille");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [importing, setImporting] = useState<string | null>(null);
  const [batchImporting, setBatchImporting] = useState(false);
  const [marches, setMarches] = useState<MarcheRow[]>([]);
  const [marchesLoading, setMarchesLoading] = useState(false);
  const [selectedMarche, setSelectedMarche] = useState<MarcheRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [analyzeTarget, setAnalyzeTarget] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [memoireTarget, setMemoireTarget] = useState("");
  const [generatingMemoire, setGeneratingMemoire] = useState(false);
  const [memoireSections, setMemoireSections] = useState<Record<string, string>>({});
  const [savingMemoire, setSavingMemoire] = useState(false);
  const [achatsOpen, setAchatsOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);

  const supabase = createClient();
  const { toast } = useToast();

  const fetchTenders = useCallback(async (query?: string) => {
    setLoading(true); setError(null);
    try { const action = query ? "search" : "latest"; const params = new URLSearchParams({ action }); if (query) params.set("q", query); params.set("limit", "50");
      const res = await fetch(`/api/boamp?${params}`); if (!res.ok) throw new Error("Erreur BOAMP"); const data = await res.json(); setTenders(data.results ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur chargement"); setTenders([]); } finally { setLoading(false); }
  }, []);

  const fetchMarches = useCallback(async () => {
    setMarchesLoading(true);
    try { const { data, error: err } = await supabase.from("marches_publics").select("*").order("created_at", { ascending: false }); if (err) throw err; setMarches((data as MarcheRow[]) ?? []); }
    catch { setMarches([]); } finally { setMarchesLoading(false); }
  }, []);

  useEffect(() => { fetchTenders(); }, [fetchTenders]);
  useEffect(() => { if (activeTab === "pipeline" || activeTab === "analyse" || activeTab === "memoire") { if (marches.length === 0 && !marchesLoading) fetchMarches(); } }, [activeTab, marches.length, marchesLoading, fetchMarches]);

  const handleSearch = () => { if (searchQuery.trim()) { setActiveSearch(searchQuery.trim()); fetchTenders(searchQuery.trim()); } else { setActiveSearch(""); fetchTenders(); } };

  const importTender = async (tender: Tender, score: number) => {
    setImporting(tender.id);
    try { const res = await fetch("/api/boamp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "import", tender, relevanceScore: score }) });
      if (!res.ok) throw new Error("Erreur import"); const data = await res.json();
      if (data.duplicate) toast("Marche deja importe", "info"); else toast("Marche importe dans le pipeline", "success"); await fetchMarches();
    } catch (err) { console.error("Import error:", err); toast("Erreur import marche", "error"); } finally { setImporting(null); }
  };

  const batchImport = async () => { setBatchImporting(true); const top10 = processedTenders.slice(0, 10); for (const t of top10) { await importTender(t, t.relevance); } toast(`${top10.length} marches importes`, "success"); setBatchImporting(false); };

  const updateMarcheStatus = async (id: string, status: MarcheStatus) => {
    const { error: updateErr } = await supabase.from("marches_publics").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (updateErr) { toast("Erreur mise a jour statut", "error"); return; }
    toast(`Statut \u2192 ${status.toUpperCase()}`, "success");
    try { const m = marches.find((x) => x.id === id); if (m) await onMarcheStatusChanged(id, m.title, m.acheteur || "Inconnu", status, m.budget_proposed ?? 0); } catch { /* synergy fire-and-forget */ }
    setMarches((prev) => prev.map((m) => m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m));
    if (selectedMarche?.id === id) setSelectedMarche((prev) => prev ? { ...prev, status } : prev);
  };

  const saveMarche = async (id: string, data: Partial<MarcheRow>) => {
    const { error: saveErr } = await supabase.from("marches_publics").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
    if (saveErr) { toast("Erreur sauvegarde", "error"); return; }
    toast("Marche sauvegarde", "success"); setMarches((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMarche = async (id: string) => {
    const { error: delErr } = await supabase.from("marches_publics").delete().eq("id", id);
    if (delErr) { toast("Erreur suppression", "error"); return; }
    toast("Marche supprime", "success"); setMarches((prev) => prev.filter((m) => m.id !== id)); setDetailOpen(false);
  };

  const linkToCRM = async (m: MarcheRow) => {
    const { data, error: crmErr } = await supabase.from("prospects").insert({ name: m.acheteur || "Prospect march\u00e9 public", sector: "Public", stage: "contact_froid", source: "March\u00e9 public", notes: `March\u00e9: ${m.title}`, basket: m.budget_proposed || m.budget_estimated || 0 }).select("id").single();
    if (crmErr) { toast("Erreur liaison CRM", "error"); return; }
    if (data) { await supabase.from("marches_publics").update({ prospect_id: data.id }).eq("id", m.id); setMarches((prev) => prev.map((x) => x.id === m.id ? { ...x, prospect_id: data.id } : x)); toast("Prospect cree et lie au marche", "success"); }
  };

  const createInvoice = (m: MarcheRow) => { window.location.href = `/finance?newInvoice=true&client=${encodeURIComponent(m.acheteur || "")}&amount=${m.budget_proposed || ""}&ref=${encodeURIComponent(m.title)}`; };

  const runAnalysis = async () => {
    if (!analyzeTarget) return; const target = marches.find((m) => m.id === analyzeTarget); if (!target) return;
    setAnalyzing(true); setAnalysisResult(null);
    try { const res = await fetch("/api/boamp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "analyze", marcheId: target.id }) });
      if (!res.ok) throw new Error("Erreur analyse"); const data = await res.json(); setAnalysisResult(data.analysis || "Analyse indisponible"); toast(`Analyse terminee \u2014 ${data.goNoGo || ""}`, "success"); await fetchMarches();
    } catch { setAnalysisResult("Erreur lors de l'analyse IA."); toast("Erreur analyse IA", "error"); } finally { setAnalyzing(false); }
  };

  const generateMemoire = async () => {
    if (!memoireTarget) return; const target = marches.find((m) => m.id === memoireTarget); if (!target) return;
    setGeneratingMemoire(true);
    try { const res = await fetch("/api/boamp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "generate_memoire", marcheId: target.id }) });
      if (!res.ok) throw new Error("Erreur g\u00e9n\u00e9ration"); const data = await res.json(); setMemoireSections(data.sections || {}); toast("Memoire technique genere", "success");
    } catch { setMemoireSections({}); toast("Erreur generation memoire", "error"); } finally { setGeneratingMemoire(false); }
  };

  const saveMemoire = async () => {
    if (!memoireTarget) return; setSavingMemoire(true);
    const content = Object.entries(memoireSections).map(([key, val]) => { const section = MEMOIRE_SECTIONS.find((s) => s.id === key); return `## ${section?.label || key}\n\n${val}`; }).join("\n\n---\n\n");
    const { error: memErr } = await supabase.from("marches_publics").update({ memoire_technique: content, updated_at: new Date().toISOString() }).eq("id", memoireTarget);
    if (memErr) toast("Erreur sauvegarde memoire", "error"); else toast("Memoire technique sauvegarde", "success");
    await fetchMarches(); setSavingMemoire(false);
  };

  const processedTenders = useMemo(() => {
    let filtered = [...tenders];
    if (categoryFilter !== "tous") { const cat = TENDER_CATEGORIES.find((c) => c.id === categoryFilter); if (cat && "keywords" in cat) { filtered = filtered.filter((t) => { const text = `${t.intitule} ${t.descripteur} ${t.familleActivite}`.toLowerCase(); return (cat.keywords as readonly string[]).some((kw) => text.includes(kw)); }); } }
    const scored = filtered.map((t) => ({ ...t, relevance: scoreTenderRelevance(t.intitule, t.descripteur), daysLeft: daysUntil(t.dateLimite) }));
    switch (sortMode) {
      case "deadline": scored.sort((a, b) => { if (a.daysLeft === null) return 1; if (b.daysLeft === null) return -1; return a.daysLeft - b.daysLeft; }); break;
      case "relevance": scored.sort((a, b) => b.relevance - a.relevance); break;
      default: scored.sort((a, b) => { if (!a.datePublication) return 1; if (!b.datePublication) return -1; return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime(); }); }
    return scored;
  }, [tenders, categoryFilter, sortMode]);

  const kpis = useMemo(() => {
    const now = new Date(); const ouverts = tenders.filter((t) => !t.dateLimite || new Date(t.dateLimite) > now);
    const pertinents = tenders.filter((t) => scoreTenderRelevance(t.intitule, t.descripteur) >= 40);
    const urgents = tenders.filter((t) => { const d = daysUntil(t.dateLimite); return d !== null && d >= 0 && d <= 7; });
    const enPipeline = marches.filter((m) => !["no_go", "lost"].includes(m.status)).length;
    const gagnes = marches.filter((m) => m.status === "won").length;
    const pipelineValue = marches.filter((m) => ["go", "drafting", "submitted"].includes(m.status)).reduce((acc, m) => acc + (m.budget_proposed || m.budget_estimated || 0), 0);
    return { ouverts: ouverts.length, pertinents: pertinents.length, urgents: urgents.length, enPipeline, gagnes, pipelineValue };
  }, [tenders, marches]);

  const pipelineGroups = useMemo(() => MARCHE_PIPELINE.map((phase) => ({ ...phase, items: marches.filter((m) => m.status === phase.id) })), [marches]);
  const goMarches = useMemo(() => marches.filter((m) => ["go", "drafting"].includes(m.status)), [marches]);

  const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "veille", label: "Veille", icon: Search }, { id: "pipeline", label: "Pipeline", icon: TrendingUp },
    { id: "analyse", label: "Analyse IA", icon: Brain }, { id: "memoire", label: "M\u00e9moire Technique", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#06080F] p-4 md:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-clash-display)] text-3xl md:text-4xl font-bold tracking-tight"><span className="text-[var(--color-text)]">March\u00e9s </span><span className="text-cyan-400">Publics</span></h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Veille BOAMP + Pipeline + Analyse IA + M\u00e9moire Technique</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />BOAMP Live \u2014 972</div>
            <span className="text-[var(--color-border-subtle)]">|</span><span>{marches.length} en pipeline</span>
            <span className="text-[var(--color-border-subtle)]">|</span><span className="text-emerald-400 font-medium">{kpis.gagnes} gagn\u00e9s</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[{ label: "Ouverts", value: kpis.ouverts, icon: Building2, color: "cyan" }, { label: "Pertinents", value: kpis.pertinents, icon: Target, color: "cyan" },
            { label: "Urgents (<7j)", value: kpis.urgents, icon: AlertTriangle, color: kpis.urgents > 0 ? "red" : "cyan" }, { label: "En pipeline", value: kpis.enPipeline, icon: TrendingUp, color: "cyan" },
            { label: "Gagn\u00e9s", value: kpis.gagnes, icon: Trophy, color: "green" }, { label: "Pipeline EUR", value: formatCurrency(kpis.pipelineValue), icon: Briefcase, color: "cyan" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-3">
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><kpi.icon className="h-3.5 w-3.5" /><span className="text-[10px] uppercase tracking-wider">{kpi.label}</span></div>
              <p className={cn("mt-1.5 font-[family-name:var(--font-clash-display)] text-xl font-bold", kpi.color === "red" ? "text-red-400" : kpi.color === "green" ? "text-emerald-400" : "text-cyan-400")}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14] p-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition",
                activeTab === tab.id ? "bg-cyan-500/10 text-cyan-400" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]")}>
              <tab.icon className="h-4 w-4" /><span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "veille" && (
          <VeilleTab processedTenders={processedTenders} marches={marches} loading={loading} error={error}
            searchQuery={searchQuery} activeSearch={activeSearch} categoryFilter={categoryFilter} sortMode={sortMode}
            importing={importing} batchImporting={batchImporting} achatsOpen={achatsOpen} platformsOpen={platformsOpen}
            onSearchQueryChange={setSearchQuery} onSearch={handleSearch} onRefresh={() => fetchTenders(activeSearch || undefined)}
            onClearSearch={() => { setActiveSearch(""); setSearchQuery(""); fetchTenders(); }}
            onCategoryFilter={setCategoryFilter} onSortMode={setSortMode}
            onImport={importTender} onBatchImport={batchImport}
            onAchatsToggle={() => setAchatsOpen(!achatsOpen)} onPlatformsToggle={() => setPlatformsOpen(!platformsOpen)} />
        )}

        {activeTab === "pipeline" && (
          <PipelineTab marches={marches} marchesLoading={marchesLoading} pipelineGroups={pipelineGroups}
            onMarcheClick={(m) => { setSelectedMarche(m); setDetailOpen(true); }} />
        )}

        {activeTab === "analyse" && (
          <AnalyseTab marches={marches} analyzeTarget={analyzeTarget} analyzing={analyzing} analysisResult={analysisResult}
            onAnalyzeTargetChange={setAnalyzeTarget} onRunAnalysis={runAnalysis} />
        )}

        {activeTab === "memoire" && (
          <MemoireTab goMarches={goMarches} marches={marches} memoireTarget={memoireTarget}
            generatingMemoire={generatingMemoire} memoireSections={memoireSections} savingMemoire={savingMemoire}
            onMemoireTargetChange={(v) => { setMemoireTarget(v); setMemoireSections({}); }}
            onGenerate={generateMemoire} onSectionChange={(k, v) => setMemoireSections((prev) => ({ ...prev, [k]: v }))}
            onSave={saveMemoire} onExportPdf={() => window.open(`/api/invoice-pdf?type=memoire&id=${memoireTarget}`, "_blank")}
            onViewMemoire={(id) => setMemoireTarget(id)} />
        )}
      </div>

      <MarcheDetailModal marche={selectedMarche} open={detailOpen} onClose={() => setDetailOpen(false)}
        onStatusChange={updateMarcheStatus} onSave={saveMarche} onDelete={deleteMarche} onLinkCRM={linkToCRM} onCreateInvoice={createInvoice} />
    </div>
  );
}
