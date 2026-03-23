"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, Search, Clock, TrendingUp, Filter, ExternalLink,
  AlertTriangle, Sparkles, ChevronDown, ChevronRight, Target,
  Briefcase, Users, Globe, Lightbulb, Loader2, X, FileText,
  ArrowRight, Zap, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  scoreTenderRelevance,
  MARCHES_PLATFORMS,
  ACHAT_INNOVANT_TARGETS,
  TENDER_CATEGORIES,
  BYSS_CPV_CODES,
} from "@/lib/data/cpv-codes";

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

interface AnalysisResult {
  matchScore: number;
  relevantServices: string[];
  recommendedTeam: string[];
  estimatedEffort: string;
  goNoGo: "GO" | "NO-GO" | "A EVALUER";
  reasoning: string;
}

type SortMode = "publication" | "deadline" | "relevance";

/* ── Helpers ── */
function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

/* ═══════════════════════════════════════════════════════════════
   MARCHES PUBLICS — Tender Monitoring Dashboard
   ═══════════════════════════════════════════════════════════════ */
export default function MarchesPublicsPage() {
  /* ── State ── */
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [sortMode, setSortMode] = useState<SortMode>("publication");
  const [analysisPanel, setAnalysisPanel] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [achatsOpen, setAchatsOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(true);

  /* ── Fetch tenders ── */
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

  useEffect(() => { fetchTenders(); }, [fetchTenders]);

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

  /* ── Filter & Sort ── */
  const processedTenders = useMemo(() => {
    let filtered = [...tenders];

    // Category filter
    if (categoryFilter !== "tous") {
      const cat = TENDER_CATEGORIES.find((c) => c.id === categoryFilter);
      if (cat && "keywords" in cat) {
        filtered = filtered.filter((t) => {
          const text = `${t.intitule} ${t.descripteur} ${t.familleActivite}`.toLowerCase();
          return (cat.keywords as readonly string[]).some((kw) => text.includes(kw));
        });
      }
    }

    // Add relevance score
    const scored = filtered.map((t) => ({
      ...t,
      relevance: scoreTenderRelevance(t.intitule, t.descripteur),
      daysLeft: daysUntil(t.dateLimite),
    }));

    // Sort
    switch (sortMode) {
      case "deadline":
        scored.sort((a, b) => {
          if (a.daysLeft === null) return 1;
          if (b.daysLeft === null) return -1;
          return a.daysLeft - b.daysLeft;
        });
        break;
      case "relevance":
        scored.sort((a, b) => b.relevance - a.relevance);
        break;
      default:
        scored.sort((a, b) => {
          if (!a.datePublication) return 1;
          if (!b.datePublication) return -1;
          return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
        });
    }

    return scored;
  }, [tenders, categoryFilter, sortMode]);

  /* ── KPI calculations ── */
  const kpis = useMemo(() => {
    const now = new Date();
    const ouverts = tenders.filter((t) => {
      if (!t.dateLimite) return true;
      return new Date(t.dateLimite) > now;
    });
    const pertinents = tenders.filter(
      (t) => scoreTenderRelevance(t.intitule, t.descripteur) >= 40,
    );
    const urgents = tenders.filter((t) => {
      const d = daysUntil(t.dateLimite);
      return d !== null && d >= 0 && d <= 7;
    });
    const pipeline = pertinents.length * 25_000; // Estimate 25K avg

    return {
      ouverts: ouverts.length,
      pertinents: pertinents.length,
      urgents: urgents.length,
      pipeline,
    };
  }, [tenders]);

  /* ── Analyze tender ── */
  const analyzeTender = async (tender: Tender) => {
    setAnalysisPanel(tender.id);
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "sorel",
          action: "analyze_tender",
          prompt: `Analyse ce marché public pour BYSS GROUP (agence numérique Martinique : développement web/mobile, IA, vidéo, marketing digital, formation, conseil IT).

Marché: ${tender.intitule}
Acheteur: ${tender.acheteur}
Nature: ${tender.nature}
Descripteur: ${tender.descripteur}
CPV: ${tender.codeCPV}
Procédure: ${tender.procedure}
Date limite: ${tender.dateLimite}

Réponds en JSON strict:
{
  "matchScore": number 0-100,
  "relevantServices": ["service1", "service2"],
  "recommendedTeam": ["membre1", "membre2"],
  "estimatedEffort": "X jours/semaines",
  "goNoGo": "GO" | "NO-GO" | "A EVALUER",
  "reasoning": "explication courte"
}`,
        }),
      });

      if (!res.ok) throw new Error("Erreur analyse");
      const data = await res.json();

      // Parse AI response
      let parsed: AnalysisResult;
      try {
        const text = typeof data.data === "string" ? data.data : JSON.stringify(data.data);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        parsed = {
          matchScore: scoreTenderRelevance(tender.intitule, tender.descripteur),
          relevantServices: ["Analyse automatique indisponible"],
          recommendedTeam: ["Gary Bissol"],
          estimatedEffort: "A estimer",
          goNoGo: "A EVALUER",
          reasoning: "L'IA n'a pas pu analyser ce marché. Score basé sur les mots-clés.",
        };
      }

      setAnalysisResult(parsed);
    } catch {
      setAnalysisResult({
        matchScore: scoreTenderRelevance(tender.intitule, tender.descripteur),
        relevantServices: ["Développement web", "Conseil IT"],
        recommendedTeam: ["Gary Bissol"],
        estimatedEffort: "A estimer",
        goNoGo: "A EVALUER",
        reasoning: "Analyse IA indisponible. Score calculé par mots-clés.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

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
              {tenders.length} appels d&apos;offres Martinique — BOAMP + CTM + TED
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>BOAMP Live — 972</span>
          </div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Marchés ouverts", value: kpis.ouverts, icon: Building2, color: "cyan" },
            { label: "Pertinents BYSS", value: kpis.pertinents, icon: Target, color: "cyan" },
            { label: "Deadline < 7j", value: kpis.urgents, icon: AlertTriangle, color: kpis.urgents > 0 ? "red" : "cyan" },
            { label: "Pipeline estimé", value: `${(kpis.pipeline / 1000).toFixed(0)}K€`, icon: TrendingUp, color: "cyan" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4"
            >
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <kpi.icon className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className={cn(
                "mt-2 font-[family-name:var(--font-clash-display)] text-2xl font-bold",
                kpi.color === "red" ? "text-red-400" : "text-cyan-400",
              )}>
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
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
            <button
              onClick={handleSearch}
              className="rounded-lg bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
            >
              Chercher
            </button>
            {activeSearch && (
              <button
                onClick={() => { setActiveSearch(""); setSearchQuery(""); fetchTenders(); }}
                className="rounded-lg p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {TENDER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  categoryFilter === cat.id
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--color-text-muted)]" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none"
            >
              <option value="publication">Date publication</option>
              <option value="deadline">Date limite</option>
              <option value="relevance">Pertinence</option>
            </select>
          </div>
        </div>

        {/* ── Active search tag ── */}
        {activeSearch && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <Search className="h-3.5 w-3.5" />
            Résultats pour &quot;<span className="text-cyan-400">{activeSearch}</span>&quot;
            — {processedTenders.length} marchés
          </div>
        )}

        {/* ── Loading / Error ── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            <span className="ml-3 text-sm text-[var(--color-text-muted)]">Interrogation BOAMP...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Tender Cards + Analysis Panel ── */}
        {!loading && !error && (
          <div className="flex gap-6">
            {/* Cards Grid */}
            <div className={cn("flex-1 grid gap-4", analysisPanel ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3")}>
              {processedTenders.length === 0 ? (
                <div className="col-span-full py-20 text-center text-[var(--color-text-muted)]">
                  <Building2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p className="font-[family-name:var(--font-clash-display)] text-lg">Le territoire est vierge.</p>
                  <p className="mt-1 text-sm">Aucun marché trouvé pour ces critères.</p>
                </div>
              ) : (
                processedTenders.map((tender, i) => (
                  <TenderCard
                    key={tender.id || i}
                    tender={tender}
                    relevance={tender.relevance}
                    daysLeft={tender.daysLeft}
                    isSelected={analysisPanel === tender.id}
                    onAnalyze={() => analyzeTender(tender)}
                    index={i}
                  />
                ))
              )}
            </div>

            {/* Analysis Sidebar */}
            <AnimatePresence>
              {analysisPanel && (
                <motion.div
                  initial={{ opacity: 0, x: 40, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 400 }}
                  exit={{ opacity: 0, x: 40, width: 0 }}
                  className="hidden lg:block shrink-0"
                >
                  <div className="sticky top-4 rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-cyan-400">
                        Analyse BYSS
                      </h3>
                      <button
                        onClick={() => { setAnalysisPanel(null); setAnalysisResult(null); }}
                        className="rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {analyzing ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                        <p className="mt-3 text-sm text-[var(--color-text-muted)]">Sorel analyse le marché...</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4">
                        {/* Score */}
                        <div className="text-center">
                          <div className={cn(
                            "inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold font-[family-name:var(--font-clash-display)]",
                            analysisResult.matchScore >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                            analysisResult.matchScore >= 40 ? "bg-amber-500/10 text-amber-400" :
                            "bg-red-500/10 text-red-400",
                          )}>
                            {analysisResult.matchScore}%
                          </div>
                          <p className={cn(
                            "mt-2 font-bold text-sm",
                            analysisResult.goNoGo === "GO" ? "text-emerald-400" :
                            analysisResult.goNoGo === "NO-GO" ? "text-red-400" :
                            "text-amber-400",
                          )}>
                            {analysisResult.goNoGo}
                          </p>
                        </div>

                        {/* Reasoning */}
                        <p className="text-sm text-[var(--color-text-muted)]">{analysisResult.reasoning}</p>

                        {/* Services */}
                        <div>
                          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Services pertinents</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.relevantServices.map((s) => (
                              <span key={s} className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-400">{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Team */}
                        <div>
                          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Equipe recommandée</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.recommendedTeam.map((m) => (
                              <span key={m} className="rounded bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text)]">{m}</span>
                            ))}
                          </div>
                        </div>

                        {/* Effort */}
                        <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
                          <span className="text-xs text-[var(--color-text-muted)]">Effort estimé</span>
                          <span className="text-sm font-medium text-[var(--color-text)]">{analysisResult.estimatedEffort}</span>
                        </div>

                        {/* Actions */}
                        <button className="w-full rounded-lg bg-cyan-500/10 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20">
                          <FileText className="mr-2 inline h-4 w-4" />
                          Générer Mémoire Technique
                        </button>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Achats Innovants Section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]"
        >
          <button
            onClick={() => setAchatsOpen(!achatsOpen)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <div>
                <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                  Achats Innovants
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  &lt; 100K€ HT — sans publicité, sans concurrence
                </p>
              </div>
            </div>
            <motion.div animate={{ rotate: achatsOpen ? 180 : 0 }}>
              <ChevronDown className="h-5 w-5 text-[var(--color-text-muted)]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {achatsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[var(--color-border-subtle)] p-4 space-y-4">
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 text-sm text-amber-200/80">
                    <p>
                      <strong>Article R2122-9 du Code de la commande publique</strong> — Les acheteurs publics peuvent
                      attribuer un marché sans publicité ni mise en concurrence pour les marchés de fournitures,
                      services ou travaux innovants dont la valeur estimée est inférieure à 100 000 EUR HT.
                    </p>
                    <p className="mt-2">
                      BYSS GROUP peut prospecter directement ces organismes pour proposer ses solutions IA et numériques.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {ACHAT_INNOVANT_TARGETS.map((org) => (
                      <div
                        key={org.name}
                        className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] p-3"
                      >
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
                        )}>
                          {org.type}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-400 transition hover:bg-amber-500/20">
                    <Users className="h-4 w-4" />
                    Prospecter Directement
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Platforms Section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]"
        >
          <button
            onClick={() => setPlatformsOpen(!platformsOpen)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-cyan-400" />
              <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                Plateformes
              </h2>
            </div>
            <motion.div animate={{ rotate: platformsOpen ? 180 : 0 }}>
              <ChevronDown className="h-5 w-5 text-[var(--color-text-muted)]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {platformsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[var(--color-border-subtle)] p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {MARCHES_PLATFORMS.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] p-3 transition hover:border-cyan-500/30"
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-cyan-400 transition">
                            {platform.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">{platform.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] group-hover:text-cyan-400 transition" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── CPV Codes Reference ── */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
          <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            <Shield className="h-4 w-4" />
            Codes CPV BYSS GROUP
          </h3>
          <div className="flex flex-wrap gap-2">
            {[...BYSS_CPV_CODES.primary, ...BYSS_CPV_CODES.secondary].map((cpv) => (
              <span
                key={cpv.code}
                className="rounded bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]"
              >
                <span className="font-mono text-cyan-400/70">{cpv.code}</span>
                <span className="ml-1.5">{cpv.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TENDER CARD — Individual tender display
   ═══════════════════════════════════════════════════════════════ */
function TenderCard({
  tender,
  relevance,
  daysLeft,
  isSelected,
  onAnalyze,
  index,
}: {
  tender: Tender;
  relevance: number;
  daysLeft: number | null;
  isSelected: boolean;
  onAnalyze: () => void;
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
        isSelected
          ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5"
          : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-subtle)]/80",
        expired && "opacity-50",
      )}
    >
      {/* Top row: nature + deadline */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
          {tender.nature || "Marché"}
        </span>
        {daysLeft !== null && !expired && (
          <span className={cn(
            "rounded px-2 py-0.5 text-[10px] font-bold",
            urgent
              ? "bg-red-500/15 text-red-400 animate-pulse"
              : "bg-[var(--color-surface)] text-[var(--color-text-muted)]",
          )}>
            J-{daysLeft}
          </span>
        )}
        {expired && (
          <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-text-muted)]">
            Clos
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)] line-clamp-2">
        {tender.intitule}
      </h3>

      {/* Buyer */}
      <p className="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Building2 className="h-3 w-3" />
        {tender.acheteur}
      </p>

      {/* Dates */}
      <div className="mb-3 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pub. {formatDate(tender.datePublication)}
        </span>
        {tender.dateLimite && (
          <span className={cn("flex items-center gap-1", urgent && "text-red-400 font-medium")}>
            <AlertTriangle className="h-3 w-3" />
            Lim. {formatDate(tender.dateLimite)}
          </span>
        )}
      </div>

      {/* Tags */}
      {tender.descripteur && (
        <div className="mb-3 flex flex-wrap gap-1">
          {tender.descripteur.split(/[,;]/).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Relevance bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Pertinence</span>
          <span className={cn(
            "text-xs font-bold",
            relevance >= 60 ? "text-emerald-400" :
            relevance >= 30 ? "text-amber-400" :
            "text-[var(--color-text-muted)]",
          )}>
            {relevance}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-[var(--color-surface)]">
          <div
            className={cn(
              "h-1 rounded-full transition-all",
              relevance >= 60 ? "bg-emerald-400" :
              relevance >= 30 ? "bg-amber-400" :
              "bg-[var(--color-text-muted)]/30",
            )}
            style={{ width: `${relevance}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAnalyze}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/20"
        >
          <Sparkles className="h-3 w-3" />
          Analyser
        </button>
        {tender.urlAvis && (
          <a
            href={tender.urlAvis}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
          >
            <ExternalLink className="h-3 w-3" />
            Ouvrir
          </a>
        )}
      </div>
    </motion.div>
  );
}
