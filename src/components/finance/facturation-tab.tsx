"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Receipt,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Plus,
  Send,
  Download,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { onInvoicePaid } from "@/lib/synergies";
import { useToast } from "@/hooks/use-toast";
import type { Invoice } from "@/types/finance";
import { eur } from "@/types/finance";

/* ═══════════════════════════════════════════════════════
   FACTURATION TAB — Invoice list, KPIs, actions
   ═══════════════════════════════════════════════════════ */

const statutColors: Record<string, { bg: string; text: string }> = {
  "Pay\u00E9e": {
    bg: "bg-[oklch(0.72_0.19_155/0.15)]",
    text: "text-[var(--color-green)]",
  },
  "Envoy\u00E9e": {
    bg: "bg-[oklch(0.65_0.15_250/0.15)]",
    text: "text-[var(--color-blue)]",
  },
  Brouillon: {
    bg: "bg-[oklch(0.60_0.02_270/0.15)]",
    text: "text-[var(--color-text-muted)]",
  },
  "Impay\u00E9e": {
    bg: "bg-[oklch(0.60_0.20_15/0.15)]",
    text: "text-[var(--color-fire)]",
  },
};

interface FacturationTabProps {
  invoices: Invoice[];
  loading: boolean;
  caMois: number;
  caTrimestre: number;
  caAnnee: number;
  totalImpaye: number;
  onNewInvoice: () => void;
  onRefresh: () => void;
}

export function FacturationTab({
  invoices,
  loading,
  caMois,
  caTrimestre,
  caAnnee,
  totalImpaye,
  onNewInvoice,
  onRefresh,
}: FacturationTabProps) {
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const { toast } = useToast();

  async function updateStatus(id: string, newStatus: string) {
    setActionLoading((prev) => ({ ...prev, [id]: newStatus }));
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;

      // Synergy: invoice paid → notification
      if (newStatus === "Payée") {
        const inv = invoices.find((i) => i.id === id);
        if (inv) {
          onInvoicePaid(id, inv.prospects?.name || inv.description || "Client", inv.amount_ht || 0);
        }
      }

      toast(`Facture → ${newStatus}`, "success");
      onRefresh();
    } catch (err) {
      console.error("Status update error:", err);
      toast("Erreur mise a jour statut", "error");
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  }

  async function downloadPDF(inv: Invoice) {
    setActionLoading((prev) => ({ ...prev, [inv.id]: "pdf" }));
    try {
      const clientName = inv.prospects?.name || "Client";
      const lineItems = inv.line_items?.length
        ? inv.line_items
        : [
            {
              description: inv.description || "Prestation",
              quantity: 1,
              unit_price_ht: inv.amount_ht || 0,
              tva_rate: inv.tva_rate || 0,
            },
          ];

      const isMicro =
        inv.is_micro !== undefined ? inv.is_micro : inv.tva_rate === 0;

      const res = await fetch("/api/invoice-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_number: inv.invoice_number,
          issue_date: inv.issue_date,
          due_date: inv.due_date,
          client_name: clientName,
          line_items: lineItems,
          is_micro: isMicro,
          payment_terms: inv.payment_terms || "",
        }),
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-${inv.invoice_number.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast(`PDF ${inv.invoice_number} telecharge`, "success");
    } catch (err) {
      console.error("PDF download error:", err);
      toast("Erreur generation PDF", "error");
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[inv.id];
        return copy;
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "CA Factur\u00E9 (ce mois)", value: caMois, icon: Receipt, color: "var(--color-gold)" },
          { label: "CA Factur\u00E9 (trimestre)", value: caTrimestre, icon: TrendingUp, color: "var(--color-green)" },
          { label: "CA Factur\u00E9 (ann\u00E9e)", value: caAnnee, icon: ArrowUpRight, color: "var(--color-blue)" },
          { label: "Factures Impay\u00E9es", value: totalImpaye, icon: AlertTriangle, color: totalImpaye > 0 ? "var(--color-fire)" : "var(--color-green)", alert: totalImpaye > 0 },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "rounded-xl border bg-[var(--color-surface)] p-4",
                kpi.alert
                  ? "border-[var(--color-fire)] shadow-[0_0_20px_oklch(0.60_0.20_15/0.15)]"
                  : "border-[var(--color-border-subtle)]"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: kpi.color }} />
                <span className="text-xs text-[var(--color-text-muted)]">{kpi.label}</span>
              </div>
              {loading ? (
                <div className="h-7 w-20 animate-pulse rounded bg-[var(--color-surface-2)]" />
              ) : (
                <p className="font-[family-name:var(--font-display)] text-xl font-bold" style={{ color: kpi.color }}>
                  {eur(kpi.value)}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Invoice Table */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
          <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            Factures
          </h2>
          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 rounded-lg bg-[#00B4D8] px-3 py-1.5 text-xs font-medium text-[#0A0A14] transition-all hover:bg-[#48CAE4] hover:shadow-[0_0_16px_oklch(0.65_0.15_220/0.3)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle Facture
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                {["N\u00B0", "Client", "Description", "Date", "Montant HT", "TTC", "Type", "Statut", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-2)]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-xs text-[var(--color-text-muted)]">
                    Zero facture. Le premier client paie la fondation.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const ttc = (inv.amount_ht || 0) * (1 + (inv.tva_rate || 0));
                  const colors = statutColors[inv.status] || statutColors["Brouillon"];
                  const clientName = inv.prospects?.name || "\u2014";
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-[var(--color-border-subtle)] transition-colors last:border-0 hover:bg-[var(--color-surface-2)]"
                    >
                      <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-gold)]">
                        {inv.invoice_number}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-[var(--color-text)]">
                        {clientName}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-xs text-[var(--color-text-muted)]">
                        {inv.description}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                        {inv.issue_date}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-[var(--color-text)]">
                        {eur(inv.amount_ht || 0)}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-[var(--color-text)]">
                        {eur(Math.round(ttc))}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                            inv.type === "MRR"
                              ? "bg-[oklch(0.75_0.12_85/0.12)] text-[var(--color-gold)]"
                              : "bg-[oklch(0.65_0.15_250/0.12)] text-[var(--color-blue)]"
                          )}
                        >
                          {inv.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                            colors.bg,
                            colors.text
                          )}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {inv.status === "Brouillon" && (
                            <button
                              onClick={() => updateStatus(inv.id, "Envoy\u00E9e")}
                              disabled={!!actionLoading[inv.id]}
                              title="Marquer comme envoy\u00E9e"
                              className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[#00B4D8]/10 hover:text-[#00B4D8] disabled:opacity-40"
                            >
                              {actionLoading[inv.id] === "Envoy\u00E9e" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                          {(inv.status === "Envoy\u00E9e" || inv.status === "Impay\u00E9e") && (
                            <button
                              onClick={() => updateStatus(inv.id, "Pay\u00E9e")}
                              disabled={!!actionLoading[inv.id]}
                              title="Marquer comme pay\u00E9e"
                              className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-green-500/10 hover:text-green-400 disabled:opacity-40"
                            >
                              {actionLoading[inv.id] === "Pay\u00E9e" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => downloadPDF(inv)}
                            disabled={!!actionLoading[inv.id]}
                            title="T\u00E9l\u00E9charger PDF"
                            className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[#00B4D8]/10 hover:text-[#00B4D8] disabled:opacity-40"
                          >
                            {actionLoading[inv.id] === "pdf" ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
