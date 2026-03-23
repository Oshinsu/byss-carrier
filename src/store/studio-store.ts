import { create } from "zustand";
import type { EditorState, Format, HistoryEntry, Clip } from "@/types/studio";
import { FORMAT_RESOLUTIONS, DEFAULT_TRACKS } from "@/types/studio";

/* ── localStorage persistence ── */

const STORAGE_KEY = "byss-studio-project";

function loadFromStorage(): Partial<EditorState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return {
      projectName: data.projectName ?? "Projet Sans Titre",
      format: data.format ?? "16:9",
      tracks: data.tracks ?? DEFAULT_TRACKS,
      assets: data.assets ?? [],
      zoom: data.zoom ?? 40,
    };
  } catch { return {}; }
}

export function saveToStorage(state: EditorState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projectName: state.projectName,
      format: state.format,
      tracks: state.tracks,
      assets: state.assets,
      zoom: state.zoom,
    }));
  } catch { /* quota exceeded */ }
}

/* ── Zustand Store ── */

export const useEditorStore = create<EditorState>((set, get) => {
  const stored = loadFromStorage();
  return {
    projectName: stored.projectName ?? "Projet Sans Titre",
    format: (stored.format as Format) ?? "16:9",
    resolution: FORMAT_RESOLUTIONS[(stored.format as Format) ?? "16:9"],
    fps: 30,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    tracks: stored.tracks ?? DEFAULT_TRACKS.map(t => ({ ...t })),
    assets: stored.assets ?? [],
    selectedClipId: null,
    zoom: stored.zoom ?? 40,
    history: [],
    historyIndex: -1,

    setProjectName: (name) => set({ projectName: name }),
    setFormat: (f) => set({ format: f, resolution: FORMAT_RESOLUTIONS[f] }),
    setCurrentTime: (t) => set({ currentTime: Math.max(0, t) }),
    setIsPlaying: (p) => set({ isPlaying: p }),
    setZoom: (z) => set({ zoom: Math.max(10, Math.min(200, z)) }),

    addAsset: (asset) => set((s) => ({ assets: [...s.assets, asset] })),
    removeAsset: (id) => set((s) => ({ assets: s.assets.filter(a => a.id !== id) })),

    addClip: (trackId, clip) => {
      get().pushHistory();
      set((s) => ({
        tracks: s.tracks.map(t =>
          t.id === trackId ? { ...t, clips: [...t.clips, { ...clip, trackId }] } : t
        ),
      }));
      get().recalcDuration();
    },

    removeClip: (trackId, clipId) => {
      get().pushHistory();
      set((s) => ({
        tracks: s.tracks.map(t =>
          t.id === trackId ? { ...t, clips: t.clips.filter(c => c.id !== clipId) } : t
        ),
        selectedClipId: s.selectedClipId === clipId ? null : s.selectedClipId,
      }));
      get().recalcDuration();
    },

    updateClip: (trackId, clipId, updates) => set((s) => ({
      tracks: s.tracks.map(t =>
        t.id === trackId
          ? { ...t, clips: t.clips.map(c => c.id === clipId ? { ...c, ...updates } : c) }
          : t
      ),
    })),

    selectClip: (id) => set({ selectedClipId: id }),

    toggleTrackMute: (id) => set((s) => ({ tracks: s.tracks.map(t => t.id === id ? { ...t, muted: !t.muted } : t) })),
    toggleTrackLock: (id) => set((s) => ({ tracks: s.tracks.map(t => t.id === id ? { ...t, locked: !t.locked } : t) })),
    toggleTrackVisible: (id) => set((s) => ({ tracks: s.tracks.map(t => t.id === id ? { ...t, visible: !t.visible } : t) })),

    cutAtPlayhead: () => {
      const s = get();
      if (!s.selectedClipId) return;
      s.pushHistory();
      const ct = s.currentTime;
      set((state) => ({
        tracks: state.tracks.map(track => {
          const clipIndex = track.clips.findIndex(c => c.id === state.selectedClipId);
          if (clipIndex === -1) return track;
          const clip = track.clips[clipIndex];
          if (ct <= clip.startTime || ct >= clip.startTime + clip.duration) return track;
          const splitPoint = ct - clip.startTime;
          const leftClip: Clip = { ...clip, duration: splitPoint };
          const rightClip: Clip = { ...clip, id: `${clip.id}-r-${Date.now()}`, startTime: ct, duration: clip.duration - splitPoint, name: `${clip.name} (2)` };
          const newClips = [...track.clips];
          newClips.splice(clipIndex, 1, leftClip, rightClip);
          return { ...track, clips: newClips };
        }),
      }));
    },

    deleteSelected: () => {
      const s = get();
      if (!s.selectedClipId) return;
      for (const track of s.tracks) {
        const clip = track.clips.find(c => c.id === s.selectedClipId);
        if (clip) { s.removeClip(track.id, clip.id); return; }
      }
    },

    undo: () => set((s) => {
      if (s.historyIndex < 0) return s;
      const entry = s.history[s.historyIndex];
      return { tracks: entry.tracks, assets: entry.assets, historyIndex: s.historyIndex - 1 };
    }),

    redo: () => set((s) => {
      if (s.historyIndex >= s.history.length - 1) return s;
      const entry = s.history[s.historyIndex + 1];
      return { tracks: entry ? entry.tracks : s.tracks, assets: entry ? entry.assets : s.assets, historyIndex: s.historyIndex + 1 };
    }),

    pushHistory: () => set((s) => {
      const entry: HistoryEntry = { tracks: JSON.parse(JSON.stringify(s.tracks)), assets: [...s.assets] };
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > 50) newHistory.shift();
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    }),

    loadTemplate: (template) => {
      get().pushHistory();
      set({ format: template.format, resolution: FORMAT_RESOLUTIONS[template.format], tracks: JSON.parse(JSON.stringify(template.tracks)), duration: template.duration, currentTime: 0, selectedClipId: null });
    },

    recalcDuration: () => set((s) => {
      let maxEnd = 0;
      for (const t of s.tracks) for (const c of t.clips) { const end = c.startTime + c.duration; if (end > maxEnd) maxEnd = end; }
      return { duration: Math.max(maxEnd, 10) };
    }),
  };
});
