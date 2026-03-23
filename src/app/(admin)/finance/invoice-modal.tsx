"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Invoice Creation Modal
   French-compliant, auto-calc HT/TVA/TTC
   ═══════════════════════════════════════════════════════ */

interface Prospect {
  id: string;
  name: string;
  email?: string;
  company?: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price_ht: number;
  tva_rate: number;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  nextInvoiceNumber: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyLine(): LineItem {
  return {
    id: generateId(),
    description: "",
    quantity: 1,
    unit_price_ht: 0,
    tva_rate: 0, // 0 = micro, 0.085 = DOM, 0.20 = metropole
  };
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function InvoiceModal({
  open,
  onClose,
  onCreated,
  nextInvoiceNumber,
}: InvoiceModalProps) {
  const { toast } = useToast();
  // Form state
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [selectedProspect, setSelectedProspect] = useState("");
  const [description, setDescription] = useState("");
  const [issueDate, setIssueDate] = useState(formatDate(new Date()));
  const [dueDate, setDueDate] = useState(
    formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  );
  const [invoiceType, setInvoiceType] = useState<"Ponctuelle" | "MRR">(
    "Ponctuelle"
  );
  const [isMicro, setIsMicro] = useState(true);
  const [paymentTerms, setPaymentTerms] = useState(
    "Paiement par virement bancaire sous 30 jours."
  );
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch prospects
  useEffect(() => {
    if (!open) return;
    async function fetchProspects() {
      const supabase = createClient();
      const { data } = await supabase
        .from("prospects")
        .select("id, name, email, company")
        .order("name");
      if (data) setProspects(data as Prospect[]);
    }
    fetchProspects();
  }, [open]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedProspect("");
      setDescription("");
      setIssueDate(formatDate(new Date()));
      setDueDate(
        formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      );
      setInvoiceType("Ponctuelle");
      setIsMicro(true);
      setPaymentTerms("Paiement par virement bancaire sous 30 jours.");
      setLines([emptyLine()]);
      setError("");
    }
  }, [open]);

  // Calculations
  const totalHT = lines.reduce(
    (sum, l) => sum + l.quantity * l.unit_price_ht,
    0
  );
  const totalTVA = isMicro
    ? 0
    : lines.reduce(
        (sum, l) => sum + l.quantity * l.unit_price_ht * l.tva_rate,
        0
      );
  const totalTTC = totalHT + totalTVA;

