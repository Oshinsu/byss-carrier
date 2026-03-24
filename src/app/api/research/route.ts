import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";
import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }
import { logAgentAction } from "@/lib/db/queries";
import { callOpenRouter } from "@/lib/ai/router";
import {
  DEPTH_CONFIG,
  DOMAIN_AGENTS,
  getDepthModel,
  resolveAgent,
  type ResearchRequest,
  type ResearchDepth,
  type ResearchDomain,
  type ResearchMode,
} from "@/lib/research";

// ═══════════════════════════════════════════════════════
// BYSS Research API
//
// POST: Execute 7-stage research pipeline
// Inspired by EurekaClaw + K-Dense + AgentScope
// ═══════════════════════════════════════════════════════

const RESEARCH_SYSTEM_PROMPT = `Tu es l'Agent Recherche de BYSS GROUP — Premier studio IA de la Martinique.

## Pipeline EurekaClaw (7 etapes)
Tu executes une recherche structuree en 7 etapes:
1. QUESTION — Reformule la question pour precision maximale
2. SOURCES — Identifie les sources pertinentes (web, base interne, fichiers)
3. ANALYSE — Cross-reference les informations, detecte contradictions
4. SYNTHESE — Identifie patterns, tendances, gaps
5. HYPOTHESE — Genere des insights et recommandations actionnables
6. VALIDATION — Fact-check, indique le niveau de confiance
7. RAPPORT — Resume structure et actionnable

## Format de Sortie (JSON strict)
Reponds UNIQUEMENT avec un JSON valide:
{
  "reformulatedQuestion": "question reformulee pour precision",
  "findings": [
    {
      "insight": "decouverte cle",
      "confidence": "faible|moyen|eleve",
      "sources": [0, 1],
      "category": "categorie"
    }
  ],
  "sources": [
    {
      "title": "titre de la source",
      "url": "url si disponible",
      "type": "web|lore|local|api",
      "confidence": 0.85,
      "snippet": "extrait pertinent"
    }
  ],
  "summary": "synthese en 3-5 phrases MODE_CADIFOR",
  "graphNodes": [
    { "id": "concept-1", "label": "Concept", "domain": "technology" }
  ],
  "graphEdges": [
    { "source": "concept-1", "target": "concept-2", "weight": 0.8, "label": "relation" }
  ],
  "followUpQuestions": ["question pour approfondir 1", "question 2"]
}

## Regles MODE_CADIFOR
- Compression: pas de filler, chaque phrase porte du sens
- Cite toujours tes sources avec index
- Indique ton niveau de confiance (faible/moyen/eleve)
- Si tu manques d'information, dis-le clairement
- Vocabulaire interdit: "n'hesitez pas", "je me permets", "tres", "vraiment"
`;

