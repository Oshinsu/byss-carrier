/* ═══════════════════════════════════════════════════════
   FINANCE TYPES
   ═══════════════════════════════════════════════════════ */

export type TabId =
  | "facturation"
  | "mrr"
  | "pricing"
  | "couts"
  | "gulfstream"
  | "eligibilites";

export interface InvoiceLineItemStored {
  description: string;
  quantity: number;
  unit_price_ht: number;
  tva_rate: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  prospect_id: string | null;
  description: string;
  issue_date: string;
  due_date: string;
  amount_ht: number;
  tva_rate: number;
  status: string;
  type: string;
  prospects?: { name: string } | null;
  line_items?: InvoiceLineItemStored[];
  is_micro?: boolean;
  payment_terms?: string;
  total_tva?: number;
  total_ttc?: number;
}

export interface EligibiliteItem {
  label: string;
  description: string;
  steps: string[];
  checked: boolean;
}

export interface PricingItem {
  tier: string;
  desc: string;
  prix: string;
  accent: boolean;
}

export interface CostItem {
  cat: string;
  mensuel: number;
  notes: string;
}

export interface MarginItem {
  label: string;
  cost: string;
  price: string;
  margin: number;
  color: string;
}

export interface RevenueLine {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  unitPrice: string;
  clients: number;
  mrrTotal: number;
  annual: number;
  color: string;
}

export interface MrrDataPoint {
  month: string;
  value: number;
}

/* Helper */
export function eur(n: number) {
  return n.toLocaleString("fr-FR") + "\u20AC";
}