  // Line item handlers
  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (id: string) =>
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  const updateLine = (id: string, field: keyof LineItem, value: string | number) =>
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );

  // Submit
  async function handleSubmit() {
    setError("");

    if (!selectedProspect) {
      setError("Sélectionnez un client.");
      return;
    }
    if (!description.trim()) {
      setError("Ajoutez une description.");
      return;
    }
    if (lines.some((l) => !l.description.trim() || l.unit_price_ht <= 0)) {
      setError(
        "Chaque ligne doit avoir une description et un prix unitaire > 0."
      );
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      // Determine the effective TVA rate (use first line's rate for the invoice-level field)
      const effectiveTvaRate = isMicro ? 0 : lines[0]?.tva_rate || 0;

      // Insert invoice
      const { error: insertError } = await supabase.from("invoices").insert({
        invoice_number: nextInvoiceNumber,
        prospect_id: selectedProspect,
        description,
        issue_date: issueDate,
        due_date: dueDate,
        amount_ht: totalHT,
        tva_rate: effectiveTvaRate,
        status: "Brouillon",
        type: invoiceType,
        line_items: lines.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unit_price_ht: l.unit_price_ht,
          tva_rate: isMicro ? 0 : l.tva_rate,
        })),
        is_micro: isMicro,
        payment_terms: paymentTerms,
        total_tva: totalTVA,
        total_ttc: totalTTC,
      });

      if (insertError) throw insertError;

      toast("Facture creee — " + nextInvoiceNumber, "success");
      onCreated();
      onClose();
    } catch (err) {
      console.error("Invoice creation error:", err);
      toast("Erreur creation facture", "error");
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la facture."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function eur(n: number) {
    return n.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm pt-10 pb-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="relative w-full max-w-3xl rounded-2xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00B4D8]/15">
                  <FileText className="h-4 w-4 text-[#00B4D8]" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)]">
                    Nouvelle Facture
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {nextInvoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
              {/* Row 1: Client + Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Client
                  </label>
                  <select
                    value={selectedProspect}
                    onChange={(e) => setSelectedProspect(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none transition-colors focus:border-[#00B4D8]"
                  >
                    <option value="">Sélectionner un client...</option>
                    {prospects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {p.company ? ` — ${p.company}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Développement site web, Pack vidéo..."
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)]/50 focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              {/* Row 2: Dates + Type + Micro */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Date d&apos;emission
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Echeance
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Type
                  </label>
                  <select
                    value={invoiceType}
                    onChange={(e) =>
                      setInvoiceType(e.target.value as "Ponctuelle" | "MRR")
                    }
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none focus:border-[#00B4D8]"
                  >
                    <option value="Ponctuelle">Ponctuelle</option>
                    <option value="MRR">MRR</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Regime TVA
                  </label>
                  <select
                    value={isMicro ? "micro" : "tva"}
                    onChange={(e) => setIsMicro(e.target.value === "micro")}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none focus:border-[#00B4D8]"
                  >
                    <option value="micro">
                      Micro (art. 293 B CGI)
                    </option>
                    <option value="tva">Assujetti TVA</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Lignes de facturation
                  </label>
                  <button
                    onClick={addLine}
                    className="flex items-center gap-1 rounded-md bg-[#00B4D8]/15 px-2 py-1 text-[10px] font-medium text-[#00B4D8] transition-colors hover:bg-[#00B4D8]/25"
                  >
                    <Plus className="h-3 w-3" />
                    Ajouter ligne
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 px-1">
                    <span className="col-span-5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Description
                    </span>
                    <span className="col-span-1 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Qte
                    </span>
                    <span className="col-span-2 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      P.U. HT
                    </span>
                    <span className="col-span-2 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      TVA
                    </span>
                    <span className="col-span-1 text-right text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Total
                    </span>
                    <span className="col-span-1" />
                  </div>

                  {/* Lines */}
                  {lines.map((line) => {
                    const lineTotal = line.quantity * line.unit_price_ht;
                    return (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-12 items-center gap-2"
                      >
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) =>
                            updateLine(line.id, "description", e.target.value)
                          }
                          placeholder="Description..."
                          className="col-span-5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2.5 py-2 text-xs text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]/40 focus:border-[#00B4D8]"
                        />
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(
                              line.id,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="col-span-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2 py-2 text-center text-xs text-[var(--color-text)] outline-none focus:border-[#00B4D8]"
                        />
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={line.unit_price_ht || ""}
                          onChange={(e) =>
                            updateLine(
                              line.id,
                              "unit_price_ht",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0,00"
                          className="col-span-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2.5 py-2 text-xs text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]/40 focus:border-[#00B4D8]"
                        />
                        <select
                          value={line.tva_rate}
                          onChange={(e) =>
                            updateLine(
                              line.id,
                              "tva_rate",
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={isMicro}
                          className={cn(
                            "col-span-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2 py-2 text-xs outline-none focus:border-[#00B4D8]",
                            isMicro
                              ? "text-[var(--color-text-muted)]/50"
                              : "text-[var(--color-text)]"
                          )}
                        >
                          <option value={0}>0%</option>
                          <option value={0.085}>8,5% (DOM)</option>
                          <option value={0.2}>20%</option>
                        </select>
                        <span className="col-span-1 text-right font-[family-name:var(--font-mono)] text-xs font-medium text-[#00B4D8]">
                          {eur(lineTotal)}
                        </span>
                        <button
                          onClick={() => removeLine(line.id)}
                          disabled={lines.length <= 1}
                          className={cn(
                            "col-span-1 flex justify-center rounded-lg p-1.5 transition-colors",
                            lines.length <= 1
                              ? "cursor-not-allowed text-[var(--color-text-muted)]/30"
                              : "text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400"
                          )}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-muted)]">
                      Total HT
                    </span>
                    <span className="font-medium text-[var(--color-text)]">
                      {eur(totalHT)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-muted)]">TVA</span>
                    <span className="font-medium text-[var(--color-text)]">
                      {isMicro ? "N/A (art. 293 B)" : eur(totalTVA)}
                    </span>
                  </div>
                  <div className="border-t border-[var(--color-border-subtle)] pt-1.5">
                    <div className="flex justify-between">
                      <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[#00B4D8]">
                        Total TTC
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[#00B4D8]">
                        {eur(totalTTC)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment terms */}
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Conditions de paiement
                </label>
                <textarea
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]/50 focus:border-[#00B4D8]"
                />
              </div>

              {/* Legal info */}
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Mentions legales (incluses automatiquement sur le PDF)
                </p>
                <ul className="mt-1.5 space-y-0.5 text-[10px] text-[var(--color-text-muted)]">
                  <li>
                    BYSS GROUP SAS — SIRET : XX XXX XXX XXXXX — APE : 62.01Z
                  </li>
                  <li>TVA intracommunautaire : FR XX XXXXXXXXX</li>
                  {isMicro && (
                    <li className="font-medium text-[#00B4D8]">
                      TVA non applicable, art. 293 B du CGI
                    </li>
                  )}
                  <li>
                    Penalites de retard : 3x le taux d&apos;interet legal
                  </li>
                  <li>Indemnite forfaitaire de recouvrement : 40 EUR</li>
                </ul>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border-subtle)] px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-[#00B4D8] px-5 py-2 text-xs font-semibold text-[#0A0A14] transition-all hover:bg-[#48CAE4] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                {submitting ? "Creation..." : "Creer la facture"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
