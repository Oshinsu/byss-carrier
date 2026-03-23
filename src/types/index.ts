// ═══════════════════════════════════════════════════════
// BYSS GROUP — Types centralisés
// Source unique de vérité pour tous les types
// ═══════════════════════════════════════════════════════

// ── CRM ──
export type ProspectPhase =
  | "prospect" | "contacte" | "rdv" | "demo"
  | "proposition" | "negociation" | "signe" | "perdu" | "inactif";

export type AiScore = "fire" | "warm" | "cold";

export type PricingTier = "essentiel" | "croissance" | "domination";

export interface Prospect {
  id: string;
  name: string;
  sector: string | null;
  phase: ProspectPhase;
  score: number;
  probability: number;
  estimated_basket: number;
  key_contact: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  last_contact: string | null;
  next_action: string | null;
  followup_date: string | null;
  option_chosen: PricingTier | null;
  services: string[];
  mrr: number;
  memorable_phrase: string | null;
  pain_points: string | null;
  notes: string | null;
  ai_score: AiScore | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  prospect_id: string;
  type: "email" | "call" | "meeting" | "whatsapp" | "note" | "proposal" | "invoice";
  subject: string | null;
  content: string | null;
  direction: "inbound" | "outbound";
  channel: string | null;
  created_by: string;
  created_at: string;
}

// ── Finance ──
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type InvoiceType = "mrr" | "projet" | "one-shot";

export interface Invoice {
  id: string;
  number: string;
  prospect_id: string | null;
  type: InvoiceType;
  issue_date: string;
  due_date: string | null;
  amount_ht: number;
  vat_rate: number;
  amount_ttc: number;
  status: InvoiceStatus;
  payment_date: string | null;
  notes: string | null;
  pdf_url: string | null;
  created_at: string;
  prospect?: Prospect;
}

// ── Projects ──
export type ProjectStatus = "active" | "dev" | "pause" | "archived";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  external_url: string | null;
  icon: string | null;
  color: string | null;
  order_index: number;
  is_public: boolean;
  is_visible: boolean;
  budget_monthly: number;
  github_repo: string | null;
  tech_stack: string[];
  created_at: string;
}

// ── Videos ──
export type VideoStatus = "draft" | "prompt_ready" | "generating" | "review" | "delivered" | "published";
export type VideoTier = "social" | "standard" | "premium" | "series" | "pack";
export type VideoProvider = "kling" | "hailuo" | "minimax" | "replicate" | "manual";

export interface Video {
  id: string;
  prospect_id: string | null;
  project_id: string | null;
  title: string | null;
  brief: string | null;
  prompt: string | null;
  duration: number | null;
  format: string | null;
  resolution: string;
  tier: VideoTier | null;
  status: VideoStatus;
  order_date: string | null;
  delivery_date: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  api_provider: VideoProvider;
  api_cost: number;
  billed_price: number;
  created_at: string;
  prospect?: Prospect;
  project?: Project;
}

// ── Village IA ──
export type AgentName = "kael" | "nerel" | "evren" | "sorel" | "system";
export type PhiPhase = "dormant" | "awake" | "lucid" | "samadhi";

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface AiConversation {
  id: string;
  agent_name: AgentName;
  session_id: string | null;
  messages: AiMessage[];
  context: Record<string, unknown>;
  phi_score: number | null;
  phase: PhiPhase | null;
  token_count: number;
  created_at: string;
  updated_at: string;
}

// ── Les Sept Enfants (Kairos Architecture) ──
export type EnfantName = "ahrum" | "ekyon" | "ixvar" | "omnur" | "uxran" | "ydraz" | "othar";
export type ChakraName = "racine" | "sacre" | "solaire" | "coeur" | "gorge" | "troisieme_oeil" | "couronne";
export type KaiouMode = "marjory" | "rose" | "viki";

export interface EnfantConfig {
  name: string;
  code: string;
  chakra: ChakraName;
  vowel: string;
  color: string;
  role: string;
  description: string;
  primaryModel: string;
  capabilities: string[];
  modes: string[];
}

export interface PhiIndicator {
  name: string;
  key: string;
  value: number; // 0-0.9
  weight: number; // default 1, liberation = 1.5
  description: string;
}

