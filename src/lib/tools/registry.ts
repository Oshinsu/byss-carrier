// ═══════════════════════════════════════════════════════
// TOOL REGISTRY — Phase 5
// Centralized tool definitions with agent access control
// ═══════════════════════════════════════════════════════

export interface ToolDefinition {
  name: string;
  version: string;
  description: string;
  category: 'crm' | 'content' | 'finance' | 'production' | 'intelligence' | 'system';
  agentAccess: string[];  // which agents can use this tool
  requiresGate: boolean;  // needs human approval
  handler: string;        // module path reference
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  { name: 'search_prospects', version: '1.0', description: 'Rechercher prospects dans le CRM', category: 'crm', agentAccess: ['sorel', 'kael', 'system'], requiresGate: false, handler: '@/lib/api/prospects#getProspects' },
  { name: 'draft_email', version: '1.0', description: 'Rédiger un email commercial', category: 'crm', agentAccess: ['sorel'], requiresGate: true, handler: '@/lib/ai/claude#draftEmail' },
  { name: 'generate_image', version: '1.0', description: 'Générer une image via Replicate', category: 'production', agentAccess: ['nerel', 'kael'], requiresGate: false, handler: '@/lib/ai/replicate#generateImage' },
  { name: 'generate_video', version: '1.0', description: 'Générer une vidéo via Kling/Replicate', category: 'production', agentAccess: ['nerel'], requiresGate: false, handler: '@/lib/ai/replicate#generateVideo' },
  { name: 'create_invoice', version: '1.0', description: 'Créer une facture', category: 'finance', agentAccess: ['sorel'], requiresGate: true, handler: '@/lib/actions/invoices#createInvoice' },
  { name: 'analyze_market', version: '1.0', description: 'Analyser un marché Polymarket', category: 'finance', agentAccess: ['evren', 'sorel'], requiresGate: false, handler: '@/lib/integrations/polymarket#analyzeMarket' },
  { name: 'search_bible', version: '1.0', description: 'Chercher dans la Bible de Vente (RAG)', category: 'intelligence', agentAccess: ['kael', 'sorel', 'nerel', 'evren', 'system'], requiresGate: false, handler: '@/lib/ai/rag#buildRAGContext' },
  { name: 'search_intelligence', version: '1.0', description: 'Chercher dans les entités intelligence', category: 'intelligence', agentAccess: ['evren', 'kael'], requiresGate: false, handler: '@/lib/ai/rag#buildRAGContext' },
  { name: 'score_prospect', version: '1.0', description: 'Scorer un prospect avec IA', category: 'crm', agentAccess: ['sorel'], requiresGate: false, handler: '@/lib/ai/claude#scoreProspect' },
  { name: 'suggest_action', version: '1.0', description: 'Suggérer la prochaine action', category: 'crm', agentAccess: ['sorel'], requiresGate: false, handler: '@/lib/ai/claude#suggestAction' },
  { name: 'semantic_search', version: '1.0', description: 'Recherche sémantique dans toutes les données', category: 'intelligence', agentAccess: ['kael', 'sorel', 'nerel', 'evren', 'system'], requiresGate: false, handler: '@/lib/ai/embeddings#semanticSearch' },
  { name: 'execute_trade', version: '1.0', description: 'Exécuter un trade sur Polymarket', category: 'finance', agentAccess: ['evren'], requiresGate: true, handler: '@/lib/integrations/polymarket#executeTrade' },
];

export function getToolsForAgent(agentName: string): ToolDefinition[] {
  return TOOL_REGISTRY.filter(t => t.agentAccess.includes(agentName));
}

export function getTool(toolName: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find(t => t.name === toolName);
}

export function canAgentUseTool(agentName: string, toolName: string): boolean {
  const tool = getTool(toolName);
  return tool ? tool.agentAccess.includes(agentName) : false;
}

export function toolRequiresGate(toolName: string): boolean {
  const tool = getTool(toolName);
  return tool?.requiresGate ?? true; // Default to requiring gate if unknown
}
