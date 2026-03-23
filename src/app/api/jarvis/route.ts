import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { classifyIntent, JARVIS_SYSTEM_PROMPT } from "@/lib/jarvis";
import { buildRAGContext } from "@/lib/ai/rag";
import { loadSession, saveSession, buildMessagesFromSession } from "@/lib/agents/sessions";
import { logAgentAction } from "@/lib/db/queries";

// ═══════════════════════════════════════════════════════
// JARVIS — Voice AI API Route
// Receives transcribed text, classifies intent,
// executes action via existing routes, responds in CADIFOR.
// ═══════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Internal fetch helper — hits existing API routes.
 */
async function internalFetch(
  origin: string,
  path: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  try {
    const res = await fetch(`${origin}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Execute a classified intent and return structured data for Jarvis to narrate.
 */
async function executeAction(
  action: string,
  param: string | undefined,
  origin: string,
): Promise<{ type: string; details: string; data?: unknown }> {
  switch (action) {
    case "briefing": {
      const result = await internalFetch(origin, "/api/ai", {
        action: "briefing",
        data: { pipelineData: {} },
      });
      return {
        type: "briefing",
        details: "Briefing matinal genere",
        data: result,
      };
    }

    case "relance":
    case "email": {
      if (!param) {
        return { type: action, details: "Aucun prospect specifie. Dis-moi qui relancer." };
      }
      const result = await internalFetch(origin, "/api/ai", {
        action: "draft_email",
        data: {
          context: {
            prospect: { name: param },
            emailType: action === "relance" ? "relance" : "premier_contact",
          },
        },
      });
      return {
        type: action,
        details: `Email ${action === "relance" ? "de relance" : ""} prepare pour ${param}`,
        data: result,
      };
    }

    case "pipeline_stats": {
      return {
        type: "pipeline_stats",
        details: "Statistiques pipeline CRM demandees",
      };
    }

    case "finance_stats": {
      return {
        type: "finance_stats",
        details: "Donnees financieres demandees",
      };
    }

    case "gulf_stream": {
      const result = await internalFetch(origin, "/api/polymarket", {
        action: "trending",
      });
      return {
        type: "gulf_stream",
        details: "Marches et positions Gulf Stream",
        data: result,
      };
    }

    case "research": {
      if (!param) {
        return { type: "research", details: "Aucun sujet specifie. Que veux-tu analyser?" };
      }
      const result = await internalFetch(origin, "/api/research", {
        query: param,
      });
      return {
        type: "research",
        details: `Recherche lancee: ${param}`,
        data: result,
      };
    }

    case "calendar": {
      return {
        type: "calendar",
        details: "Calendrier et rendez-vous du jour",
      };
    }

    case "production": {
      return {
        type: "production",
        details: "Status production (video, images, musique)",
      };
    }

    case "bible": {
      return {
        type: "bible",
        details: "Bible de vente — 92 articles disponibles",
      };
    }

    case "intelligence": {
      return {
        type: "intelligence",
        details: "Hub intelligence — 5 cartographies actives",
      };
    }

    case "village": {
      return {
        type: "village",
        details: "Village IA — Kael, Nerel, Evren, Sorel disponibles",
      };
    }

    case "help": {
      return {
        type: "help",
        details: "Commandes: briefing, relancer [nom], email [nom], pipeline, facture, gulf stream, recherche [sujet], calendrier, production",
      };
    }

    default: {
      return { type: "chat", details: "Conversation libre" };
    }
  }
}

export async function POST(request: NextRequest) {
  const start = Date.now();

  try {
    const { text, sessionId } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texte manquant" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    // 1. Classify intent
    const intent = classifyIntent(text);

    // 2. Load session
    const session = await loadSession("jarvis", sessionId || "gary");

    // 3. Build RAG context
    const ragContext = await buildRAGContext(text, { limit: 5 });

    // 4. Execute action if applicable
    let actionResult: { type: string; details: string; data?: unknown } | null = null;
    if (intent.action !== "chat") {
      actionResult = await executeAction(intent.action, intent.param, origin);
    }

    // 5. Build messages with session history
    const messages = buildMessagesFromSession(session, text, 20);

    // 6. Build enhanced system prompt with action context
    let systemPrompt = JARVIS_SYSTEM_PROMPT;

    if (ragContext) {
      systemPrompt += "\n\n" + ragContext;
    }

    if (actionResult) {
      systemPrompt += `\n\n--- ACTION EXECUTEE ---
Type: ${actionResult.type}
Details: ${actionResult.details}
${actionResult.data ? `Donnees: ${JSON.stringify(actionResult.data).slice(0, 2000)}` : ""}
--- FIN ACTION ---
Confirme l'action en 1-2 phrases. Si des donnees sont disponibles, resume-les.`;
    }

    // 7. Call Claude
    const model = "claude-sonnet-4-6";
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 8. Save session with updated messages
    const updatedMessages = [
      ...messages,
      { role: "assistant" as const, content: responseText },
    ];
    await saveSession(
      "jarvis",
      {
        messages: updatedMessages.slice(-20),
        context: { lastAction: actionResult?.type },
      },
      sessionId || "gary",
    ).catch(() => {});

    // 9. Log
    const durationMs = Date.now() - start;
    logAgentAction({
      agentName: "jarvis",
      action: intent.action,
      model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      durationMs,
      success: true,
    }).catch(() => {});

    return NextResponse.json({
      response: responseText,
      intent: intent.action,
      action: actionResult
        ? { type: actionResult.type, details: actionResult.details }
        : undefined,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : "Erreur JARVIS";

    console.error("JARVIS API error:", error);

    logAgentAction({
      agentName: "jarvis",
      action: "error",
      model: "claude-sonnet-4-6",
      durationMs,
      success: false,
      error: message,
    }).catch(() => {});

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
