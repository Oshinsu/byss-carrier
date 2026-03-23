import Stripe from "stripe";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Stripe Integration
// Invoices, subscriptions, payments for Orion SaaS
// ═══════════════════════════════════════════════════════

// ── Orion Pricing ──
export const ORION_PRICING = {
  starter: {
    name: "Orion Starter",
    priceHt: 99,
    currency: "eur",
    interval: "month" as const,
    description: "CRM IA de base. 1 utilisateur. 500 contacts.",
  },
  pro: {
    name: "Orion Pro",
    priceHt: 249,
    currency: "eur",
    interval: "month" as const,
    description: "CRM IA avancé. 5 utilisateurs. 5 000 contacts. Automatisations.",
  },
  enterprise: {
    name: "Orion Enterprise",
    priceHt: 449,
    currency: "eur",
    interval: "month" as const,
    description: "CRM IA complet. Utilisateurs illimités. API. Support prioritaire.",
  },
  institutional: {
    name: "Orion Institutional",
    priceHt: 10000,
    currency: "eur",
    interval: "year" as const,
    description: "Déploiement institutionnel. Sur-mesure. Formation. SLA garanti.",
  },
} as const;

export type OrionTier = keyof typeof ORION_PRICING;

// ── Stripe client (graceful degradation) ──
let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY non configurée. Ajoutez-la dans .env.local"
    );
  }

  stripeClient = new Stripe(key, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// ── Invoice ──
export async function createInvoice(params: {
  prospectName: string;
  amountHt: number;
  vatRate?: number;
  dueDate?: Date;
  description?: string;
}): Promise<Stripe.Invoice> {
  const stripe = getStripe();
  const { prospectName, amountHt, vatRate = 20, dueDate, description } = params;

  // Create or find customer
  const customers = await stripe.customers.list({
    limit: 1,
    email: undefined,
  });

  let customer: Stripe.Customer;
  const existing = customers.data.find((c) => c.name === prospectName);

  if (existing) {
    customer = existing;
  } else {
    customer = await stripe.customers.create({
      name: prospectName,
      metadata: { source: "byss-carrier" },
    });
  }

  // Create invoice
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: "send_invoice",
    due_date: dueDate
      ? Math.floor(dueDate.getTime() / 1000)
      : Math.floor(Date.now() / 1000) + 30 * 86400,
    metadata: { source: "byss-carrier", prospect: prospectName },
  });

  // Add line item with tax
  const amountCents = Math.round(amountHt * 100);
  const taxAmount = Math.round(amountCents * (vatRate / 100));

  await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: invoice.id!,
    amount: amountCents + taxAmount,
    currency: "eur",
    description:
      description || `Prestation BYSS GROUP — ${prospectName} (HT: ${amountHt}€ + TVA ${vatRate}%)`,
  });

  return invoice;
}

// ── Subscription (Orion SaaS) ──
export async function createSubscription(params: {
  prospectEmail: string;
  priceId: string;
  prospectName?: string;
}): Promise<Stripe.Subscription> {
  const stripe = getStripe();
  const { prospectEmail, priceId, prospectName } = params;

  // Find or create customer
  const customers = await stripe.customers.list({
    email: prospectEmail,
    limit: 1,
  });

  let customer: Stripe.Customer;

  if (customers.data.length > 0) {
    customer = customers.data[0];
  } else {
    customer = await stripe.customers.create({
      email: prospectEmail,
      name: prospectName,
      metadata: { source: "byss-carrier", product: "orion" },
    });
  }

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    metadata: { source: "byss-carrier", product: "orion" },
  });

  return subscription;
}

// ── Balance ──
export async function getBalance(): Promise<{
  available: number;
  pending: number;
  currency: string;
}> {
  const stripe = getStripe();
  const balance = await stripe.balance.retrieve();

  const available = balance.available.find((b) => b.currency === "eur");
  const pending = balance.pending.find((b) => b.currency === "eur");

  return {
    available: (available?.amount || 0) / 100,
    pending: (pending?.amount || 0) / 100,
    currency: "eur",
  };
}

// ── Recent Payments ──
export interface PaymentSummary {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerName: string | null;
  description: string | null;
  created: string;
}

export async function getRecentPayments(
  limit = 10
): Promise<PaymentSummary[]> {
  const stripe = getStripe();
  const charges = await stripe.charges.list({
    limit,
    expand: ["data.customer"],
  });

  return charges.data.map((charge) => ({
    id: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency,
    status: charge.status,
    customerName:
      typeof charge.customer === "object" && charge.customer
        ? (charge.customer as Stripe.Customer).name ?? null
        : null,
    description: charge.description,
    created: new Date(charge.created * 1000).toISOString(),
  }));
}

// ── Products ──
export async function listProducts(): Promise<
  { id: string; name: string; active: boolean; prices: { id: string; amount: number; interval: string | null }[] }[]
> {
  const stripe = getStripe();
  const products = await stripe.products.list({
    active: true,
    limit: 20,
    expand: ["data.default_price"],
  });

  return Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });
      return {
        id: product.id,
        name: product.name,
        active: product.active,
        prices: prices.data.map((p) => ({
          id: p.id,
          amount: (p.unit_amount || 0) / 100,
          interval: p.recurring?.interval || null,
        })),
      };
    })
  );
}
