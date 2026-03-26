"use client";

import { motion, AnimatePresence } from "motion/react";
import { Building2, Search, Clock, AlertTriangle, Lightbulb, Globe, Shield, ExternalLink, RefreshCw, X, Loader2, Download, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARCHES_PLATFORMS, ACHAT_INNOVANT_TARGETS, TENDER_CATEGORIES, BYSS_CPV_CODES } from "@/lib/data/cpv-codes";
import type { MarcheRow } from "@/lib/marches";

interface Tender { id: string; intitule: string; acheteur: string; nature: string; datePublication: string; dateLimite: string; descripteur: string; familleActivite: string; departement: string; typeAvis: string; codeCPV: string; procedure: string; urlAvis: string; }
type SortMode = "publication" | "deadline" | "relevance";

function formatDate(dateStr: string | null): string { if (!dateStr) return "\u2014"; try { return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); } catch { return dateStr; } }

function CollapsibleSection({ icon, title, subtitle, open, onToggle, children }: { icon: React.ReactNode; title: string; subtitle?: string; open: boolean; onToggle: () => void; children: React.ReactNode; }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3">{icon}<div><h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">{title}</h2>{subtitle && <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>}</div></div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="h-5 w-5 text-[var(--color-text-muted)]" /></motion.div>
      </button>
      <AnimatePresence>{open && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="border-t border-[var(--color-border-subtle)] p-4">{children}</div></motion.div>)}</AnimatePresence>
    </div>
  );
}

