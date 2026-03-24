"use server";

import { revalidatePath } from "next/cache";
import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

// ═══════════════════════════════════════════════
// BYSS GROUP — Prospect Server Actions
// ═══════════════════════════════════════════════

export async function updateProspectPhase(id: string, phase: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prospects")
    .update({ phase, updatedAt: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  // Log activity
  await supabase.from("activities").insert({
    type: "prospect",
    title: `Phase changee → ${phase}`,
    prospectId: id,
  });

  revalidatePath("/admin/pipeline");
  return { success: true };
}

export async function updateProspectField(id: string, field: string, value: string | number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prospects")
    .update({ [field]: value, updatedAt: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/pipeline");
  return { success: true };
}

export async function addProspect(formData: FormData) {
  const supabase = createClient();

  const prospect = {
    name: formData.get("name") as string,
    sector: formData.get("sector") as string,
    keyContact: formData.get("key_contact") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    estimatedBasket: Number(formData.get("estimated_basket") || 0),
    phase: "prospect",
    score: 1,
    probability: 0,
  };

  const { data, error } = await supabase
    .from("prospects")
    .insert(prospect)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await supabase.from("activities").insert({
    type: "prospect",
    title: `Nouveau prospect: ${prospect.name}`,
    prospectId: data.id,
  });

  revalidatePath("/admin/pipeline");
  return { success: true, id: data.id };
}

export async function deleteProspect(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prospects")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/pipeline");
  return { success: true };
}

export async function addInteraction(prospectId: string, type: string, content: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("interactions")
    .insert({
      prospectId: prospectId,
      type,
      content,
      direction: "outbound",
    });

  if (error) return { success: false, error: error.message };

  // Update last_contact
  await supabase
    .from("prospects")
    .update({ lastContact: new Date().toISOString().split("T")[0] })
    .eq("id", prospectId);

  revalidatePath("/admin/pipeline");
  return { success: true };
}
