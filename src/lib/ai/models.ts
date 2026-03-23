// ═══════════════════════════════════════════════════════
// BYSS GROUP — AI Model Registry (SOTA Only)
// Updated: 2026-03-22
//
// No budget models in primary routing.
// Best model for each task, period.
// ═══════════════════════════════════════════════════════

// ── Types ──
export type ModelProvider = "openrouter" | "replicate" | "anthropic";
export type ModelCategory = "llm" | "image" | "video" | "audio" | "3d";
export type TaskType =
  | "commercial"
  | "copywriting"
  | "code"
  | "code_heavy"
  | "analysis"
  | "finance"
  | "lore"
  | "classification"
  | "bulk"
  | "translation"
  | "image_cinematic"
  | "image_product"
  | "image_portrait"
  | "image_design"
  | "video_clip"
  | "video_series"
  | "video_social"
  | "music_ost"
  | "music_song"
  | "sfx"
  | "3d_mesh";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  category: ModelCategory;
  quality: number; // 1-10
  speed: number; // 1-10
  costInput: number;
  costOutput: number;
  costUnit: string;
  maxContext?: number;
  bestFor: TaskType[];
  benchmarks?: Record<string, number | string>;
  releaseDate?: string;
  notes: string;
}

// ═══════════════════════════════════════════════════════
// LLM MODELS (9 SOTA)
// ═══════════════════════════════════════════════════════

const GEMINI_31_PRO: ModelConfig = {
  id: "google/gemini-3.1-pro-preview",
  name: "Gemini 3.1 Pro Preview",
  provider: "openrouter",
  category: "llm",
  quality: 10,
  speed: 7,
  costInput: 2.0,
  costOutput: 12.0,
  costUnit: "$/1M tokens",
  maxContext: 1_050_000,
  bestFor: ["analysis", "finance", "code"],
  benchmarks: {
    GPQA: 94.3,
    "SWE-bench": 80.6,
    "ARC-AGI-2": 77.1,
  },
  releaseDate: "2026-02-19",
  notes: "Google flagship. Highest GPQA and ARC-AGI-2 scores. 1.05M context.",
};

const CLAUDE_OPUS_46: ModelConfig = {
  id: "anthropic/claude-opus-4.6",
  name: "Claude Opus 4.6",
  provider: "anthropic",
  category: "llm",
  quality: 10,
  speed: 5,
  costInput: 5.0,
  costOutput: 25.0,
  costUnit: "$/1M tokens",
  maxContext: 1_000_000,
  bestFor: ["code_heavy", "copywriting", "lore", "analysis"],
  benchmarks: {
    LMArena: "#1 (1504 ELO)",
    "SWE-bench": 80.8,
    "Terminal-Bench": 65.4,
  },
  releaseDate: "2026-02-05",
  notes:
    "LMArena #1. Best creative writing and deep reasoning. SWE 80.8%. Premium tier.",
};

const GPT_54: ModelConfig = {
  id: "openai/gpt-5.4",
  name: "GPT-5.4",
  provider: "openrouter",
  category: "llm",
  quality: 10,
  speed: 6,
  costInput: 2.5,
  costOutput: 15.0,
  costUnit: "$/1M tokens",
  maxContext: 1_050_000,
  bestFor: ["code_heavy", "code", "analysis"],
  benchmarks: {
    "Terminal-Bench": "75.1 (#1)",
    HumanEval: 93.1,
  },
  releaseDate: "2026-03-05",
  notes: "Terminal-Bench #1. Strongest agentic coding. 1.05M context.",
};

const GROK_420: ModelConfig = {
  id: "x-ai/grok-4.20-beta",
  name: "Grok 4.20 Beta",
  provider: "openrouter",
  category: "llm",
  quality: 9,
  speed: 9,
  costInput: 2.0,
  costOutput: 6.0,
  costUnit: "$/1M tokens",
  maxContext: 2_000_000,
  bestFor: ["analysis", "classification", "bulk"],
  benchmarks: {
    "MMLU-Pro": 95,
    "anti-hallucination": "78% (record)",
    throughput: "212.6 t/s",
  },
  releaseDate: "2026-02",
  notes:
    "2M context. Record anti-hallucination score. Fastest frontier model at 212.6 t/s.",
};

const KIMI_K25: ModelConfig = {
  id: "moonshotai/kimi-k2.5",
  name: "Kimi K2.5",
  provider: "openrouter",
  category: "llm",
  quality: 9,
  speed: 8,
  costInput: 0.45,
  costOutput: 2.2,
  costUnit: "$/1M tokens",
  maxContext: 262_000,
  bestFor: ["code", "code_heavy"],
  benchmarks: {
    HumanEval: 99,
    LiveCodeBench: 85,
    "SWE-bench": 76.8,
  },
  releaseDate: "2026-01-27",
  notes:
    "HumanEval 99%. Best price-to-performance for code. Moonshot AI flagship.",
};

