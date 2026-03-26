// ═══════════════════════════════════════════════════════
// DOSSIER API — McKinsey-grade prospect dossier generator
//
// POST { action: 'generate', prospectId }
//   → 10-section commercial dossier via Claude + all data
//
// POST { action: 'regenerate_section', prospectId, section }
//   → Regenerate one specific section
//
// GET ?prospectId=xxx
//   → Fetch saved dossier
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";
import { createClient as createServerClient } from "@supabase/supabase-js";

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
import { callOpenRouter } from "@/lib/ai/router";
import {
  buildProspectContext,
  compressContext,
} from "@/lib/dossier/context-builder";
import { getFewShotExamples } from "@/lib/ai/few-shot";
import { reflect } from "@/lib/ai/reflection";

/* ── Dossier JSON Structure ────────────────────────── */

export interface DossierData {
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

/* ── System prompt for dossier generation ──────────── */

const DOSSIER_SYSTEM_PROMPT = `Tu es un consultant senior de BYSS GROUP, agence digitale en Martinique. Tu prepares un dossier commercial complet pour un prospect martiniquais.

MODE_CADIFOR: compression, precision, phrases memorables. Pas de mots faibles.

Genere un dossier en 10 sections en JSON strict. Chaque section doit etre DENSE et ACTIONNABLE.

Structure EXACTE requise:
{
  "executive_summary": "3 phrases max — pourquoi ce prospect DOIT acheter maintenant",
  "company_profile": {
    "name": "Nom officiel",
    "siret": "SIRET ou null",
    "naf": "Code NAF ou null",
    "workforce": "Tranche effectif ou null",
    "creation": "Date creation ou null",
    "legal_form": "Forme juridique ou null",
    "address": "Adresse complete ou null"
  },
  "market_context": "Analyse du secteur en Martinique: taille, tendances, enjeux digitaux. 3-5 phrases.",
  "pain_points": [
    { "pain": "Douleur identifiee", "impact": "Impact business chiffre", "byss_solution": "Comment BYSS resout ca" }
  ],
  "competitive_landscape": "Concurrents locaux, leurs faiblesses, positionnement BYSS. 3-5 phrases.",
  "proposed_solution": {
    "description": "Solution sur mesure en 2-3 phrases",
    "modules": ["Module 1", "Module 2", "Module 3"],
    "timeline": "Delai de livraison",
    "differentiators": ["Diff 1", "Diff 2", "Diff 3"]
  },
  "pricing": {
    "essential": { "price": "X EUR/mois", "includes": ["Feature 1", "Feature 2"] },
    "croissance": { "price": "X EUR/mois", "includes": ["Feature 1", "Feature 2", "Feature 3"] },
    "domination": { "price": "X EUR/mois", "includes": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"] }
  },
  "roi_projection": {
    "investment": "Investissement total annuel",
    "monthly_savings": "Economies ou gains mensuels",
    "annual_roi": "ROI annuel en %",
    "payback_months": 4
  },
  "case_studies": [
    { "client": "Nom client similaire", "sector": "Meme secteur", "result": "Resultat chiffre", "quote": "Temoignage client" }
  ],
  "next_steps": [
    { "action": "Action precise", "deadline": "J+X ou date", "owner": "Qui fait quoi" }
  ]
}

REGLES:
- Adapte les prix au marche martiniquais (PME: 500-3000 EUR/mois)
- Les ROI doivent etre realistes et justifies
- Les pain points doivent mapper EXACTEMENT aux solutions
- Les case studies doivent etre du meme secteur si possible
- Les next steps doivent etre concrets avec des deadlines
- REPONDS UNIQUEMENT en JSON valide, rien d'autre`;

/* ── GET — Fetch saved dossier ─────────────────────── */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prospectId = searchParams.get("prospectId");

