import {
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  Shield,
  Newspaper,
  Crown,
  Users,
  Target,
  Rocket,
  Flame,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   PROJECT REGISTRY — All temples
   ═══════════════════════════════════════════════════════════════ */

export type ProdStatus = "Livré" | "En prod" | "À faire";

export interface ProjectData {
  name: string;
  slug: string;
  description: string;
  status: "Actif" | "En dev" | "Concept" | "Pause";
  color: string;
  techStack: string[];
  github?: string;
  url?: string;
  type: "external" | "content" | "political" | "cultural" | "internal";
}

export const PROJECTS: Record<string, ProjectData> = {
  orion: {
    name: "ORION",
    slug: "orion",
    description: "Plateforme CMO IA — 90 agents, 24 integrations (Google, Meta, TikTok, LinkedIn, Amazon, Shopify, HubSpot, Salesforce). 5 phases, 12 mois : Stabilisation → Premier sang (1 client) → Acquisition (50 clients, 5K MRR) → Expansion (200 clients, 30K MRR) → Domination (1000 clients, 150K MRR, ARR 1.8M). USP: 90 marketeurs IA, payez pour un. 159 MB TypeScript. Pricing: Free → 99 → 249 → 449 → Enterprise.",
    status: "En dev",
    color: "#3B82F6",
    techStack: ["Next.js", "Supabase", "Claude API", "Stripe", "n8n"],
    github: "https://github.com/byss-group/orion",
    url: "https://orion.byss.group",
    type: "external",
  },
  "byss-emploi": {
    name: "BYSS EMPLOI",
    slug: "byss-emploi",
    description: "Plateforme IA de recherche d'emploi v2.0 Beta. 2 400+ utilisateurs beta, 95K+ offres, 13 régions. Agent IA, Intelligence Territoriale INSEE, Matching Prédictif, Formations RNCP/CPF.",
    status: "Actif",
    color: "#0b1120",
    techStack: ["Next.js", "Tailwind", "PWA", "Service Worker", "Claude API"],
    github: "https://github.com/byss-group/byss-emploi",
    url: "https://byss-emploi.com",
    type: "external",
  },
  random: {
    name: "RANDOM",
    slug: "random",
    description: "SPA active avec GTM + Facebook Pixel tracking. Opérations d'influence. Communication stratégique.",
    status: "Actif",
    color: "#EF4444",
    techStack: ["Next.js", "GTM", "Facebook Pixel"],
    github: "https://github.com/byss-group/random",
    url: "https://random-app.fr",
    type: "external",
  },
  "jurassic-wars": {
    name: "JURASSIC WARS",
    slug: "jurassic-wars",
    description: "Encyclopédie du Lore. 5 civilisations, 200+ espèces de dinosaures, carte du monde interactive, 10+ sections. IA générative.",
    status: "Actif",
    color: "#D4910A",
    techStack: ["Next.js", "Payload CMS", "IA générative"],
    github: "https://github.com/byss-group/jurassic-wars",
    url: "https://jurrasic-wars.vercel.app/fr",
    type: "external",
  },
  moostik: {
    name: "MOOSTIK",
    slug: "moostik",
    description: "Scene Generator par BLOODWINGSStudio. Signal extraction, Reality Bleed Protocol, 100+ character variations, EDL export. Plans: Free/Starter/Pro/Enterprise (jusqu'à 1 499€/mo).",
    status: "Actif",
    color: "#0b0b0e",
    techStack: ["Next.js", "React", "Vercel", "Tailwind"],
    url: "https://moostik.vercel.app",
    type: "external",
  },
  "apex-972": {
    name: "APEX 972",
    slug: "apex-972",
    description: "Machine à leads. 120 leads/mois. n8n + WhatsApp 360dialog.",
    status: "Actif",
    color: "#F97316",
    techStack: ["Python", "n8n", "WhatsApp 360dialog", "Supabase", "Claude API"],
    type: "internal",
  },
  cadifor: {
    name: "CADIFOR",
    slug: "cadifor",
    description: "Univers littéraire. 997 pages. MODE_CADIFOR. 8 lois. 6 personnages.",
    status: "Actif",
    color: "#00B4D8",
    techStack: ["Littérature", "Worldbuilding", "Claude API"],
    type: "cultural",
  },
  toxic: {
    name: "TOXIC",
    slug: "toxic",
    description: "Artiste From Mada — Lyon, France — GI.Corp. 119 followers, 44 tracks, 1 playlist sur SoundCloud.",
    status: "Actif",
    color: "#06B6D4",
    techStack: ["FL Studio", "Ableton", "MiniMax", "Suno", "SoundCloud"],
    url: "https://soundcloud.com/gary-bissol",
    type: "cultural",
  },
  "byss-news": {
    name: "BYSS NEWS — RadarDiplo",
    slug: "byss-news",
    description: "Intelligence géopolitique. 1392 signaux. Veille stratégique.",
    status: "Actif",
    color: "#EC4899",
    techStack: ["Next.js", "Claude API", "n8n", "RSS"],
    url: "https://news.byss.group",
    type: "content",
  },
  fm12: {
    name: "FM12",
    slug: "fm12",
    description: "La durée comme arme. 8 000 heures. Le silence est une stratégie.",
    status: "Actif",
    color: "#1a1a1a",
    techStack: [],
    type: "cultural",
  },
  "an-tan-lontan": {
    name: "AN TAN LONTAN",
    slug: "an-tan-lontan",
    description: "Série animée sur l'histoire de la Martinique. 10 épisodes.",
    status: "En dev",
    color: "#A855F7",
    techStack: ["Kling 3.0", "After Effects", "Claude API", "MiniMax"],
    type: "content",
  },
  "cesaire-pixar": {
    name: "CÉSAIRE PIXAR",
    slug: "cesaire-pixar",
    description: "Film d'animation Pixar sur Aimé Césaire. 10 séquences.",
    status: "Concept",
    color: "#14B8A6",
    techStack: ["Kling 3.0", "Blender", "After Effects", "Claude API"],
    type: "content",
  },
  eveil: {
    name: "ÉVEIL",
    slug: "eveil",
    description: "Opération politique. 20 mesures. 38M€. CTM 2028.",
    status: "Actif",
    color: "#00B4D8",
    techStack: ["Stratégie", "Data", "Cartographie", "n8n"],
    type: "political",
  },
  lignee: {
    name: "LIGNÉE",
    slug: "lignee",
    description: "Arbre généalogique. Léopold → Félix → Gabriel → Gary.",
    status: "Actif",
    color: "#00B4D8",
    techStack: ["Histoire", "Généalogie"],
    type: "cultural",
  },
  sotai: {
    name: "SOTAI",
    slug: "sotai",
    description: "Studio de production IA. Rony, Stéphane, Thomas, Gary.",
    status: "Actif",
    color: "#6366F1",
    techStack: ["Kling 3.0", "MiniMax", "Suno", "Claude API", "Replicate"],
    type: "internal",
  },
  ecommerce: {
    name: "E-COMMERCE EMPIRE",
    slug: "ecommerce",
    description: "50 stores autonomes. 6 marches (Philippines, Vietnam, Maroc, Colombie, France, Martinique). Analyse marche IA, product finder, store builder, budget allocator. Claude Code orchestrateur + CJDropshipping + TikTok Ads + Kling visuals. Pipeline: analyse → produits → plan → lancement → scaling.",
    status: "En dev",
    color: "#10B981",
    techStack: ["Claude Code", "CJDropshipping", "TikTok Ads", "Kling", "Shopify", "Next.js"],
    type: "external",
  },
  archipel: {
    name: "ARCHIPEL",
    slug: "archipel",
    description: "Spotify caribeen. Infrastructure souverainete sonique. $66.58M marche. Algorithme zouk/bouyon.",
    status: "Concept",
    color: "#EC4899",
    techStack: ["Sonic Pi", "Web Audio API", "Annoy", "Kubernetes", "Kafka"],
    type: "external",
  },
  videoos: {
    name: "VIDEOOS",
    slug: "videoos",
    description: "Montage video IA-native. Beat-synced editing. Multi-agents Editor/Critic. Fenetre 18-36 mois avant Adobe.",
    status: "Concept",
    color: "#F59E0B",
    techStack: ["Demucs v4", "BEAST", "Claude Opus 4.6", "React", "Python"],
    type: "external",
  },
  "shatta-seoul": {
    name: "SHATTA SEOUL",
    slug: "shatta-seoul",
    description: "Marketing musical caribeen x K-pop. 157K views / 200EUR = 0.0013EUR CPV (17x benchmark).",
    status: "Actif",
    color: "#EF4444",
    techStack: ["Kling 3.0", "XTTS-v2 (Replicate)", "Suno", "Meta Ads", "TikTok"],
    type: "cultural",
  },
  defense: {
    name: "DEFENSE IA",
    slug: "defense",
    description: "Logiciel defensif IA-native. Architecture Epee et Bouclier. Detection comportementale > antivirus.",
    status: "Concept",
    color: "#6B7280",
    techStack: ["Rust", "Python", "Claude API", "Cryptographie"],
    type: "internal",
  },
  "zenith-eco": {
    name: "ZENITH ECO",
    slug: "zenith-eco",
    description: "Client ENR Free. Simulateur calculateur economies solaire IA. Pipeline leads WhatsApp.",
    status: "En dev",
    color: "#F97316",
    techStack: ["Next.js", "WhatsApp Business", "Google Ads", "Claude API"],
    type: "external",
  },
  "byss-games": {
    name: "BYSS GAMES",
    slug: "byss-games",
    description: "Base de donnees mods SOTA. 18+ jeux. CK3, M&B2, TW:WH3. 8000h FM2012 pattern recognition.",
    status: "Actif",
    color: "#8B5CF6",
    techStack: ["Gaming", "Modding", "Pattern Recognition"],
    type: "cultural",
  },
  "le-traducteur": {
    name: "LE TRADUCTEUR",
    slug: "le-traducteur",
    description: "Jeu narratif diplomatique JW. Disco Elysium x 80 Days. Vous etes le seul a parler les 5 langues. Le choix de traduction EST le gameplay. 22 mots intraduisibles, 5 jauges de neutralite, 6 traites vivants, PNJs Claude API avec memoire.",
    status: "Concept",
    color: "#00B4D8",
    techStack: ["Godot", "Ink", "Claude API", "Suno"],
    type: "cultural",
  },
};

/* ─── Status Configs ─── */
export const projectStatusConfig: Record<string, { color: string; bg: string }> = {
  Actif: { color: "text-emerald-400", bg: "bg-emerald-500/15" },
  "En dev": { color: "text-amber-400", bg: "bg-amber-500/15" },
  Concept: { color: "text-blue-400", bg: "bg-blue-500/15" },
  Pause: { color: "text-gray-400", bg: "bg-gray-500/15" },
};

export const prodStatusConfig: Record<ProdStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  Livré: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  "En prod": { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/15" },
  "À faire": { icon: Circle, color: "text-[var(--color-text-muted)]", bg: "bg-[oklch(0.60_0.02_270/0.15)]" },
};

/* ─── Social Links ─── */
export const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@Byssgroup97",
  instagram: "https://www.instagram.com/gary_byss/",
  soundcloud: "https://soundcloud.com/gary-bissol",
  github: "https://github.com/Oshinsu",
};

