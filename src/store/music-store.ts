import { create } from "zustand";

export interface Track {
  title: string;
  videoId: string;
}

export const PLAYLIST: Track[] = [
  { title: "Light of the Seven \u2014 GoT", videoId: "w1GaGdGYQ1g" },
  { title: "Rains of Castamere \u2014 Piano", videoId: "ECewrAld3zw" },
  { title: "HOTD Main Theme \u2014 Piano", videoId: "fIhKqaPavXs" },
  { title: "The Night King \u2014 GoT", videoId: "k1frgt0MEHo" },
  { title: "Imperial March \u2014 Piano", videoId: "s3SZ5sIMY6o" },
  { title: "Across the Stars \u2014 Piano", videoId: "9nk_LrRqBJU" },
  { title: "Interstellar \u2014 Piano", videoId: "4y33h81phKU" },
  { title: "Time \u2014 Hans Zimmer Piano", videoId: "jgyShFzdB_Q" },
  { title: "Experience \u2014 Ludovico Einaudi", videoId: "hN_q-_nGv4U" },
  { title: "Nuvole Bianche \u2014 Einaudi", videoId: "kcihcYEOeic" },
];

interface MusicState {
  isExpanded: boolean;
  isPlaying: boolean;
  currentTrackIndex: number;
  showTrackList: boolean;
  setExpanded: (expanded: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
  setShowTrackList: (show: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
  toggleExpanded: () => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  isExpanded: false,
  isPlaying: false,
  currentTrackIndex: 0,
  showTrackList: false,
  setExpanded: (expanded) => set({ isExpanded: expanded }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index, isPlaying: true }),
  setShowTrackList: (show) => set({ showTrackList: show }),
  nextTrack: () =>
    set((state) => ({
      currentTrackIndex: (state.currentTrackIndex + 1) % PLAYLIST.length,
      isPlaying: true,
    })),
  prevTrack: () =>
    set((state) => ({
      currentTrackIndex:
        state.currentTrackIndex === 0
          ? PLAYLIST.length - 1
          : state.currentTrackIndex - 1,
      isPlaying: true,
    })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded, showTrackList: false })),
}));
