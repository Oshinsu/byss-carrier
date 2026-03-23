import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Prospect, ProspectPhase, Interaction } from "@/types";

// ═══════════════════════════════════════════════════════
// Server-side Prospect API — BYSS GROUP
// ═══════════════════════════════════════════════════════

export async function getProspects(phase?: ProspectPhase) {
  const supabase = await createServerClient();
  let query = supabase.from("prospects").select("*").order("updated_at", { ascending: false });
  if (phase) query = query.eq("phase", phase);
  const { data, error } = await query;
  if (error) throw error;
  return data as Prospect[];
}

export async function getProspect(id: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("prospects").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Prospect;
}

export async function updateProspectPhase(id: string, phase: ProspectPhase) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("prospects").update({ phase, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function getProspectInteractions(prospectId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("interactions")
    .select("*")
    .eq("prospect_id", prospectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Interaction[];
}

export async function addInteraction(interaction: Omit<Interaction, "id" | "created_at">) {
  const supabase = await createServerClient();
  const now = new Date().toISOString();
  // Parallel: insert interaction + update prospect timestamp
  const [insertRes, _updateRes] = await Promise.all([
    supabase.from("interactions").insert(interaction).select().single(),
    supabase.from("prospects")
      .update({ last_contact: now.split("T")[0], updated_at: now })
      .eq("id", interaction.prospect_id),
  ]);
  if (insertRes.error) throw insertRes.error;
  return insertRes.data as Interaction;
}

export async function getPipelineStats() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("pipeline_stats").select("*").limit(100);
  if (error) throw error;
  return data;
}
