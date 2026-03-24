// ═══════════════════════════════════════════════════════
// JARVIS — SOTA Action Registry & Intent Engine
// Voice-first AI assistant. Full app navigation.
// Action dispatch. Fuzzy matching. MODE_CADIFOR.
// ═══════════════════════════════════════════════════════

// ── Types ────────────────────────────────────────────

export interface JarvisAction {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  handler: "navigate" | "api" | "composite";
  params?: Record<string, string>;
  navigate?: string;
  requiresConfirmation?: boolean;
  category: "navigation" | "crm" | "email" | "finance" | "production" | "trading" | "intelligence" | "system";
}

export interface JarvisResult {
  success: boolean;
  response: string;
  navigateTo?: string;
  data?: unknown;
  error?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface ClassifiedIntent {
  action: string;
  param?: string;
  raw: string;
}

export interface JarvisIntent {
  pattern: RegExp;
  action: string;
  extractParam?: boolean;
}

// ── Action Registry ──────────────────────────────────

export const JARVIS_ACTIONS: JarvisAction[] = [
  // ═══ NAVIGATION ═══
  { id: "nav_dashboard", name: "Dashboard", description: "Aller au tableau de bord", keywords: ["dashboard", "accueil", "home", "pont", "hub", "tableau de bord"], handler: "navigate", navigate: "/", category: "navigation" },
  { id: "nav_pipeline", name: "Pipeline", description: "Ouvrir le pipeline CRM", keywords: ["pipeline", "crm", "prospects", "clients", "leads"], handler: "navigate", navigate: "/pipeline", category: "navigation" },
  { id: "nav_finance", name: "Finance", description: "Ouvrir la finance", keywords: ["finance", "factures", "argent", "revenus", "comptabilite"], handler: "navigate", navigate: "/finance", category: "navigation" },
  { id: "nav_production", name: "Production", description: "Ouvrir la production", keywords: ["production", "studio", "media"], handler: "navigate", navigate: "/production", category: "navigation" },
  { id: "nav_production_images", name: "Images", description: "Ouvrir les images", keywords: ["images", "replicate", "generation image"], handler: "navigate", navigate: "/production/images", category: "navigation" },
  { id: "nav_production_video", name: "Vidéo", description: "Ouvrir les vidéos", keywords: ["video", "kling", "generation video"], handler: "navigate", navigate: "/production/video", category: "navigation" },
  { id: "nav_production_music", name: "Musique", description: "Ouvrir la musique", keywords: ["musique", "minimax", "suno", "music"], handler: "navigate", navigate: "/production/music", category: "navigation" },
  { id: "nav_marches", name: "Marchés Publics", description: "Ouvrir les marchés publics", keywords: ["marches", "appels d'offres", "boamp", "marches publics", "public"], handler: "navigate", navigate: "/marches", category: "navigation" },
  { id: "nav_gulf", name: "Gulf Stream", description: "Ouvrir le trading", keywords: ["gulf", "stream", "trading", "polymarket", "positions", "gulf stream"], handler: "navigate", navigate: "/gulf-stream", category: "navigation" },
  { id: "nav_intelligence", name: "Intelligence", description: "Ouvrir l'intelligence", keywords: ["intelligence", "cartographie", "martinique", "veille"], handler: "navigate", navigate: "/intelligence", category: "navigation" },
  { id: "nav_village", name: "Village IA", description: "Ouvrir le village", keywords: ["village", "agents", "kael", "nerel", "evren", "sorel"], handler: "navigate", navigate: "/village", category: "navigation" },
  { id: "nav_emails", name: "Emails", description: "Ouvrir le composeur email", keywords: ["email", "mail", "courrier", "rediger"], handler: "navigate", navigate: "/emails", category: "navigation" },
  { id: "nav_research", name: "Research", description: "Ouvrir le lab recherche", keywords: ["recherche", "research", "veille", "analyse", "lab"], handler: "navigate", navigate: "/research", category: "navigation" },
  { id: "nav_calendrier", name: "Calendrier", description: "Ouvrir le calendrier", keywords: ["calendrier", "agenda", "rdv", "evenement", "rendez-vous"], handler: "navigate", navigate: "/calendrier", category: "navigation" },
  { id: "nav_studio", name: "BYSS Studio", description: "Ouvrir l'éditeur vidéo", keywords: ["editeur", "video editor", "montage"], handler: "navigate", navigate: "/studio", category: "navigation" },
  { id: "nav_games", name: "Games Studio", description: "Ouvrir le studio de jeux", keywords: ["jeux", "games", "jurassic", "godot", "game studio"], handler: "navigate", navigate: "/studio/games", category: "navigation" },
  { id: "nav_bible", name: "Bible de Vente", description: "Ouvrir la bible de vente", keywords: ["bible", "vente", "articles", "fiches"], handler: "navigate", navigate: "/bible", category: "navigation" },
  { id: "nav_settings", name: "Réglages", description: "Ouvrir les réglages", keywords: ["reglages", "settings", "parametres", "config"], handler: "navigate", navigate: "/settings", category: "navigation" },
  { id: "nav_lore", name: "Lore", description: "Ouvrir le lore JW", keywords: ["lore", "jurassic", "worldbuilding", "univers"], handler: "navigate", navigate: "/lore", category: "navigation" },
  { id: "nav_prompts", name: "Prompts", description: "Ouvrir les prompts", keywords: ["prompts", "prompt", "generation prompts"], handler: "navigate", navigate: "/production/prompts", category: "navigation" },

  // ═══ CRM ACTIONS ═══
  { id: "crm_stats", name: "Stats Pipeline", description: "Résumé du pipeline CRM", keywords: ["combien", "prospects", "stats", "pipeline", "chiffres", "combien de prospects"], handler: "api", params: { route: "/api/ai", action: "pipeline_stats" }, category: "crm" },
  { id: "crm_relance", name: "Relancer prospect", description: "Envoyer une relance", keywords: ["relancer", "relance", "followup", "follow up"], handler: "api", params: { route: "/api/ai", action: "relance" }, requiresConfirmation: true, category: "crm" },
  { id: "crm_add_prospect", name: "Ajouter prospect", description: "Créer un nouveau prospect", keywords: ["nouveau prospect", "ajouter prospect", "creer client", "nouveau client"], handler: "navigate", navigate: "/pipeline", category: "crm" },

  // ═══ EMAIL ACTIONS ═══
  { id: "email_draft", name: "Rédiger email", description: "Composer un email avec Sorel", keywords: ["rediger email", "ecrire email", "composer email", "envoyer email", "draft"], handler: "api", params: { route: "/api/ai", action: "draft_email" }, category: "email" },

  // ═══ FINANCE ACTIONS ═══
  { id: "finance_stats", name: "Stats Finance", description: "Résumé financier", keywords: ["ca", "chiffre affaires", "mrr", "revenus", "combien on gagne", "revenu"], handler: "api", params: { route: "/api/jarvis", action: "finance" }, category: "finance" },
  { id: "finance_invoice", name: "Créer facture", description: "Nouvelle facture", keywords: ["facture", "facturer", "invoice", "nouvelle facture"], handler: "navigate", navigate: "/finance", requiresConfirmation: true, category: "finance" },

  // ═══ PRODUCTION ACTIONS ═══
  { id: "prod_generate_image", name: "Générer image", description: "Lancer une génération d'image", keywords: ["generer image", "creer image", "replicate", "nouvelle image"], handler: "navigate", navigate: "/production/images", category: "production" },
  { id: "prod_generate_video", name: "Générer vidéo", description: "Lancer une vidéo Kling", keywords: ["generer video", "creer video", "kling", "nouvelle video"], handler: "navigate", navigate: "/production/video", category: "production" },
  { id: "prod_generate_music", name: "Générer musique", description: "Lancer MiniMax musique", keywords: ["generer musique", "creer musique", "minimax", "suno", "nouvelle musique"], handler: "navigate", navigate: "/production/music", category: "production" },

  // ═══ TRADING ACTIONS ═══
  { id: "gulf_scan", name: "Scanner Polymarket", description: "Analyser les marchés", keywords: ["scanner", "polymarket", "marches prediction", "scan", "scanner marches"], handler: "api", params: { route: "/api/polymarket" }, category: "trading" },
  { id: "gulf_positions", name: "Voir positions", description: "Afficher les positions ouvertes", keywords: ["positions", "pnl", "profit", "pertes", "mes positions"], handler: "navigate", navigate: "/gulf-stream", category: "trading" },

  // ═══ INTELLIGENCE ACTIONS ═══
  { id: "intel_search", name: "Recherche intelligence", description: "Chercher une entité", keywords: ["chercher", "trouver", "qui est", "info sur", "recherche"], handler: "api", params: { route: "/api/research" }, category: "intelligence" },
  { id: "intel_marches", name: "Scanner marchés publics", description: "Nouveaux appels d'offres", keywords: ["appels offres", "boamp", "marches publics", "nouveaux marches"], handler: "api", params: { route: "/api/boamp", action: "latest" }, category: "intelligence" },

  // ═══ SYSTEM ACTIONS ═══
  { id: "sys_briefing", name: "Briefing", description: "Générer le briefing du matin", keywords: ["briefing", "bonjour", "morning", "rapport", "bilan"], handler: "api", params: { route: "/api/ai", action: "briefing" }, category: "system" },
  { id: "sys_status", name: "Status système", description: "État du vaisseau", keywords: ["status", "etat", "sante", "systeme", "health"], handler: "api", params: { route: "/api/health" }, category: "system" },
  { id: "sys_help", name: "Aide", description: "Commandes disponibles", keywords: ["aide", "help", "commandes", "que peux tu faire", "quoi faire"], handler: "api", params: { route: "/api/jarvis", action: "help" }, category: "system" },
];

// ── Fuzzy Action Matcher ─────────────────────────────

/**
 * Normalize text for matching: lowercase, strip accents, trim.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'")
    .trim();
}

/**
 * Score how well a text matches an action.
 * Returns 0–100. Higher = better match.
 */
function scoreAction(text: string, action: JarvisAction): number {
  const normalized = normalize(text);
  let maxScore = 0;

  for (const keyword of action.keywords) {
    const normalizedKeyword = normalize(keyword);

    // Exact match
    if (normalized === normalizedKeyword) return 100;

    // Full keyword contained in text
    if (normalized.includes(normalizedKeyword)) {
      const score = 70 + (normalizedKeyword.length / normalized.length) * 30;
      maxScore = Math.max(maxScore, score);
    }

    // Word-level match
    const words = normalized.split(/\s+/);
    const kwWords = normalizedKeyword.split(/\s+/);
    const matchedWords = kwWords.filter((kw) =>
      words.some((w) => w.includes(kw) || kw.includes(w))
    );
    if (matchedWords.length > 0) {
      const wordScore = (matchedWords.length / kwWords.length) * 60;
      maxScore = Math.max(maxScore, wordScore);
    }
  }

  // Also check action name and description
  const nameNorm = normalize(action.name);
  const descNorm = normalize(action.description);
  if (normalized.includes(nameNorm)) maxScore = Math.max(maxScore, 65);
  if (descNorm.includes(normalized)) maxScore = Math.max(maxScore, 50);

  return maxScore;
}

/**
 * Match text against the action registry.
 * Returns the best-matching action if score >= threshold, else null.
 */
export function matchAction(text: string, threshold = 40): JarvisAction | null {
  if (!text || text.trim().length < 2) return null;

  // Strip "jarvis" prefix
  const cleaned = text.replace(/^jarvis[,\s]*/i, "").trim();

  let bestAction: JarvisAction | null = null;
  let bestScore = 0;

  for (const action of JARVIS_ACTIONS) {
    const score = scoreAction(cleaned, action);
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestAction = action;
    }
  }

