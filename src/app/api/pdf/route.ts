import { NextRequest, NextResponse } from "next/server";
import { renderProposalPDF, type ProposalProps } from "@/lib/pdf/proposal";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — PDF Generation API
// POST proposal data → returns PDF buffer as download
// ═══════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposalProps;

    // Validate required fields
    if (!body.clientName || !body.sector || !body.pain || !body.options) {
      return NextResponse.json(
        { error: "Champs requis manquants: clientName, sector, pain, options" },
        { status: 400 },
      );
    }

    // Validate options structure
    const { options } = body;
    if (!options.essentiel || !options.croissance || !options.domination) {
      return NextResponse.json(
        { error: "Options requises: essentiel, croissance, domination" },
        { status: 400 },
      );
    }

    // Set defaults for optional fields
    const proposalData: ProposalProps = {
      clientName: body.clientName,
      sector: body.sector,
      pain: body.pain,
      memorablePhrase: body.memorablePhrase || "",
      options: {
        essentiel: {
          price: options.essentiel.price || "1 500",
          services: options.essentiel.services || [],
        },
        croissance: {
          price: options.croissance.price || "3 500",
          services: options.croissance.services || [],
        },
        domination: {
          price: options.domination.price || "7 500",
          services: options.domination.services || [],
        },
      },
      roi: {
        essentiel: body.roi?.essentiel ?? 120,
        croissance: body.roi?.croissance ?? 250,
        domination: body.roi?.domination ?? 400,
      },
      ca: body.ca,
    };

    // Render PDF
    const pdfBuffer = await renderProposalPDF(proposalData);

    // Build filename
    const sanitizedName = body.clientName
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const filename = `proposition-${sanitizedName}-${Date.now()}.pdf`;

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
    console.error("PDF generation error:", error);
    const message = error instanceof Error ? error.message : "Erreur generation PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
