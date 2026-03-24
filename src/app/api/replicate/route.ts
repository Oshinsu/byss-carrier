import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";

// ---------------------------------------------------------------------------
// Replicate API proxy
// ---------------------------------------------------------------------------

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN ?? "";
const REPLICATE_API = "https://api.replicate.com/v1";

// Model version IDs
const MODELS = {
  "nano-banana-pro": "bde7a2b6-5e24-4e85-9c4a-1e3de8e0b5c1",
  "flux-2-pro": "black-forest-labs/flux-2-pro",
  "kling-3": "kuaishou-video/kling-3",
  "minimax-music-2.5": "minimax/music-2.5",
  "xtts-v2": "lucataco/xtts-v2",
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GenerateImagePayload {
  model?: "nano-banana-pro" | "flux-2-pro";
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
}

interface GenerateVideoPayload {
  prompt: string;
  imageUrl?: string;
  duration?: number;
  aspectRatio?: string;
  multishot?: { prompts: string[]; transition?: string };
}

interface GenerateMusicPayload {
  prompt: string;
  duration?: number;
  referenceAudioUrl?: string;
}

interface GenerateVoicePayload {
  text: string;
  speakerWav?: string;
  language?: string;
}

interface StatusPayload {
  predictionId: string;
}

interface CancelPayload {
  predictionId: string;
}

type ActionPayload =
  | { action: "generate-image" } & GenerateImagePayload
  | { action: "generate-video" } & GenerateVideoPayload
  | { action: "generate-music" } & GenerateMusicPayload
  | { action: "generate-voice" } & GenerateVoicePayload
  | { action: "status" } & StatusPayload
  | { action: "cancel" } & CancelPayload;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function replicatePost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${REPLICATE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "respond-async",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function replicateGet(path: string) {
  const res = await fetch(`${REPLICATE_API}${path}`, {
    headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
  });
  return res.json();
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const { allowed, remaining } = rateLimit("replicate-route", 5, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    });
  }

  if (!REPLICATE_TOKEN) {
    return NextResponse.json(
      {
        error: "Replicate API non configurée. Ajoutez REPLICATE_API_TOKEN dans .env.local",
        fallback: true,
      },
      { status: 503 }
    );
  }

  try {
    const payload = (await request.json()) as ActionPayload;

    switch (payload.action) {
      // ---- Image generation ------------------------------------------------
      case "generate-image": {
        const modelKey = payload.model ?? "flux-2-pro";
        const modelId = MODELS[modelKey];
        const input: Record<string, unknown> = {
          prompt: payload.prompt,
          width: payload.width ?? 1024,
          height: payload.height ?? 1024,
          num_outputs: payload.numOutputs ?? 1,
        };
        if (payload.negativePrompt) {
          input.negative_prompt = payload.negativePrompt;
        }

        const prediction = await replicatePost("/predictions", {
          model: modelId,
          input,
        });
        return NextResponse.json(prediction);
      }

      // ---- Video generation (Kling 3.0) ------------------------------------
      case "generate-video": {
        if (payload.multishot && payload.multishot.prompts.length > 1) {
          // Multishot: queue one prediction per prompt segment
          const predictions = [];
          for (const segmentPrompt of payload.multishot.prompts) {
            const input: Record<string, unknown> = {
              prompt: segmentPrompt,
              duration: payload.duration ?? 5,
              aspect_ratio: payload.aspectRatio ?? "16:9",
            };
            if (payload.imageUrl) input.image = payload.imageUrl;
            const pred = await replicatePost("/predictions", {
              model: MODELS["kling-3"],
              input,
            });
            predictions.push(pred);
          }
          return NextResponse.json({
            multishot: true,
            transition: payload.multishot.transition ?? "cut",
            predictions,
          });
        }

        // Single-shot
        const input: Record<string, unknown> = {
          prompt: payload.prompt,
          duration: payload.duration ?? 5,
          aspect_ratio: payload.aspectRatio ?? "16:9",
        };
        if (payload.imageUrl) input.image = payload.imageUrl;

        const prediction = await replicatePost("/predictions", {
          model: MODELS["kling-3"],
          input,
        });
        return NextResponse.json(prediction);
      }

      // ---- Music generation (MiniMax 2.5) ----------------------------------
      case "generate-music": {
        const input: Record<string, unknown> = {
          prompt: payload.prompt,
          duration: payload.duration ?? 30,
        };
        if (payload.referenceAudioUrl) {
          input.reference_audio = payload.referenceAudioUrl;
        }

        const prediction = await replicatePost("/predictions", {
          model: MODELS["minimax-music-2.5"],
          input,
        });
        return NextResponse.json(prediction);
      }

      // ---- Voice/TTS generation (XTTS-v2) -----------------------------------
      case "generate-voice": {
        const input: Record<string, unknown> = {
          text: payload.text,
          language: payload.language ?? "fr",
        };
        if (payload.speakerWav) {
          input.speaker_wav = payload.speakerWav;
        }

        const prediction = await replicatePost("/predictions", {
          model: MODELS["xtts-v2"],
          input,
        });
        return NextResponse.json(prediction);
      }

      // ---- Poll prediction status ------------------------------------------
      case "status": {
        const status = await replicateGet(
          `/predictions/${payload.predictionId}`
        );
        return NextResponse.json(status);
      }

      // ---- Cancel prediction -----------------------------------------------
      case "cancel": {
        const result = await replicatePost(
          `/predictions/${payload.predictionId}/cancel`,
          {}
        );
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[replicate] API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Replicate API error" },
      { status: 500 }
    );
  }
}
