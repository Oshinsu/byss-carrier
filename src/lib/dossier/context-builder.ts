// ═══════════════════════════════════════════════════════
// DOSSIER CONTEXT BUILDER — Unified Data Aggregator
//
// Parallel fetch: Prospect + Interactions + SIRENE +
// Bible de Vente + Intelligence Martinique + RAG
// ═══════════════════════════════════════════════════════

import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }
import { buildRAGContext } from "@/lib/ai/rag";

/* ── Types ─────────────────────────────────────────── */

export interface SireneCompany {
  siret: string | null;
  siren: string;
  denomination: string;
  activitePrincipale: string | null;
  codeNAF: string | null;
  adresse: string | null;
  codePostal: string | null;
  commune: string | null;
  effectif: string | null;
  dateCreation: string | null;
  categorieJuridique: string | null;
  trancheEffectif: string | null;
}

export interface ProspectContext {
  prospect: Record<string, unknown>;
  interactions: Record<string, unknown>[];
  sirene: SireneCompany | null;
  bible: Record<string, unknown>[];
  intel: Record<string, unknown>[];
  rag: string;
}

/* ── SIRENE External Fetch ─────────────────────────── */

async function fetchSireneData(
  companyName: string,
  department: string = "972"
): Promise<SireneCompany | null> {
  try {
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(
      companyName
    )}&department=${department}&per_page=3&mtm_campaign=byss-carrier`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const first = data.results?.[0];
    if (!first) return null;

    const siege = first.siege || {};
    return {
      siret: siege.siret || null,
      siren: first.siren || "",
      denomination: first.nom_complet || first.nom_raison_sociale || "",
      activitePrincipale:
        siege.activite_principale || first.activite_principale || null,
      codeNAF: siege.activite_principale || first.activite_principale || null,
      adresse:
        [siege.numero_voie, siege.type_voie, siege.libelle_voie]
          .filter(Boolean)
          .join(" ") || null,
      codePostal: siege.code_postal || null,
      commune: siege.libelle_commune || null,
      effectif: first.tranche_effectif_salarie || null,
      dateCreation: first.date_creation || null,
      categorieJuridique: first.nature_juridique || null,
      trancheEffectif: first.tranche_effectif_salarie || null,
    };
  } catch (err) {
    console.warn("[dossier] SIRENE fetch failed:", err);
    return null;
  }
}

/* ── Main Context Builder ──────────────────────────── */

export async function buildProspectContext(
  prospectId: string
): Promise<ProspectContext> {
  const supabase = createClient();

  // 1. Fetch prospect first (need name/sector for other queries)
  const { data: prospect, error: prospectErr } = await supabase
    .from("prospects")
    .select("*")
    .eq("id", prospectId)
    .single();

  if (prospectErr || !prospect) {
    throw new Error(`Prospect ${prospectId} introuvable: ${prospectErr?.message}`);
  }

  const name = (prospect.name as string) || "";
  const sector = (prospect.sector as string) || "";
  const painPoints = (prospect.pain_points as string) || "";

  // 2. Parallel fetch everything else
  const [interactionsRes, sirene, bibleRes, intelRes, rag] = await Promise.all([
    // Interactions
    supabase
      .from("interactions")
      .select("*")
      .eq("prospect_id", prospectId)
      .order("created_at", { ascending: false })
      .limit(20),

    // SIRENE enrichment
    fetchSireneData(name, "972"),

    // Bible de Vente entries matching sector
    supabase
      .from("lore_entries")
      .select("*")
      .eq("universe", "bible")
      .or(
        `tags.cs.{${sector}},category.eq.pricing,category.eq.case_study,category.eq.objection,category.eq.vertical`
      )
      .limit(15),

    // Intelligence Martinique
    supabase
      .from("intel_entities")
      .select("*")
      .eq("domain", "economique")
      .limit(15),

    // RAG semantic search
    buildRAGContext(`${name} ${sector} ${painPoints} Martinique commercial`, {
      limit: 6,
    }).catch(() => ""),
  ]);

  return {
    prospect,
    interactions: interactionsRes.data || [],
    sirene,
    bible: bibleRes.data || [],
    intel: intelRes.data || [],
    rag,
  };
}

/* ── Compress context for Claude prompt ────────────── */

export function compressContext(ctx: ProspectContext): string {
  const sections: string[] = [];

  // Prospect
  const p = ctx.prospect;
  sections.push(
    `## PROSPECT\nNom: ${p.name}\nSecteur: ${p.sector}\nPhase: ${p.phase}\nScore: ${p.score}/5\nContact: ${p.key_contact || "N/A"}\nTel: ${p.phone || "N/A"}\nEmail: ${p.email || "N/A"}\nDouleurs: ${p.pain_points || "N/A"}\nPanier estime: ${p.estimated_basket || "N/A"}€\nPhrase memorable: ${p.memorable_phrase || "N/A"}`
  );

  // Interactions
  if (ctx.interactions.length > 0) {
    const intLines = ctx.interactions
      .slice(0, 10)
      .map(
        (i) =>
          `- [${i.type}] ${new Date(i.created_at as string).toLocaleDateString("fr-FR")}: ${i.notes || i.summary || "RAS"}`
      )
      .join("\n");
    sections.push(`## INTERACTIONS (${ctx.interactions.length})\n${intLines}`);
  }

  // SIRENE
  if (ctx.sirene) {
    const s = ctx.sirene;
    sections.push(
      `## SIRENE\nSIRET: ${s.siret}\nSIREN: ${s.siren}\nDenomination: ${s.denomination}\nNAF: ${s.codeNAF}\nAdresse: ${s.adresse}, ${s.codePostal} ${s.commune}\nEffectif: ${s.effectif || "N/A"}\nCreation: ${s.dateCreation}\nForme juridique: ${s.categorieJuridique}`
    );
  }

  // Bible
  if (ctx.bible.length > 0) {
    const bibleLines = ctx.bible
      .slice(0, 8)
      .map((b) => `- [${b.category}] ${b.title}: ${((b.content as string) || "").slice(0, 200)}`)
      .join("\n");
    sections.push(`## BIBLE DE VENTE (${ctx.bible.length} entrees)\n${bibleLines}`);
  }

  // Intel
  if (ctx.intel.length > 0) {
    const intelLines = ctx.intel
      .slice(0, 8)
      .map((e) => `- ${e.name}: ${((e.description as string) || "").slice(0, 150)}`)
      .join("\n");
    sections.push(`## INTELLIGENCE MARTINIQUE (${ctx.intel.length})\n${intelLines}`);
  }

  // RAG
  if (ctx.rag) {
    sections.push(`## RAG\n${ctx.rag}`);
  }

  return sections.join("\n\n");
}
