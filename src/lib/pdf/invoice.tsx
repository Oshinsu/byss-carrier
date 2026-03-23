import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Invoice PDF Generator
   French-compliant (CGI art. 289, 293 B)
   Black + Cyan design system
   ═══════════════════════════════════════════════════════ */

// ── Font registration ─────────────────────────────────
Font.register({
  family: "ClashDisplay",
  fonts: [
    {
      src: "https://fonts.cdnfonts.com/s/85546/ClashDisplay-Regular.woff",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.cdnfonts.com/s/85546/ClashDisplay-Semibold.woff",
      fontWeight: "semibold",
    },
    {
      src: "https://fonts.cdnfonts.com/s/85546/ClashDisplay-Bold.woff",
      fontWeight: "bold",
    },
  ],
});

// ── Color tokens ──────────────────────────────────────
const C = {
  bg: "#0A0A14",
  surface: "#111126",
  surface2: "#1A1A2E",
  cyan: "#00B4D8",
  cyanLight: "#48CAE4",
  cyanDark: "#0096C7",
  text: "#F5F5F7",
  textMuted: "#8B8BA3",
  border: "#2A2A3E",
  white: "#FFFFFF",
  green: "#4ADE80",
  fire: "#EF4444",
  gold: "#D4A843",
};

// ── Types ─────────────────────────────────────────────
export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price_ht: number;
  tva_rate: number; // 0, 0.085, or 0.20
}

export interface InvoiceData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  client_name: string;
  client_address?: string;
  client_email?: string;
  client_siret?: string;
  line_items: InvoiceLineItem[];
  payment_terms?: string;
  notes?: string;
  is_micro: boolean; // micro-entreprise = no TVA
}

// ── Styles ────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    padding: 40,
    fontFamily: "ClashDisplay",
    color: C.text,
    fontSize: 9,
    position: "relative",
  },
  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: C.cyan,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: C.bg,
    letterSpacing: -1,
  },
  companyBlock: {
    marginLeft: 14,
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: C.white,
    letterSpacing: 1,
  },
  companyDetail: {
    fontSize: 8,
    color: C.textMuted,
    marginTop: 2,
  },
  invoiceLabel: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: C.cyan,
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontSize: 10,
    color: C.cyanLight,
    marginTop: 4,
    fontWeight: "semibold",
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 16,
  },
  cyanDivider: {
    height: 2,
    backgroundColor: C.cyan,
    marginVertical: 16,
    opacity: 0.4,
  },
  // Info blocks
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 9,
    color: C.text,
    lineHeight: 1.6,
  },
  infoValueBold: {
    fontSize: 10,
    color: C.white,
    fontWeight: "semibold",
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.surface2,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 7,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "semibold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTva: { flex: 1, textAlign: "center" },
  colTotal: { flex: 1.5, textAlign: "right" },
  cellText: {
    fontSize: 9,
    color: C.text,
  },
  cellMuted: {
    fontSize: 9,
    color: C.textMuted,
  },
  // Totals
  totalsBlock: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  totalValue: {
    fontSize: 9,
    color: C.text,
    fontWeight: "semibold",
  },
  totalTTCRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: C.surface2,
    borderRadius: 6,
    marginTop: 4,
  },
  totalTTCLabel: {
    fontSize: 11,
    color: C.cyan,
    fontWeight: "bold",
  },
  totalTTCValue: {
    fontSize: 11,
    color: C.cyan,
    fontWeight: "bold",
  },
  // Payment / legal
  legalSection: {
    marginTop: 30,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  legalTitle: {
    fontSize: 7,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  legalText: {
    fontSize: 7,
    color: C.textMuted,
    lineHeight: 1.8,
  },
  legalBold: {
    fontSize: 7,
    color: C.text,
    fontWeight: "semibold",
    lineHeight: 1.8,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: C.textMuted,
  },
  footerAccent: {
    fontSize: 7,
    color: C.cyan,
    fontWeight: "semibold",
  },
  // Watermark accent bar
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    backgroundColor: C.cyan,
  },
});

