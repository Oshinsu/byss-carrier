"use server";

import { revalidatePath } from "next/cache";
import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

// ═══════════════════════════════════════════════
// BYSS GROUP — Invoice Server Actions
// ═══════════════════════════════════════════════

export async function createInvoice(formData: FormData) {
  const supabase = createClient();

  // Generate invoice number: BG-2026-XXX
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  const num = String((count ?? 0) + 1).padStart(3, "0");
  const number = `BG-2026-${num}`;

  const invoice = {
    number,
    prospectId: formData.get("prospect_id") as string || null,
    type: formData.get("type") as string || "projet",
    amountHt: Number(formData.get("amount_ht")),
    vatRate: Number(formData.get("vat_rate") || 8.5),
    dueDate: formData.get("due_date") as string || null,
    notes: formData.get("notes") as string || null,
    status: "draft",
  };

  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await supabase.from("activities").insert({
    type: "invoice",
    title: `Facture ${number} creee — ${invoice.amountHt}€ HT`,
    prospectId: invoice.prospectId,
  });

  revalidatePath("/admin/finance");
  return { success: true, number };
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = createClient();

  const updates: Record<string, string | null> = { status };
  if (status === "paid") {
    updates.payment_date = new Date().toISOString().split("T")[0];
  }

  const { error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/finance");
  return { success: true };
}
