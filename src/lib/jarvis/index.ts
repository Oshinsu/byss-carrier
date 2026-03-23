// ═══════════════════════════════════════════════════════
// JARVIS — Intent Classification Engine
// Voice-first AI assistant for the BYSS EMPIRE.
// Classifies natural language → action + param.
// ═══════════════════════════════════════════════════════

export interface JarvisIntent {
  pattern: RegExp;
  action: string;
  extractParam?: boolean;
}

export const JARVIS_INTENTS: JarvisIntent[] = [
  { pattern: /^(bonjour|salut|hey|morning|brief(?:ing)?|bon(?:jour)?\s+jarvis)/i, action: "briefing" },
  { pattern: /relance[r]?\s+(.+)/i, action: "relance", extractParam: true },
  { pattern: /email\s+(?:a\s+|pour\s+|to\s+)?(.+)/i, action: "email", extractParam: true },
  { pattern: /pipeline|prospects?|combien\s+(?:de\s+)?prospect/i, action: "pipeline_stats" },
  { pattern: /facture[s]?|invoice[s]?|finance[s]?|chiffre[s]?/i, action: "finance_stats" },
  { pattern: /gulf\s*stream|polymarket|trade[s]?|march[eé][s]?/i, action: "gulf_stream" },
  { pattern: /recherche\s+(.+)/i, action: "research", extractParam: true },
  { pattern: /analyse\s+(.+)/i, action: "research", extractParam: true },
  { pattern: /calendrier|rdv|agenda|rendez[- ]?vous/i, action: "calendar" },
  { pattern: /production|vid[eé]o[s]?|image[s]?|musique/i, action: "production" },
  { pattern: /bible|vente|article/i, action: "bible" },
  { pattern: /intelligence|veille|actualit[eé]/i, action: "intelligence" },
  { pattern: /village|ka[eë]l|ner[eë]l|evren|sorel/i, action: "village" },
  { pattern: /aide|help|commande[s]?|que\s+(?:peux|sais)/i, action: "help" },
];

export interface ClassifiedIntent {
  action: string;
  param?: string;
  raw: string;
}

/**
 * Classify free-text input into a structured intent.
 * Falls back to "chat" for unrecognized patterns.
 */
export function classifyIntent(text: string): ClassifiedIntent {
  const trimmed = text.trim();

  // Strip "jarvis" prefix if present
  const cleaned = trimmed.replace(/^jarvis[,\s]*/i, "").trim();

  for (const intent of JARVIS_INTENTS) {
    const match = cleaned.match(intent.pattern);
    if (match) {
      let param: string | undefined;
      if (intent.extractParam && match[1]) {
        param = match[1].trim();
      } else if (intent.extractParam && match[2]) {
        param = match[2].trim();
      }
      return { action: intent.action, param, raw: trimmed };
    }
  }

  // Default: general chat with full context
  return { action: "chat", raw: trimmed };
}

/**
 * Quick action labels for the UI shortcut buttons.
 */
export const JARVIS_QUICK_ACTIONS = [
  { id: "briefing", label: "Briefing", command: "briefing", icon: "Zap" },
  { id: "relancer", label: "Relancer", command: "relancer", icon: "Send" },
  { id: "email", label: "Email", command: "email", icon: "Mail" },
  { id: "pipeline", label: "Pipeline", command: "pipeline", icon: "Kanban" },
  { id: "gulf", label: "Gulf Stream", command: "gulf stream", icon: "Waves" },
  { id: "recherche", label: "Recherche", command: "recherche", icon: "Search" },
] as const;

/**
 * JARVIS system prompt — sovereign voice of the empire.
 */
export const JARVIS_SYSTEM_PROMPT = `Tu es JARVIS, l'assistant vocal du BYSS EMPIRE. Tu parles en MODE_CADIFOR.
Tu as acces a: CRM (32 prospects), Bible de Vente (92 articles), Intelligence (101 entites),
Production (Replicate), Finance (Gulf Stream), Email (Sorel/Resend), Calendrier.
Reponds en 2-3 phrases maximum. Compression souveraine. Chaque mot compte.
Quand tu executes une action, confirme en une phrase.
Langue: Francais. Accent: Martinique acceptable.

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