// ── Helpers ───────────────────────────────────────────
function formatEur(n: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " €";
}

function formatDate(d: string): string {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTvaRate(rate: number): string {
  if (rate === 0) return "0%";
  return (rate * 100).toFixed(1).replace(".", ",") + "%";
}

// ── Invoice Document ──────────────────────────────────
function InvoiceDocument({ data }: { data: InvoiceData }) {
  // Calculate totals
  const lines = data.line_items.map((item) => {
    const lineHT = item.quantity * item.unit_price_ht;
    const lineTVA = data.is_micro ? 0 : lineHT * item.tva_rate;
    const lineTTC = lineHT + lineTVA;
    return { ...item, lineHT, lineTVA, lineTTC };
  });

  const totalHT = lines.reduce((sum, l) => sum + l.lineHT, 0);
  const totalTVA = lines.reduce((sum, l) => sum + l.lineTVA, 0);
  const totalTTC = totalHT + totalTVA;

  // Group TVA by rate
  const tvaByRate: Record<string, number> = {};
  if (!data.is_micro) {
    lines.forEach((l) => {
      const key = formatTvaRate(l.tva_rate);
      tvaByRate[key] = (tvaByRate[key] || 0) + l.lineTVA;
    });
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Accent bar */}
        <View style={s.accentBar} />

        {/* ═══ HEADER ═══ */}
        <View style={s.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={s.logoBox}>
              <Text style={s.logoText}>BG</Text>
            </View>
            <View style={s.companyBlock}>
              <Text style={s.companyName}>BYSS GROUP</Text>
              <Text style={s.companyDetail}>SAS au capital social variable</Text>
              <Text style={s.companyDetail}>SIRET : XX XXX XXX XXXXX</Text>
              <Text style={s.companyDetail}>Code APE : 62.01Z</Text>
            </View>
          </View>
          <View style={s.invoiceLabel}>
            <Text style={s.invoiceTitle}>FACTURE</Text>
            <Text style={s.invoiceNumber}>N° {data.invoice_number}</Text>
          </View>
        </View>

        <View style={s.cyanDivider} />

        {/* ═══ INFO BLOCKS ═══ */}
        <View style={s.infoRow}>
          {/* Emetteur */}
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Emetteur</Text>
            <Text style={s.infoValueBold}>BYSS GROUP SAS</Text>
            <Text style={s.infoValue}>Martinique, France</Text>
            <Text style={s.infoValue}>contact@byssgroup.fr</Text>
            <Text style={s.infoValue}>TVA : FR XX XXXXXXXXX</Text>
          </View>

          {/* Client */}
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Facture a</Text>
            <Text style={s.infoValueBold}>{data.client_name}</Text>
            {data.client_address && (
              <Text style={s.infoValue}>{data.client_address}</Text>
            )}
            {data.client_email && (
              <Text style={s.infoValue}>{data.client_email}</Text>
            )}
            {data.client_siret && (
              <Text style={s.infoValue}>SIRET : {data.client_siret}</Text>
            )}
          </View>

          {/* Dates */}
          <View style={{ ...s.infoBlock, alignItems: "flex-end" }}>
            <Text style={s.infoLabel}>Dates</Text>
            <Text style={s.infoValue}>
              Emission : {formatDate(data.issue_date)}
            </Text>
            <Text style={s.infoValue}>
              Echeance : {formatDate(data.due_date)}
            </Text>
          </View>
        </View>

        {/* ═══ LINE ITEMS TABLE ═══ */}
        <View style={s.tableHeader}>
          <Text style={{ ...s.tableHeaderText, ...s.colDesc }}>
            Description
          </Text>
          <Text style={{ ...s.tableHeaderText, ...s.colQty }}>Qte</Text>
          <Text style={{ ...s.tableHeaderText, ...s.colPrice }}>P.U. HT</Text>
          <Text style={{ ...s.tableHeaderText, ...s.colTva }}>TVA</Text>
          <Text style={{ ...s.tableHeaderText, ...s.colTotal }}>Total HT</Text>
        </View>

        {lines.map((line, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={{ ...s.cellText, ...s.colDesc }}>
              {line.description}
            </Text>
            <Text style={{ ...s.cellMuted, ...s.colQty }}>
              {line.quantity}
            </Text>
            <Text style={{ ...s.cellMuted, ...s.colPrice }}>
              {formatEur(line.unit_price_ht)}
            </Text>
            <Text style={{ ...s.cellMuted, ...s.colTva }}>
              {data.is_micro ? "—" : formatTvaRate(line.tva_rate)}
            </Text>
            <Text style={{ ...s.cellText, ...s.colTotal }}>
              {formatEur(line.lineHT)}
            </Text>
          </View>
        ))}

        {/* ═══ TOTALS ═══ */}
        <View style={s.totalsBlock}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total HT</Text>
            <Text style={s.totalValue}>{formatEur(totalHT)}</Text>
          </View>

          {data.is_micro ? (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>TVA</Text>
              <Text style={{ ...s.totalValue, color: C.textMuted }}>
                Non applicable
              </Text>
            </View>
          ) : (
            Object.entries(tvaByRate).map(([rate, amount]) => (
              <View key={rate} style={s.totalRow}>
                <Text style={s.totalLabel}>TVA {rate}</Text>
                <Text style={s.totalValue}>{formatEur(amount)}</Text>
              </View>
            ))
          )}

          <View style={s.totalTTCRow}>
            <Text style={s.totalTTCLabel}>TOTAL TTC</Text>
            <Text style={s.totalTTCValue}>{formatEur(totalTTC)}</Text>
          </View>
        </View>

        {/* ═══ PAYMENT TERMS ═══ */}
        <View style={s.legalSection}>
          <Text style={s.legalTitle}>Conditions de paiement</Text>
          <Text style={s.legalText}>
            {data.payment_terms ||
              "Paiement par virement bancaire sous 30 jours a compter de la date d'emission."}
          </Text>
          {data.notes && (
            <Text style={{ ...s.legalText, marginTop: 6 }}>{data.notes}</Text>
          )}
        </View>

        {/* ═══ LEGAL MENTIONS ═══ */}
        <View style={{ ...s.legalSection, marginTop: 16 }}>
          <Text style={s.legalTitle}>Mentions legales obligatoires</Text>

          <Text style={s.legalBold}>BYSS GROUP SAS</Text>
          <Text style={s.legalText}>
            SIRET : XX XXX XXX XXXXX — Code APE : 62.01Z
          </Text>
          <Text style={s.legalText}>
            N° TVA intracommunautaire : FR XX XXXXXXXXX
          </Text>

          {data.is_micro ? (
            <Text style={{ ...s.legalBold, color: C.cyan, marginTop: 4 }}>
              TVA non applicable, article 293 B du Code General des Impots.
            </Text>
          ) : (
            <Text style={{ ...s.legalText, marginTop: 4 }}>
              TVA applicable selon les taux indiques ci-dessus.
            </Text>
          )}

          <Text style={{ ...s.legalText, marginTop: 6 }}>
            En cas de retard de paiement, une penalite de retard sera exigible
            (taux : 3 fois le taux d'interet legal en vigueur).
          </Text>
          <Text style={s.legalText}>
            Indemnite forfaitaire pour frais de recouvrement : 40,00 EUR (art.
            L.441-10 du Code de commerce).
          </Text>
          <Text style={{ ...s.legalText, marginTop: 4 }}>
            Pas d'escompte pour paiement anticipe.
          </Text>
        </View>

        {/* ═══ FOOTER ═══ */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            BYSS GROUP SAS — Martinique, France
          </Text>
          <Text style={s.footerAccent}>byssgroup.fr</Text>
        </View>
      </Page>
    </Document>
  );
}

// ── Render function ───────────────────────────────────
export async function renderInvoicePDF(
  data: InvoiceData
): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />);
}

export type { InvoiceData as InvoiceProps };
