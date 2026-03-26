// ═══════════════════════════════════════════════════════
// FEW-SHOT BOOTSTRAPPING (Stanford)
//
// Store the best AI outputs as examples for future prompts.
// Uses the insights table (type='few_shot') to persist.
// ═══════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Save a high-quality output as a few-shot example.
 * Only stores outputs with score >= 80.
 */
export async function saveGoodExample(
  task: string,
  input: string,
  output: string,
  score: number,
): Promise<void> {
  if (score < 80) return;

  try {
    const supabase = getSupabase();
    await supabase.from("insights").insert({
      type: "few_shot",
      title: `example_${task}`,
      content: JSON.stringify({
        input: input.substring(0, 500),
        output: output.substring(0, 1000),
      }),
      data: { task, score },
      agent_name: "system",
    });
  } catch (err) {
    console.warn("[few-shot] Save failed:", err);
  }
}

/**
 * Retrieve best few-shot examples for a given task type.
 * Returns a formatted string ready to append to a system prompt.
 */
export async function getFewShotExamples(
  task: string,
  limit = 3,
): Promise<string> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("insights")
      .select("content")
      .eq("type", "few_shot")
      .eq("title", `example_${task}`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!data?.length) return "";

    return (
      "\n\n## Exemples de reference (productions precedentes approuvees):\n" +
      data
        .map((d, i) => {
          try {
            const { input, output } = JSON.parse(d.content);
            return `### Exemple ${i + 1}:\nInput: ${input}\nOutput: ${output}`;
          } catch {
            return "";
          }
        })
        .filter(Boolean)
        .join("\n\n")
    );
  } catch (err) {
    console.warn("[few-shot] Fetch failed:", err);
    return "";
  }
}
