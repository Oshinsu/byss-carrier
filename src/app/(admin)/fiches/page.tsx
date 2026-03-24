"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Phone, Mail, FileText, Star, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface FicheProspect {
  id: string;
  company: string;
  sector: string;
  sectorColor: string;
  decisionMaker: string;
  phone: string;
  email: string;
  pain: string;
  estimatedBasket: number;
  memorablePhrase: string;
  score: number;
  phase: string;
  phaseColor: string;
}

/* ─── Sector color mapping ────────────────────────── */
const SECTOR_COLORS: Record<string, string> = {
  telecoms: "bg-blue-500/20 text-blue-400",
  telecom: "bg-blue-500/20 text-blue-400",
  rhum: "bg-amber-500/20 text-amber-400",
  spiritueux: "bg-amber-500/20 text-amber-400",
  institution: "bg-emerald-500/20 text-emerald-400",
  distribution: "bg-orange-500/20 text-orange-400",
  transport: "bg-teal-500/20 text-teal-400",
  aerien: "bg-sky-500/20 text-sky-400",
  banque: "bg-red-500/20 text-red-400",
  fintech: "bg-red-500/20 text-red-400",
  agroalimentaire: "bg-yellow-500/20 text-yellow-400",
  sante: "bg-pink-500/20 text-pink-400",
  tourisme: "bg-cyan-500/20 text-cyan-400",
  hotellerie: "bg-cyan-500/20 text-cyan-400",
  immobilier: "bg-violet-500/20 text-violet-400",
  conseil: "bg-indigo-500/20 text-indigo-400",
  automobile: "bg-slate-500/20 text-slate-400",
  logistique: "bg-stone-500/20 text-stone-400",
  tech: "bg-purple-500/20 text-purple-400",
  restauration: "bg-orange-500/20 text-orange-400",
};

/* ─── Phase color mapping ─────────────────────────── */
const PHASE_COLORS: Record<string, string> = {
  prospect: "bg-gray-500",
  contacte: "bg-blue-500",
  rdv_planifie: "bg-purple-500",
  decouverte: "bg-blue-500",
  qualification: "bg-cyan-500",
  demo_faite: "bg-amber-500",
  proposition: "bg-purple-500",
  negociation: "bg-amber-500",
  signe: "bg-green-500",
  perdu: "bg-red-500",
  inactif: "bg-gray-400",
};

/* ─── Phase display labels ────────────────────────── */
const PHASE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  contacte: "Contacte",
  rdv_planifie: "RDV Planifie",
  decouverte: "Decouverte",
  qualification: "Qualification",
  demo_faite: "Demo Faite",
  proposition: "Proposition",
  negociation: "Negociation",
  signe: "Signe",
  perdu: "Perdu",
  inactif: "Inactif",
};

function getSectorColor(sector: string): string {
  const key = (sector || "").toLowerCase().trim();
  return SECTOR_COLORS[key] || "bg-gray-500/20 text-gray-400";
}

function getPhaseColor(phase: string): string {
  const key = (phase || "").toLowerCase().trim();
  return PHASE_COLORS[key] || "bg-gray-500";
}

function getPhaseLabel(phase: string): string {
  const key = (phase || "").toLowerCase().trim();
  return PHASE_LABELS[key] || phase;
}

