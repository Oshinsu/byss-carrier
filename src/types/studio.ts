/* ═══════════════════════════════════════════════════════════════
   BYSS STUDIO — Types
   ═══════════════════════════════════════════════════════════════ */

export type AssetType = "video" | "image" | "audio";
export type ClipType = "video" | "image" | "audio" | "text";
export type Format = "16:9" | "9:16" | "1:1";
export type MediaTab = "assets" | "templates" | "ai";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  duration: number;
  thumbnail?: string;
  createdAt: number;
}

export interface Clip {
  id: string;
  trackId: string;
  assetId?: string;
  type: ClipType;
  startTime: number;
  duration: number;
  name: string;
  scale: number;
  rotation: number;
  opacity: number;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  blur: number;
  colorGrade: string;
}

export interface Track {
  id: string;
  name: string;
  type: ClipType;
  muted: boolean;
  locked: boolean;
  visible: boolean;
  clips: Clip[];
}

export interface HistoryEntry {
  tracks: Track[];
  assets: Asset[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  duration: number;
  format: Format;
  tracks: Track[];
  icon: string;
}

export interface EditorState {
  projectName: string;
  format: Format;
  resolution: { w: number; h: number };
  fps: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  tracks: Track[];
  assets: Asset[];
  selectedClipId: string | null;
  zoom: number;
  history: HistoryEntry[];
  historyIndex: number;
  setProjectName: (name: string) => void;
  setFormat: (f: Format) => void;
  setCurrentTime: (t: number) => void;
  setIsPlaying: (p: boolean) => void;
  setZoom: (z: number) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  addClip: (trackId: string, clip: Clip) => void;
  removeClip: (trackId: string, clipId: string) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<Clip>) => void;
  selectClip: (id: string | null) => void;
  toggleTrackMute: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;
  toggleTrackVisible: (trackId: string) => void;
  cutAtPlayhead: () => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  loadTemplate: (template: Template) => void;
  recalcDuration: () => void;
}

/* ── Constants ── */

export const FORMAT_RESOLUTIONS: Record<Format, { w: number; h: number }> = {
  "16:9": { w: 1920, h: 1080 },
  "9:16": { w: 1080, h: 1920 },
  "1:1": { w: 1080, h: 1080 },
};

export const DEFAULT_TRACKS: Track[] = [
  { id: "video-1", name: "Video 1", type: "video", muted: false, locked: false, visible: true, clips: [] },
  { id: "video-2", name: "Video 2", type: "video", muted: false, locked: false, visible: true, clips: [] },
  { id: "text-1", name: "Text", type: "text", muted: false, locked: false, visible: true, clips: [] },
  { id: "audio-1", name: "Audio 1", type: "audio", muted: false, locked: false, visible: true, clips: [] },
  { id: "audio-2", name: "Audio 2", type: "audio", muted: false, locked: false, visible: true, clips: [] },
];

export const TEMPLATES: Template[] = [
  {
    id: "teaser-25", name: "Teaser 25s", description: "Accroche rapide — parfait réseaux sociaux",
    duration: 25, format: "9:16", icon: "zap",
    tracks: [
      { id: "video-1", name: "Video 1", type: "video", muted: false, locked: false, visible: true, clips: [
        { id: "t1-v1", trackId: "video-1", type: "video", startTime: 0, duration: 8, name: "Hook", scale: 1, rotation: 0, opacity: 1, volume: 1, fadeIn: 0.5, fadeOut: 0, blur: 0, colorGrade: "none" },
        { id: "t1-v2", trackId: "video-1", type: "video", startTime: 8, duration: 10, name: "Core", scale: 1, rotation: 0, opacity: 1, volume: 1, fadeIn: 0, fadeOut: 0, blur: 0, colorGrade: "none" },
        { id: "t1-v3", trackId: "video-1", type: "video", startTime: 18, duration: 7, name: "CTA", scale: 1.1, rotation: 0, opacity: 1, volume: 1, fadeIn: 0, fadeOut: 1, blur: 0, colorGrade: "none" },
      ]},
      { id: "video-2", name: "Video 2", type: "video", muted: false, locked: false, visible: true, clips: [] },
      { id: "text-1", name: "Text", type: "text", muted: false, locked: false, visible: true, clips: [
        { id: "t1-t1", trackId: "text-1", type: "text", startTime: 0, duration: 4, name: "Titre", text: "VOTRE TITRE", fontSize: 48, fontColor: "#FFFFFF", fontFamily: "ClashDisplay", scale: 1, rotation: 0, opacity: 1, volume: 1, fadeIn: 0.3, fadeOut: 0.3, blur: 0, colorGrade: "none" },
        { id: "t1-t2", trackId: "text-1", type: "text", startTime: 18, duration: 7, name: "CTA Text", text: "DECOUVRIR", fontSize: 36, fontColor: "#00D4FF", fontFamily: "ClashDisplay", scale: 1, rotation: 0, opacity: 1, volume: 1, fadeIn: 0.3, fadeOut: 0.3, blur: 0, colorGrade: "none" },
      ]},
      { id: "audio-1", name: "Audio 1", type: "audio", muted: false, locked: false, visible: true, clips: [
        { id: "t1-a1", trackId: "audio-1", type: "audio", startTime: 0, duration: 25, name: "Music BG", scale: 1, rotation: 0, opacity: 1, volume: 0.6, fadeIn: 1, fadeOut: 2, blur: 0, colorGrade: "none" },
      ]},
      { id: "audio-2", name: "Audio 2", type: "audio", muted: false, locked: false, visible: true, clips: [] },
    ],
  },
  { id: "clip-60", name: "Clip Musical", description: "Clip 60s — intro, couplet, refrain, outro", duration: 60, format: "16:9", icon: "music", tracks: DEFAULT_TRACKS.map(t => ({ ...t, clips: [] })) },
  { id: "pub-restaurant", name: "Pub Restaurant", description: "Publicite restaurant — plats, ambiance, CTA", duration: 30, format: "9:16", icon: "utensils", tracks: DEFAULT_TRACKS.map(t => ({ ...t, clips: [] })) },
  { id: "court-metrage", name: "Court-Metrage", description: "Mini-film 3-5min — narration cinematographique", duration: 180, format: "16:9", icon: "film", tracks: DEFAULT_TRACKS.map(t => ({ ...t, clips: [] })) },
  { id: "trailer-jw", name: "Trailer JW", description: "Bande-annonce Jurassic Wars — epique, orchestral", duration: 90, format: "16:9", icon: "swords", tracks: DEFAULT_TRACKS.map(t => ({ ...t, clips: [] })) },
  { id: "story-ig", name: "Story Instagram", description: "Story 15s — vertical, impactant, rapide", duration: 15, format: "9:16", icon: "smartphone", tracks: DEFAULT_TRACKS.map(t => ({ ...t, clips: [] })) },
];

/* ── Helpers ── */

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatTimecode(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export const CLIP_COLORS: Record<ClipType, string> = {
  video: "bg-cyan-600/70 border-cyan-400/50",
  image: "bg-amber-600/70 border-amber-400/50",
  audio: "bg-purple-600/70 border-purple-400/50",
  text: "bg-emerald-600/70 border-emerald-400/50",
};

export const CLIP_COLORS_HEX: Record<ClipType, string> = {
  video: "#00B4D8",
  image: "#F59E0B",
  audio: "#8B5CF6",
  text: "#10B981",
};
