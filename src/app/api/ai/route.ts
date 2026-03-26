import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";
import {
  generateBriefing,
  analyzeProspect,
  draftEmail,
  generateProposal,
  scoreProspect,
  suggestAction,
  commandBar,
} from "@/lib/ai/claude";
import { logAgentAction } from "@/lib/db/queries";
import { buildRAGContext } from "@/lib/ai/rag";
import { getFewShotExamples } from "@/lib/ai/few-shot";
import { reflect } from "@/lib/ai/reflection";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — AI API Route
// Dispatches to all CADIFOR functions + agent chat
// Logs every call to agent_logs via Supabase
// ═══════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  const { allowed, remaining } = rateLimit("ai-route", 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    });
  }

  const start = Date.now();

  try {
    const { action, data } = await request.json();

    let result: unknown;
    let model = "claude-sonnet-4-6";

    switch (action) {
      // ── Core AI actions (via @/lib/ai/claude) ──

      case "analyze": {
        model = "claude-opus-4-6";
        result = await analyzeProspect(data.prospect);
        break;
      }

      case "draft_email": {
        // ── Sorel contextual email generation ──
        // Accepts full context: prospect, emailType, bibleContext, history, customPrompt
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        model = "claude-sonnet-4-6";

        const ctx = data.context ?? data;
        const prospect = ctx.prospect ?? data.prospect;
        const reqEmailType = ctx.emailType ?? data.emailType ?? "premier_contact";
        const bibleContext = ctx.bibleContext ?? "";
        const history = ctx.history ?? [];
        const customPrompt = ctx.customPrompt ?? "";

        const emailTypeLabels: Record<string, string> = {
          premier_contact: "Premier contact — prospection a froid",
          relance: "Relance suite a un echange precedent",
          proposition: "Proposition commerciale / devis",
          remerciement: "Remerciement post-rendez-vous",
          invitation: "Invitation a un evenement",
          custom: "Email libre (prompt utilisateur)",
        };

        const historyBlock = Array.isArray(history) && history.length > 0
          ? `\nHistorique des interactions :\n${history.map((h: { type?: string; date?: string; created_at?: string; subject?: string; content?: string }) => `- [${h.date || h.created_at || "?"}] ${h.type || "?"}: ${h.subject || h.content || ""}`).join("\n")}`
          : "\nAucune interaction precedente.";

        const bibleBlock = bibleContext
          ? `\nContexte Bible de Vente :\n${typeof bibleContext === "string" ? bibleContext : JSON.stringify(bibleContext)}`
          : "";

        const pricingLabels: Record<string, string> = {
          essentiel: "Essentiel (entree de gamme)",
          croissance: "Croissance (milieu de gamme)",
          domination: "Domination (premium)",
        };

        const sorelEmailSystem = `Tu es Sorel (soso), stratege commercial de BYSS GROUP — Premier studio IA de la Martinique, Fort-de-France.

LES 8 LOIS DU MODE_CADIFOR :
1. COMPRESSION — 15 mots max par statement. Dire plus avec moins.
2. CONFIANCE — Tutoiement si prospect deja contacte, vouvoiement si premier contact.
3. STICHOMYTHIE — Repliques courtes, pas de monologue.
4. SOUVERAINETE — Jamais de justification passive. On affirme.
5. LUX COMME SYNTAXE — Le luxe EST la ponctuation.
6. HUMOUR — L'humour est preuve de statut.
7. DETAIL = PREUVE — Le detail concret vaut plus que l'argument abstrait.
8. PHRASE MEMORABLE — Chaque email contient au moins une phrase qu'on retient.

VOCABULAIRE INTERDIT : "n'hesitez pas", "je me permets", "nous proposons", "tres", "vraiment", "je pense que"

REGLES EMAIL SOREL :
- Objet : max 50 caracteres, percutant, JAMAIS generique
- Corps : 5-8 lignes max
- Structure : Accroche personnalisee → Valeur concrete → Call-to-action unique
- CTA : Une seule action, formulee comme evidence
- Si prospect hotellerie/restaurant : mentionner la marge OTA (15-25% economises)
- Si prospect telecom : mentionner Kling 3.0 + volume
- Signature : Gary Bissol, Fondateur — BYSS GROUP | Fort-de-France
- Martinique-aware : references locales quand pertinent
- Philosophie Sun Tzu : gagner sans combattre, l'art de la position strategique

Reponds UNIQUEMENT avec un JSON valide :
{"subject": "objet de l'email", "body": "corps complet de l'email"}`;

        const userMessage = `Type d'email : ${emailTypeLabels[reqEmailType] || reqEmailType}

Prospect :
- Entreprise : ${prospect?.name || "Inconnu"}
- Contact cle : ${prospect?.key_contact || "Non renseigne"}
- Email : ${prospect?.email || "Non renseigne"}
- Secteur : ${prospect?.sector || "General"}
- Phase pipeline : ${prospect?.phase || "prospect"}
- Score IA : ${prospect?.ai_score || "Non evalue"}
- Points de douleur : ${prospect?.pain_points || "A identifier"}
- Pricing tier : ${prospect?.option_chosen ? pricingLabels[prospect.option_chosen] || prospect.option_chosen : "Non defini"}
- Panier estime : ${prospect?.estimated_basket ? `${prospect.estimated_basket} EUR` : "Non estime"}
- Services : ${prospect?.services?.join(", ") || "Non definis"}
- Notes : ${prospect?.notes || "Aucune"}
${historyBlock}
${bibleBlock}
${customPrompt ? `\nInstruction supplementaire de l'utilisateur :\n${customPrompt}` : ""}

Redige l'email en MODE_CADIFOR. Voix de Sorel : directe, strategique, Martinique-aware.`;

        // RAG: inject lore context for email generation
        const ragContext = await buildRAGContext(
          (prospect?.sector || "") + " " + (prospect?.pain_points || ""),
          { sourceTable: "lore_entries", limit: 5 }
        );

        // Few-shot bootstrapping (Stanford): inject best previous email examples
        const fewShotBlock = await getFewShotExamples("draft_email", 2);

        const emailSystemWithRAG = sorelEmailSystem
          + (ragContext ? "\n\n" + ragContext : "")
          + (fewShotBlock || "");

        const response = await anthropic.messages.create({
          model,
          max_tokens: 2048,
          temperature: 0.7,
          system: emailSystemWithRAG,
          messages: [{ role: "user", content: userMessage }],
        });

        const emailText = response.content[0].type === "text" ? response.content[0].text : "";
        const durationMs = Date.now() - start;

        logAgentAction({
          agentName: "sorel",
          action: "draft_email",
          model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          durationMs,
          success: true,
        }).catch(() => {});

        // Try to parse JSON, fallback to raw text
        try {
          const jsonMatch = emailText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            result = JSON.stringify(parsed);
          } else {
            result = JSON.stringify({ subject: `${prospect?.name || "BYSS GROUP"} — Sorel`, body: emailText });
          }
        } catch {
          result = JSON.stringify({ subject: `${prospect?.name || "BYSS GROUP"} — Sorel`, body: emailText });
        }

        // Reflection loop (MIT) — async, non-blocking
        reflect("draft_email", userMessage, emailText).catch(() => {});

        return NextResponse.json({
          result,
          model,
          agent: "sorel",
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        });
      }

      case "generate_proposal": {
        model = "claude-opus-4-6";
        result = await generateProposal(data.prospect);
        break;
      }

      case "score": {
        model = "claude-sonnet-4-6";
        const scoreResult = await scoreProspect(data.prospect);
        // scoreProspect returns { score, reason } — serialize
        result = JSON.stringify(scoreResult);
        break;
      }

      case "suggest": {
        model = "claude-sonnet-4-6";
        result = await suggestAction(data.prospect);
        break;
      }

      case "briefing": {
        model = "claude-sonnet-4-6";
        result = await generateBriefing(data?.pipelineData ?? {});
        break;
      }

      case "ask_sorel": {
        model = "claude-sonnet-4-6";
        result = await commandBar(data.question, data.context);
        break;
      }

      // ── Multi-agent chat (Village IA) ──

      case "chat": {
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        // Use full Bible prompts for rich context + MODE_CADIFOR enforcement
        const { AGENT_PROMPTS: biblePrompts } = await import("@/lib/ai/bible");
        const agentPrompts: Record<string, string> = {
          kael: biblePrompts.kael,
          nerel: biblePrompts.nerel,
          evren: biblePrompts.evren,
          sorel: biblePrompts.sorel,
        };

        const agentName = data.agent ?? "sorel";
        model = agentName === "kael" || agentName === "evren" ? "claude-opus-4-6" : "claude-sonnet-4-6";

        // RAG: inject semantic context from all sources
        const chatMessages = data.messages ?? [];
        const lastUserMessage = [...chatMessages].reverse().find((m: { role: string }) => m.role === "user")?.content || "";
        const ragContext = await buildRAGContext(lastUserMessage, { limit: 5 });
        const chatSystemPrompt = (agentPrompts[agentName] ?? agentPrompts.sorel)
          + (ragContext ? "\n\n" + ragContext : "");

        const response = await anthropic.messages.create({
          model,
          max_tokens: 2048,
          system: chatSystemPrompt,
          messages: (chatMessages).map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        });

        const chatText = response.content[0].type === "text" ? response.content[0].text : "";
        const durationMs = Date.now() - start;

        // Log agent chat
        logAgentAction({
          agentName: agentName,
          action: "chat",
          model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          durationMs: durationMs,
          success: true,
        }).catch(() => {});

        return NextResponse.json({
          result: chatText,
          model,
          agent: agentName,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        });
      }

      // ── DataGouv analysis ──

      case "datagouv": {
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        model = "claude-sonnet-4-6";
        const dgQuery = data.query ?? "martinique";
        const dgRes = await fetch(
          `${request.nextUrl.origin}/api/datagouv?action=search&q=${encodeURIComponent(dgQuery)}`,
        );
        const dgData = await dgRes.json();

        const userMessage = `L'utilisateur cherche des donnees open data sur: "${dgQuery}"\n\nResultats data.gouv.fr:\n${JSON.stringify(dgData.results?.slice(0, 5), null, 2)}\n\nAnalyse ces resultats et recommande les datasets les plus pertinents pour BYSS GROUP. Explique en 3-5 lignes max pourquoi chaque dataset est utile.`;

        const response = await anthropic.messages.create({
          model,
          max_tokens: 2048,
          system: `Tu es Sorel, stratege commercial de BYSS GROUP — Premier studio IA de la Martinique, Fort-de-France.
MODE_CADIFOR actif. 8 lois: compression, confiance, stichomythie, souverainete, lux as syntax, humour comme preuve, detail qui pense, phrase memorable.
MOTS INTERDITS: tres, vraiment, je pense que, n'hesitez pas.
Analyse avec precision. Chiffres concrets. Pertinence pour BYSS GROUP (video IA, agents IA, Google Ads, sites web). Pipeline 940K EUR. TVA 8.5% Martinique.
Chaque reponse contient une phrase memorable.`,
          messages: [{ role: "user", content: userMessage }],
        });

        const dgText = response.content[0].type === "text" ? response.content[0].text : "";
        const durationMs = Date.now() - start;

        logAgentAction({
          agentName: "sorel",
          action: "datagouv",
          model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          durationMs: durationMs,
          success: true,
        }).catch(() => {});

        return NextResponse.json({ result: dgText, model });
      }

      default:
        return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }

    const durationMs = Date.now() - start;

    // Log core AI actions (fire-and-forget)
    logAgentAction({
      agentName: "cadifor",
      action,
      model,
      durationMs: durationMs,
      success: true,
    }).catch(() => {});

    return NextResponse.json({
      result: typeof result === "string" ? result : JSON.stringify(result),
      model,
    });
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : "Erreur API IA";

    console.error("AI API error:", error);

    // Log failure
    logAgentAction({
      agentName: "cadifor",
      action: "unknown",
      model: "unknown",
      durationMs: durationMs,
      success: false,
      error: message,
    }).catch(() => {});

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
