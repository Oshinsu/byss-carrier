// ═══════════════════════════════════════════════════════
// REFLECTION LOOP (MIT)
//
// After key actions, analyze quality and store learnings.
// Uses the cheapest model (classification task) for self-eval.
// Feeds into few-shot bootstrapping when quality >= 80.
// ═══════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";
import { callOpenRouter } from "./router";
import { saveGoodExample } from "./few-shot";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const REFLECTABLE_ACTIONS = [
  "draft_email",
  "generate_dossier",
  "analyze_market",
  "research",
];

/**
 * Reflect on an AI action: evaluate quality, extract improvements,
 * and optionally save as few-shot example.
 *
 * Fire-and-forget — never blocks the main response path.
 */
export async function reflect(
  action: string,
  input: string,
  output: string,
  outcome?: string,
): Promise<void> {
  if (!REFLECTABLE_ACTIONS.includes(action)) return;

  try {
    const reflection = await callOpenRouter({
      task: "classification", // routes to cheapest model (MiniMax)
      messages: [
        {
          role: "user",
          content: `Analyse cette action et identifie ce qui pourrait etre ameliore.

Action: ${action}
Input: ${input.substring(0, 300)}
Output: ${output.substring(0, 500)}
${outcome ? `Resultat: ${outcome}` : ""}

Reponds en JSON: { "quality": 0-100, "improvements": ["..."], "should_save_as_example": boolean }`,
        },
      ],
      temperature: 0.3,
      maxTokens: 512,
    });

    const jsonMatch = reflection.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;

    const parsed = JSON.parse(jsonMatch[0]);

    // Save as few-shot example if quality is high
    if (parsed.should_save_as_example && parsed.quality >= 80) {
      await saveGoodExample(action, input, output, parsed.quality);
    }

    // Store reflection in insights table
    const supabase = getSupabase();
    await supabase.from("insights").insert({
      type: "reflection",
      title: `reflect_${action}`,
      content: reflection.content,
      data: {
        action,
        quality: parsed.quality,
        improvements: parsed.improvements,
        model: reflection.model,
      },
      agent_name: "system",
    });
  } catch {
    // Reflection is non-critical — silent fail
  }
}