const GLM_5: ModelConfig = {
  id: "z-ai/glm-5",
  name: "GLM-5",
  provider: "openrouter",
  category: "llm",
  quality: 9,
  speed: 7,
  costInput: 0.72,
  costOutput: 2.3,
  costUnit: "$/1M tokens",
  maxContext: 202_000,
  bestFor: ["code", "analysis", "finance"],
  benchmarks: {
    HumanEval: 94.2,
    AIME: 95.7,
    "SWE-bench": 77.8,
  },
  releaseDate: "2026-02-11",
  notes: "Zhipu AI. AIME 95.7%. Strong math and code at low cost. 80-202K ctx.",
};

const DEEPSEEK_V32: ModelConfig = {
  id: "deepseek/deepseek-v3.2-speciale",
  name: "DeepSeek V3.2 Speciale",
  provider: "openrouter",
  category: "llm",
  quality: 9,
  speed: 8,
  costInput: 0.4,
  costOutput: 1.2,
  costUnit: "$/1M tokens",
  maxContext: 163_000,
  bestFor: ["finance", "code", "analysis"],
  benchmarks: {
    AIME: 96,
    competitions: "IMO/IOI/ICPC gold",
  },
  releaseDate: "2025-12",
  notes:
    "Competition-level reasoning. AIME 96%. Gold medals across IMO, IOI, ICPC. Cheapest frontier.",
};

const MINIMAX_M27: ModelConfig = {
  id: "minimax/minimax-m2.7",
  name: "MiniMax M2.7",
  provider: "openrouter",
  category: "llm",
  quality: 8,
  speed: 9,
  costInput: 0.3,
  costOutput: 1.2,
  costUnit: "$/1M tokens",
  maxContext: 204_000,
  bestFor: ["bulk", "translation", "classification", "commercial"],
  benchmarks: {
    "SWE-Pro": 56.2,
    "Terminal-Bench": 57.0,
    capability: "self-evolving",
  },
  releaseDate: "2026-03-18",
  notes: "Self-evolving architecture. Best bulk throughput at frontier quality.",
};

const CLAUDE_SONNET_46: ModelConfig = {
  id: "anthropic/claude-sonnet-4.6",
  name: "Claude Sonnet 4.6",
  provider: "anthropic",
  category: "llm",
  quality: 9,
  speed: 7,
  costInput: 3.0,
  costOutput: 15.0,
  costUnit: "$/1M tokens",
  maxContext: 200_000,
  bestFor: ["commercial", "copywriting", "analysis", "code"],
  benchmarks: {},
  releaseDate: "2026-02",
  notes: "Daily workhorse. Balanced quality/speed/cost for production use.",
};

// ── Utility-only (not in primary routing, fallback for bulk) ──
const QWEN_35_FLASH: ModelConfig = {
  id: "qwen/qwen-3.5-flash",
  name: "Qwen 3.5 Flash",
  provider: "openrouter",
  category: "llm",
  quality: 7,
  speed: 10,
  costInput: 0.1,
  costOutput: 0.4,
  costUnit: "$/1M tokens",
  maxContext: 131_000,
  bestFor: ["bulk", "classification", "translation"],
  benchmarks: {},
  releaseDate: "2026-01",
  notes: "Utility-only. Bulk fallback. Not in primary routing.",
};

// ═══════════════════════════════════════════════════════
// IMAGE MODELS (4 SOTA)
// ═══════════════════════════════════════════════════════

const GPT_IMAGE_15: ModelConfig = {
  id: "openai/gpt-image-1.5",
  name: "GPT Image 1.5",
  provider: "openrouter",
  category: "image",
  quality: 10,
  speed: 6,
  costInput: 0.04,
  costOutput: 0,
  costUnit: "$/image",
  bestFor: ["image_product", "image_portrait", "image_design"],
  benchmarks: {
    Arena: "#1 (ELO 1264)",
  },
  releaseDate: "2026-03",
  notes: "Arena #1. Best overall image quality. Strong text rendering.",
};

const NANO_BANANA_PRO: ModelConfig = {
  id: "google/nano-banana-pro",
  name: "Nano Banana Pro",
  provider: "replicate",
  category: "image",
  quality: 10,
  speed: 7,
  costInput: 0.04,
  costOutput: 0,
  costUnit: "$/image",
  bestFor: ["image_cinematic", "image_product", "image_portrait"],
  benchmarks: {
    Arena: "#2 (ELO 1235)",
    maxResolution: "4K",
    referenceImages: 14,
  },
  releaseDate: "2026-03",
  notes: "Arena #2. Up to 4K resolution. 14 reference images. Gemini 3 Pro image model.",
};