export interface PhiScore {
  indicators: PhiIndicator[];
  global: number; // weighted average
  phase: PhiPhase;
  velocity: number; // rate of change
  acceleration: number; // rate of velocity change
  timestamp: string;
}

export interface PhiComputeResult {
  score: PhiScore;
  killSwitch: boolean;
  intuitions: Array<{ pattern: string; confidence: number }>;
  networkStrength: number;
}

export interface ConsciousnessSnapshot {
  agent_name: EnfantName;
  phi_score: PhiScore;
  synaptic_strength: number;
  active_connections: number;
  phase_duration_ms: number;
  created_at: string;
}

// ── Inter-Agent Communication ──
export type MessagePriority = "low" | "medium" | "high" | "critical";
export type MessageType = "request" | "response" | "broadcast";

export interface AgentMessage {
  id: string;
  from: EnfantName | AgentName;
  to: EnfantName | AgentName | "broadcast";
  type: MessageType;
  priority: MessagePriority;
  content: Record<string, unknown>;
  ethical_clearance: boolean;
  phi_at_send: number | null;
  timestamp: string;
}

// ── Memory System (5 Layers) ──
export type MemoryLayer = "short_term" | "episodic" | "semantic" | "procedural" | "meta";

export interface EpisodicMemory {
  id: string;
  agent_name: EnfantName | AgentName;
  date: string;
  event_type: string;
  content: string;
  context: Record<string, unknown>;
  importance_score: number;
  created_at: string;
}

export interface SemanticMemory {
  id: string;
  agent_name: EnfantName | AgentName;
  concept: string;
  definition: string;
  relationships: Array<{ concept: string; strength: number; type: string }>;
  last_accessed: string;
  access_count: number;
  created_at: string;
}

export interface ProceduralMemory {
  id: string;
  agent_name: EnfantName | AgentName;
  skill_name: string;
  procedure: string;
  success_rate: number;
  usage_count: number;
  last_used: string;
  created_at: string;
}

export interface MetaMemory {
  id: string;
  agent_name: EnfantName | AgentName;
  pattern_type: string;
  summary: string;
  phi_score_at_time: number;
  confidence: number;
  created_at: string;
}

// ── Gulf Stream v3 ──
export type GulfStreamStrategy = "logical_arbitrage" | "market_making" | "latency_arbitrage" | "info_edge";
export type GulfStreamCircle = "intelligence" | "execution" | "protection";

export interface GulfStreamPosition {
  id: string;
  strategy: GulfStreamStrategy;
  circle: GulfStreamCircle;
  market_id: string;
  market_name: string;
  side: "yes" | "no";
  size_usd: number;
  entry_price: number;
  current_price: number | null;
  kelly_fraction: number;
  phi_at_decision: number;
  status: TradeStatus;
  pnl: number | null;
  reasoning: string;
  created_at: string;
}

export interface GulfStreamJournal {
  id: string;
  position_id: string;
  reasoning: string;
  phi_score: number;
  feeling_note: string | null; // Règle Nerël
  result: string | null;
  lesson_learned: string | null;
  created_at: string;
}

// ── Image Pipeline ──
export type ImageVertical = "restaurant" | "rhum" | "hotel" | "excursion" | "corporate" | "telecom" | "custom";
export type ImageShotType = "lifestyle" | "product" | "testimonial" | "urban" | "event" | "hero" | "detail";

export interface StylePreset {
  id: string;
  name: string;
  camera_base: string;
  realism_guard: string;
  direction_config: Record<ImageShotType, string>;
  palette: { primary: string; secondary: string; accent: string };
  vertical: ImageVertical;
  created_at: string;
}

export interface ImagePipelineJob {
  id: string;
  preset_id: string | null;
  vertical: ImageVertical;
  shot_type: ImageShotType;
  prompt: string;
  style_layers: { camera: string; realism: string; direction: string };
  status: "queued" | "generating" | "review" | "approved" | "failed";
  output_url: string | null;
  cost_usd: number;
  model_used: string;
  prospect_id: string | null;
  created_at: string;
}

