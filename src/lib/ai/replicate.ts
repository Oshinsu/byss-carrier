// ═══════════════════════════════════════════════════════
// BYSS GROUP — Replicate API Wrapper
// Kling 3.0, Nano Banana Pro, FLUX 2 Pro, MiniMax Music
// ═══════════════════════════════════════════════════════

import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// ═══════════════════════════════════════════════════════
// KLING 3.0 VIDEO GENERATION
// ═══════════════════════════════════════════════════════

export interface KlingMultiPrompt {
  prompt: string;
  duration: number; // min 3s per shot
}

export interface KlingImageRef {
  url: string;
  type: "first_frame" | "end_frame";
}

export interface KlingVideoParams {
  prompt: string;
  duration?: 3 | 5 | 10 | 15;
  aspect_ratio?: "16:9" | "9:16" | "1:1" | "21:9" | "2.39:1";
  mode?: "std" | "pro";
  cfg_scale?: number; // 0-1
  // Multi-shot
  multi_shot?: boolean;
  multi_prompt?: KlingMultiPrompt[];
  // Image-to-video
  image_list?: KlingImageRef[];
  // Reference images (up to 7, referenced as <<<image_1>>> etc. in prompt)
  reference_images?: string[];
}

export interface KlingVideoInput {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: string;
  cfg_scale: number;
  multi_shot?: boolean;
  multi_prompt?: KlingMultiPrompt[];
  image_list?: KlingImageRef[];
  reference_images?: string[];
}

export async function generateKlingVideo(params: KlingVideoParams) {
  // Use omni model for multi-shot, standard for single clips
  const model = params.multi_shot
    ? "kwaivgi/kling-v3-omni-video"
    : "kwaivgi/kling-v3-video";

  const input: KlingVideoInput = {
    prompt: params.prompt,
    duration: params.duration ?? 5,
    aspect_ratio: params.aspect_ratio ?? "16:9",
    mode: params.mode ?? "pro",
    cfg_scale: params.cfg_scale ?? 0.5,
  };

  if (params.multi_shot && params.multi_prompt) {
    input.multi_shot = true;
    input.multi_prompt = params.multi_prompt;
  }

  if (params.image_list) {
    input.image_list = params.image_list;
  }

  if (params.reference_images) {
    input.reference_images = params.reference_images;
  }

  const prediction = await replicate.predictions.create({
    model,
    input,
  });

  return prediction;
}

// ═══════════════════════════════════════════════════════
// NANO BANANA PRO (Gemini 3 Pro Image)
// ═══════════════════════════════════════════════════════

export interface NanoBananaParams {
  prompt: string;
  aspect_ratio?: "16:9" | "9:16" | "1:1" | "4:3" | "21:9";
  resolution?: "1k" | "2k" | "4k";
  reference_images?: string[]; // up to 14
  allow_fallback?: boolean; // fallback to Seedream 5.0 lite
}

export interface NanoBananaInput {
  prompt: string;
  aspect_ratio: string;
  resolution?: string;
  reference_images?: string[];
  allow_fallback_model: boolean;
}

export async function generateNanoBananaImage(params: NanoBananaParams) {
  const input: NanoBananaInput = {
    prompt: params.prompt,
    aspect_ratio: params.aspect_ratio ?? "16:9",
    allow_fallback_model: params.allow_fallback ?? true,
  };

  if (params.resolution) {
    input.resolution = params.resolution;
  }

  if (params.reference_images) {
    input.reference_images = params.reference_images;
  }

  const prediction = await replicate.predictions.create({
    model: "google/nano-banana-pro",
    input,
  });

  return prediction;
}

// ═══════════════════════════════════════════════════════
// FLUX 2 PRO
// ═══════════════════════════════════════════════════════

export async function generateFluxImage(
  prompt: string,
  aspectRatio: string = "16:9"
) {
  const prediction = await replicate.predictions.create({
    model: "black-forest-labs/flux-2-pro",
    input: {
      prompt,
      aspect_ratio: aspectRatio,
    },
  });

  return prediction;
}

// ═══════════════════════════════════════════════════════
// MINIMAX MUSIC 2.5
// ═══════════════════════════════════════════════════════

export async function generateMusic(
  prompt: string,
  durationSec: number = 120
) {
  const prediction = await replicate.predictions.create({
    model: "minimax/music-2.5",
    input: {
      prompt,
      duration: durationSec,
    },
  });

  return prediction;
}

// ═══════════════════════════════════════════════════════
// PREDICTION MANAGEMENT
// ═══════════════════════════════════════════════════════

/**
 * Poll a prediction's current status and output.
 */
export async function pollPrediction(id: string) {
  return replicate.predictions.get(id);
}

/**
 * Cancel a running prediction.
 */
export async function cancelPrediction(id: string) {
  return replicate.predictions.cancel(id);
}

/**
 * Wait for a prediction to complete (with timeout).
 * Polls every `intervalMs` until status is "succeeded", "failed", or "canceled".
 */
export async function waitForPrediction(
  id: string,
  timeoutMs: number = 300_000,
  intervalMs: number = 3_000
) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const prediction = await replicate.predictions.get(id);

    if (
      prediction.status === "succeeded" ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      return prediction;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Prediction ${id} timed out after ${timeoutMs}ms`);
}
