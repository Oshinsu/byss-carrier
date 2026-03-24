import { createClient as _sc } from "@supabase/supabase-js";
function createServerClient() { return _sc(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }
import type { Invoice, InvoiceStatus } from "@/types";
import { TVA_RATE } from "@/lib/constants";

// ═══════════════════════════════════════════════════════
// Server-side Finance API — BYSS GROUP
// ═══════════════════════════════════════════════════════

export async function getInvoices(status?: InvoiceStatus) {
  const supabase = createServerClient();
  let query = supabase.from("invoices").select("*, prospect:prospects(name)").order("issue_date", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data as (Invoice & { prospect: { name: string } | null })[];
}

export async function createInvoice(invoice: {
  prospect_id?: string;
  type: "mrr" | "projet" | "one-shot";
  amount_ht: number;
  due_date?: string;
  notes?: string;
}) {
  const supabase = createServerClient();

  // Generate invoice number: BG-2026-XXX
  const year = new Date().getFullYear();
  const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
  const num = String((count ?? 0) + 1).padStart(3, "0");
  const number = `BG-${year}-${num}`;

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      ...invoice,
      number,
      vat_rate: TVA_RATE,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const supabase = createServerClient();
  const updates: Record<string, unknown> = { status };
  if (status === "paid") updates.payment_date = new Date().toISOString().split("T")[0];
  const { error } = await supabase.from("invoices").update(updates).eq("id", id);
  if (error) throw error;
}

export async function getMonthlyRevenue() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("monthly_revenue").select("*");
  if (error) throw error;
  return data;
}

export async function getFinanceSummary() {
  const supabase = createServerClient();

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const quarterStart = `${now.getFullYear()}-${String(Math.floor(now.getMonth() / 3) * 3 + 1).padStart(2, "0")}-01`;
  const yearStart = `${now.getFullYear()}-01-01`;

  const [monthRes, quarterRes, yearRes, overdueRes, mrrRes] = await Promise.all([
    supabase.from("invoices").select("amount_ht").gte("issue_date", monthStart).eq("status", "paid"),
    supabase.from("invoices").select("amount_ht").gte("issue_date", quarterStart).eq("status", "paid"),
    supabase.from("invoices").select("amount_ht").gte("issue_date", yearStart).eq("status", "paid"),
    supabase.from("invoices").select("amount_ht").eq("status", "overdue"),
    supabase.from("prospects").select("mrr").gt("mrr", 0),
  ]);

  const sum = (data: { amount_ht: number }[] | null) => (data ?? []).reduce((s, r) => s + Number(r.amount_ht), 0);
  const sumMrr = (data: { mrr: number }[] | null) => (data ?? []).reduce((s, r) => s + Number(r.mrr), 0);

  return {
    ca_month: sum(monthRes.data as any),
    ca_quarter: sum(quarterRes.data as any),
    ca_year: sum(yearRes.data as any),
    overdue: sum(overdueRes.data as any),
    mrr: sumMrr(mrrRes.data as any),
  };
}