/* ─── Map DB row to fiche ─────────────────────────── */
function mapToFiche(row: Record<string, unknown>): FicheProspect {
  const sector = (row.sector as string) || "";
  const phase = (row.phase as string) || "prospect";
  return {
    id: row.id as string,
    company: (row.name as string) || "Sans nom",
    sector,
    sectorColor: getSectorColor(sector),
    decisionMaker: (row.key_contact as string) || "",
    phone: (row.phone as string) || "",
    email: (row.email as string) || "",
    pain: (row.pain_points as string) || "",
    estimatedBasket: Number(row.estimated_basket) || 0,
    memorablePhrase: (row.memorable_phrase as string) || "",
    score: Number(row.score) || 1,
    phase,
    phaseColor: getPhaseColor(phase),
  };
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function FichesPage() {
  const [allProspects, setAllProspects] = useState<FicheProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProspects() {
      const supabase = createClient();
      try {
        const { data, error: fetchErr } = await supabase
          .from("prospects")
          .select("*")
          .order("score", { ascending: false });

        if (fetchErr) throw fetchErr;
        if (data) {
          setAllProspects(data.map(mapToFiche));
        }
      } catch (err) {
        console.error("Fiches fetch error:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement des fiches.");
      } finally {
        setLoading(false);
      }
    }

    fetchProspects();
  }, []);

  const sectors = useMemo(
    () => [...new Set(allProspects.map((p) => p.sector).filter(Boolean))],
    [allProspects]
  );

  const filtered = useMemo(() => {
    let result = allProspects;
    if (activeSector) {
      result = result.filter((p) => p.sector === activeSector);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.company.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q) ||
          p.decisionMaker.toLowerCase().includes(q) ||
          p.pain.toLowerCase().includes(q) ||
          p.memorablePhrase.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeSector, allProspects]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <PageHeader
          title="Fiches de"
          titleAccent="Poche"
          subtitle={loading ? "Chargement..." : `${allProspects.length} fiches. Tout ce qu\u2019il faut avant de decrocher.`}
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="mb-6 flex items-center gap-3 rounded-xl border px-5 py-4"
          style={{
            borderColor: "rgba(255,45,45,0.2)",
            background: "rgba(255,45,45,0.05)",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D2D" }} />
          <p className="flex-1 text-sm" style={{ color: "#FF6B6B" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(0,212,255,0.1)",
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6A6A7A]" />
        <input
          type="text"
          placeholder="Nom, secteur, douleur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#2A2A3E] bg-[#0F0F1A] py-2.5 pl-10 pr-10 text-sm text-[#E0E0E8] placeholder-[#6A6A7A] outline-none transition-colors focus:border-[#00B4D8]/50"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A7A] hover:text-[#E0E0E8]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sector filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSector(null)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            !activeSector
              ? "bg-[#00B4D8] text-[#0A0A0F]"
              : "bg-[#1A1A2E] text-[#8A8A9A] hover:bg-[#2A2A3E] hover:text-[#E0E0E8]"
          )}
        >
          Tous
        </button>
        {sectors.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSector(activeSector === s ? null : s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeSector === s
                ? "bg-[#00B4D8] text-[#0A0A0F]"
                : "bg-[#1A1A2E] text-[#8A8A9A] hover:bg-[#2A2A3E] hover:text-[#E0E0E8]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-[#6A6A7A]">
        {loading
          ? "Chargement..."
          : `${filtered.length} fiche${filtered.length !== 1 ? "s" : ""} affichee${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] animate-pulse rounded-xl border border-[#2A2A3E]/60 bg-[#1A1A2E]"
            />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: i * 0.06,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-xl border border-[#2A2A3E]/60 bg-[#0F0F1A]/80 p-5 backdrop-blur-md transition-colors hover:border-[#00B4D8]/30"
            >
              {/* Top row: company + sector + score */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#E0E0E8]">
                    {p.company}
                  </h2>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    p.sectorColor
                  )}
                >
                  {p.sector || "N/A"}
                </span>
              </div>

              {/* Decision maker contact */}
              <div className="mb-3 space-y-0.5 text-sm">
                <p className="font-medium text-[#C0C0D0]">
                  {p.decisionMaker || "Contact non renseigne"}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[#8A8A9A]">
                  {p.phone && (
                    <a
                      href={`tel:${p.phone}`}
                      className="transition-colors hover:text-[#00B4D8]"
                    >
                      {p.phone}
                    </a>
                  )}
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="truncate transition-colors hover:text-[#00B4D8]"
                    >
                      {p.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Pain */}
              {p.pain && (
                <p className="mb-3 text-sm font-semibold italic text-red-400">
                  {p.pain}
                </p>
              )}

              {/* Estimated basket */}
              <div className="mb-3 flex items-center gap-3 text-xs">
                <span className="text-[#00B4D8]">
                  <span className="mr-1">&#x1F4B0;</span>
                  {p.estimatedBasket.toLocaleString("fr-FR")}&euro; estimé
                </span>
              </div>

              {/* Memorable phrase -- the MOST prominent element */}
              {p.memorablePhrase && (
                <div className="mb-4 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2.5">
                  <p className="text-base font-bold italic leading-snug text-red-400">
                    &laquo; {p.memorablePhrase} &raquo;
                  </p>
                </div>
              )}

              {/* Score + Phase */}
              <div className="mb-4 flex items-center justify-between">
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={cn(
                        "h-4 w-4",
                        si < p.score
                          ? "fill-[#00B4D8] text-[#00B4D8]"
                          : "text-[#2A2A3E]"
                      )}
                    />
                  ))}
                </div>
                {/* Phase badge */}
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-2 w-2 rounded-full", p.phaseColor)} />
                  <span className="text-xs font-medium text-[#8A8A9A]">
                    {getPhaseLabel(p.phase)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {p.phone ? (
                  <a
                    href={`tel:${p.phone}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A2E] py-2 text-xs font-medium text-[#8A8A9A] transition-colors hover:bg-[#00B4D8]/15 hover:text-[#00B4D8]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Appeler
                  </a>
                ) : (
                  <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A2E] py-2 text-xs font-medium text-[#3A3A4A]">
                    <Phone className="h-3.5 w-3.5" />
                    Appeler
                  </div>
                )}
                {p.email ? (
                  <a
                    href={`mailto:${p.email}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A2E] py-2 text-xs font-medium text-[#8A8A9A] transition-colors hover:bg-[#00B4D8]/15 hover:text-[#00B4D8]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                ) : (
                  <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A2E] py-2 text-xs font-medium text-[#3A3A4A]">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </div>
                )}
                <a
                  href={`/pipeline`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A2E] py-2 text-xs font-medium text-[#8A8A9A] transition-colors hover:bg-[#00B4D8]/15 hover:text-[#00B4D8]"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Dossier
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-[var(--color-text-muted)]" />
          <p className="text-sm text-[var(--color-text-muted)]">
            {search ? `Rien pour \u201C${search}\u201D. Cherche autrement.` : "Les fiches attendent. Les prospects existent."}
          </p>
        </div>
      )}
    </div>
  );
}
