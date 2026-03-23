import { NextRequest, NextResponse } from "next/server";
import { renderInvoicePDF, type InvoiceData } from "@/lib/pdf/invoice";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Invoice PDF Generation API
// POST invoice data → returns PDF buffer as download
// ═══════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InvoiceData;

    // Validate required fields
    if (!body.invoice_number || !body.client_name || !body.line_items?.length) {
      return NextResponse.json(
        {
          error:
            "Champs requis manquants: invoice_number, client_name, line_items",
        },
        { status: 400 }
      );
    }

    // Set defaults
    const invoiceData: InvoiceData = {
      invoice_number: body.invoice_number,
      issue_date: body.issue_date || new Date().toISOString().split("T")[0],
      due_date:
        body.due_date ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      client_name: body.client_name,
      client_address: body.client_address || "",
      client_email: body.client_email || "",
      client_siret: body.client_siret || "",
      line_items: body.line_items.map((item) => ({
        description: item.description || "Prestation",
        quantity: item.quantity || 1,
        unit_price_ht: item.unit_price_ht || 0,
        tva_rate: item.tva_rate ?? 0,
      })),
      payment_terms: body.payment_terms || "",
      notes: body.notes || "",
      is_micro: body.is_micro ?? true,
    };

    // Render PDF
    const pdfBuffer = await renderInvoicePDF(invoiceData);

    // Build filename
    const sanitizedNumber = body.invoice_number
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    const filename = `facture-${sanitizedNumber}.pdf`;

    // Return as downloadable PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Invoice PDF generation error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur generation PDF facture";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
