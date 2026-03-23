import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env
const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Execute raw SQL via the Supabase Management API
async function execSQL(sql) {
  const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/`;
  // Use the pg_net or direct approach via fetch to the SQL editor endpoint
  const projectRef = env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "").split(".")[0];
  const resp = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return resp;
}

async function seed() {
  console.log("Connecting to Supabase...");
  const { count } = await supabase.from("prospects").select("id", { count: "exact", head: true });
  console.log(`Connected. ${count} prospects in DB.`);

  // Step 1: Create tables via raw SQL using pg functions
  console.log("\n--- Creating tables via SQL ---");
  const migrationSQL = readFileSync("supabase/migrations/009_empire_v2_tables.sql", "utf8");

  // Extract CREATE TABLE statements and run them individually
  const createStatements = migrationSQL
    .split(";")
    .map(s => s.trim())
    .filter(s => s.toUpperCase().startsWith("CREATE TABLE") || s.toUpperCase().startsWith("CREATE INDEX"));

  for (const stmt of createStatements) {
    try {
      // Use Supabase's built-in SQL execution via postgrest
      const { error } = await supabase.rpc("exec_sql", { sql_query: stmt + ";" });
      if (error) {
        // Table might already exist, that's OK
        if (!error.message.includes("already exists")) {
          console.log(`  Warning: ${error.message.slice(0, 80)}`);
        }
      }
    } catch (e) {
      // RPC might not exist, skip
    }
  }
  console.log("Tables creation attempted. Checking...");

  // Verify tables exist by trying to query them
  const testTables = ["contacts_directory", "bible_chapters", "style_presets"];
  for (const t of testTables) {
    const { error } = await supabase.from(t).select("*").limit(0);
    console.log(`  ${t}: ${error ? "NOT FOUND - " + error.message.slice(0, 50) : "OK"}`);
  }
  console.log("");

  // Seed contacts
  const contacts = [
    { name: "Pierre Canton-Bacara", organization: "Digicel", title: "Directeur General", sector: "Telecom", region: "Martinique", influence_score: 9, tags: ["telecom","dg"], source: "SOSO.txt" },
    { name: "Astrid Dollin", organization: "Digicel", title: "Resp. Marketing Business", sector: "Telecom", region: "Martinique", influence_score: 8, tags: ["telecom","marketing"], source: "SOSO.txt" },
    { name: "Claire Saussay", organization: "Digicel", title: "Cheffe Ventes MQ Business", sector: "Telecom", region: "Martinique", influence_score: 7, tags: ["telecom","commercial"], source: "SOSO.txt" },
    { name: "Samir Benzahra", organization: "Orange Antilles-Guyane", title: "Directeur", sector: "Telecom", region: "Martinique", influence_score: 9, tags: ["telecom","orange"], source: "SOSO.txt" },
    { name: "Frederic Hayot", organization: "SFR Caraibe", title: "PDG", sector: "Telecom", region: "Martinique", influence_score: 9, tags: ["telecom","altice"], source: "SOSO.txt" },
    { name: "Fabienne Joseph", organization: "Alpha Diving", title: "Gerante", sector: "Tourisme", region: "Martinique", influence_score: 6, tags: ["excursion","plongee"], source: "Pipeline" },
    { name: "Chef Tatiana", organization: "MIZA Restaurant", title: "Chef proprietaire", sector: "Restauration", region: "Fort-de-France", influence_score: 6, tags: ["restaurant","gastronomie"], source: "Pipeline" },
    { name: "Direction Clement", organization: "Habitation Clement", title: "Direction Marketing", sector: "Distillerie", region: "Francois", influence_score: 8, tags: ["rhum","patrimoine","luxe"], source: "Pipeline" },
    { name: "Direction Bakoua", organization: "Hotel Bakoua", title: "Directeur General", sector: "Hotellerie", region: "Pointe du Bout", influence_score: 8, tags: ["hotel","luxe"], source: "Pipeline" },
    { name: "Direction Cap Est", organization: "Cap Est Lagoon Resort", title: "Direction", sector: "Hotellerie", region: "Francois", influence_score: 8, tags: ["hotel","resort","luxe"], source: "Pipeline" },
    { name: "CCI Martinique", organization: "CCI", title: "Direction", sector: "Institutionnel", region: "Fort-de-France", influence_score: 8, tags: ["cci","5000-entreprises"], source: "SOSO.txt" },
    { name: "MEDEF Martinique", organization: "MEDEF", title: "Bureau", sector: "Institutionnel", region: "Fort-de-France", influence_score: 7, tags: ["medef","640-entreprises"], source: "SOSO.txt" },
    { name: "Wizzee", organization: "Wizzee", title: "Direction Marketing", sector: "Commerce", region: "Martinique", influence_score: 6, tags: ["ads","client-actif"], source: "Pipeline" },
    { name: "Evil P", organization: "Artiste", title: "Artiste", sector: "Media", region: "Martinique", influence_score: 5, tags: ["musique","clip","voice"], source: "Pipeline" },
    { name: "Krys", organization: "Artiste", title: "Artiste Dancehall", sector: "Media", region: "Martinique", influence_score: 6, tags: ["dancehall","clip"], source: "Pipeline" },
  ];

  const { data: cData, error: cErr } = await supabase.from("contacts_directory").insert(contacts).select("id");
  console.log("Contacts:", cErr ? `ERROR ${cErr.message}` : `${cData.length} inserted`);

  // Seed bible
  const bible = [
    { number: 1, title: "Psychologie de la Decision", content: "Kahneman Systeme 1 vs 2. Ariely ancrage. Cialdini 6 leviers. En MQ le bouche-a-oreille EST la preuve sociale.", category: "psychologie", word_count: 80 },
    { number: 2, title: "Methode SPIN Selling", content: "Situation, Probleme, Implication, Need-Payoff. En MQ la phase Situation est CRITIQUE.", category: "spin", word_count: 65 },
    { number: 3, title: "Les 15 Objections", content: "Trop cher: Par rapport a quoi? Reflechir: Qu est-ce qui ferait hesiter? Mon neveu fait ca: Montrez-moi, on completera.", category: "objections", word_count: 75 },
    { number: 4, title: "Neuro-Selling MQ", content: "7 regles. Premier cafe decide tout. Nommer le quartier. Citer un concurrent. ROI sur tablette. Silence apres le prix. Tu apres premier cafe. Phrase memorable.", category: "neuro", word_count: 95 },
    { number: 5, title: "Sun Tzu Applique", content: "Connaitre le terrain (35 communes). Ne jamais attaquer de front. Victoire sans combat (ROI Calculator). L eau epouse le terrain.", category: "suntzu", word_count: 70 },
    { number: 6, title: "Biomimetisme Commercial", content: "Courbaril: racines profondes. Manguier: un fruit attire. Recif corallien: symbiose client=ambassadeur. Oseille-pays: humble, partout, essentielle.", category: "biomimetique", word_count: 60 },
    { number: 7, title: "Timing et Saisonnalite", content: "Haute saison Nov-Avr: budget. Basse Mai-Oct: graines. Carnaval: STOP. Rentree Sept: budgets N+1. Cyclone: digital=resilience.", category: "timing", word_count: 60 },
    { number: 8, title: "Phrases Memorables", content: "99.96% marge. Votre concurrent a commence il y a 6 mois. Le WordPress a 40%. Combien coutent les 15% OTA? Agent IA travaille 24/7.", category: "memorable", word_count: 75 },
    { number: 9, title: "Secteur Hotellerie", content: "Pain: OTA 15-25%. Solution: video IA + site direct + chatbot 4 langues. ROI 3 mois si 10% en direct.", category: "sectoriel", word_count: 85 },
    { number: 10, title: "Secteur Restauration", content: "Pain: pas de GMB complet. Solution: 10 photos IA + site + WhatsApp Business + Google Ads local.", category: "sectoriel", word_count: 75 },
    { number: 11, title: "Land and Expand", content: "Land: petit projet. Expand: pack complet. Regle 3-5-10: 3K, 5K, 10K+. Commencer par la douleur.", category: "land_expand", word_count: 65 },
  ];

  const { data: bData, error: bErr } = await supabase.from("bible_chapters").insert(bible).select("id");
  console.log("Bible:", bErr ? `ERROR ${bErr.message}` : `${bData.length} inserted`);

  // Seed style presets
  const presets = [
    { name: "Restaurant Tropical", camera_base: "Sony A7IV, 50mm f/1.4, natural light", realism_guard: "Photorealistic, magazine editorial", direction_config: { hero: "Wide tropical", product: "Clean plating", detail: "Macro texture", lifestyle: "Candid dining", event: "Group table" }, palette: { primary: "#D4AF37", secondary: "#2D5016", accent: "#FF6B35" }, vertical: "restaurant" },
    { name: "Distillerie Premium", camera_base: "Hasselblad X2D, 90mm, rich color", realism_guard: "Luxury editorial, amber tones", direction_config: { hero: "Distillery golden hour", product: "Bottle amber light", detail: "Oak barrel", lifestyle: "Tasting terrace", event: "Rum group" }, palette: { primary: "#8B4513", secondary: "#D4AF37", accent: "#1A0A00" }, vertical: "rhum" },
    { name: "Hotel Luxe Caraibe", camera_base: "Canon R5, 24-70mm f/2.8", realism_guard: "Travel magazine quality", direction_config: { hero: "Infinity pool Caribbean", product: "Suite ocean view", detail: "Spa amenity", lifestyle: "Couple beach sunset", event: "Wedding poolside" }, palette: { primary: "#00B4D8", secondary: "#FFFFFF", accent: "#D4AF37" }, vertical: "hotel" },
  ];

  const { data: sData, error: sErr } = await supabase.from("style_presets").insert(presets).select("id");
  console.log("Style presets:", sErr ? `ERROR ${sErr.message}` : `${sData.length} inserted`);

  console.log("\nSeed complete!");
}

seed().catch(console.error);
