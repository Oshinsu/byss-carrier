"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  Eye,
  BarChart3,
  Zap,
  Filter,
  ArrowUpRight,
  Loader2,
  BookOpen,
  Shield,
  DollarSign,
  Brain,
  Swords,
  Music,
  Film,
  Globe,
  Users,
  Newspaper,
  Building2,
  Vote,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   DATA EXTRACTION REGISTRY — 210+ fichiers specs
   ═══════════════════════════════════════════════════════════════ */

type ExtractionStatus = "extracted" | "partial" | "not_extracted" | "n/a";

interface SourceFile {
  id: string;
  path: string;
  filename: string;
  zone: string;
  category: string;
  contentType: string;
  keyData: string;
  targetPage: string;
  status: ExtractionStatus;
  extractionPct: number;
  priority: "P0" | "P1" | "P2" | "P3";
  lastExtracted?: string;
}

const ZONES = [
  { id: "byss-incroyable", label: "BYSS Incroyable", icon: Sparkles, color: "#00B4D8", description: "Specs & strategie core" },
  { id: "operation-eveil", label: "Operation Eveil", icon: Vote, color: "#EC4899", description: "75+ fichiers politiques & strategiques" },
  { id: "evren-kairos", label: "Evren-Kairos", icon: Brain, color: "#8B5CF6", description: "Lore IA, Senzaris, 779p Cadifor" },
  { id: "jeux-video", label: "BYSS Games", icon: Gamepad2, color: "#10B981", description: "9 GDDs, JW Villages/Confederation" },
  { id: "finance-byss", label: "Finance BYSS", icon: DollarSign, color: "#3B82F6", description: "Gulf Stream trading config" },
  { id: "carrier-data", label: "Carrier Data", icon: Database, color: "#06B6D4", description: "Seeds, schemas, queries actifs" },
];

