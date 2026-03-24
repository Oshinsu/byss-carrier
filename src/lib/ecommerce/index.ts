// ═══════════════════════════════════════════════════════
// E-COMMERCE ENGINE — Market Analysis + Store Builder
// 50 stores. 7 markets. CJDropshipping + TikTok Ads.
// ═══════════════════════════════════════════════════════

/* ── Target Markets ─────────────────────────────────── */

export const TARGET_MARKETS = [
  { id: "ph", name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", currency: "PHP", avgOrderValue: 15, adCostPer1000: 2, lang: "en/tl" },
  { id: "vn", name: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}", currency: "VND", avgOrderValue: 12, adCostPer1000: 1.5, lang: "vi" },
  { id: "ma", name: "Maroc", flag: "\u{1F1F2}\u{1F1E6}", currency: "MAD", avgOrderValue: 20, adCostPer1000: 3, lang: "fr/ar" },
  { id: "co", name: "Colombie", flag: "\u{1F1E8}\u{1F1F4}", currency: "COP", avgOrderValue: 18, adCostPer1000: 2.5, lang: "es" },
  { id: "fr", name: "France", flag: "\u{1F1EB}\u{1F1F7}", currency: "EUR", avgOrderValue: 45, adCostPer1000: 8, lang: "fr" },
  { id: "mq", name: "Martinique", flag: "\u{1F1F2}\u{1F1F6}", currency: "EUR", avgOrderValue: 40, adCostPer1000: 6, lang: "fr" },
] as const;

export type MarketId = (typeof TARGET_MARKETS)[number]["id"];

/* ── Niches ─────────────────────────────────────────── */

export const NICHES = [
  "Beauty & Skincare",
  "Pet Accessories",
  "Home & Kitchen",
  "Fitness",
  "Tech Gadgets",
  "Baby Products",
  "Outdoor",
  "Fashion Accessories",
  "Health & Wellness",
  "Car Accessories",
  "Gaming",
  "Eco-Friendly",
] as const;

export type Niche = (typeof NICHES)[number];

/* ── Store Statuses ─────────────────────────────────── */

export const STORE_STATUSES = [
  { id: "research", label: "Recherche", color: "#6B7280", bg: "bg-gray-500/15" },
  { id: "planning", label: "Planification", color: "#3B82F6", bg: "bg-blue-500/15" },
  { id: "building", label: "Construction", color: "#8B5CF6", bg: "bg-purple-500/15" },
  { id: "testing", label: "Test Ads", color: "#F59E0B", bg: "bg-amber-500/15" },
  { id: "live", label: "En ligne", color: "#10B981", bg: "bg-emerald-500/15" },
  { id: "scaling", label: "Scaling", color: "#00D4FF", bg: "bg-cyan-500/15" },
  { id: "paused", label: "Pause", color: "#EF4444", bg: "bg-red-500/15" },
] as const;

export type StoreStatusId = (typeof STORE_STATUSES)[number]["id"];

/* ── Interfaces ─────────────────────────────────────── */

export interface ProductIdea {
  id: string;
  name: string;
  cost: number;
  sellingPrice: number;
  margin: number;
  source: string;
  marketingAngle: string;
  selected?: boolean;
}

export interface MarketAnalysis {
  niche: string;
  country: string;
  marketSize: string;
  competitionLevel: "blue_ocean" | "moderate" | "saturated";
  trendingProducts: string[];
  recommendedPlatforms: string[];
  estimatedMargins: string;
  adStrategy: string;
  startupCost: string;
  score: number;
  timestamp: string;
}

export interface StorePlan {
  storeNames: string[];
  selectedName?: string;
  brandIdentity: {
    colors: string[];
    tone: string;
    targetAudience: string;
  };
  pages: string[];
  homepageStructure: string[];
  adCreativesBrief: string;
  launchTimeline: { day: number; task: string }[];
  budgetAllocation: { category: string; amount: number; percentage: number }[];
}

export interface CompetitorAnalysis {
  url: string;
  strengths: string[];
  weaknesses: string[];
  pricingStrategy: string;
  trafficEstimate: string;
  opportunities: string[];
  timestamp: string;
}

export interface StoreProject {
  id: string;
  name: string;
  niche: string;
  country: string;
  status: StoreStatusId;
  products: ProductIdea[];
  revenue: number;
  adSpend: number;
  profit: number;
  url?: string;
  plan?: StorePlan;
  createdAt: string;
  updatedAt: string;
}

/* ── localStorage Keys ──────────────────────────────── */

export const ECOM_STORAGE = {
  ANALYSES: "byss-ecom-analyses",
  PRODUCTS: "byss-ecom-products",
  STORES: "byss-ecom-stores",
  SELECTED_PRODUCTS: "byss-ecom-selected-products",
} as const;

/* ── Helpers ─────────────────────────────────────────── */

export function getMarketById(id: string) {
  return TARGET_MARKETS.find((m) => m.id === id);
}

export function getStatusConfig(id: string) {
  return STORE_STATUSES.find((s) => s.id === id) ?? STORE_STATUSES[0];
}

export function calculateMargin(cost: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0;
  return Math.round(((sellingPrice - cost) / sellingPrice) * 100);
}

export function generateStoreId(): string {
  return `store_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Compute aggregate KPIs from a list of stores. */
export function computeKPIs(stores: StoreProject[]) {
  const totalStores = stores.length;
  const liveStores = stores.filter((s) => s.status === "live" || s.status === "scaling").length;
  const totalRevenue = stores.reduce((acc, s) => acc + s.revenue, 0);
  const totalAdSpend = stores.reduce((acc, s) => acc + s.adSpend, 0);
  const totalProfit = stores.reduce((acc, s) => acc + s.profit, 0);
  const bestPerformer = stores.length > 0
    ? stores.reduce((best, s) => (s.profit > best.profit ? s : best), stores[0])
    : null;
  const totalProducts = stores.reduce((acc, s) => acc + s.products.length, 0);

  return { totalStores, liveStores, totalRevenue, totalAdSpend, totalProfit, bestPerformer, totalProducts };
}

/** Competition level label + color */
export function competitionConfig(level: MarketAnalysis["competitionLevel"]) {
  const map = {
    blue_ocean: { label: "Blue Ocean", color: "#00D4FF", bg: "bg-cyan-500/15" },
    moderate: { label: "Modere", color: "#F59E0B", bg: "bg-amber-500/15" },
    saturated: { label: "Sature", color: "#EF4444", bg: "bg-red-500/15" },
  };
  return map[level];
}