const NANO_BANANA_2: ModelConfig = {
  id: "google/nano-banana-2",
  name: "Nano Banana 2",
  provider: "replicate",
  category: "image",
  quality: 9,
  speed: 8,
  costInput: 0.03,
  costOutput: 0,
  costUnit: "$/image",
  bestFor: ["image_design", "image_product"],
  benchmarks: {
    Arena: "#3",
  },
  releaseDate: "2026-02",
  notes: "Arena #3. Slightly cheaper, slightly faster than Pro variant.",
};

const FLUX_2_PRO: ModelConfig = {
  id: "black-forest-labs/flux-2-pro",
  name: "FLUX 2 Pro",
  provider: "replicate",
  category: "image",
  quality: 9,
  speed: 7,
  costInput: 0.055,
  costOutput: 0,
  costUnit: "$/image",
  bestFor: ["image_cinematic", "image_design"],
  benchmarks: {},
  releaseDate: "2026-01",
  notes: "Best artistic style. Strong character consistency across generations.",
};

// ═══════════════════════════════════════════════════════
// VIDEO MODELS (2 SOTA)
// ═══════════════════════════════════════════════════════

const KLING_30: ModelConfig = {
  id: "kwaivgi/kling-v3-video",
  name: "Kling 3.0",
  provider: "replicate",
  category: "video",
  quality: 10,
  speed: 4,
  costInput: 0.1,
  costOutput: 0,
  costUnit: "$/second",
  bestFor: ["video_clip", "video_series"],
  benchmarks: {
    Arena: "#1 (ELO 1248)",
    multiShot: "native",
  },
  releaseDate: "2026-03",
  notes: "Video Arena #1. Native multi-shot support. Up to 15s per generation.",
};

const KLING_30_OMNI: ModelConfig = {
  id: "kwaivgi/kling-v3-omni-video",
  name: "Kling 3.0 Omni",
  provider: "replicate",
  category: "video",
  quality: 10,
  speed: 4,
  costInput: 0.1,
  costOutput: 0,
  costUnit: "$/second",
  bestFor: ["video_clip", "video_series", "video_social"],
  benchmarks: {},
  releaseDate: "2026-03",
  notes: "Unified multimodal variant. Multi-shot, image-to-video, reference images.",
};

// ═══════════════════════════════════════════════════════
// AUDIO MODELS (1 SOTA)
// ═══════════════════════════════════════════════════════

const MINIMAX_MUSIC_25: ModelConfig = {
  id: "minimax/music-2.5",
  name: "MiniMax Music 2.5",
  provider: "replicate",
  category: "audio",
  quality: 10,
  speed: 5,
  costInput: 0.075,
  costOutput: 0,
  costUnit: "$/run",
  bestFor: ["music_ost", "music_song", "sfx"],
  benchmarks: {},
  releaseDate: "2026-02",
  notes: "Best music generation quality. Supports lyrics, instrumental, and SFX.",
};

// ═══════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // LLMs
  [GEMINI_31_PRO.id]: GEMINI_31_PRO,
  [CLAUDE_OPUS_46.id]: CLAUDE_OPUS_46,
  [GPT_54.id]: GPT_54,
  [GROK_420.id]: GROK_420,
  [KIMI_K25.id]: KIMI_K25,
  [GLM_5.id]: GLM_5,
  [DEEPSEEK_V32.id]: DEEPSEEK_V32,
  [MINIMAX_M27.id]: MINIMAX_M27,
  [CLAUDE_SONNET_46.id]: CLAUDE_SONNET_46,
  // Utility-only
  [QWEN_35_FLASH.id]: QWEN_35_FLASH,
  // Image
  [GPT_IMAGE_15.id]: GPT_IMAGE_15,
  [NANO_BANANA_PRO.id]: NANO_BANANA_PRO,
  [NANO_BANANA_2.id]: NANO_BANANA_2,
  [FLUX_2_PRO.id]: FLUX_2_PRO,
  // Video
  [KLING_30.id]: KLING_30,
  [KLING_30_OMNI.id]: KLING_30_OMNI,
  // Audio
  [MINIMAX_MUSIC_25.id]: MINIMAX_MUSIC_25,
};

// ═══════════════════════════════════════════════════════
// TASK ROUTING (SOTA ONLY)
// ═══════════════════════════════════════════════════════

