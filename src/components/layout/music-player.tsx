"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  ChevronDown,
  ChevronUp,
  List,
} from "lucide-react";
import { useMusicStore, PLAYLIST } from "@/store/music-store";

/* ================================================================
   THE EXECUTOR — Music Player
   Imperial ambient. Floating bottom-right. Cyan hologram aesthetic.
   Persists across navigation via Zustand.
   ================================================================ */

const CYAN = "#00D4FF";

export function MusicPlayer() {
  const {
    isExpanded,
    isPlaying,
    currentTrackIndex,
    showTrackList,
    toggleExpanded,
    togglePlay,
    nextTrack,
    prevTrack,
    setCurrentTrackIndex,
    setShowTrackList,
    setPlaying,
  } = useMusicStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  /* Build YouTube embed URL */
  const embedUrl = `https://www.youtube-nocookie.com/embed/${currentTrack.videoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&loop=0&controls=0&rel=0`;

  /* Post message to YouTube iframe to play/pause */
  const postCommand = useCallback(
    (command: string) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: command,
            args: [],
          }),
          "*"
        );
      }
    },
    []
  );

  useEffect(() => {
    if (isPlaying) {
      postCommand("playVideo");
    } else {
      postCommand("pauseVideo");
    }
  }, [isPlaying, postCommand]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ── Collapsed: tiny cyan circle ── */
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleExpanded}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: "rgba(10,22,40,0.9)",
              border: `1px solid rgba(0,212,255,${isPlaying ? "0.5" : "0.2"})`,
              boxShadow: isPlaying
                ? "0 0 15px rgba(0,212,255,0.3), 0 0 30px rgba(0,212,255,0.1)"
                : "none",
            }}
            title="Music Player"
          >
            <Music className="h-4 w-4" style={{ color: CYAN }} />
          </motion.button>
        ) : (
          /* ── Expanded: mini player card ── */
          <motion.div
            key="expanded"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="imperial-glass flex w-[280px] flex-col overflow-hidden rounded-xl"
            style={{
              boxShadow: "0 0 30px rgba(0,212,255,0.1), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}
            >
              <div className="flex items-center gap-2">
                <Music className="h-3.5 w-3.5" style={{ color: CYAN }} />
                <span
                  className="text-[11px] font-medium tracking-wider uppercase"
                  style={{ color: `${CYAN}90` }}
                >
                  Bridge Audio
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowTrackList(!showTrackList)}
                  className="rounded p-1 transition-colors hover:bg-[rgba(0,212,255,0.1)]"
                  title="Track list"
                >
                  <List className="h-3.5 w-3.5" style={{ color: `${CYAN}70` }} />
                </button>
                <button
                  onClick={toggleExpanded}
                  className="rounded p-1 transition-colors hover:bg-[rgba(0,212,255,0.1)]"
                  title="Collapse"
                >
                  <X className="h-3.5 w-3.5" style={{ color: `${CYAN}70` }} />
                </button>
              </div>
            </div>

            {/* Track info */}
            <div className="px-3 pt-2.5 pb-1">
              <p
                className="truncate text-xs font-medium"
                style={{ color: "#D0D8E8" }}
              >
                {currentTrack.title}
              </p>
              <p className="mt-0.5 text-[10px]" style={{ color: `${CYAN}50` }}>
                Track {currentTrackIndex + 1} / {PLAYLIST.length}
              </p>
            </div>

            {/* Hidden YouTube iframe (audio only) */}
            <div className="h-0 w-0 overflow-hidden">
              <iframe
                ref={iframeRef}
                key={`${currentTrack.videoId}-${currentTrackIndex}`}
                src={embedUrl}
                width="1"
                height="1"
                allow="autoplay"
                title="Music Player"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 px-3 py-3">
              <button
                onClick={prevTrack}
                className="rounded-full p-1.5 transition-colors hover:bg-[rgba(0,212,255,0.1)]"
              >
                <SkipBack className="h-4 w-4" style={{ color: `${CYAN}80` }} />
              </button>
              <button
                onClick={() => {
                  if (!isPlaying) {
                    setPlaying(true);
                  } else {
                    togglePlay();
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${CYAN}, #0099CC)`,
                  boxShadow: `0 0 15px rgba(0,212,255,0.3)`,
                }}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" style={{ color: "#06080F" }} />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" style={{ color: "#06080F" }} />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="rounded-full p-1.5 transition-colors hover:bg-[rgba(0,212,255,0.1)]"
              >
                <SkipForward className="h-4 w-4" style={{ color: `${CYAN}80` }} />
              </button>
            </div>

            {/* Track list dropdown */}
            <AnimatePresence>
              {showTrackList && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                  style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}
                >
                  <div className="max-h-[200px] overflow-y-auto p-1.5">
                    {PLAYLIST.map((track, i) => (
                      <button
                        key={track.videoId}
                        onClick={() => {
                          setCurrentTrackIndex(i);
                          setShowTrackList(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] transition-colors"
                        style={{
                          background:
                            i === currentTrackIndex
                              ? "rgba(0,212,255,0.1)"
                              : "transparent",
                          color:
                            i === currentTrackIndex ? CYAN : "rgba(208,216,232,0.7)",
                        }}
                      >
                        <span
                          className="w-4 shrink-0 text-center text-[10px]"
                          style={{
                            color:
                              i === currentTrackIndex
                                ? CYAN
                                : "rgba(0,212,255,0.3)",
                          }}
                        >
                          {i === currentTrackIndex && isPlaying ? "\u25B6" : `${i + 1}`}
                        </span>
                        <span className="truncate">{track.title}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