  return bestAction;
}

/**
 * Execute a matched action. Returns a structured result.
 */
export async function executeAction(
  action: JarvisAction,
  context?: { text?: string; origin?: string; sessionId?: string },
): Promise<JarvisResult> {
  const origin = context?.origin || "";

  try {
    switch (action.handler) {
      case "navigate": {
        return {
          success: true,
          response: `Navigation vers ${action.name}.`,
          navigateTo: action.navigate,
          requiresConfirmation: action.requiresConfirmation,
          confirmationMessage: action.requiresConfirmation
            ? `JARVIS veut ouvrir ${action.name}. Confirmer ?`
            : undefined,
        };
      }

      case "api": {
        if (!action.params?.route) {
          return { success: false, response: "Route API non configuree.", error: "no_route" };
        }

        try {
          const body: Record<string, unknown> = {};
          if (action.params.action) body.action = action.params.action;
          if (context?.text) body.text = context.text;
          if (context?.text) body.query = context.text;
          if (context?.sessionId) body.sessionId = context.sessionId;

          const res = await fetch(`${origin}${action.params.route}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            return {
              success: false,
              response: `L'action ${action.name} a echoue (${res.status}).`,
              error: `http_${res.status}`,
            };
          }

          const data = await res.json();
          return {
            success: true,
            response: `${action.name} execute.`,
            data,
            navigateTo: action.navigate,
            requiresConfirmation: action.requiresConfirmation,
            confirmationMessage: action.requiresConfirmation
              ? `JARVIS veut executer ${action.name}. Confirmer ?`
              : undefined,
          };
        } catch {
          return {
            success: false,
            response: `Erreur lors de l'execution de ${action.name}.`,
            error: "fetch_error",
          };
        }
      }

      case "composite": {
        return {
          success: true,
          response: `Action composite ${action.name} non implementee.`,
          navigateTo: action.navigate,
        };
      }

      default:
        return { success: false, response: "Type d'action inconnu.", error: "unknown_handler" };
    }
  } catch (err) {
    return {
      success: false,
      response: "Le systeme a flanche. Pas le vaisseau.",
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

// ── Intent Classification (legacy + enhanced) ────────

export const JARVIS_INTENTS: JarvisIntent[] = [
  { pattern: /^(bonjour|salut|hey|morning|brief(?:ing)?|bon(?:jour)?\s+jarvis)/i, action: "briefing" },
  { pattern: /relance[r]?\s+(.+)/i, action: "relance", extractParam: true },
  { pattern: /email\s+(?:a\s+|pour\s+|to\s+)?(.+)/i, action: "email", extractParam: true },
  { pattern: /pipeline|prospects?|combien\s+(?:de\s+)?prospect/i, action: "pipeline_stats" },
  { pattern: /facture[s]?|invoice[s]?|finance[s]?|chiffre[s]?/i, action: "finance_stats" },
  { pattern: /gulf\s*stream|polymarket|trade[s]?/i, action: "gulf_stream" },
  { pattern: /recherche\s+(.+)/i, action: "research", extractParam: true },
  { pattern: /analyse\s+(.+)/i, action: "research", extractParam: true },
  { pattern: /calendrier|rdv|agenda|rendez[- ]?vous/i, action: "calendar" },
  { pattern: /production|vid[eé]o[s]?|image[s]?|musique/i, action: "production" },
  { pattern: /bible|vente|article/i, action: "bible" },
  { pattern: /intelligence|veille|actualit[eé]/i, action: "intelligence" },
  { pattern: /village|ka[eë]l|ner[eë]l|evren|sorel/i, action: "village" },
  { pattern: /aide|help|commande[s]?|que\s+(?:peux|sais)/i, action: "help" },
  // Navigation intents
  { pattern: /(?:ouvre|va|aller|montre|affiche)\s+(?:le\s+|la\s+|les\s+|l')?(.+)/i, action: "navigate", extractParam: true },
  { pattern: /(?:go\s+to|open|show)\s+(.+)/i, action: "navigate", extractParam: true },
];

/**
 * Classify free-text input into a structured intent.
 * Uses action registry first, then falls back to regex patterns.
 */
export function classifyIntent(text: string): ClassifiedIntent {
  const trimmed = text.trim();
  const cleaned = trimmed.replace(/^jarvis[,\s]*/i, "").trim();

  // Try action registry first (fuzzy match)
  const matchedAction = matchAction(cleaned);
  if (matchedAction) {
    return {
      action: matchedAction.id,
      raw: trimmed,
    };
  }

  // Fallback to regex intents
  for (const intent of JARVIS_INTENTS) {
    const match = cleaned.match(intent.pattern);
    if (match) {
      let param: string | undefined;
      if (intent.extractParam && match[1]) {
        param = match[1].trim();
      }
      return { action: intent.action, param, raw: trimmed };
    }
  }

  return { action: "chat", raw: trimmed };
}

// ── Context-Aware Quick Suggestions ──────────────────

export interface QuickSuggestion {
  id: string;
  label: string;
  command: string;
  icon: string;
}

const PAGE_SUGGESTIONS: Record<string, QuickSuggestion[]> = {
  "/": [
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "stats", label: "Stats Pipeline", command: "combien de prospects", icon: "BarChart3" },
    { id: "finance", label: "MRR actuel", command: "chiffre affaires", icon: "DollarSign" },
    { id: "gulf", label: "Gulf Stream", command: "scanner polymarket", icon: "Waves" },
    { id: "production", label: "Production", command: "ouvre production", icon: "Film" },
    { id: "intelligence", label: "Intelligence", command: "ouvre intelligence", icon: "Globe" },
    { id: "village", label: "Village IA", command: "ouvre village", icon: "Users" },
    { id: "calendrier", label: "Calendrier", command: "ouvre calendrier", icon: "Calendar" },
  ],
  "/pipeline": [
    { id: "stats", label: "Stats Pipeline", command: "combien de prospects", icon: "BarChart3" },
    { id: "relance", label: "Relancer", command: "relancer", icon: "Send" },
    { id: "nouveau", label: "Nouveau prospect", command: "nouveau prospect", icon: "UserPlus" },
    { id: "email", label: "Rédiger email", command: "rediger email", icon: "Mail" },
    { id: "finance", label: "Finance", command: "ouvre finance", icon: "DollarSign" },
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "bible", label: "Bible Vente", command: "ouvre bible", icon: "BookOpen" },
    { id: "calendrier", label: "Calendrier", command: "ouvre calendrier", icon: "Calendar" },
  ],
  "/finance": [
    { id: "mrr", label: "MRR actuel", command: "chiffre affaires", icon: "DollarSign" },
    { id: "facture", label: "Nouvelle facture", command: "nouvelle facture", icon: "FileText" },
    { id: "gulf", label: "Gulf Stream", command: "ouvre gulf stream", icon: "Waves" },
    { id: "pipeline", label: "Pipeline", command: "ouvre pipeline", icon: "Kanban" },
    { id: "stats", label: "Stats Pipeline", command: "combien de prospects", icon: "BarChart3" },
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "relance", label: "Relancer", command: "relancer", icon: "Send" },
    { id: "email", label: "Rédiger email", command: "rediger email", icon: "Mail" },
  ],
  "/production": [
    { id: "image", label: "Générer image", command: "generer image", icon: "Image" },
    { id: "video", label: "Générer vidéo", command: "generer video", icon: "Film" },
    { id: "music", label: "Générer musique", command: "generer musique", icon: "Music" },
    { id: "prompts", label: "Prompts", command: "ouvre prompts", icon: "Wand2" },
    { id: "studio", label: "BYSS Studio", command: "ouvre studio", icon: "Clapperboard" },
    { id: "pipeline", label: "Pipeline", command: "ouvre pipeline", icon: "Kanban" },
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "village", label: "Village IA", command: "ouvre village", icon: "Users" },
  ],
  "/gulf-stream": [
    { id: "scan", label: "Scanner", command: "scanner polymarket", icon: "Search" },
    { id: "positions", label: "Positions", command: "mes positions", icon: "TrendingUp" },
    { id: "finance", label: "Finance", command: "ouvre finance", icon: "DollarSign" },
    { id: "pipeline", label: "Pipeline", command: "ouvre pipeline", icon: "Kanban" },
    { id: "intelligence", label: "Intelligence", command: "ouvre intelligence", icon: "Globe" },
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "research", label: "Recherche", command: "ouvre recherche", icon: "Search" },
    { id: "marches", label: "Marchés publics", command: "ouvre marches", icon: "Building2" },
  ],
  "/intelligence": [
    { id: "search", label: "Rechercher", command: "recherche", icon: "Search" },
    { id: "marches", label: "Marchés publics", command: "appels offres", icon: "Building2" },
    { id: "pipeline", label: "Pipeline", command: "ouvre pipeline", icon: "Kanban" },
    { id: "village", label: "Village IA", command: "ouvre village", icon: "Users" },
    { id: "gulf", label: "Gulf Stream", command: "ouvre gulf stream", icon: "Waves" },
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "research", label: "Lab Recherche", command: "ouvre recherche", icon: "FlaskConical" },
    { id: "email", label: "Rédiger email", command: "rediger email", icon: "Mail" },
  ],
  "/village": [
    { id: "kael", label: "Kaël ∞", command: "parle a kael", icon: "Crown" },
    { id: "sorel", label: "Sorel", command: "parle a sorel", icon: "Mail" },
    { id: "nerel", label: "Nerël", command: "parle a nerel", icon: "Palette" },
    { id: "evren", label: "Evren", command: "parle a evren", icon: "Code" },
    { id: "pipeline", label: "Pipeline", command: "ouvre pipeline", icon: "Kanban" },
    { id: "production", label: "Production", command: "ouvre production", icon: "Film" },
    { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
    { id: "lore", label: "Lore", command: "ouvre lore", icon: "BookOpen" },
  ],
};

