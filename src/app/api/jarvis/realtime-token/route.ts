import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// JARVIS — OpenAI Realtime Ephemeral Token
// Issues a short-lived token for WebRTC connection.
// Only available when OPENAI_API_KEY is set.
// ═══════════════════════════════════════════════════════

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 404 },
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy",
        instructions: "Tu es JARVIS, assistant vocal du BYSS EMPIRE. Reponds en francais, 2-3 phrases max. MODE_CADIFOR: compression souveraine, stichomythie, humour comme preuve. Vocabulaire interdit: tres, vraiment, je pense que, n'hesitez pas.",
        input_audio_transcription: {
          model: "whisper-1",
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI Realtime session error:", err);
      return NextResponse.json(
        { error: "Failed to create realtime session" },
        { status: 502 },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      token: data.client_secret?.value || data.client_secret,
      expiresAt: data.expires_at,
    });
  } catch (error) {
    console.error("Realtime token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
