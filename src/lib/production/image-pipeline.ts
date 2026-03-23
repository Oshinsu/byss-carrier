// ═══════════════════════════════════════════════════════
// IMAGE PIPELINE — 3-Layer Style System Wrapper
// Orchestrates: CAMERA_BASE + REALISM_GUARD + DIRECTION
// Connects to Replicate via src/lib/ai/replicate.ts
// ═══════════════════════════════════════════════════════

import type { ImageVertical, ImageShotType, ImagePipelineJob } from "@/types";
import { IMAGE_VERTICALS } from "@/lib/constants";

// ── Style Layer Definitions ──

export const CAMERA_BASE =
  "Shot on Sony A7IV, 50mm f/1.4, natural lighting, shallow depth of field, RAW quality";

export const REALISM_GUARD =
  "Photorealistic, no AI artifacts, no text overlays, natural skin tones, magazine editorial quality, 16:9 aspect ratio";

export const DIRECTION: Record<ImageShotType, string> = {
  lifestyle: "Candid moment, warm ambient lighting, lifestyle editorial feel, genuine emotions",
  product: "Clean studio lighting, product hero shot, dramatic shadows, premium finish",
  testimonial: "Portrait, eye contact, confident expression, professional headshot quality",
  urban: "Street photography, vibrant Caribbean colors, architectural context, golden hour",
  event: "Dynamic composition, crowd energy, stage lighting, live atmosphere",
  hero: "Wide angle establishing shot, cinematic framing, dramatic sky, brand landmark",
  detail: "Macro close-up, texture focus, artisan craftsmanship, rich detail",
};

// ── Vertical-specific style overrides ──

const VERTICAL_STYLES: Partial<Record<ImageVertical, string>> = {
  restaurant: "Warm ambient tropical lighting, lush vegetation, Caribbean bistro atmosphere",
  rhum: "Rich amber tones, heritage architecture, oak and copper textures, plantation setting",
  hotel: "Turquoise Caribbean water, palm trees, infinity pool, luxury resort feel",
  excursion: "Ocean blue, dolphins, turtles, underwater clarity, adventure spirit",
  corporate: "Modern office, glass facade, professional team, clean lines",
  telecom: "Tech-forward, connectivity, network imagery, vibrant brand colors",
};

/**
 * Build a complete 3-layer prompt for image generation.
 */
export function buildImagePrompt(
  vertical: ImageVertical,
  shotType: ImageShotType,
  subject: string
): string {
  const direction = DIRECTION[shotType] || DIRECTION.hero;
  const verticalStyle = VERTICAL_STYLES[vertical] || "";

  return [
    subject,
    direction,
    verticalStyle,
    CAMERA_BASE,
    REALISM_GUARD,
  ]
    .filter(Boolean)
    .join(". ");
}

/**
 * Generate batch prompts for a vertical (all shot types).
 */
export function buildVerticalBatch(
  vertical: ImageVertical,
  subject: string
): Array<{ shotType: ImageShotType; prompt: string }> {
  const config = IMAGE_VERTICALS[vertical];
  return config.shots.map((shot) => ({
    shotType: shot as ImageShotType,
    prompt: buildImagePrompt(vertical, shot as ImageShotType, subject),
  }));
}

/**
 * Create a pipeline job record (for tracking).
 */
export function createPipelineJob(
  vertical: ImageVertical,
  shotType: ImageShotType,
  prompt: string,
  prospectId?: string
): Omit<ImagePipelineJob, "id" | "created_at"> {
  return {
    preset_id: null,
    vertical,
    shot_type: shotType,
    prompt,
    style_layers: {
      camera: CAMERA_BASE,
      realism: REALISM_GUARD,
      direction: DIRECTION[shotType] || "",
    },
    status: "queued",
    output_url: null,
    cost_usd: 0.04, // Estimated cost per image (Nano Banana Pro)
    model_used: "google/nano-banana-pro",
    prospect_id: prospectId || null,
  };
}

/**
 * Estimate cost for a batch generation.
 */
export function estimateBatchCost(imageCount: number): {
  costUsd: number;
  sellPriceEur: number;
  margin: number;
} {
  const costPerImage = 0.04; // Nano Banana Pro
  const costUsd = imageCount * costPerImage;
  const sellPriceEur = imageCount <= 10 ? 750 : imageCount <= 20 ? 1500 : 3000;
  const margin = ((sellPriceEur - costUsd) / sellPriceEur) * 100;

  return {
    costUsd: Math.round(costUsd * 100) / 100,
    sellPriceEur,
    margin: Math.round(margin * 100) / 100,
  };
}