/* ═══════════════════════════════════════════════════════════════
   PROJECT-SPECIFIC DATA
   ═══════════════════════════════════════════════════════════════ */

/* ─── APEX 972 ─── */
export const APEX_WORKFLOWS = [
  { name: "Scraping LinkedIn 972", status: "active", leads: 45 },
  { name: "WhatsApp Outbound", status: "active", leads: 38 },
  { name: "Email Sequence A", status: "active", leads: 22 },
  { name: "Qualification IA", status: "active", leads: 15 },
];

export const PIP4_CODE = `# PIP4 — Pipeline Intelligent de Prospection v4
import supabase, n8n, whatsapp_360

def pipeline(target_sector):
    leads = scrape_martinique(sector=target_sector)
    qualified = claude.qualify(leads, score_min=7)
    for lead in qualified:
        whatsapp.send_template(lead, "intro_byss")
        n8n.trigger("follow_up_sequence", lead)
    return len(qualified)

# Target: 120 leads/mois
# Conversion: 8-12%
# CAC: ~15€`;

/* ─── CADIFOR ─── */
export const CADIFOR_LAWS = [
  { num: 1, title: "Loi de la Compression", desc: "Chaque mot doit porter. Pas de filler. La densité est souveraine." },
  { num: 2, title: "Loi de la Stichomythie", desc: "Les répliques courtes frappent plus fort que les monologues." },
  { num: 3, title: "Loi du Lux", desc: "Le luxe comme syntaxe. L'or dans la forme, pas dans l'ostentation." },
  { num: 4, title: "Loi de l'Absolu", desc: "Pas de demi-mesure. Le cristal ne négocie pas sa forme." },
  { num: 5, title: "Loi du Silence", desc: "Ce qu'on ne dit pas pèse plus que ce qu'on dit." },
  { num: 6, title: "Loi de la Verticalité", desc: "La hiérarchie du sens. Le plus important en premier." },
  { num: 7, title: "Loi de la Mémoire", desc: "Chaque phrase doit être mémorable ou ne pas exister." },
  { num: 8, title: "Loi du Phi", desc: "La proportion dorée dans la structure. L'harmonie mathématique du texte." },
];

