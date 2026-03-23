/**
 * Village IA — Skill System (Hermes-inspired)
 *
 * Agents learn from successful actions and persist patterns as skills.
 * Skills self-improve: each use increments a score, low-score skills decay.
 *
 * "Le système qui s'améliore bat le système qui fonctionne." — Hermes principle
 */

import { createClient } from "@/lib/supabase/client";

export interface Skill {
  id: string;
  agent: "kael" | "nerel" | "evren" | "sorel";
  name: string;
  description: string;
  pattern: string; // The reusable prompt/action pattern
  category: "email" | "prompt" | "analysis" | "strategy" | "creative" | "code";
  usage_count: number;
  success_rate: number; // 0-1
  last_used: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

const SKILLS_LS_KEY = "byss-village-skills";

/**
 * Load skills from localStorage (Supabase fallback planned).
 */
export function loadSkills(): Skill[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SKILLS_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save skills to localStorage.
 */
function saveSkills(skills: Skill[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SKILLS_LS_KEY, JSON.stringify(skills));
}

/**
 * Create a new skill from a successful action.
 * Called after a positive outcome (email opened, prompt approved, analysis validated).
 */
export function createSkill(
  agent: Skill["agent"],
  name: string,
  description: string,
  pattern: string,
  category: Skill["category"],
  metadata?: Record<string, unknown>
): Skill {
  const skill: Skill = {
    id: crypto.randomUUID(),
    agent,
    name,
    description,
    pattern,
    category,
    usage_count: 1,
    success_rate: 1.0,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    metadata,
  };

  const skills = loadSkills();
  skills.push(skill);
  saveSkills(skills);

  // Also try to persist to Supabase lore_entries
  persistToSupabase(skill).catch(() => {});

  return skill;
}

/**
 * Record a skill usage. Increments count and updates success rate.
 */
export function useSkill(skillId: string, success: boolean): void {
  const skills = loadSkills();
  const skill = skills.find((s) => s.id === skillId);
  if (!skill) return;

  skill.usage_count++;
  skill.success_rate =
    (skill.success_rate * (skill.usage_count - 1) + (success ? 1 : 0)) /
    skill.usage_count;
  skill.last_used = new Date().toISOString();

  saveSkills(skills);
}

/**
 * Get skills for an agent, sorted by relevance.
 * Relevance = usage_count * success_rate * recency_factor
 */
export function getAgentSkills(
  agent: Skill["agent"],
  category?: Skill["category"]
): Skill[] {
  const skills = loadSkills().filter(
    (s) => s.agent === agent && (!category || s.category === category)
  );

  // Score by relevance
  const now = Date.now();
  return skills
    .map((s) => {
      const daysSinceUse = (now - new Date(s.last_used).getTime()) / 86400000;
      const recency = Math.max(0, 1 - daysSinceUse / 30); // Decays over 30 days
      const relevance = s.usage_count * s.success_rate * (0.5 + 0.5 * recency);
      return { ...s, _relevance: relevance };
    })
    .sort((a, b) => (b as any)._relevance - (a as any)._relevance);
}

/**
 * Get top skills as context for Claude prompt injection.
 * Returns a compressed string of the agent's best patterns.
 */
export function getSkillContext(
  agent: Skill["agent"],
  category?: Skill["category"],
  maxSkills: number = 3
): string {
  const skills = getAgentSkills(agent, category).slice(0, maxSkills);
  if (skills.length === 0) return "";

  return skills
    .map(
      (s) =>
        `[SKILL: ${s.name}] (${s.usage_count}x, ${Math.round(s.success_rate * 100)}% success)\n${s.pattern}`
    )
    .join("\n\n");
}

/**
 * Auto-detect if a completed action should become a skill.
 * Heuristic: if the output is long enough and received positive feedback.
 */
export function shouldCreateSkill(
  output: string,
  feedback: "positive" | "negative" | "neutral"
): boolean {
  if (feedback !== "positive") return false;
  if (output.length < 100) return false;

  // Check if a similar skill already exists
  const skills = loadSkills();
  const similar = skills.some(
    (s) => s.pattern.substring(0, 50) === output.substring(0, 50)
  );
  if (similar) return false;

  return true;
}

/**
 * Decay unused skills (call periodically).
 * Skills not used in 60 days lose 10% success_rate.
 * Skills below 0.1 success_rate are archived.
 */
export function decaySkills(): { decayed: number; archived: number } {
  const skills = loadSkills();
  const now = Date.now();
  let decayed = 0;
  let archived = 0;

  const active = skills.filter((s) => {
    const daysSinceUse = (now - new Date(s.last_used).getTime()) / 86400000;
    if (daysSinceUse > 60) {
      s.success_rate *= 0.9;
      decayed++;
    }
    if (s.success_rate < 0.1) {
      archived++;
      return false; // Remove
    }
    return true;
  });

  saveSkills(active);
  return { decayed, archived };
}

/**
 * Persist skill to Supabase as a lore_entry for cross-session durability.
 */
async function persistToSupabase(skill: Skill): Promise<void> {
  const supabase = createClient();
  await supabase.from("lore_entries").insert({
    universe: "skills",
    category: skill.category,
    title: `[${skill.agent}] ${skill.name}`,
    content: skill.pattern,
    tags: [skill.agent, skill.category],
    word_count: skill.pattern.split(/\s+/).length,
    order_index: 0,
  });
}