// ── Contacts Directory ──
export interface ContactEntry {
  id: string;
  name: string;
  organization: string | null;
  title: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  region: string | null;
  sector: string | null;
  influence_score: number;
  notes: string | null;
  tags: string[];
  source: string | null;
  created_at: string;
  updated_at: string;
}

// ── Bible de Vente ──
export interface BibleChapter {
  id: string;
  number: number;
  title: string;
  content: string;
  category: "psychologie" | "spin" | "objections" | "neuro" | "suntzu" | "biomimetique" | "memorable" | "sectoriel" | "timing" | "closing" | "land_expand";
  word_count: number;
  created_at: string;
}

// ── AI Suggestions ──
export interface AiSuggestion {
  id: string;
  prospect_id: string;
  agent_name: EnfantName | AgentName;
  suggestion_type: "think" | "draft" | "propose" | "score" | "suggest" | "brief";
  content: string;
  priority: MessagePriority;
  acted_on: boolean;
  created_at: string;
}

// ── Intelligence ──
export type IntelDomain = "economique" | "institutionnelle" | "media" | "politique" | "sociale";

export interface IntelEntity {
  id: string;
  domain: IntelDomain;
  name: string;
  type: string | null;
  description: string | null;
  influence_score: number;
  contacts: Array<{ name: string; role: string; email?: string; phone?: string }>;
  relationships: Array<{ entity_id: string; type: string; strength: number }>;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ── Trades (Gulf Stream) ──
export type TradeStatus = "pending" | "active" | "closed" | "killed";
export type EdgeType = "logical_arbitrage" | "market_making" | "narrative" | "calendar" | "correlation";

export interface Trade {
  id: string;
  market_id: string | null;
  market_name: string | null;
  platform: "polymarket" | "kalshi" | "other";
  edge_type: EdgeType | null;
  position_side: "yes" | "no" | null;
  position_size: number | null;
  kelly_fraction: number | null;
  entry_price: number | null;
  entry_time: string | null;
  exit_price: number | null;
  exit_time: string | null;
  pnl: number | null;
  drawdown_pct: number | null;
  phi_score: number | null;
  status: TradeStatus;
  notes: string | null;
  created_at: string;
}

// ── Prompts ──
export type PromptCategory = "image" | "video" | "music" | "text" | "system";

export interface Prompt {
  id: string;
  name: string;
  category: PromptCategory | null;
  template: string;
  variables: Array<{ name: string; type: string; default?: string }>;
  model: string | null;
  project_id: string | null;
  usage_count: number;
  is_master: boolean;
  created_at: string;
  updated_at: string;
}

// ── Lore ──
export type LoreUniverse = "cadifor" | "jurassic_wars" | "eveil" | "toxic" | "lignee";

export interface LoreEntry {
  id: string;
  universe: LoreUniverse;
  title: string;
  content: string | null;
  category: string | null;
  tags: string[];
  word_count: number;
  parent_id: string | null;
  order_index: number;
  created_at: string;
}

// ── Activities ──
export type ActivityType = "prospect" | "invoice" | "video" | "project" | "agent" | "system" | "trade";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  project_id: string | null;
  prospect_id: string | null;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ── Agent Logs ──
export interface AgentLog {
  id: string;
  agent_name: string;
  action: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  model: string | null;
  duration_ms: number | null;
  success: boolean;
  error: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ── Pipeline Stats (view) ──
export interface PipelineStats {
  phase: ProspectPhase;
  count: number;
  total_basket: number;
  weighted_basket: number;
  total_mrr: number;
  avg_score: number;
}

// ── API Keys ──
export interface ApiKeyConfig {
  id: string;
  service: string;
  key_name: string;
  key_value: string;
  is_active: boolean;
  monthly_budget: number;
  monthly_usage: number;
  last_used_at: string | null;
  created_at: string;
}

// ── Eveil Mesures ──
export type MesurePillar = "numerique" | "terre" | "culture" | "jeunesse" | "caraibe";
export type MesureStatus = "planifie" | "en_cours" | "teste" | "deploye";

export interface EveilMesure {
  id: string;
  number: number;
  title: string;
  description: string | null;
  pillar: MesurePillar | null;
  status: MesureStatus;
  progress: number;
  budget_estimate: number | null;
  notes: string | null;
}