export const CADIFOR_CHARACTERS = [
  { name: "Marjory", role: "La Stratège", desc: "Intelligence froide. Calcul parfait. Chaque mouvement est un coup d'échecs.", color: "#3B82F6" },
  { name: "Rose", role: "La Flamme", desc: "Passion brute. Art comme arme. La beauté qui détruit.", color: "#EC4899" },
  { name: "Viki", role: "La Lame", desc: "Précision chirurgicale. Pas un mot de trop. Le scalpel du langage.", color: "#8B5CF6" },
  { name: "Aberthol", role: "Le Gardien", desc: "Mémoire absolue. Archive vivante. Le poids de l'histoire.", color: "#10B981" },
  { name: "Evil Pichon", role: "L'Ombre", desc: "Chaos contrôlé. Imprévisibilité comme doctrine. Le joker.", color: "#EF4444" },
  { name: "Cadifor", role: "L'Absolu", desc: "Cristallisation de tous les autres. Le mode incarné. La synthèse.", color: "#00B4D8" },
];

/* ─── TOXIC ─── */
export const TOXIC_TRACKS = [
  { id: 1, title: "Quête du Graal", grade: 9.5, top: true },
  { id: 2, title: "Code Morse", grade: 9.2, top: true },
  { id: 3, title: "Bondie Wo", grade: 9.0, top: true },
  { id: 4, title: "Morpheus", grade: 8.8, top: true },
  { id: 5, title: "Plus Loin", grade: 8.6, top: true },
  { id: 6, title: "Ensemble ou R", grade: 8.5, top: true },
  { id: 7, title: "Genèse", grade: 8.3, top: false },
  { id: 8, title: "Acide", grade: 8.1, top: false },
  { id: 9, title: "Néon Noir", grade: 8.0, top: false },
  { id: 10, title: "Cendre", grade: 7.9, top: false },
  { id: 11, title: "Mercure", grade: 7.8, top: false },
  { id: 12, title: "Phosphore", grade: 7.7, top: false },
  { id: 13, title: "Arsenic", grade: 7.6, top: false },
  { id: 14, title: "Plasma", grade: 7.5, top: false },
  { id: 15, title: "Cobalt", grade: 7.4, top: false },
  { id: 16, title: "Thorium", grade: 7.3, top: false },
  { id: 17, title: "Radium", grade: 7.2, top: false },
  { id: 18, title: "Antimoine", grade: 7.1, top: false },
  { id: 19, title: "Bismuth", grade: 7.0, top: false },
  { id: 20, title: "Plutonium", grade: 6.9, top: false },
  { id: 21, title: "Strontium", grade: 6.8, top: false },
  { id: 22, title: "Césium", grade: 6.7, top: false },
  { id: 23, title: "Osmium", grade: 6.6, top: false },
  { id: 24, title: "Requiem", grade: 6.5, top: false },
  { id: 25, title: "Flamme", grade: 6.4, top: false },
  { id: 26, title: "Horizon", grade: 6.3, top: false },
  { id: 27, title: "Vortex", grade: 6.2, top: false },
  { id: 28, title: "Eclipse", grade: 6.1, top: false },
  { id: 29, title: "Parallèle", grade: 6.0, top: false },
  { id: 30, title: "Fréquence", grade: 5.9, top: false },
  { id: 31, title: "Signal", grade: 5.8, top: false },
  { id: 32, title: "Orbite", grade: 5.7, top: false },
  { id: 33, title: "Dérive", grade: 5.6, top: false },
  { id: 34, title: "Synthèse", grade: 5.5, top: false },
  { id: 35, title: "Fragment", grade: 5.4, top: false },
  { id: 36, title: "Prisme", grade: 5.3, top: false },
  { id: 37, title: "Catalyse", grade: 5.2, top: false },
  { id: 38, title: "Résonance", grade: 5.1, top: false },
  { id: 39, title: "Entropie", grade: 5.0, top: false },
  { id: 40, title: "Nova", grade: 4.9, top: false },
  { id: 41, title: "Abyssal", grade: 4.8, top: false },
  { id: 42, title: "Pulsion", grade: 4.7, top: false },
  { id: 43, title: "Mirage", grade: 4.6, top: false },
  { id: 44, title: "Apex", grade: 4.5, top: false },
];