  if (!prospectId) {
    return NextResponse.json(
      { error: "prospectId requis" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .eq("type", "dossier")
      .eq("metadata->>prospect_id", prospectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dossier: data });
  } catch (err) {
    console.error("[DOSSIER] GET error:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* ── POST — Generate or regenerate dossier ─────────── */

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit("dossier-route", 5, 120000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit — max 5 dossiers par 2 minutes" },
      { status: 429, headers: { "Retry-After": "120" } }
    );
  }

  try {
    const body = await request.json();
    const { action, prospectId, section } = body;

    if (!prospectId) {
      return NextResponse.json(
        { error: "prospectId requis" },
        { status: 400 }
      );
    }

    if (action === "generate") {
      return await generateFullDossier(prospectId);
    }

    if (action === "regenerate_section" && section) {
      return await regenerateSection(prospectId, section);
    }

    return NextResponse.json(
      { error: "Action invalide. Utilise 'generate' ou 'regenerate_section'" },
      { status: 400 }
    );
  } catch (err) {
    console.error("[DOSSIER] POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* ── Generate full 10-section dossier ──────────────── */

async function generateFullDossier(prospectId: string) {
  const startTime = Date.now();

  // 1. Build unified context
  const ctx = await buildProspectContext(prospectId);
  const compressed = compressContext(ctx);

  // 2a. Fetch few-shot examples (Stanford bootstrapping)
  const fewShotBlock = await getFewShotExamples("generate_dossier", 2);
  const enhancedSystemPrompt = fewShotBlock
    ? DOSSIER_SYSTEM_PROMPT + fewShotBlock
    : DOSSIER_SYSTEM_PROMPT;

  // 2b. Call Claude via OpenRouter (analysis task = heavy model)
  const userPrompt = `Genere le dossier commercial complet pour ce prospect.\n\n${compressed}`;
  const response = await callOpenRouter({
    task: "analysis",
    messages: [
      { role: "system" as const, content: enhancedSystemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    maxTokens: 6000,
  });

  // 3. Parse JSON response
  const jsonMatch = response.content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json(
      { error: "Claude n'a pas genere de JSON valide" },
      { status: 500 }
    );
  }

  let dossier: DossierData;
  try {
    dossier = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json(
      { error: "JSON parse error dans la reponse Claude" },
      { status: 500 }
    );
  }

  // 4. Save to insights table
  const supabase = getSupabase();
  const { data: saved, error: saveErr } = await supabase
    .from("insights")
    .insert({
      type: "dossier",
      title: `Dossier — ${ctx.prospect.name}`,
      content: JSON.stringify(dossier),
      data: dossier,
      agent_name: "dossier-generator",
      metadata: {
        prospect_id: prospectId,
        prospect_name: ctx.prospect.name,
        sector: ctx.prospect.sector,
        model: response.model,
        duration_ms: Date.now() - startTime,
        tokens: response.usage,
        sirene_found: !!ctx.sirene,
        bible_entries: ctx.bible.length,
        intel_entries: ctx.intel.length,
        interactions_count: ctx.interactions.length,
      },
    })
    .select()
    .single();

  if (saveErr) {
    console.warn("[DOSSIER] Save error (returning anyway):", saveErr.message);
  }

  // 5. Log agent action
  try {
    const { logAgentAction } = await import("@/lib/db/queries");
    await logAgentAction({
      agent_name: "dossier-generator",
      action: "generate_dossier",
      model: response.model,
      input_tokens: response.usage?.prompt_tokens || 0,
      output_tokens: response.usage?.completion_tokens || 0,
      cost_usd: 0,
      duration_ms: Date.now() - startTime,
      success: true,
      metadata: {
        prospect_id: prospectId,
        prospect_name: ctx.prospect.name,
      },
    } as any);
  } catch {} // fire and forget

  // 6. Reflection loop (MIT) — async, non-blocking
  reflect("generate_dossier", userPrompt, response.content).catch(() => {});

  return NextResponse.json({
    dossier,
    saved_id: saved?.id || null,
    meta: {
      duration_ms: Date.now() - startTime,
      model: response.model,
      sources: {
        sirene: !!ctx.sirene,
        bible: ctx.bible.length,
        intel: ctx.intel.length,
        interactions: ctx.interactions.length,
        rag: ctx.rag ? "yes" : "no",
      },
    },
  });
}

/* ── Regenerate a single section ───────────────────── */

async function regenerateSection(prospectId: string, section: string) {
  const ctx = await buildProspectContext(prospectId);
  const compressed = compressContext(ctx);

  const SECTION_PROMPTS: Record<string, string> = {
    executive_summary:
      "Regenere UNIQUEMENT l'executive_summary. 3 phrases percutantes. Reponds en JSON: {\"executive_summary\": \"...\"}",
    company_profile:
      "Regenere UNIQUEMENT le company_profile avec les donnees SIRENE. Reponds en JSON: {\"company_profile\": {...}}",
    market_context:
      "Regenere UNIQUEMENT le market_context. Analyse sectorielle Martinique. Reponds en JSON: {\"market_context\": \"...\"}",
    pain_points:
      "Regenere UNIQUEMENT les pain_points. 3-5 douleurs avec impact et solution. Reponds en JSON: {\"pain_points\": [...]}",
    competitive_landscape:
      "Regenere UNIQUEMENT le competitive_landscape. Concurrents et positionnement BYSS. Reponds en JSON: {\"competitive_landscape\": \"...\"}",
    proposed_solution:
      "Regenere UNIQUEMENT la proposed_solution. Modules, timeline, differenciateurs. Reponds en JSON: {\"proposed_solution\": {...}}",
    pricing:
      "Regenere UNIQUEMENT le pricing. 3 offres (Essential/Croissance/Domination). Reponds en JSON: {\"pricing\": {...}}",
    roi_projection:
      "Regenere UNIQUEMENT le roi_projection. ROI realiste. Reponds en JSON: {\"roi_projection\": {...}}",
    case_studies:
      "Regenere UNIQUEMENT les case_studies. 2-3 cas du meme secteur. Reponds en JSON: {\"case_studies\": [...]}",
    next_steps:
      "Regenere UNIQUEMENT les next_steps. Actions concretes avec deadlines. Reponds en JSON: {\"next_steps\": [...]}",
  };

  const sectionPrompt = SECTION_PROMPTS[section];
  if (!sectionPrompt) {
    return NextResponse.json(
      { error: `Section invalide: ${section}` },
      { status: 400 }
    );
  }

  const response = await callOpenRouter({
    task: "commercial",
    messages: [
      { role: "system" as const, content: DOSSIER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `${sectionPrompt}\n\nContexte:\n${compressed}`,
      },
    ],
    temperature: 0.6,
    maxTokens: 2000,
  });

  const jsonMatch = response.content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json(
      { error: "JSON invalide pour la section" },
      { status: 500 }
    );
  }

  try {
    const partial = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ section, data: partial[section] || partial });
  } catch {
    return NextResponse.json(
      { error: "Parse error section" },
      { status: 500 }
    );
  }
}
