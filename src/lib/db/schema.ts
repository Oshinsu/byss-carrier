import {
  pgTable, uuid, text, integer, numeric, date, timestamp,
  boolean, jsonb, index, check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ═══════════════════════════════════════════════
// BYSS GROUP — Database Schema (14 tables)
// Supabase PostgreSQL + Drizzle ORM
// ═══════════════════════════════════════════════

// 1. PROSPECTS
export const prospects = pgTable("prospects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sector: text("sector"),
  phase: text("phase").default("prospect").notNull(),
  score: integer("score").default(1),
  probability: integer("probability").default(0),
  estimatedBasket: numeric("estimated_basket", { precision: 12, scale: 2 }).default("0"),
  keyContact: text("key_contact"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  lastContact: date("last_contact"),
  nextAction: text("next_action"),
  followupDate: date("followup_date"),
  optionChosen: text("option_chosen"),
  services: text("services").array(),
  mrr: numeric("mrr", { precision: 10, scale: 2 }).default("0"),
  memorablePhrase: text("memorable_phrase"),
  painPoints: text("pain_points"),
  notes: text("notes"),
  aiScore: text("ai_score"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_prospects_phase").on(t.phase),
  index("idx_prospects_followup").on(t.followupDate),
]);

// 2. INTERACTIONS
export const interactions = pgTable("interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id").references(() => prospects.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  subject: text("subject"),
  content: text("content"),
  direction: text("direction").default("outbound"),
  channel: text("channel"),
  createdBy: text("created_by").default("gary"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_interactions_prospect").on(t.prospectId),
]);

// 3. INVOICES
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: text("number").unique().notNull(),
  prospectId: uuid("prospect_id").references(() => prospects.id),
  type: text("type").default("projet"),
  issueDate: date("issue_date").default(sql`CURRENT_DATE`),
  dueDate: date("due_date"),
  amountHt: numeric("amount_ht", { precision: 12, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 4, scale: 2 }).default("8.5"),
  status: text("status").default("draft"),
  paymentDate: date("payment_date"),
  notes: text("notes"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_invoices_status").on(t.status),
]);

// 4. PROJECTS
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  status: text("status").default("active"),
  externalUrl: text("external_url"),
  icon: text("icon"),
  color: text("color"),
  orderIndex: integer("order_index"),
  isPublic: boolean("is_public").default(true),
  isVisible: boolean("is_visible").default(true),
  budgetMonthly: numeric("budget_monthly", { precision: 10, scale: 2 }).default("0"),
  githubRepo: text("github_repo"),
  techStack: text("tech_stack").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 5. VIDEOS
export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id").references(() => prospects.id),
  projectId: uuid("project_id").references(() => projects.id),
  title: text("title"),
  brief: text("brief"),
  prompt: text("prompt"),
  duration: integer("duration"),
  format: text("format"),
  resolution: text("resolution").default("1080p"),
  tier: text("tier"),
  status: text("status").default("draft"),
  orderDate: date("order_date"),
  deliveryDate: date("delivery_date"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  apiProvider: text("api_provider").default("kling"),
  apiCost: numeric("api_cost", { precision: 8, scale: 4 }).default("0"),
  billedPrice: numeric("billed_price", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 6. ACTIVITIES
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  projectId: uuid("project_id").references(() => projects.id),
  prospectId: uuid("prospect_id").references(() => prospects.id),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_activities_created").on(t.createdAt),
]);

// 7. AI CONVERSATIONS
export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentName: text("agent_name").notNull(),
  sessionId: text("session_id"),
  messages: jsonb("messages").default(sql`'[]'::jsonb`),
  context: jsonb("context").default(sql`'{}'::jsonb`),
  phiScore: numeric("phi_score", { precision: 6, scale: 4 }),
  phase: text("phase"),
  tokenCount: integer("token_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 8. INTELLIGENCE
export const intelEntities = pgTable("intel_entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  domain: text("domain").notNull(),
  name: text("name").notNull(),
  type: text("type"),
  description: text("description"),
  influenceScore: integer("influence_score").default(0),
  contacts: jsonb("contacts").default(sql`'[]'::jsonb`),
  relationships: jsonb("relationships").default(sql`'[]'::jsonb`),
  notes: text("notes"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_intel_domain").on(t.domain),
]);

// 9. TRADES (Gulf Stream)
export const trades = pgTable("trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketId: text("market_id"),
  marketName: text("market_name"),
  platform: text("platform").default("polymarket"),
  edgeType: text("edge_type"),
  positionSide: text("position_side"),
  positionSize: numeric("position_size", { precision: 12, scale: 2 }),
  kellyFraction: numeric("kelly_fraction", { precision: 6, scale: 4 }),
  entryPrice: numeric("entry_price", { precision: 10, scale: 4 }),
  entryTime: timestamp("entry_time", { withTimezone: true }),
  exitPrice: numeric("exit_price", { precision: 10, scale: 4 }),
  exitTime: timestamp("exit_time", { withTimezone: true }),
  pnl: numeric("pnl", { precision: 12, scale: 2 }),
  drawdownPct: numeric("drawdown_pct", { precision: 6, scale: 2 }),
  phiScore: numeric("phi_score", { precision: 6, scale: 4 }),
  status: text("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 10. PROMPTS
export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category"),
  template: text("template").notNull(),
  variables: jsonb("variables").default(sql`'[]'::jsonb`),
  model: text("model"),
  projectId: uuid("project_id").references(() => projects.id),
  usageCount: integer("usage_count").default(0),
  isMaster: boolean("is_master").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 11. LORE
export const loreEntries = pgTable("lore_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  universe: text("universe").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  category: text("category"),
  tags: text("tags").array(),
  wordCount: integer("word_count").default(0),
  parentId: uuid("parent_id"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_lore_universe").on(t.universe),
]);

// 12. EVEIL MESURES
export const eveilMesures = pgTable("eveil_mesures", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: integer("number").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  pillar: text("pillar"),
  status: text("status").default("planifie"),
  progress: integer("progress").default(0),
  budgetEstimate: numeric("budget_estimate", { precision: 12, scale: 2 }),
  notes: text("notes"),
});

// 13. API KEYS
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  service: text("service").notNull(),
  keyName: text("key_name").notNull(),
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  monthlyBudget: numeric("monthly_budget", { precision: 10, scale: 2 }),
  monthlyUsage: numeric("monthly_usage", { precision: 10, scale: 2 }).default("0"),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 14. AGENT LOGS
export const agentLogs = pgTable("agent_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentName: text("agent_name").notNull(),
  action: text("action").notNull(),
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  costUsd: numeric("cost_usd", { precision: 8, scale: 4 }).default("0"),
  model: text("model"),
  durationMs: integer("duration_ms"),
  success: boolean("success").default(true),
  error: text("error"),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("idx_agent_logs_agent").on(t.agentName),
  index("idx_agent_logs_created").on(t.createdAt),
]);

// ═══════════════════════════════════════════════
// Type exports
// ═══════════════════════════════════════════════
export type Prospect = typeof prospects.$inferSelect;
export type NewProspect = typeof prospects.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type AiConversation = typeof aiConversations.$inferSelect;
export type IntelEntity = typeof intelEntities.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
export type LoreEntry = typeof loreEntries.$inferSelect;
export type EveilMesure = typeof eveilMesures.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type AgentLog = typeof agentLogs.$inferSelect;
