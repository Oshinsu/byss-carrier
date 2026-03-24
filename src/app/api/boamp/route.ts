import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scoreTenderRelevance } from "@/lib/data/cpv-codes";
import { onMarcheStatusChanged } from "@/lib/synergies";

// ═══════════════════════════════════════════════════════
// BOAMP API — Marchés Publics Martinique (972)
// Source: OpenDataSoft / DILA
// Cache: 1 hour — public tender data
// POST: import, analyze, generate_memoire, status_changed
// ═══════════════════════════════════════════════════════

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const BASE_URL =
  "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";

const FIELDS = [
  "id",
  "intitule",
  "nomacheteur",
  "nature",
  "datepublicationdonnees",
  "datelimitereponse",
  "descripteur",
  "familleactivite",
  "departement",
  "typeavis",
  "codecpv",
  "procedure",
  "url_avis",
].join(",");

/** In-memory cache: key → { data, timestamp } */
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 3600_000; // 1 hour

function cached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
  // Prevent unbounded growth
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      /* ── Search tenders by keyword ── */
      case "search": {
        const q = searchParams.get("q") || "informatique";
        const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
        const cacheKey = `search:${q}:${limit}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json(hit);

        const where = `departement='972' AND (intitule LIKE '%${q}%' OR descripteur LIKE '%${q}%' OR nomacheteur LIKE '%${q}%')`;
        const url = `${BASE_URL}?select=${FIELDS}&where=${encodeURIComponent(where)}&order_by=datepublicationdonnees DESC&limit=${limit}`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`BOAMP responded ${res.status}`);
        const json = await res.json();

        const data = {
          results: (json.results ?? []).map(simplify),
          total: json.total_count ?? 0,
          query: q,
          source: "BOAMP OpenDataSoft",
        };

        setCache(cacheKey, data);
        return NextResponse.json(data);
      }

      /* ── Latest tenders in 972 ── */
      case "latest": {
        const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
        const cacheKey = `latest:${limit}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json(hit);

        const where = "departement='972'";
        const url = `${BASE_URL}?select=${FIELDS}&where=${encodeURIComponent(where)}&order_by=datepublicationdonnees DESC&limit=${limit}`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`BOAMP responded ${res.status}`);
        const json = await res.json();

        const data = {
          results: (json.results ?? []).map(simplify),
          total: json.total_count ?? 0,
          source: "BOAMP OpenDataSoft",
        };

        setCache(cacheKey, data);
        return NextResponse.json(data);
      }

      /* ── Single tender detail ── */
      case "detail": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Paramètre id requis" }, { status: 400 });

        const cacheKey = `detail:${id}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json(hit);

        const where = `id='${id}'`;
        const url = `${BASE_URL}?where=${encodeURIComponent(where)}&limit=1`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`BOAMP responded ${res.status}`);
        const json = await res.json();

        if (!json.results?.length) {
          return NextResponse.json({ error: "Marché introuvable" }, { status: 404 });
        }

        const data = { result: simplify(json.results[0]), source: "BOAMP OpenDataSoft" };
        setCache(cacheKey, data);
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json(
          { error: "Action requise: search, latest, detail" },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur BOAMP" },
      { status: 500 },
    );
  }
}

/* ═══════════════════════════════════════════════════════
   POST — Import, Analyze, Generate Mémoire, Status Changed
   ═══════════════════════════════════════════════════════ */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      /* ── Import a BOAMP tender into Supabase ── */
      case "import": {
        const { tender, relevanceScore } = body;
        if (!tender?.intitule) {
          return NextResponse.json({ error: "Tender data required" }, { status: 400 });
        }

        const supabase = getSupabase();

        // Check duplicate
        const { data: existing } = await supabase
          .from("marches_publics")
          .select("id")
          .eq("boamp_id", tender.id)
          .maybeSingle();

        if (existing) {
          return NextResponse.json({ data: existing, duplicate: true });
        }

        const cpvCodes = tender.codeCPV
          ? tender.codeCPV.split(/[,;]/).map((c: string) => c.trim()).filter(Boolean)
          : [];

        const { data, error } = await supabase
          .from("marches_publics")
          .insert({
            boamp_id: tender.id || null,
            title: tender.intitule,
            acheteur: tender.acheteur || null,
            nature: tender.nature || null,
            date_publication: tender.datePublication || null,
            date_limite: tender.dateLimite || null,
            cpv_codes: cpvCodes.length > 0 ? cpvCodes : null,
            description: tender.descripteur || null,
            url_source: tender.urlAvis || null,
            platform: "boamp",
            status: "detected",
            relevance_score: relevanceScore || scoreTenderRelevance(tender.intitule, tender.descripteur || ""),
          })
          .select("id")
          .single();

        if (error) throw error;
        return NextResponse.json({ data, imported: true });
      }

      /* ── Deep AI Analysis of a saved marché ── */
      case "analyze": {
        const { marcheId } = body;
        if (!marcheId) {
          return NextResponse.json({ error: "marcheId required" }, { status: 400 });
        }

        const supabase = getSupabase();
        const { data: marche } = await supabase
          .from("marches_publics")
          .select("*")
          .eq("id", marcheId)
          .single();

        if (!marche) {
          return NextResponse.json({ error: "Marché introuvable" }, { status: 404 });
        }

        // Call AI for deep analysis
        const { callOpenRouter } = await import("@/lib/ai/router");
        const prompt = `Tu es un expert en marchés publics français pour BYSS GROUP (agence numérique Martinique 972).
Capacités: développement web/mobile, IA/ML, vidéo/audiovisuel, marketing digital, formation, conseil IT, cloud/hébergement, cybersécurité, transformation digitale.