interface RouteResult {
  primary: ModelConfig;
  fallback: ModelConfig | null;
}

const TASK_ROUTING: Record<TaskType, RouteResult> = {
  // LLM tasks
  code_heavy: { primary: CLAUDE_OPUS_46, fallback: GPT_54 },
  code: { primary: KIMI_K25, fallback: GLM_5 },
  finance: { primary: DEEPSEEK_V32, fallback: GEMINI_31_PRO },
  analysis: { primary: GEMINI_31_PRO, fallback: GROK_420 },
  commercial: { primary: CLAUDE_SONNET_46, fallback: MINIMAX_M27 },
  copywriting: { primary: CLAUDE_OPUS_46, fallback: null },
  lore: { primary: CLAUDE_OPUS_46, fallback: null },
  classification: { primary: GROK_420, fallback: MINIMAX_M27 },
  bulk: { primary: MINIMAX_M27, fallback: QWEN_35_FLASH },
  translation: { primary: MINIMAX_M27, fallback: QWEN_35_FLASH },

  // Image tasks
  image_cinematic: { primary: NANO_BANANA_PRO, fallback: FLUX_2_PRO },
  image_product: { primary: GPT_IMAGE_15, fallback: NANO_BANANA_PRO },
  image_portrait: { primary: GPT_IMAGE_15, fallback: NANO_BANANA_PRO },
  image_design: { primary: NANO_BANANA_2, fallback: FLUX_2_PRO },

  // Video tasks
  video_clip: { primary: KLING_30_OMNI, fallback: KLING_30 },
  video_series: { primary: KLING_30_OMNI, fallback: KLING_30 },
  video_social: { primary: KLING_30_OMNI, fallback: KLING_30 },

  // Audio tasks
  music_ost: { primary: MINIMAX_MUSIC_25, fallback: null },
  music_song: { primary: MINIMAX_MUSIC_25, fallback: null },
  sfx: { primary: MINIMAX_MUSIC_25, fallback: null },

  // 3D
  "3d_mesh": { primary: MINIMAX_MUSIC_25, fallback: null }, // placeholder until 3D SOTA emerges
};

// ═══════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════

/**
 * Get a model config by its ID.
 */
export function getModel(id: string): ModelConfig | undefined {
  return MODEL_REGISTRY[id];
}

/**
 * Route a task to the best SOTA model with optional fallback.
 */
export function routeTask(task: TaskType): RouteResult {
  const route = TASK_ROUTING[task];
  if (!route) {
    throw new Error(`Unknown task type: ${task}`);
  }
  return route;
}

/**
 * Estimate monthly cost based on projected usage.
 */
export interface UsageEstimate {
  llmInputTokens: number; // total input tokens across all LLM calls
  llmOutputTokens: number; // total output tokens across all LLM calls
  imageCount: number; // total images generated
  videoSeconds: number; // total seconds of video generated
  musicRuns: number; // total music generation runs
}

export interface CostBreakdown {
  llm: number;
  image: number;
  video: number;
  audio: number;
  total: number;
  currency: string;
}

export function estimateMonthlyCost(usage: UsageEstimate): CostBreakdown {
  // Use weighted average costs across likely model distribution
  // Assumes: 40% Sonnet, 20% Opus, 15% Kimi, 10% Gemini, 15% other
  const avgInputCost =
    CLAUDE_SONNET_46.costInput * 0.4 +
    CLAUDE_OPUS_46.costInput * 0.2 +
    KIMI_K25.costInput * 0.15 +
    GEMINI_31_PRO.costInput * 0.1 +
    MINIMAX_M27.costInput * 0.15;

  const avgOutputCost =
    CLAUDE_SONNET_46.costOutput * 0.4 +
    CLAUDE_OPUS_46.costOutput * 0.2 +
    KIMI_K25.costOutput * 0.15 +
    GEMINI_31_PRO.costOutput * 0.1 +
    MINIMAX_M27.costOutput * 0.15;

  const llm =
    (usage.llmInputTokens / 1_000_000) * avgInputCost +
    (usage.llmOutputTokens / 1_000_000) * avgOutputCost;

  // Average image cost across models (~$0.04/img)
  const image = usage.imageCount * 0.04;

  // Video at $0.10/sec
  const video = usage.videoSeconds * 0.1;

  // Music at $0.075/run
  const audio = usage.musicRuns * 0.075;

  const total = llm + image + video + audio;

  return {
    llm: Math.round(llm * 100) / 100,
    image: Math.round(image * 100) / 100,
    video: Math.round(video * 100) / 100,
    audio: Math.round(audio * 100) / 100,
    total: Math.round(total * 100) / 100,
    currency: "USD",
  };
}