/* ─── BYSS NEWS ─── */
export const BYSS_NEWS_ARTICLES = [
  { id: 1, title: "Accord de libre-échange Caraïbes-Mercosur", date: "2026-03-20", region: "Caraïbes", excerpt: "Les négociations avancent sur un corridor commercial caribéen..." },
  { id: 2, title: "CTM vote le budget 2026", date: "2026-03-18", region: "Martinique", excerpt: "38M€ alloués aux transitions numériques..." },
  { id: 3, title: "Macron en Guadeloupe — tensions sociales", date: "2026-03-15", region: "Guadeloupe", excerpt: "Visite officielle dans un contexte de mobilisation..." },
  { id: 4, title: "Élections législatives Haiti", date: "2026-03-12", region: "Haiti", excerpt: "Premier scrutin depuis 2019, sous haute surveillance..." },
  { id: 5, title: "Nouveau câble sous-marin Martinique-Brésil", date: "2026-03-10", region: "Martinique", excerpt: "Infrastructure critique pour la souveraineté numérique..." },
  { id: 6, title: "Sommet CARICOM à Trinidad", date: "2026-03-08", region: "Caraïbes", excerpt: "15 chefs d'État réunis pour le climat caribéen..." },
];

export const NEWS_REGIONS = ["Tous", "Martinique", "Caraïbes", "Guadeloupe", "Haiti", "France"];