function VeilleTenderCard({ tender, relevance, daysLeft, alreadyImported, importing, onImport, index }: {
  tender: Tender & { relevance: number; daysLeft: number | null }; relevance: number; daysLeft: number | null; alreadyImported: boolean; importing: boolean; onImport: () => void; index: number;
}) {
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  const expired = daysLeft !== null && daysLeft < 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.5) }}
      className={cn("group rounded-xl border bg-[#0F0F1A] p-4 transition", alreadyImported ? "border-cyan-500/20 bg-cyan-500/[0.02]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-subtle)]/80", expired && "opacity-50")}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">{tender.nature || "March\u00e9"}</span>
        <div className="flex items-center gap-1.5">
          {alreadyImported && <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Import\u00e9</span>}
          {daysLeft !== null && !expired && <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", urgent ? "bg-red-500/15 text-red-400 animate-pulse" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}>J-{daysLeft}</span>}
          {expired && <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-text-muted)]">Clos</span>}
        </div>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)] line-clamp-2">{tender.intitule}</h3>
      <p className="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]"><Building2 className="h-3 w-3" />{tender.acheteur}</p>
      <div className="mb-3 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Pub. {formatDate(tender.datePublication)}</span>
        {tender.dateLimite && <span className={cn("flex items-center gap-1", urgent && "text-red-400 font-medium")}><AlertTriangle className="h-3 w-3" />Lim. {formatDate(tender.dateLimite)}</span>}
      </div>
      {tender.descripteur && <div className="mb-3 flex flex-wrap gap-1">{tender.descripteur.split(/[,;]/).slice(0, 3).map((tag) => (<span key={tag} className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">{tag.trim()}</span>))}</div>}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1"><span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Pertinence</span><span className={cn("text-xs font-bold", relevance >= 60 ? "text-emerald-400" : relevance >= 30 ? "text-amber-400" : "text-[var(--color-text-muted)]")}>{relevance}%</span></div>
        <div className="h-1 w-full rounded-full bg-[var(--color-surface)]"><motion.div initial={{ width: 0 }} animate={{ width: `${relevance}%` }} transition={{ duration: 0.8, delay: index * 0.03 }} className={cn("h-1 rounded-full", relevance >= 60 ? "bg-emerald-400" : relevance >= 30 ? "bg-amber-400" : "bg-gray-500/30")} /></div>
      </div>
      <div className="flex items-center gap-2">
        {!alreadyImported ? <button onClick={onImport} disabled={importing} className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50">{importing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}Importer</button>
          : <span className="text-xs text-emerald-400/60">Dans le pipeline</span>}
        {tender.urlAvis && <a href={tender.urlAvis} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"><ExternalLink className="h-3 w-3" />Ouvrir</a>}
      </div>
    </motion.div>
  );
}

export function VeilleTab({
  processedTenders, marches, loading, error, searchQuery, activeSearch, categoryFilter, sortMode,
  importing, batchImporting, achatsOpen, platformsOpen,
  onSearchQueryChange, onSearch, onRefresh, onClearSearch, onCategoryFilter, onSortMode,
  onImport, onBatchImport, onAchatsToggle, onPlatformsToggle,
}: {
  processedTenders: (Tender & { relevance: number; daysLeft: number | null })[];
  marches: MarcheRow[]; loading: boolean; error: string | null;
  searchQuery: string; activeSearch: string; categoryFilter: string; sortMode: SortMode;
  importing: string | null; batchImporting: boolean; achatsOpen: boolean; platformsOpen: boolean;
  onSearchQueryChange: (v: string) => void; onSearch: () => void; onRefresh: () => void; onClearSearch: () => void;
  onCategoryFilter: (v: string) => void; onSortMode: (v: SortMode) => void;
  onImport: (tender: Tender, score: number) => void; onBatchImport: () => void;
  onAchatsToggle: () => void; onPlatformsToggle: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="text" value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Rechercher un march\u00e9..." className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-cyan-500/50 focus:outline-none" />
          </div>
          <button onClick={onSearch} className="rounded-lg bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20">Chercher</button>
          <button onClick={onRefresh} className="rounded-lg p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"><RefreshCw className="h-4 w-4" /></button>
          {activeSearch && <button onClick={onClearSearch} className="rounded-lg p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TENDER_CATEGORIES.map((cat) => (<button key={cat.id} onClick={() => onCategoryFilter(cat.id)} className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition", categoryFilter === cat.id ? "bg-cyan-500/20 text-cyan-400" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]")}>{cat.label}</button>))}
        </div>
        <div className="flex items-center gap-2">
          <select value={sortMode} onChange={(e) => onSortMode(e.target.value as SortMode)} className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none">
            <option value="relevance">Pertinence</option><option value="publication">Date publication</option><option value="deadline">Date limite</option>
          </select>
        </div>
      </div>

      {processedTenders.length > 0 && (
        <div className="flex items-center justify-between">
          {activeSearch && <span className="text-sm text-[var(--color-text-muted)]"><Search className="mr-1.5 inline h-3.5 w-3.5" />&quot;{activeSearch}&quot; \u2014 {processedTenders.length} r\u00e9sultats</span>}
          <button onClick={onBatchImport} disabled={batchImporting} className="ml-auto flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50">
            {batchImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Importer les 10 plus pertinents
          </button>
        </div>
      )}

      {loading && <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /><span className="ml-3 text-sm text-[var(--color-text-muted)]">Interrogation BOAMP...</span></div>}
      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {processedTenders.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[var(--color-text-muted)]"><Building2 className="mx-auto mb-3 h-10 w-10 opacity-30" /><p className="font-[family-name:var(--font-clash-display)] text-lg">Le territoire est vierge.</p></div>
          ) : processedTenders.map((tender, i) => {
            const alreadyImported = marches.some((m) => m.boamp_id === tender.id);
            return <VeilleTenderCard key={tender.id || i} tender={tender} relevance={tender.relevance} daysLeft={tender.daysLeft} alreadyImported={alreadyImported} importing={importing === tender.id} onImport={() => onImport(tender, tender.relevance)} index={i} />;
          })}
        </div>
      )}

      <CollapsibleSection icon={<Lightbulb className="h-5 w-5 text-amber-400" />} title="Achats Innovants" subtitle="< 100K EUR HT \u2014 sans publicit\u00e9, sans concurrence" open={achatsOpen} onToggle={onAchatsToggle}>
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 text-sm text-amber-200/80"><strong>Article R2122-9</strong> \u2014 March\u00e9s innovants &lt; 100K EUR HT. BYSS GROUP peut prospecter directement.</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ACHAT_INNOVANT_TARGETS.map((org) => (
              <div key={org.name} className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] p-3">
                <div><p className="text-sm font-medium text-[var(--color-text)]">{org.name}</p><p className="text-xs text-[var(--color-text-muted)]">{org.fullName}</p></div>
                <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase", org.type === "collectivite" && "bg-purple-500/15 text-purple-400", org.type === "etat" && "bg-blue-500/15 text-blue-400",
                  org.type === "commune" && "bg-emerald-500/15 text-emerald-400", org.type === "epci" && "bg-cyan-500/15 text-cyan-400", org.type === "sante" && "bg-red-500/15 text-red-400", org.type === "education" && "bg-amber-500/15 text-amber-400")}>{org.type}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection icon={<Globe className="h-5 w-5 text-cyan-400" />} title="Plateformes" open={platformsOpen} onToggle={onPlatformsToggle}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MARCHES_PLATFORMS.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] p-3 transition hover:border-cyan-500/30">
              <div><p className="text-sm font-medium text-[var(--color-text)] group-hover:text-cyan-400 transition">{p.name}</p><p className="text-xs text-[var(--color-text-muted)]">{p.description}</p></div>
              <ExternalLink className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] group-hover:text-cyan-400 transition" />
            </a>
          ))}
        </div>
      </CollapsibleSection>

      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
        <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]"><Shield className="h-4 w-4" />Codes CPV BYSS GROUP</h3>
        <div className="flex flex-wrap gap-2">
          {[...BYSS_CPV_CODES.primary, ...BYSS_CPV_CODES.secondary].map((cpv) => (
            <span key={cpv.code} className="rounded bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]"><span className="font-mono text-cyan-400/70">{cpv.code}</span><span className="ml-1.5">{cpv.label}</span></span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