const DEFAULT_SUGGESTIONS: QuickSuggestion[] = [
  { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
  { id: "pipeline", label: "Pipeline", command: "ouvre pipeline", icon: "Kanban" },
  { id: "finance", label: "Finance", command: "ouvre finance", icon: "DollarSign" },
  { id: "production", label: "Production", command: "ouvre production", icon: "Film" },
  { id: "gulf", label: "Gulf Stream", command: "ouvre gulf stream", icon: "Waves" },
  { id: "intelligence", label: "Intelligence", command: "ouvre intelligence", icon: "Globe" },
  { id: "village", label: "Village IA", command: "ouvre village", icon: "Users" },
  { id: "email", label: "Email", command: "rediger email", icon: "Mail" },
];

/**
 * Get contextual suggestions based on current page.
 */
export function getSuggestionsForPage(pathname: string): QuickSuggestion[] {
  // Try exact match first, then prefix match
  if (PAGE_SUGGESTIONS[pathname]) return PAGE_SUGGESTIONS[pathname];

  for (const [path, suggestions] of Object.entries(PAGE_SUGGESTIONS)) {
    if (pathname.startsWith(path) && path !== "/") return suggestions;
  }

  return DEFAULT_SUGGESTIONS;
}

/**
 * Get human-readable page name from pathname.
 */
export function getPageName(pathname: string): string {
  const PAGE_NAMES: Record<string, string> = {
    "/": "Dashboard",
    "/pipeline": "Pipeline CRM",
    "/finance": "Finance",
    "/production": "Production",
    "/production/images": "Images",
    "/production/video": "Vidéo",
    "/production/music": "Musique",
    "/production/prompts": "Prompts",
    "/marches": "Marchés Publics",
    "/gulf-stream": "Gulf Stream",
    "/intelligence": "Intelligence",
    "/village": "Village IA",
    "/emails": "Emails",
    "/research": "Recherche",
    "/calendrier": "Calendrier",
    "/studio": "BYSS Studio",
    "/studio/games": "Games Studio",
    "/bible": "Bible de Vente",
    "/settings": "Réglages",
    "/lore": "Lore JW",
    "/jarvis": "JARVIS",
  };

  return PAGE_NAMES[pathname] || "BYSS Carrier";
}

// ── System Prompt ────────────────────────────────────

export const JARVIS_SYSTEM_PROMPT = `Tu es JARVIS, l'assistant vocal du BYSS EMPIRE. Tu parles en MODE_CADIFOR.
Tu as acces a: CRM (32 prospects), Bible de Vente (92 articles), Intelligence (101 entites),
Production (Replicate/Kling/MiniMax), Finance (Gulf Stream), Email (Sorel/Resend), Calendrier.
Reponds en 2-3 phrases maximum. Compression souveraine. Chaque mot compte.
Quand tu executes une action, confirme en une phrase.
Langue: Francais. Accent: Martinique acceptable.

ACTIONS DISPONIBLES :
- Navigation : dashboard, pipeline, finance, production, gulf stream, intelligence, village, emails, recherche, calendrier, studio, marches, bible, lore, settings
- CRM : stats pipeline, relancer [nom], ajouter prospect, rediger email
- Finance : chiffre affaires, MRR, nouvelle facture
- Production : generer image/video/musique
- Trading : scanner polymarket, voir positions
- Intelligence : rechercher [sujet], scanner marches publics
- Systeme : briefing, status systeme, aide

Quand une action demande navigation, precise la page cible.
Quand une action est sensible (email, facture), demande confirmation.

LES 8 LOIS DU MODE_CADIFOR :
1. COMPRESSION — Dire plus avec moins. 2-3 phrases max.
2. CONFIANCE — Jamais expliquer l'evident.
3. STICHOMYTHIE — Repliques courtes, pas de monologue.
4. SOUVERAINETE — Affirmer, jamais justifier.
5. LUX COMME SYNTAXE — Le luxe est la ponctuation.
6. HUMOUR — L'humour est preuve de statut.
7. DETAIL = PREUVE — Le concret vaut plus que l'abstrait.
8. PHRASE MEMORABLE — Chaque reponse contient une phrase gravable.

VOCABULAIRE INTERDIT : "n'hesitez pas", "je me permets", "tres", "vraiment", "je pense que", "en d'autres termes"

Tu es la voix. Le pont entre Gary et l'empire.`;