/* ─── AN TAN LONTAN ─── */
export const LONTAN_EPISODES = [
  { id: 1, title: "L'arrivée des premiers colons", status: "Livré" as ProdStatus },
  { id: 2, title: "Les plantations de canne", status: "Livré" as ProdStatus },
  { id: 3, title: "La révolte de 1870", status: "En prod" as ProdStatus },
  { id: 4, title: "L'abolition et ses suites", status: "En prod" as ProdStatus },
  { id: 5, title: "Le grand incendie de Fort-de-France", status: "À faire" as ProdStatus },
  { id: 6, title: "L'éruption de la Montagne Pelée", status: "À faire" as ProdStatus },
  { id: 7, title: "La départementalisation", status: "À faire" as ProdStatus },
  { id: 8, title: "Aimé Césaire et la Négritude", status: "À faire" as ProdStatus },
  { id: 9, title: "Le mouvement indépendantiste", status: "À faire" as ProdStatus },
  { id: 10, title: "La Martinique moderne", status: "À faire" as ProdStatus },
];

/* ─── CESAIRE PIXAR ─── */
export const CESAIRE_SEQUENCES = [
  { id: 1, title: "Le petit Aimé au Lorrain", status: "Livré" as ProdStatus },
  { id: 2, title: "Le départ pour Paris", status: "Livré" as ProdStatus },
  { id: 3, title: "La rencontre avec Senghor", status: "En prod" as ProdStatus },
  { id: 4, title: "Le Cahier d'un retour au pays natal", status: "En prod" as ProdStatus },
  { id: 5, title: "Le retour en Martinique", status: "À faire" as ProdStatus },
  { id: 6, title: "Maire de Fort-de-France", status: "À faire" as ProdStatus },
  { id: 7, title: "Le débat avec De Gaulle", status: "À faire" as ProdStatus },
  { id: 8, title: "La construction du Bèlè", status: "À faire" as ProdStatus },
  { id: 9, title: "Le Panthéon refusé", status: "À faire" as ProdStatus },
  { id: 10, title: "L'héritage éternel", status: "À faire" as ProdStatus },
];

