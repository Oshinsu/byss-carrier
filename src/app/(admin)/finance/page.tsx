"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Receipt,
  BarChart3,
  Grid3X3,
  PieChart,
  Waves,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { TabPanel } from "@/components/ui/tab-panel";
import InvoiceModal from "./invoice-modal";

import type { TabId, Invoice } from "@/types/finance";
import { FacturationTab } from "@/components/finance/facturation-tab";
import { MrrTab } from "@/components/finance/mrr-tab";
import { PricingTab } from "@/components/finance/pricing-tab";
import { CoutsTab } from "@/components/finance/couts-tab";
import { GulfstreamTab } from "@/components/finance/gulfstream-tab";
import { EligibilitesTab } from "@/components/finance/eligibilites-tab";

/* ═══════════════════════════════════════════════════════
   FINANCE PAGE — Orchestrator
   ═══════════════════════════════════════════════════════ */

const TABS: { id: string; label: string; icon: typeof Receipt }[] = [
  { id: "facturation", label: "Facturation", icon: Receipt },
  { id: "mrr", label: "MRR & Revenus", icon: BarChart3 },
  { id: "pricing", label: "Pricing Grid", icon: Grid3X3 },
  { id: "couts", label: "Co\u00FBts & Marges", icon: PieChart },
  { id: "gulfstream", label: "Gulf Stream", icon: Waves },
  { id: "eligibilites", label: "\u00C9ligibilit\u00E9s", icon: ShieldCheck },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabId>("facturation");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  /* -- Next invoice number -- */
  const currentYearStr = String(new Date().getFullYear());
  const existingNumbers = invoices
    .map((inv) => {
      const match = inv.invoice_number?.match(/BYSS-\d{4}-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((n) => n > 0);
  const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  const nextInvoiceNumber = `BYSS-${currentYearStr}-${String(nextNum).padStart(3, "0")}`;

  /* -- Refresh invoices -- */
  const refreshInvoices = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("invoices")
      .select("*, prospects(name)")
      .order("issue_date", { ascending: false });
    if (data) setInvoices(data as Invoice[]);
  };

  /* -- Fetch invoices on mount -- */
  useEffect(() => {
    async function fetchInvoices() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*, prospects(name)")
          .order("issue_date", { ascending: false });
        if (error) throw error;
        if (data) setInvoices(data as Invoice[]);
      } catch (err) {
        console.error("Invoice fetch error:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement des factures.");
      } finally {
        setLoadingInvoices(false);
      }
    }
    fetchInvoices();
  }, []);

  /* -- Facturation KPIs -- */
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentYear = String(now.getFullYear());
  const quarterMonths = [0, 1, 2].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const paid = (inv: Invoice) => inv.status === "Pay\u00E9e";
  const caMois = invoices.filter((inv) => inv.issue_date?.startsWith(currentMonth) && paid(inv)).reduce((s, inv) => s + (inv.amount_ht || 0), 0);
  const caTrimestre = invoices.filter((inv) => quarterMonths.some((m) => inv.issue_date?.startsWith(m)) && paid(inv)).reduce((s, inv) => s + (inv.amount_ht || 0), 0);
  const caAnnee = invoices.filter((inv) => inv.issue_date?.startsWith(currentYear) && paid(inv)).reduce((s, inv) => s + (inv.amount_ht || 0), 0);
  const totalImpaye = invoices.filter((inv) => inv.status === "Impay\u00E9e").reduce((s, inv) => s + (inv.amount_ht || 0), 0);

  /* -- Render active tab content -- */
  function renderTab() {
    switch (activeTab) {
      case "facturation":
        return (
          <>
            <FacturationTab
              invoices={invoices}
              loading={loadingInvoices}
              caMois={caMois}
              caTrimestre={caTrimestre}
              caAnnee={caAnnee}
              totalImpaye={totalImpaye}
              onNewInvoice={() => setInvoiceModalOpen(true)}
              onRefresh={refreshInvoices}
            />
            <InvoiceModal
              open={invoiceModalOpen}
              onClose={() => setInvoiceModalOpen(false)}
              onCreated={refreshInvoices}
              nextInvoiceNumber={nextInvoiceNumber}
            />
          </>
        );
      case "mrr":
        return <MrrTab />;
      case "pricing":
        return <PricingTab />;
      case "couts":
        return <CoutsTab />;
      case "gulfstream":
        return <GulfstreamTab />;
      case "eligibilites":
        return <EligibilitesTab />;
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <PageHeader title="Finance" />
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="mx-6 mt-4 flex items-center gap-3 rounded-xl border px-5 py-4"
          style={{ borderColor: "rgba(255,45,45,0.2)", background: "rgba(255,45,45,0.05)" }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D2D" }} />
          <p className="flex-1 text-sm" style={{ color: "#FF6B6B" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* Tab bar + content */}
      <TabPanel
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
        className="flex-1"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </TabPanel>
    </div>
  );
}
