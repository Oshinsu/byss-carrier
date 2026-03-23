"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useVillageRPG,
  AGENT_DISPLAY,
  type InterAgentMessage,
  type MessageType,
} from "@/lib/village/rpg-engine";

// ── Helpers ──────────────────────────────────────────────────────

const MESSAGE_TYPE_COLORS: Record<MessageType, string> = {
  request: "border-l-blue-400",
  response: "border-l-emerald-400",
  alert: "border-l-red-400",
  insight: "border-l-purple-400",
};

const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  request: "REQ",
  response: "RES",
  alert: "ALRT",
  insight: "PHI",
};

const MESSAGE_TYPE_BG: Record<MessageType, string> = {
  request: "bg-blue-500/10 text-blue-400",
  response: "bg-emerald-500/10 text-emerald-400",
  alert: "bg-red-500/10 text-red-400",
  insight: "bg-purple-500/10 text-purple-400",
};

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getAgentLabel(id: string): { name: string; color: string } {
  if (id === "all") return { name: "Tous", color: "#6B7280" };
  if (id === "gary") return { name: "Gary", color: "#F59E0B" };
  const display = AGENT_DISPLAY[id as keyof typeof AGENT_DISPLAY];
  return display
    ? { name: display.name, color: display.color }
    : { name: id, color: "#6B7280" };
}

// ── Message Bubble ──────────────────────────────────────────────

function MessageBubble({ message }: { message: InterAgentMessage }) {
  const from = getAgentLabel(message.from);
  const to = getAgentLabel(message.to);
  const typeColor = MESSAGE_TYPE_COLORS[message.type];
  const typeBg = MESSAGE_TYPE_BG[message.type];
  const typeLabel = MESSAGE_TYPE_LABELS[message.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      className={`rounded-lg border-l-2 bg-[#0A0A14] px-4 py-3 ${typeColor}`}
    >
      {/* Header */}
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: from.color }}>
          {from.name}
        </span>
        <span className="text-[10px] text-cyan-500/30">&rarr;</span>
        <span className="text-xs" style={{ color: to.color }}>
          {to.name}
        </span>
        <span
          className={`ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold ${typeBg}`}
        >
          {typeLabel}
        </span>
      </div>

      {/* Content */}
      <p className="text-[11px] leading-relaxed text-cyan-200/80">
        {message.content}
      </p>

      {/* Timestamp */}
      <p className="mt-1.5 text-[9px] text-cyan-500/30">
        {formatTime(message.timestamp)}
      </p>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────

export default function MessageFeed() {
  const { feed, isActive } = useVillageRPG();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [feed.length]);

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0F0F1A] p-6 font-[family-name:var(--font-clash)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-cyan-50">
            Flux Inter-Agents
          </h2>
          <p className="text-xs text-cyan-500/50">
            {feed.length} messages &middot;{" "}
            {isActive ? "En direct" : "En pause"}
          </p>
        </div>
        {isActive && (
          <span className="flex items-center gap-1.5 text-[10px] text-cyan-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            LIVE
          </span>
        )}
      </div>

      {/* Feed */}
      <div
        ref={scrollRef}
        className="max-h-[420px] space-y-2 overflow-y-auto pr-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,180,216,0.15) transparent",
        }}
      >
        {feed.length === 0 ? (
          <div className="py-12 text-center text-xs text-cyan-500/30">
            Le silence precede la parole. Active le Village.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {feed.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-cyan-500/10 pt-3">
        {(Object.entries(MESSAGE_TYPE_BG) as [MessageType, string][]).map(
          ([type, bg]) => (
            <span key={type} className="flex items-center gap-1">
              <span
                className={`rounded px-1 py-0.5 text-[8px] font-bold ${bg}`}
              >
                {MESSAGE_TYPE_LABELS[type]}
              </span>
              <span className="text-[9px] capitalize text-cyan-500/30">
                {type}
              </span>
            </span>
          )
        )}
      </div>
    </div>
  );
}
