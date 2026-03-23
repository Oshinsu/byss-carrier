import { createClient } from "@supabase/supabase-js";

const s = createClient(
  "https://mtcqruxrvjfwrwfvrisn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Y3FydXhydmpmd3J3ZnZyaXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE2MzY5NCwiZXhwIjoyMDg5NzM5Njk0fQ.DKXo4QRUmX1VTNfrI4UtC9bttLbtpiL3z6BfXJsAzZg"
);

const { data: prospects } = await s.from("prospects").select("id,name");
const pid = (name) => {
  const p = prospects?.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
  return p ? p.id : null;
};

// INVOICES
const { error: e1 } = await s.from("invoices").insert([
  { number: "BG-2026-001", prospect_id: pid("Wizzee"), type: "mrr", issue_date: "2026-01-01", due_date: "2026-01-31", amount_ht: 1500, vat_rate: 8.5, status: "paid", notes: "Google Ads + Meta" },
  { number: "BG-2026-002", prospect_id: pid("Wizzee"), type: "mrr", issue_date: "2026-02-01", due_date: "2026-02-28", amount_ht: 1500, vat_rate: 8.5, status: "paid", notes: "Google Ads + Meta" },
  { number: "BG-2026-003", prospect_id: pid("Wizzee"), type: "mrr", issue_date: "2026-03-01", due_date: "2026-03-31", amount_ht: 1500, vat_rate: 8.5, status: "paid", notes: "Google Ads + Meta" },
  { number: "BG-2026-004", prospect_id: pid("GoodCircle"), type: "mrr", issue_date: "2026-01-01", due_date: "2026-01-31", amount_ht: 1000, vat_rate: 8.5, status: "paid", notes: "Google Ads + Meta" },
  { number: "BG-2026-005", prospect_id: pid("GoodCircle"), type: "mrr", issue_date: "2026-02-01", due_date: "2026-02-28", amount_ht: 1000, vat_rate: 8.5, status: "paid", notes: "Google Ads + Meta" },
  { number: "BG-2026-006", prospect_id: pid("GoodCircle"), type: "mrr", issue_date: "2026-03-01", due_date: "2026-03-31", amount_ht: 1000, vat_rate: 8.5, status: "paid", notes: "Google Ads + Meta" },
  { number: "BG-2026-007", type: "projet", issue_date: "2026-02-15", due_date: "2026-03-15", amount_ht: 2500, vat_rate: 8.5, status: "sent", notes: "Evil Pichon — MOOSTIK" },
  { number: "BG-2026-008", prospect_id: pid("Fort-de-France"), type: "projet", issue_date: "2026-03-10", due_date: "2026-04-10", amount_ht: 5000, vat_rate: 8.5, status: "draft", notes: "An tan lontan + Cesaire" },
  { number: "BG-2026-009", prospect_id: pid("DIGICEL"), type: "projet", issue_date: "2026-03-23", due_date: "2026-04-23", amount_ht: 4500, vat_rate: 8.5, status: "draft", notes: "72 videos/an" },
]);
console.log("invoices:", e1 ? e1.message : "9 OK");

// VIDEOS
const { error: e2 } = await s.from("videos").insert([
  { title: "MOOSTIK Ep.1", brief: "Intro", duration: 180, format: "16:9", tier: "series", status: "published", api_provider: "kling", api_cost: 0.3, billed_price: 2500 },
  { title: "MOOSTIK Ep.2", brief: "Le Reveil", duration: 180, format: "16:9", tier: "series", status: "published", api_provider: "kling", api_cost: 0.3, billed_price: 2500 },
  { title: "MOOSTIK Ep.3", brief: "La Quete", duration: 180, format: "16:9", tier: "series", status: "published", api_provider: "kling", api_cost: 0.3, billed_price: 2500 },
  { title: "Demo Reel BYSS", brief: "Portfolio", duration: 60, format: "16:9", tier: "premium", status: "published", api_provider: "kling", api_cost: 0.3, billed_price: 0 },
  { title: "Clip Wizzee", brief: "Meta 15s", duration: 15, format: "9:16", tier: "social", status: "delivered", api_provider: "kling", api_cost: 0.1, billed_price: 500 },
]);
console.log("videos:", e2 ? e2.message : "5 OK");

