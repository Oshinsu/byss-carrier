import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";
import Anthropic from "@anthropic-ai/sdk";
import {
  classifyIntent,
  matchAction,
  executeAction,
  getPageName,
  JARVIS_SYSTEM_PROMPT,
} from "@/lib/jarvis";
import { buildRAGContext } from "@/lib/ai/rag";
import { loadSession, saveSession, buildMessagesFromSession } from "@/lib/agents/sessions";
import { logAgentAction } from "@/lib/db/queries";

// ═══════════════════════════════════════════════════════
// JARVIS — SOTA Voice AI API Route
// Intent classification → action execution → Claude response.
// Full action registry with navigation + API dispatch.
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
 * Execute a classified intent via legacy action system.
 * Falls back when no action registry match is found.
 */
async function executeLegacyAction(
  action: string,
  param: string | undefined,
  origin: string,
): Promise<{ type: string; details: string; data?: unknown; navigate?: string }> {
  switch (action) {
    case "briefing": {
      const result = await internalFetch(origin, "/api/ai", {
        action: "briefing",
        data: { pipelineData: {} },
      });
      return { type: "briefing", details: "Briefing matinal genere", data: result };
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
        navigate: "/emails",
      };
    }

    case "pipeline_stats":
      return { type: "pipeline_stats", details: "Statistiques pipeline CRM", navigate: "/pipeline" };

    case "finance_stats":
      return { type: "finance_stats", details: "Donnees financieres", navigate: "/finance" };

    case "gulf_stream": {
      const result = await internalFetch(origin, "/api/polymarket", { action: "trending" });
      return { type: "gulf_stream", details: "Marches et positions Gulf Stream", data: result, navigate: "/gulf-stream" };
    }

    case "research": {
      if (!param) return { type: "research", details: "Aucun sujet specifie. Que veux-tu analyser?" };
      const result = await internalFetch(origin, "/api/research", { query: param });
      return { type: "research", details: `Recherche lancee: ${param}`, data: result, navigate: "/research" };
    }

    case "calendar":
      return { type: "calendar", details: "Calendrier et rendez-vous du jour", navigate: "/calendrier" };

    case "production":
      return { type: "production", details: "Status production (video, images, musique)", navigate: "/production" };

    case "bible":
      return { type: "bible", details: "Bible de vente — 92 articles disponibles", navigate: "/bible" };

    case "intelligence":
      return { type: "intelligence", details: "Hub intelligence — 5 cartographies actives", navigate: "/intelligence" };

    case "village":
      return { type: "village", details: "Village IA — Kael, Nerel, Evren, Sorel disponibles", navigate: "/village" };

    case "help":
      return { type: "help", details: "Navigation, CRM, email, finance, production, trading, intelligence, systeme. Dis ce que tu veux." };

    default:
      return { type: "chat", details: "Conversation libre" };
  }
}

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit("jarvis-route", 20, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    });
  }

  const start = Date.now();

  try {
    const { text, sessionId, currentPage } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texte manquant" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    // 1. Try action registry first (fuzzy match)
    const matchedAction = matchAction(text);

    // 2. Fall back to intent classification
    const intent = classifyIntent(text);

    // 3. Load session
    const session = await loadSession("jarvis", sessionId || "gary");

    // 4. Build RAG context
    const ragContext = await buildRAGContext(text, { limit: 5 });

    // 5. Execute action
    let actionData: {
      id: string;
      name: string;
      type: string;
      details: string;
      navigate?: string;
      data?: unknown;
      requiresConfirmation?: boolean;
      confirmationMessage?: string;
    } | null = null;

    if (matchedAction) {
      // Execute via new action registry
      const result = await executeAction(matchedAction, { text, origin, sessionId });
      actionData = {
        id: matchedAction.id,
        name: matchedAction.name,
        type: matchedAction.category,
        details: result.response,
        navigate: result.navigateTo,
        data: result.data,
        requiresConfirmation: result.requiresConfirmation,
        confirmationMessage: result.confirmationMessage,
      };
    } else if (intent.action !== "chat") {
      // Fall back to legacy action execution
      const legacyResult = await executeLegacyAction(intent.action, intent.param, origin);
      actionData = {
        id: intent.action,
        name: intent.action,
        type: legacyResult.type,
        details: legacyResult.details,
        navigate: legacyResult.navigate,
        data: legacyResult.data,
      };
    }

    // 6. Build messages with session history
    const messages = buildMessagesFromSession(session, text, 20);

    // 7. Build enhanced system prompt
    let systemPrompt = JARVIS_SYSTEM_PROMPT;

    // Add current page context
    if (currentPage) {
      const pageLabel = getPageName(currentPage);
      systemPrompt += `\n\nCONTEXTE ACTUEL: L'utilisateur est sur la page "${pageLabel}" (${currentPage}).`;
    }

    if (ragContext) {
      systemPrompt += "\n\n" + ragContext;
    }

    if (actionData) {
      systemPrompt += `\n\n--- ACTION EXECUTEE ---
Type: ${actionData.type}
Action: ${actionData.name}
Details: ${actionData.details}
${actionData.navigate ? `Navigation: ${actionData.navigate}` : ""}
${actionData.data ? `Donnees: ${JSON.stringify(actionData.data).slice(0, 2000)}` : ""}
--- FIN ACTION ---
Confirme l'action en 1-2 phrases. Si navigation, mentionne la destination. Si des donnees sont disponibles, resume-les.`;
    }

    // 8. Call Claude
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

    // 9. Save session
    const updatedMessages = [
      ...messages,
      { role: "assistant" as const, content: responseText },
    ];
    await saveSession(
      "jarvis",
      {
        messages: updatedMessages.slice(-20),
        context: {
          lastAction: actionData?.id,
          currentPage,
        },
      },
      sessionId || "gary",
    ).catch(() => {});

    // 10. Log
    const durationMs = Date.now() - start;
    logAgentAction({
      agentName: "jarvis",
      action: actionData?.id || intent.action,
      model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      durationMs,
      success: true,
    }).catch(() => {});

    return NextResponse.json({
      response: responseText,
      intent: actionData?.id || intent.action,
      action: actionData || undefined,
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