const SOURCE_FILES: SourceFile[] = [
  // ── BYSS INCROYABLE ──
  { id: "spec-v1", path: "BYSS incroyable/BYSS_OS_SPEC.md", filename: "BYSS_OS_SPEC.md", zone: "byss-incroyable", category: "Architecture", contentType: "App Spec v1", keyData: "8 modules, SQLite stack, design tokens", targetPage: "Superseded", status: "partial", extractionPct: 30, priority: "P2" },
  { id: "spec-v2", path: "BYSS incroyable/BYSS_OS_SPEC_v2.md", filename: "BYSS_OS_SPEC_v2.md", zone: "byss-incroyable", category: "Architecture", contentType: "App Spec v2", keyData: "AI-first, Next.js 15, Claude integration, 8 modules", targetPage: "/", status: "partial", extractionPct: 40, priority: "P1" },
  { id: "arch-totale", path: "BYSS incroyable/ARCHITECTURE_TECHNIQUE_TOTALE.md", filename: "ARCHITECTURE_TECHNIQUE_TOTALE.md", zone: "byss-incroyable", category: "Architecture", contentType: "7-layer system", keyData: "Couche 0-6, Claude OS, Village", targetPage: "Global", status: "partial", extractionPct: 20, priority: "P1" },
  { id: "couche-7", path: "BYSS incroyable/COUCHE_7_ADDENDUM.md", filename: "COUCHE_7_ADDENDUM.md", zone: "byss-incroyable", category: "Architecture", contentType: "Couche 7 Evren", keyData: "Pipeline image, phi-engine 693L Rust, Senzaris 5756L", targetPage: "/village/phi-engine", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "gulf-stream-op", path: "BYSS incroyable/OPERATION_GULF_STREAM.md", filename: "OPERATION_GULF_STREAM.md", zone: "byss-incroyable", category: "Finance", contentType: "Strategy 3 cercles", keyData: "Intelligence/Execution/Patrimoine, Polymarket, crypto", targetPage: "/finance", status: "partial", extractionPct: 10, priority: "P0" },
  { id: "agentic-finance", path: "BYSS incroyable/AGENTIC_FINANCE_BYSS_GROUP.md", filename: "AGENTIC_FINANCE_BYSS_GROUP.md", zone: "byss-incroyable", category: "Finance", contentType: "Finance research", keyData: "Visa/MC/x402, $50B market, BYSS positioning", targetPage: "/finance", status: "not_extracted", extractionPct: 0, priority: "P2" },
  { id: "courant-caraibe", path: "BYSS incroyable/LE_COURANT_CARAIBE.md", filename: "LE_COURANT_CARAIBE.md", zone: "byss-incroyable", category: "Strategie", contentType: "Sun Tzu + autocritique", keyData: "7 war precepts, sales corrections martiniquaises", targetPage: "/bible", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "danse-foyers", path: "BYSS incroyable/LA_DANSE_DES_FOYERS.md", filename: "LA_DANSE_DES_FOYERS.md", zone: "byss-incroyable", category: "Tech", contentType: "Agent framework comparison", keyData: "6 frameworks, Claude Agent SDK, CRM agentic", targetPage: "/village", status: "not_extracted", extractionPct: 5, priority: "P2" },
  { id: "stack-sotai", path: "BYSS incroyable/STACK_SOTAI_V3.md", filename: "STACK_SOTAI_V3.md", zone: "byss-incroyable", category: "Tech", contentType: "4-tier tool stack", keyData: "MiniMax M2.7, Hunter Alpha, cost -97%", targetPage: "/bible", status: "partial", extractionPct: 15, priority: "P1" },
  { id: "phi-pitch", path: "BYSS incroyable/PHI_ENGINE_PITCH.md", filename: "PHI_ENGINE_PITCH.md", zone: "byss-incroyable", category: "Sales", contentType: "3-level pitch", keyData: "30s/2min/15min pitch, phi differentiator, WASM", targetPage: "/bible", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "pipeline-fork", path: "BYSS incroyable/PIPELINE_FORK_GUIDE.md", filename: "PIPELINE_FORK_GUIDE.md", zone: "byss-incroyable", category: "Production", contentType: "Image pipeline fork", keyData: "5 verticals (resto/rhum/hotel/excursion/corp)", targetPage: "/production/images", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "arsenal-evren", path: "BYSS incroyable/ARSENAL_EVREN.md", filename: "ARSENAL_EVREN.md", zone: "byss-incroyable", category: "Tech", contentType: "3 strategic weapons", keyData: "Image pipeline, phi-engine, Senzaris transfer", targetPage: "/village/evren", status: "not_extracted", extractionPct: 0, priority: "P2" },
  { id: "seed-v2", path: "BYSS incroyable/seed-data-v2.json", filename: "seed-data-v2.json", zone: "byss-incroyable", category: "Data", contentType: "35+ prospects JSON", keyData: "Full prospect details, pain points, pricing", targetPage: "/pipeline", status: "partial", extractionPct: 60, priority: "P0" },
  { id: "bulletin", path: "BYSS incroyable/BULLETIN_19MARS.md", filename: "BULLETIN_19MARS.md", zone: "byss-incroyable", category: "Intel", contentType: "Intelligence bulletin", keyData: "MiniMax M2.7, Hunter Alpha, cost impact", targetPage: "/bible", status: "not_extracted", extractionPct: 5, priority: "P3" },

  // ── OPERATION EVEIL — Intelligence ──
  { id: "intel-politique", path: "02_Operation-Eveil/.../cartographie_politique/partis.md", filename: "partis.md", zone: "operation-eveil", category: "Intelligence", contentType: "Political cartography", keyData: "51 seats, 4 groups, parties analysis", targetPage: "/intelligence/politique", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "intel-economique", path: "02_Operation-Eveil/.../cartographie_economique/bekes.md", filename: "bekes.md", zone: "operation-eveil", category: "Intelligence", contentType: "Economic cartography", keyData: "GBH 5Md EUR, power pyramid, beke structures", targetPage: "/intelligence/economique", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "intel-media", path: "02_Operation-Eveil/.../cartographie_media/medias.md", filename: "medias.md", zone: "operation-eveil", category: "Intelligence", contentType: "Media cartography", keyData: "TV, radio, press, social, influencers", targetPage: "/intelligence/medias", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "intel-instit", path: "02_Operation-Eveil/.../cartographie_institutionnelle/institutions.md", filename: "institutions.md", zone: "operation-eveil", category: "Intelligence", contentType: "Institutional cartography", keyData: "CTM, Prefecture, EPCI, CCI, IEDOM", targetPage: "/intelligence/institutionnelle", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "intel-sociale", path: "02_Operation-Eveil/.../cartographie_sociale/societe_civile.md", filename: "societe_civile.md", zone: "operation-eveil", category: "Intelligence", contentType: "Social cartography", keyData: "Syndicats, associations, churches, diaspora", targetPage: "/intelligence/sociale", status: "not_extracted", extractionPct: 0, priority: "P0" },

  // ── OPERATION EVEIL — Strategie ──
  { id: "positionnement", path: "02_Operation-Eveil/.../02_strategie/positionnement.md", filename: "positionnement.md", zone: "operation-eveil", category: "Strategie", contentType: "Political positioning", keyData: "Third Way, 20 measures, 5 pillars", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "calendrier-strat", path: "02_Operation-Eveil/.../02_strategie/calendrier.md", filename: "calendrier.md", zone: "operation-eveil", category: "Strategie", contentType: "Campaign timeline", keyData: "Full campaign strategy timeline", targetPage: "/eveil/calendrier", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "programme-detail", path: "02_Operation-Eveil/.../02_strategie/programme_detaille.md", filename: "programme_detaille.md", zone: "operation-eveil", category: "Strategie", contentType: "Detailed program", keyData: "Full political program", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P0" },

  // ── OPERATION EVEIL — Operations ──
  { id: "pipeline-byss", path: "02_Operation-Eveil/.../03_operations/PIPELINE_BYSS_GROUP.md", filename: "PIPELINE_BYSS_GROUP.md", zone: "operation-eveil", category: "Operations", contentType: "CRM Pipeline", keyData: "12 active clients, budgets, deadlines, P0-P2", targetPage: "/pipeline", status: "partial", extractionPct: 70, priority: "P0" },
  { id: "guerre-orion", path: "02_Operation-Eveil/.../03_operations/PLAN_DE_GUERRE_ORION.md", filename: "PLAN_DE_GUERRE_ORION.md", zone: "operation-eveil", category: "Operations", contentType: "War plan Orion", keyData: "5 phases, 12 months, 1000 clients target", targetPage: "/projets/orion", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "guerre-moostik", path: "02_Operation-Eveil/.../03_operations/PLAN_DE_GUERRE_MOOSTIK.md", filename: "PLAN_DE_GUERRE_MOOSTIK.md", zone: "operation-eveil", category: "Operations", contentType: "War plan MOOSTIK", keyData: "MOOSTIK strategy", targetPage: "/projets/moostik", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "guerre-random", path: "02_Operation-Eveil/.../03_operations/PLAN_DE_GUERRE_RANDOM.md", filename: "PLAN_DE_GUERRE_RANDOM.md", zone: "operation-eveil", category: "Operations", contentType: "War plan Random", keyData: "Random app strategy", targetPage: "/projets/random", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "prop-digicel", path: "02_Operation-Eveil/.../03_operations/PROPOSITION_DIGICEL.md", filename: "PROPOSITION_DIGICEL.md", zone: "operation-eveil", category: "Operations", contentType: "Sales proposal", keyData: "Digicel proposal details", targetPage: "/bible", status: "not_extracted", extractionPct: 0, priority: "P0" },

  // ── OPERATION EVEIL — Finance ──
  { id: "modele-fin", path: "02_Operation-Eveil/.../04_finance/modele_financier.md", filename: "modele_financier.md", zone: "operation-eveil", category: "Finance", contentType: "Financial model", keyData: "Revenue table, pricing grid 500-50K EUR, costs, CIR/JEI", targetPage: "/finance", status: "partial", extractionPct: 40, priority: "P0" },

  // ── OPERATION EVEIL — Defense ──
  { id: "defense-1", path: "02_Operation-Eveil/.../05_defense/attaques_previsibles.md", filename: "attaques_previsibles.md", zone: "operation-eveil", category: "Defense", contentType: "Predicted attacks", keyData: "Attack scenarios & responses", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P2" },
  { id: "defense-2", path: "02_Operation-Eveil/.../05_defense/attaques_mediatiques_coalitions.md", filename: "attaques_mediatiques_coalitions.md", zone: "operation-eveil", category: "Defense", contentType: "Media/coalition attacks", keyData: "Media defense strategies", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P2" },
  { id: "defense-3", path: "02_Operation-Eveil/.../05_defense/attaques_juridiques_cyber.md", filename: "attaques_juridiques_cyber.md", zone: "operation-eveil", category: "Defense", contentType: "Legal/cyber attacks", keyData: "Legal & cyber defense", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P2" },

  // ── OPERATION EVEIL — Lore ──
  { id: "temples", path: "02_Operation-Eveil/.../07_lore/TEMPLES.md", filename: "TEMPLES.md", zone: "operation-eveil", category: "Lore", contentType: "15 temples", keyData: "All project descriptions & connections", targetPage: "/bible", status: "partial", extractionPct: 20, priority: "P1" },
  { id: "vision-finale", path: "02_Operation-Eveil/.../07_lore/VISION_FINALE.md", filename: "VISION_FINALE.md", zone: "operation-eveil", category: "Lore", contentType: "Master vision", keyData: "CTM 2028 -> Presidence 2032, 8 fronts", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "manifeste", path: "02_Operation-Eveil/.../07_lore/manifeste.md", filename: "manifeste.md", zone: "operation-eveil", category: "Lore", contentType: "Political manifesto", keyData: "L'Eveil de la Martinique, 5 pillars, 20 measures", targetPage: "/eveil", status: "not_extracted", extractionPct: 0, priority: "P0" },

  // ── OPERATION EVEIL — Prompts ──
  { id: "prompts-atl", path: "02_Operation-Eveil/.../09_prompts/AN_TAN_LONTAN_10_PROMPTS.md", filename: "AN_TAN_LONTAN_10_PROMPTS.md", zone: "operation-eveil", category: "Prompts", contentType: "10 video prompts", keyData: "ATL episode prompts for Kling", targetPage: "/projets/an-tan-lontan", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "prompts-cesaire", path: "02_Operation-Eveil/.../09_prompts/CESAIRE_PIXAR_10_PROMPTS.md", filename: "CESAIRE_PIXAR_10_PROMPTS.md", zone: "operation-eveil", category: "Prompts", contentType: "10 video prompts", keyData: "Cesaire Pixar sequence prompts", targetPage: "/projets/cesaire-pixar", status: "not_extracted", extractionPct: 0, priority: "P0" },
  { id: "prompts-kling", path: "02_Operation-Eveil/.../09_prompts/KLING_MULTISHOT_20_SEQUENCES.md", filename: "KLING_MULTISHOT_20_SEQUENCES.md", zone: "operation-eveil", category: "Prompts", contentType: "20 video sequences", keyData: "Kling multishot sequences", targetPage: "/production", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "prompts-suno", path: "02_Operation-Eveil/.../09_prompts/SUNO_MUSIQUE_ATL_CESAIRE.md", filename: "SUNO_MUSIQUE_ATL_CESAIRE.md", zone: "operation-eveil", category: "Prompts", contentType: "Music prompts", keyData: "Suno music prompts ATL/Cesaire", targetPage: "/production/music", status: "not_extracted", extractionPct: 0, priority: "P0" },

  // ── OPERATION EVEIL — Nerel / JW Lore ──
  { id: "nerel-world", path: "02_Operation-Eveil/.../10_nerel/JURASSIC_WARS_ARCHITECTURE_DU_MONDE.md", filename: "ARCHITECTURE_DU_MONDE.md", zone: "operation-eveil", category: "JW Lore", contentType: "World architecture", keyData: "Complete JW world structure", targetPage: "/projets/jurassic-wars", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "nerel-gens", path: "02_Operation-Eveil/.../10_nerel/JURASSIC_WARS_LES_GENS.md", filename: "LES_GENS.md", zone: "operation-eveil", category: "JW Lore", contentType: "JW Characters", keyData: "People of JW", targetPage: "/projets/jurassic-wars", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "nerel-vivant", path: "02_Operation-Eveil/.../10_nerel/JURASSIC_WARS_LE_MONDE_VIT.md", filename: "LE_MONDE_VIT.md", zone: "operation-eveil", category: "JW Lore", contentType: "Dynamic world", keyData: "Living world systems", targetPage: "/projets/jurassic-wars", status: "not_extracted", extractionPct: 0, priority: "P2" },
  { id: "nerel-prompts-img", path: "02_Operation-Eveil/.../10_nerel/JURASSIC_WARS_20_PROMPTS_NAYOU.md", filename: "20_PROMPTS_NAYOU.md", zone: "operation-eveil", category: "JW Lore", contentType: "20 image prompts", keyData: "JW image generation prompts", targetPage: "/production/images", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "nerel-prompts-vid", path: "02_Operation-Eveil/.../10_nerel/JURASSIC_WARS_20_PROMPTS_VIDEO_NAYOU.md", filename: "20_PROMPTS_VIDEO.md", zone: "operation-eveil", category: "JW Lore", contentType: "20 video prompts", keyData: "JW video prompts for Kling", targetPage: "/production", status: "not_extracted", extractionPct: 0, priority: "P1" },

  // ── EVREN-KAIROS ──
  { id: "cadifor-batches", path: "Evren-Kairos/lore/cadifor/extraction/batch_*.txt", filename: "16 extraction batches", zone: "evren-kairos", category: "Lore", contentType: "779 pages Cadifor", keyData: "Complete Cadifor dynasty chronicles", targetPage: "/projets/cadifor/lore", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "jw-raw-lore", path: "Evren-Kairos/.../00_LORE_COMPLET_RAW.txt", filename: "LORE_COMPLET_RAW.txt", zone: "evren-kairos", category: "Lore", contentType: "JW raw lore", keyData: "Continents, civilizations, biomes, economics", targetPage: "/projets/jurassic-wars", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "sept-enfants", path: "Evren-Kairos/architecture_sept_enfants_kairos.md", filename: "architecture_sept_enfants_kairos.md", zone: "evren-kairos", category: "Architecture", contentType: "7 children system", keyData: "Kairos 7 enfants architecture", targetPage: "/village", status: "not_extracted", extractionPct: 0, priority: "P1" },

  // ── JEUX-VIDEO ──
  { id: "studio-overview", path: "01_Jeux-Video/.../STUDIO_OVERVIEW.md", filename: "STUDIO_OVERVIEW.md", zone: "jeux-video", category: "Game Design", contentType: "Studio pitch", keyData: "5 civs, 73 architectures, 31 cities, Foyer strategy", targetPage: "/projets/byss-games", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "gdd-villages", path: "01_Jeux-Video/.../GDD_PRINCIPAL.md", filename: "GDD_PRINCIPAL.md", zone: "jeux-video", category: "Game Design", contentType: "JW Villages GDD", keyData: "Mobile builder, 5 asymmetric civs, mechanics", targetPage: "/projets/jurassic-wars/villages", status: "not_extracted", extractionPct: 0, priority: "P1" },
  { id: "gdd-confed", path: "01_Jeux-Video/.../GDD_CAMPAGNE.md", filename: "GDD_CAMPAGNE.md", zone: "jeux-video", category: "Game Design", contentType: "JW Confederation GDD", keyData: "Campaign design", targetPage: "/projets/jurassic-wars/confederation", status: "not_extracted", extractionPct: 0, priority: "P2" },
  { id: "gdd-tww3", path: "01_Jeux-Video/.../GDD_MOD.md", filename: "GDD_MOD.md", zone: "jeux-video", category: "Game Design", contentType: "TW:WH3 mod GDD", keyData: "Total War mod design", targetPage: "/projets/byss-games", status: "not_extracted", extractionPct: 0, priority: "P2" },

  // ── CARRIER DATA (active) ──
  { id: "seed-ts", path: "byss-carrier/src/lib/db/seed.ts", filename: "seed.ts", zone: "carrier-data", category: "Seeds", contentType: "Prospect data", keyData: "Digicel, Wizzee, GoodCircle etc.", targetPage: "/pipeline", status: "extracted", extractionPct: 100, priority: "P0" },
  { id: "seed-tables", path: "byss-carrier/scripts/seed-tables.mjs", filename: "seed-tables.mjs", zone: "carrier-data", category: "Seeds", contentType: "DB seeder", keyData: "9 invoices, 5 videos, 11 activities", targetPage: "Global", status: "extracted", extractionPct: 100, priority: "P0" },
  { id: "seed-empire", path: "byss-carrier/scripts/seed-empire.mjs", filename: "seed-empire.mjs", zone: "carrier-data", category: "Seeds", contentType: "Empire seeder", keyData: "Migration + seed orchestration", targetPage: "Global", status: "extracted", extractionPct: 100, priority: "P0" },
  { id: "schema", path: "byss-carrier/src/lib/db/schema.ts", filename: "schema.ts", zone: "carrier-data", category: "Schema", contentType: "DB schema", keyData: "Full Supabase schema", targetPage: "Global", status: "extracted", extractionPct: 100, priority: "P0" },
];

/* ═══════════════════════════════════════════════════════════════ */

const statusConfig: Record<ExtractionStatus, { label: string; color: string; bg: string }> = {
  extracted: { label: "Extrait", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  partial: { label: "Partiel", color: "text-amber-400", bg: "bg-amber-500/15" },
  not_extracted: { label: "Non extrait", color: "text-red-400", bg: "bg-red-500/15" },
  "n/a": { label: "N/A", color: "text-gray-500", bg: "bg-gray-500/10" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  P0: { label: "P0 CRITIQUE", color: "text-red-400" },
  P1: { label: "P1 HAUTE", color: "text-amber-400" },
  P2: { label: "P2 MOYENNE", color: "text-blue-400" },
  P3: { label: "P3 BASSE", color: "text-gray-500" },
};

export default function ExtractionDashboardPage() {
  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set(ZONES.map((z) => z.id)));

  const filtered = SOURCE_FILES.filter((f) => {
    if (filterZone !== "all" && f.zone !== filterZone) return false;
    if (filterStatus !== "all" && f.status !== filterStatus) return false;
    if (filterPriority !== "all" && f.priority !== filterPriority) return false;
    if (search) {
      const q = search.toLowerCase();
      return f.filename.toLowerCase().includes(q) || f.keyData.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.targetPage.toLowerCase().includes(q);
    }
    return true;
  });

  const totalFiles = SOURCE_FILES.length;
  const extracted = SOURCE_FILES.filter((f) => f.status === "extracted").length;
  const partial = SOURCE_FILES.filter((f) => f.status === "partial").length;
  const notExtracted = SOURCE_FILES.filter((f) => f.status === "not_extracted").length;
  const avgPct = Math.round(SOURCE_FILES.reduce((a, f) => a + f.extractionPct, 0) / totalFiles);
  const p0Count = SOURCE_FILES.filter((f) => f.priority === "P0" && f.status !== "extracted").length;

  const toggleZone = (zoneId: string) => {
    setExpandedZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) next.delete(zoneId);
      else next.add(zoneId);
      return next;
    });
  };

  const groupedByZone = ZONES.map((zone) => ({
    ...zone,
    files: filtered.filter((f) => f.zone === zone.id),
    totalPct: Math.round(
      SOURCE_FILES.filter((f) => f.zone === zone.id).reduce((a, f) => a + f.extractionPct, 0) /
        Math.max(SOURCE_FILES.filter((f) => f.zone === zone.id).length, 1)
    ),
  }));

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold">
          Data <span className="text-red-400">Extraction</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          210+ fichiers specs — Suivi temps reel de l&apos;extraction vers l&apos;application
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
          <div className="text-xs font-medium text-[var(--color-text-muted)]"><Database className="mb-1 inline h-3.5 w-3.5" /> TOTAL FICHIERS</div>
          <div className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold">{totalFiles}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-xs font-medium text-emerald-400"><CheckCircle2 className="mb-1 inline h-3.5 w-3.5" /> EXTRAITS</div>
          <div className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold text-emerald-400">{extracted}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="text-xs font-medium text-amber-400"><AlertTriangle className="mb-1 inline h-3.5 w-3.5" /> PARTIELS</div>
          <div className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold text-amber-400">{partial}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="text-xs font-medium text-red-400"><Circle className="mb-1 inline h-3.5 w-3.5" /> NON EXTRAITS</div>
          <div className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold text-red-400">{notExtracted}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-4">
          <div className="text-xs font-medium text-[var(--color-text-muted)]"><BarChart3 className="mb-1 inline h-3.5 w-3.5" /> EXTRACTION MOY.</div>
          <div className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold">{avgPct}%</div>
          <div className="mt-2 h-2 rounded-full bg-[#1a1a2e]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${avgPct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="text-xs font-medium text-red-400"><Zap className="mb-1 inline h-3.5 w-3.5" /> P0 EN ATTENTE</div>
          <div className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold text-red-400">{p0Count}</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher fichier, data, page cible..." className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2.5 text-xs text-[var(--color-text)]">
          <option value="all">Tous statuts</option>
          <option value="extracted">Extrait</option>
          <option value="partial">Partiel</option>
          <option value="not_extracted">Non extrait</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="rounded-lg border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-3 py-2.5 text-xs text-[var(--color-text)]">
          <option value="all">Toutes priorites</option>
          <option value="P0">P0 Critique</option>
          <option value="P1">P1 Haute</option>
          <option value="P2">P2 Moyenne</option>
          <option value="P3">P3 Basse</option>
        </select>
      </div>

      {/* Zone Groups */}
      <div className="space-y-4">
        {groupedByZone.map((zone) => {
          const Icon = zone.icon;
          const isExpanded = expandedZones.has(zone.id);
          if (zone.files.length === 0 && (filterStatus !== "all" || filterPriority !== "all" || search)) return null;

          return (
            <motion.div key={zone.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A]">
              {/* Zone Header */}
              <button onClick={() => toggleZone(zone.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-white/[0.02]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: zone.color + "20" }}>
                  <Icon className="h-4.5 w-4.5" style={{ color: zone.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold">{zone.label}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[var(--color-text-muted)]">{zone.files.length} fichiers</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{zone.description}</p>
                </div>
                {/* Zone Progress */}
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-[#1a1a2e]">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${zone.totalPct}%`, backgroundColor: zone.totalPct > 70 ? "#10B981" : zone.totalPct > 30 ? "#F59E0B" : "#EF4444" }} />
                    </div>
                  </div>
                  <span className="min-w-[3ch] text-right text-sm font-bold" style={{ color: zone.totalPct > 70 ? "#10B981" : zone.totalPct > 30 ? "#F59E0B" : "#EF4444" }}>{zone.totalPct}%</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />}
                </div>
              </button>

              {/* Files Table */}
              <AnimatePresence>
                {isExpanded && zone.files.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="border-t border-[var(--color-border-subtle)]">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                            <th className="px-4 py-2 text-left font-medium">FICHIER</th>
                            <th className="px-4 py-2 text-left font-medium">CONTENU</th>
                            <th className="px-4 py-2 text-left font-medium">PAGE CIBLE</th>
                            <th className="px-4 py-2 text-left font-medium">PRIORITE</th>
                            <th className="px-4 py-2 text-left font-medium">STATUT</th>
                            <th className="px-4 py-2 text-right font-medium">EXTRACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {zone.files.map((file) => (
                            <tr key={file.id} className="border-b border-[var(--color-border-subtle)]/50 hover:bg-white/[0.02]">
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                                  <span className="font-medium text-[var(--color-text)]">{file.filename}</span>
                                </div>
                                <div className="mt-0.5 pl-5.5 text-[10px] text-[var(--color-text-muted)]">{file.keyData}</div>
                              </td>
                              <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{file.contentType}</td>
                              <td className="px-4 py-2.5">
                                <span className="text-[var(--color-cyan)]">{file.targetPage}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className={cn("text-[10px] font-bold", priorityConfig[file.priority].color)}>{priorityConfig[file.priority].label}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", statusConfig[file.status].bg, statusConfig[file.status].color)}>
                                  {file.status === "extracted" && <CheckCircle2 className="h-3 w-3" />}
                                  {file.status === "partial" && <AlertTriangle className="h-3 w-3" />}
                                  {file.status === "not_extracted" && <Circle className="h-3 w-3" />}
                                  {statusConfig[file.status].label}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="h-1.5 w-16 rounded-full bg-[#1a1a2e]">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${file.extractionPct}%`, backgroundColor: file.extractionPct === 100 ? "#10B981" : file.extractionPct > 0 ? "#F59E0B" : "#374151" }} />
                                  </div>
                                  <span className="min-w-[3ch] font-mono font-bold" style={{ color: file.extractionPct === 100 ? "#10B981" : file.extractionPct > 0 ? "#F59E0B" : "#6B7280" }}>{file.extractionPct}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