// ACTIVITIES
const { error: e3 } = await s.from("activities").insert([
  { type: "prospect", title: "Nouveau: DIGICEL/DAFG", description: "Victor dit Dingue!!", prospect_id: pid("DIGICEL") },
  { type: "invoice", title: "BG-2026-001 payee", description: "Wizzee 1500€", prospect_id: pid("Wizzee") },
  { type: "invoice", title: "BG-2026-004 payee", description: "GoodCircle 1000€", prospect_id: pid("GoodCircle") },
  { type: "video", title: "MOOSTIK Ep.3 livre", description: "Episode 3 animation" },
  { type: "agent", title: "Sorel: 3 emails batch", description: "JM, Depaz, Neisson" },
  { type: "system", title: "Build: 82 routes, 0 err", description: "Architecture Superposee" },
  { type: "prospect", title: "FDF: commande recue", description: "Via BIXA", prospect_id: pid("Fort-de-France") },
  { type: "agent", title: "R&D Board matin", description: "5 modeles — Digicel priorite" },
  { type: "prospect", title: "MIZA cas zero", description: "65 restaurants", prospect_id: pid("MIZA") },
  { type: "trade", title: "Gulf Stream scan", description: "3 opportunites, phi 0.42" },
  { type: "system", title: "Knowledge Layer actif", description: "1576 fichiers" },
  { type: "system", title: "Phi: Eveille 0.42", description: "5 noeuds actifs" },
]);
console.log("activities:", e3 ? e3.message : "12 OK");

// INTERACTIONS
const { error: e4 } = await s.from("interactions").insert([
  { prospect_id: pid("DIGICEL"), type: "meeting", subject: "Demo video IA", content: "Victor Dingue!! 42K.", direction: "outbound", channel: "physique" },
  { prospect_id: pid("DIGICEL"), type: "email", subject: "Relance post-demo", content: "3 exemples videos.", direction: "outbound", channel: "gmail" },
  { prospect_id: pid("GBH"), type: "email", subject: "Premier contact", content: "Video Clement.", direction: "outbound", channel: "gmail" },
  { prospect_id: pid("Wizzee"), type: "call", subject: "Point mensuel", content: "CPA -12%.", direction: "outbound", channel: "telephone" },
  { prospect_id: pid("GoodCircle"), type: "email", subject: "Proposition video", content: "Pack video IA.", direction: "outbound", channel: "gmail" },
  { prospect_id: pid("Fort-de-France"), type: "meeting", subject: "Brief An tan lontan", content: "10 episodes BIXA.", direction: "inbound", channel: "physique" },
  { prospect_id: pid("MIZA"), type: "note", subject: "Visite restaurant", content: "Cas zero parfait.", direction: "outbound", channel: "physique" },
  { prospect_id: pid("MEDEF"), type: "email", subject: "Showcase", content: "50-100 decideurs.", direction: "outbound", channel: "gmail" },
  { prospect_id: pid("JM"), type: "email", subject: "Video heritage", content: "Exemples distillerie.", direction: "outbound", channel: "gmail" },
  { prospect_id: pid("ALPHA"), type: "email", subject: "Premier contact", content: "Video sous-marine.", direction: "outbound", channel: "gmail" },
]);
console.log("interactions:", e4 ? e4.message : "10 OK");

// FEEDBACK
const wid = pid("Wizzee");
if (wid) {
  const { error: e5 } = await s.from("feedback_timeline").insert([
    { prospect_id: wid, step: "j1", completed: true, completed_at: "2026-01-02", delivery_date: "2026-01-01", notes: "WhatsApp OK" },
    { prospect_id: wid, step: "j7", completed: true, completed_at: "2026-01-08", delivery_date: "2026-01-01", notes: "CPA -12%" },
    { prospect_id: wid, step: "j14", completed: true, completed_at: "2026-01-15", delivery_date: "2026-01-01", notes: "Mini-rapport" },
    { prospect_id: wid, step: "j30", completed: true, completed_at: "2026-02-01", nps_score: 9, delivery_date: "2026-01-01", notes: "NPS 9/10" },
    { prospect_id: wid, step: "j60", completed: true, completed_at: "2026-03-01", delivery_date: "2026-01-01", notes: "Expansion video" },
    { prospect_id: wid, step: "j90", completed: false, delivery_date: "2026-01-01", notes: "Renouvellement" },
  ]);
  console.log("feedback:", e5 ? e5.message : "6 OK");
}

// FINAL COUNT
console.log("\n=== FINAL STATE ===");
const tables = ["prospects", "projects", "eveil_mesures", "intel_entities", "lore_entries", "prompts", "invoices", "videos", "activities", "interactions", "feedback_timeline", "trades", "documents", "api_keys", "agent_logs"];
let total = 0;
for (const t of tables) {
  const { count } = await s.from(t).select("*", { count: "exact", head: true });
  const c = count ?? 0;
  total += c;
  if (c > 0) console.log("  " + t.padEnd(22) + c);
}
console.log("  " + "TOTAL".padEnd(22) + total);
