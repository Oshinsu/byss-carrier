"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radio, TrendingUp, Building2, Users, Landmark, Cpu, Shield, Crosshair, ExternalLink, Bus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import dynamic from "next/dynamic";
import { ImperialGlass, LiveBadge } from "@/components/martinique/primitives";
import { ZoneInfoOverlay } from "@/components/martinique/zone-filter";
import type { ZoneId } from "@/components/martinique/zone-filter";

const RealMap = dynamic(
  () => import("@/components/martinique/real-map").then((m) => m.RealMap),
  { ssr: false, loading: () => <div className="flex h-[500px] items-center justify-center text-[10px] text-[#ffffff30]">Chargement carte...</div> }
);
import { TabSitrep } from "@/components/martinique/sitrep-tab";
import type { ActivityRecord } from "@/components/martinique/sitrep-tab";

/* ─── Lazy-loaded tab panels (only load when selected) ─── */
const TabEconomie = dynamic(
  () => import("@/components/martinique/economie-tab").then((m) => m.TabEconomie),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-[#0A1628]" /> }
);
const TabEntreprises = dynamic(
  () => import("@/components/martinique/entreprises-tab").then((m) => m.TabEntreprises),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-[#0A1628]" /> }
);
const TabDemographie = dynamic(
  () => import("@/components/martinique/demographie-tab").then((m) => m.TabDemographie),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-[#0A1628]" /> }
);
const TabPolitique = dynamic(
  () => import("@/components/martinique/politique-tab").then((m) => m.TabPolitique),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-[#0A1628]" /> }
);
const TabTechnologie = dynamic(
  () => import("@/components/martinique/technologie-tab").then((m) => m.TabTechnologie),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-[#0A1628]" /> }
);
const TabTransport = dynamic(
  () => import("@/components/martinique/transport-tab").then((m) => m.TabTransport),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-[#0A1628]" /> }
);

/* ── Types ── */
type TabId = "sitrep" | "economie" | "entreprises" | "demographie" | "politique" | "technologie" | "transport";

interface Prospect { id: string; name: string; sector: string; status: string; city: string | null; }
interface IntelEntity { id: string; domain: string; name: string; status: string; }

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "sitrep", label: "SITREP", icon: Radio },
  { id: "economie", label: "ECONOMIE", icon: TrendingUp },
  { id: "entreprises", label: "ENTREPRISES", icon: Building2 },
  { id: "demographie", label: "DEMOGRAPHIE", icon: Users },
  { id: "politique", label: "POLITIQUE", icon: Landmark },
  { id: "technologie", label: "TECH", icon: Cpu },
  { id: "transport", label: "TRANSPORT", icon: Bus },
];

const SOURCES = [
  { name: "INSEE", url: "https://www.insee.fr/fr/statistiques?geo=DEP-972" },
  { name: "data.gouv.fr", url: "https://www.data.gouv.fr" },
  { name: "IEDOM", url: "https://www.iedom.fr/martinique" },
  { name: "CTM", url: "https://www.collectivitedemartinique.mq" },
  { name: "CCI MQ", url: "https://www.martinique.cci.fr" },
  { name: "MEDEF MQ", url: "https://medef-martinique.fr" },
  { name: "transport.data.gouv.fr", url: "https://transport.data.gouv.fr" },
];

/* ═══════════════════════════════════════════════════════════════
   MARTINIQUE PAGE — Situation Monitor
   ═══════════════════════════════════════════════════════════════ */
export default function MartiniquePage() {
  const [activeTab, setActiveTab] = useState<TabId>("sitrep");
  const [activeZone, setActiveZone] = useState<ZoneId>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [intelEntities, setIntelEntities] = useState<IntelEntity[]>([]);
  const [loadingProspects, setLoadingProspects] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [mqTime, setMqTime] = useState("");

  /* ── Clock ── */
  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("fr-FR", {
        timeZone: "America/Martinique", hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "short", year: "numeric",
      });
      setMqTime(fmt.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Supabase ── */
  useEffect(() => {
    const load = async () => {
      setInitialLoading(true);
      setFetchError(null);
      try {
        const supabase = createClient();
        const [prospectsRes, activitiesRes, intelRes] = await Promise.all([
          supabase.from("prospects").select("id, name, sector, phase, notes").order("name"),
          supabase.from("activities").select("id, type, title, description, created_at").order("created_at", { ascending: false }).limit(20),
          supabase.from("intel_entities").select("id, domain, name, type, influence_score"),
        ]);
        if (prospectsRes.error) setFetchError("Le systeme a flanché. " + prospectsRes.error.message);
        if (prospectsRes.data) setProspects(prospectsRes.data.map((p: Record<string, unknown>) => ({
          id: String(p.id || ""),
          name: String(p.name || ""),
          sector: String(p.sector || ""),
          status: String(p.phase || p.status || ""),
          city: (p.city as string | null) ?? null,
        })));
        if (activitiesRes.data) setActivities(activitiesRes.data as ActivityRecord[]);
        if (intelRes.data) setIntelEntities(intelRes.data.map((e: Record<string, unknown>) => ({
          id: String(e.id || ""),
          domain: String(e.domain || ""),
          name: String(e.name || ""),
          status: String(e.type || e.status || ""),
        })));
      } catch {
        setFetchError("Connexion perdue. Le radar tourne dans le vide.");
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab !== "entreprises") return;
    const load = async () => {
      setLoadingProspects(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("prospects").select("id, name, sector, phase, notes").order("name").limit(500);
        if (error) console.error("Martinique prospects:", error.message);
        if (data) setProspects(data.map((p: Record<string, unknown>) => ({
          id: String(p.id || ""),
          name: String(p.name || ""),
          sector: String(p.sector || ""),
          status: String(p.phase || p.status || ""),
          city: (p.city as string | null) ?? null,
        })));
      } catch (e) { console.error("Martinique load:", e); } finally { setLoadingProspects(false); }
    };
    load();
  }, [activeTab]);

  const sectorCounts = useMemo(() => {
    const map: Record<string, number> = {};
    prospects.forEach((p) => { const s = p.sector || "Non defini"; map[s] = (map[s] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [prospects]);

  const handleZoneClick = useCallback((zone: ZoneId) => setActiveZone(zone), []);

  return (
    <div className="min-h-screen" style={{ background: "#070E1A" }}>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-50" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.008) 2px, rgba(0,212,255,0.008) 4px)" }} />

      {/* ── HEADER ── */}
      <div className="relative border-b border-[#00D4FF15] px-4 py-3" style={{ background: "linear-gradient(180deg, #0D1F3C 0%, #0A1628 100%)" }}>
        <div className="mx-auto flex max-w-[1800px] items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full border border-[#00D4FF30]" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-1 rounded-full border border-[#00D4FF20]" />
              <Radio className="h-5 w-5 text-[#00D4FF]" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-clash-display)] text-xl font-bold tracking-wider text-[#00D4FF]">MARTINIQUE {"\u2014"} SITUATION MONITOR</h1>
              <div className="flex items-center gap-3 text-[10px] text-[#ffffff30]">
                <span className="font-mono">{mqTime}</span><span>|</span><span>UTC-4</span><span>|</span>
                <span>14.6167{"\u00B0"}N, 61.0500{"\u00B0"}W</span><span>|</span><span>DOM-ROM 972</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LiveBadge />
            <div className="hidden items-center gap-2 rounded border border-[#00D4FF15] bg-[#0A1628] px-3 py-1.5 text-[10px] font-mono text-[#00D4FF60] lg:flex">
              <Shield className="h-3 w-3" /> BYSS ISB // CLASSIFIED
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="border-b border-[#00D4FF10] px-4" style={{ background: "#0A162880" }}>
        <div className="mx-auto flex max-w-[1800px] gap-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                active ? "border-[#00D4FF] text-[#00D4FF]" : "border-transparent text-[#ffffff30] hover:text-[#ffffff60]"
              )}>
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.id === "sitrep" && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {fetchError && (
        <div className="mx-auto max-w-[1800px] px-4 pt-3">
          <div className="flex items-center gap-3 rounded-lg border border-[#FF2D2D30] bg-[#FF2D2D08] px-4 py-3">
            <Shield className="h-4 w-4 shrink-0 text-[#FF2D2D]" />
            <p className="flex-1 text-[11px] text-[#FF6B6B]">{fetchError}</p>
            <button onClick={() => window.location.reload()} className="rounded border border-[#00D4FF30] px-2 py-1 text-[10px] text-[#00D4FF] hover:bg-[#00D4FF10]">
              Recharger
            </button>
          </div>
        </div>
      )}

      {/* ── Loading Overlay ── */}
      {initialLoading && (
        <div className="mx-auto max-w-[1800px] px-4 pt-3">
          <div className="flex items-center gap-3 rounded-lg border border-[#00D4FF15] bg-[#0A1628] px-4 py-3">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#00D4FF30] border-t-[#00D4FF]" />
            <span className="text-[10px] text-[#00D4FF60]">Acquisition des signaux...</span>
          </div>
        </div>
      )}

      {/* ── MAIN: Map + Data ── */}
      <div className="mx-auto max-w-[1800px] p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* LEFT: MAP */}
          <div className="w-full lg:w-[60%]">
            <ImperialGlass className="h-full">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-[#00D4FF]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00D4FF]">TACTICAL MAP</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-[#ffffff30]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00B4D8]" /> Capital
                  <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#00D4FF]" /> Hub
                  <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#FF2D2D]" /> Historic
                  <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> Marina
                </div>
              </div>
              <RealMap activeZone={activeZone} onZoneClick={handleZoneClick} onCityClick={(city) => console.log("[martinique] city:", city)} />
              <ZoneInfoOverlay activeZone={activeZone} />
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { v: "350K", l: "Population" }, { v: "1 128", l: "km\u00B2" },
                  { v: "34", l: "Communes" }, { v: "1 397m", l: "Alt. max", alert: true },
                ].map((s) => (
                  <div key={s.l} className="rounded border border-[#00D4FF10] bg-[#0A1628] px-2 py-1.5 text-center">
                    <div className={cn("font-[family-name:var(--font-clash-display)] text-sm font-bold", s.alert ? "text-[#FF2D2D]" : "text-[#00D4FF]")}>{s.v}</div>
                    <div className="text-[8px] uppercase tracking-wider text-[#ffffff30]">{s.l}</div>
                  </div>
                ))}
              </div>
            </ImperialGlass>
          </div>

          {/* RIGHT: DATA */}
          <div className="w-full lg:w-[40%]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                {activeTab === "sitrep" && <TabSitrep mqTime={mqTime} signalCount={intelEntities.length} pipelineCount={prospects.length} lastActivity={activities[0]} activities={activities} />}
                {activeTab === "economie" && <TabEconomie />}
                {activeTab === "entreprises" && <TabEntreprises prospects={prospects} loading={loadingProspects} sectorCounts={sectorCounts} />}
                {activeTab === "demographie" && <TabDemographie />}
                {activeTab === "politique" && <TabPolitique />}
                {activeTab === "technologie" && <TabTechnologie />}
                {activeTab === "transport" && <TabTransport />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── SOURCES ── */}
      <div className="border-t border-[#00D4FF10] px-4 py-3 mt-4">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-[#ffffff20]">SOURCES:</span>
          {SOURCES.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded border border-[#00D4FF10] bg-[#0A1628] px-2 py-1 text-[9px] text-[#00D4FF40] transition-colors hover:border-[#00D4FF30] hover:text-[#00D4FF80]">
              <ExternalLink className="h-2.5 w-2.5" /> {s.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