Analyse ce marché public en profondeur:
- Titre: ${marche.title}
- Acheteur: ${marche.acheteur || "Non précisé"}
- Nature: ${marche.nature || "Non précisée"}
- Description: ${marche.description || "Non disponible"}
- CPV: ${(marche.cpv_codes || []).join(", ") || "Non précisés"}
- Date limite: ${marche.date_limite || "Non précisée"}
- Budget estimé: ${marche.budget_estimated || "Non précisé"}

Fournis:
1. CORRESPONDANCE: Score 0-100 de match avec les capacités BYSS
2. COMPÉTENCES MANQUANTES: Ce qui manque à BYSS pour répondre seul
3. PARTENAIRES GME: Suggestion de types de partenaires pour un groupement
4. EFFORT: Estimation en jours-homme
5. STRATÉGIE PRIX: Recommandation tarifaire (fourchette)
6. RISQUES: Principaux risques identifiés
7. RECOMMANDATION: GO / NO-GO / A ÉVALUER avec justification

Réponds en texte structuré, pas en JSON.`;

        const result = await callOpenRouter({
          task: "analysis",
          messages: [{ role: "user", content: prompt }],
          maxTokens: 2048,
          temperature: 0.3,
        });

        // Extract GO/NO-GO
        const analysis = result.content;
        let goNoGo = "A EVALUER";
        if (/\bGO\b/.test(analysis) && !/NO[- ]?GO/.test(analysis.slice(0, analysis.indexOf("GO") + 10))) {
          goNoGo = "GO";
        }
        if (/NO[- ]?GO/i.test(analysis)) {
          goNoGo = "NO-GO";
        }

        // Save to Supabase
        await supabase
          .from("marches_publics")
          .update({
            ai_analysis: analysis,
            go_no_go: goNoGo,
            status: marche.status === "detected" ? "analyzing" : marche.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", marcheId);

        return NextResponse.json({ analysis, goNoGo, model: result.model });
      }

      /* ── Generate Mémoire Technique skeleton ── */
      case "generate_memoire": {
        const { marcheId } = body;
        if (!marcheId) {
          return NextResponse.json({ error: "marcheId required" }, { status: 400 });
        }

        const supabase = getSupabase();
        const { data: marche } = await supabase
          .from("marches_publics")
          .select("*")
          .eq("id", marcheId)
          .single();

        if (!marche) {
          return NextResponse.json({ error: "Marché introuvable" }, { status: 404 });
        }

        const { callOpenRouter } = await import("@/lib/ai/router");
        const prompt = `Tu es un expert en rédaction de mémoires techniques pour marchés publics.
BYSS GROUP est une agence numérique basée en Martinique (972).
Capacités: dev web/mobile (Next.js, React, Node.js), IA/ML (Claude, GPT, agents), vidéo/audiovisuel, marketing digital, formation professionnelle, conseil IT, cloud, cybersécurité, transformation digitale.

Marché: ${marche.title}
Acheteur: ${marche.acheteur || "Non précisé"}
Nature: ${marche.nature || "Non précisée"}
Description/CCTP: ${marche.description || "Non disponible"}
Analyse IA: ${marche.ai_analysis || "Non disponible"}

Génère un squelette de mémoire technique avec 8 sections.
Pour chaque section, rédige 2-4 paragraphes pertinents et spécifiques au marché.

Réponds en JSON strict avec cette structure:
{
  "presentation": "contenu section...",
  "comprehension": "contenu section...",
  "methodologie": "contenu section...",
  "moyens": "contenu section...",
  "planning": "contenu section...",
  "references": "contenu section...",
  "innovation": "contenu section...",
  "rse": "contenu section..."
}`;

        const result = await callOpenRouter({
          task: "analysis",
          messages: [{ role: "user", content: prompt }],
          maxTokens: 4096,
          temperature: 0.4,
        });

        // Parse JSON from response
        let sections: Record<string, string> = {};
        try {
          const jsonMatch = result.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            sections = JSON.parse(jsonMatch[0]);
          }
        } catch {
          // Fallback: split by double newlines
          sections = { presentation: result.content };
        }

        return NextResponse.json({ sections, model: result.model });
      }

      /* ── Status changed — trigger synergies ── */
      case "status_changed": {
        const { marcheId, title, acheteur, newStatus, budget } = body;
        if (!marcheId || !newStatus) {
          return NextResponse.json({ error: "marcheId + newStatus required" }, { status: 400 });
        }

        // Get date_limite for calendar synergy
        const supabase = getSupabase();
        const { data: marche } = await supabase
          .from("marches_publics")
          .select("date_limite")
          .eq("id", marcheId)
          .single();

        await onMarcheStatusChanged(
          marcheId,
          title || "",
          acheteur || "",
          newStatus,
          budget || 0,
          marche?.date_limite || undefined,
        );

        return NextResponse.json({ synergies: "triggered" });
      }

      default:
        return NextResponse.json(
          { error: "Action POST requise: import, analyze, generate_memoire, status_changed" },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 },
    );
  }
}

/* ── Simplify a BOAMP record ── */
function simplify(record: Record<string, unknown>) {
  return {
    id: record.id,
    intitule: record.intitule || "Sans titre",
    acheteur: record.nomacheteur || "Non précisé",
    nature: record.nature || "",
    datePublication: record.datepublicationdonnees || "",
    dateLimite: record.datelimitereponse || "",
    descripteur: record.descripteur || "",
    familleActivite: record.familleactivite || "",
    departement: record.departement || "972",
    typeAvis: record.typeavis || "",
    codeCPV: record.codecpv || "",
    procedure: record.procedure || "",
    urlAvis: record.url_avis || "",
  };
}