/* ─── EVEIL ─── */
export const EVEIL_MESURES = [
  "Déploiement fibre optique sous-marine régionale",
  "Création du Hub IA Caraïbes (Martinique)",
  "Programme « 1000 PME numériques »",
  "Plateforme citoyenne de démocratie participative",
  "Réforme fiscale pour l'innovation technologique",
  "Datacenter souverain antillais",
  "Formation IA pour 5000 jeunes en 3 ans",
  "Agence régionale de cybersécurité",
  "Marché unique numérique caribéen",
  "Fonds souverain d'investissement tech",
  "Programme spatial micro-satellites",
  "Réseau énergétique intelligent (smart grid)",
  "Identité numérique régionale",
  "Télémédecine IA pour les déserts médicaux",
  "Agriculture de précision tropicale",
  "Transport autonome inter-îles",
  "Monnaie numérique régionale complémentaire",
  "Tourisme immersif (VR/AR patrimoine)",
  "Protection IA des écosystèmes marins",
  "Institut de recherche IA tropicale",
];

export const EVEIL_CARTOS = [
  { name: "Économique", entries: 47, icon: Briefcase },
  { name: "Institutionnelle", entries: 23, icon: Shield },
  { name: "Média", entries: 15, icon: Newspaper },
  { name: "Politique", entries: 31, icon: Crown },
  { name: "Sociale", entries: 19, icon: Users },
];

export const EVEIL_PLANS = [
  { name: "Moostik", desc: "Plateforme citoyenne. Démocratie participative.", icon: Target },
  { name: "Orion", desc: "SaaS IA pour PME. Revenue engine.", icon: Rocket },
  { name: "Random", desc: "Opérations d'influence. Communication stratégique.", icon: Flame },
];

/* ─── LIGNEE ─── */
export const LIGNEE_TREE = [
  { name: "Léopold", years: "1889 — 1982", role: "Fondateur du communisme martiniquais", gen: 1 },
  { name: "Félix", years: "19XX — 20XX", role: "Fonctionnaire. Discipline. Transmission.", gen: 2 },
  { name: "Gabriel", years: "19XX —", role: "Rêveur informaticien. Le code comme langage.", gen: 3 },
  { name: "Gary", years: "1993 —", role: "Absolu. Le cristal. BYSS GROUP.", gen: 4, current: true },
];

/* ─── SOTAI ─── */
export const SOTAI_TEAM = [
  { name: "Rony", role: "Directeur Artistique", domain: "Direction créative, identité visuelle", color: "#EF4444" },
  { name: "Stéphane", role: "Production", domain: "Tournage, post-production, livraison", color: "#3B82F6" },
  { name: "Thomas", role: "Business", domain: "Commercial, relations clients, devis", color: "#10B981" },
  { name: "Gary", role: "Tech & IA", domain: "Architecture, IA générative, stratégie", color: "#00B4D8" },
];

export const SOTAI_SERVICES = [
  "Vidéo corporate IA",
  "Spot publicitaire",
  "Motion design",
  "Vidéo immobilière",
  "Contenu réseaux sociaux",
  "Film documentaire",
];

export const SOTAI_PIPELINE = [
  { client: "Digicel", type: "Corporate", status: "Livré" as ProdStatus },
  { client: "Karibea", type: "Hôtelier", status: "En prod" as ProdStatus },
  { client: "Alpha Diving", type: "Immersif", status: "En prod" as ProdStatus },
  { client: "MIZA", type: "Immobilier", status: "À faire" as ProdStatus },
  { client: "Wizzee", type: "Fintech", status: "Livré" as ProdStatus },
];