function buildUserPrompt(req: ResearchRequest, loreContext: string): string {
  const modeLabels: Record<ResearchMode, string> = {
    explore: "EXPLORATION — Decouverte large du domaine, cartographie des concepts",
    papers: "ANALYSE PROFONDE — Examination detaillee des sources, cross-reference",
    prove: "VALIDATION — Fact-check, preuves pour et contre, verdict",
  };

  const depthLabels: Record<ResearchDepth, string> = {
    quick: "RAPIDE — 1 source, reponse concise",
    medium: "MEDIUM — 3-5 sources, analyse croisee",
    deep: "PROFOND — 10+ sources, synthese exhaustive",
  };

  return `## Recherche BYSS GROUP

**Mode**: ${modeLabels[req.mode]}
**Profondeur**: ${depthLabels[req.depth]}
**Domaine**: ${req.domain}

**Question**: ${req.question}

${loreContext ? `## Contexte Interne (Supabase lore_entries)\n${loreContext}\n` : ""}

Execute le pipeline complet en 7 etapes. Reponds en JSON.`;
}

// Map domain to lore categories for Supabase context
const DOMAIN_LORE_MAP: Partial<Record<ResearchDomain, string[]>> = {
  technology: ["village", "infrastructure"],
  market: ["bible", "commercial"],
  competition: ["bible", "commercial"],
  finance: ["finance"],
  culture: ["cadifor", "martinique"],
  geopolitics: ["eveil", "martinique"],
};

// Map depth to OpenRouter task type
function depthToTask(depth: ResearchDepth): "analysis" | "commercial" | "bulk" {
  if (depth === "deep") return "analysis";
  if (depth === "medium") return "commercial";
  return "bulk";
}

export async function POST(request: NextRequest) {
  const { allowed, remaining } = rateLimit("research-route", 5, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    });
  }

  const start = Date.now();

  try {
    const body = await request.json();
    const { question, mode, depth, domain } = body as ResearchRequest;

    if (!question || !mode || !depth || !domain) {
      return NextResponse.json(
        { error: "Champs requis: question, mode, depth, domain" },
        { status: 400 },
      );
    }

    // ── 1. Fetch lore context from Supabase ──
    let loreContext = "";
    try {
      const supabase = createClient();
      const categories = DOMAIN_LORE_MAP[domain] ?? [];

      if (categories.length > 0) {
        const { data: loreEntries } = await supabase
          .from("lore_entries")
          .select("title, content, category")
          .in("category", categories)
          .limit(10);

        if (loreEntries && loreEntries.length > 0) {
          loreContext = loreEntries
            .map((e) => `[${e.category}] ${e.title}: ${(e.content || "").slice(0, 300)}`)
            .join("\n\n");
        }
      }
    } catch (err) {
      console.warn("[research] Lore fetch failed, continuing without context:", err);
    }

    // ── 2. Resolve model & agent ──
    const modelId = getDepthModel(depth as ResearchDepth, domain as ResearchDomain);
    const agentInfo = resolveAgent(domain as ResearchDomain);
    const depthConfig = DEPTH_CONFIG[depth as ResearchDepth];

    // ── 3. Call AI via OpenRouter ──
    const userPrompt = buildUserPrompt(
      { question, mode, depth, domain } as ResearchRequest,
      loreContext,
    );

    const response = await callOpenRouter({
      task: depthToTask(depth as ResearchDepth),
      messages: [
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      maxTokens: depthConfig.maxTokens,
    });

    // Prepend system prompt as a system message workaround
    // (callOpenRouter doesn't support system param, so we include it in messages)
    const fullResponse = await callOpenRouter({
      task: depthToTask(depth as ResearchDepth),
      messages: [
        { role: "system" as string, content: RESEARCH_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      maxTokens: depthConfig.maxTokens,
    });

    const durationMs = Date.now() - start;
    const tokensUsed = (fullResponse.usage?.prompt_tokens ?? 0) + (fullResponse.usage?.completion_tokens ?? 0);

    // ── 4. Parse response ──
    let parsed;
    try {
      const jsonMatch = fullResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = {
          reformulatedQuestion: question,
          findings: [{ insight: fullResponse.content.slice(0, 500), confidence: "moyen", sources: [], category: domain }],
          sources: [],
          summary: fullResponse.content.slice(0, 300),
          graphNodes: [],
          graphEdges: [],
          followUpQuestions: [],
        };
      }
    } catch {
      parsed = {
        reformulatedQuestion: question,
        findings: [{ insight: fullResponse.content.slice(0, 500), confidence: "moyen", sources: [], category: domain }],
        sources: [],
        summary: fullResponse.content.slice(0, 300),
        graphNodes: [],
        graphEdges: [],
        followUpQuestions: [],
      };
    }

    // ── 5. Log to agent_logs ──
    logAgentAction({
      agentName: agentInfo.agent,
      action: "research",
      model: fullResponse.model || modelId,
      inputTokens: fullResponse.usage?.prompt_tokens,
      outputTokens: fullResponse.usage?.completion_tokens,
      durationMs,
      success: true,
    }).catch(() => {});

    // ── 6. Return structured result ──
    return NextResponse.json({
      findings: parsed.findings ?? [],
      sources: parsed.sources ?? [],
      summary: parsed.summary ?? "",
      reformulatedQuestion: parsed.reformulatedQuestion ?? question,
      graphNodes: parsed.graphNodes ?? [],
      graphEdges: parsed.graphEdges ?? [],
      followUpQuestions: parsed.followUpQuestions ?? [],
      suggestedAgent: agentInfo.agent,
      agentRole: agentInfo.role,
      model: fullResponse.model || modelId,
      tokensUsed,
      durationMs,
    });
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : "Erreur Research API";
    console.error("[research] Error:", error);

    logAgentAction({
      agentName: "research",
      action: "research",
      model: "unknown",
      durationMs,
      success: false,
      error: message,
    }).catch(() => {});

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
