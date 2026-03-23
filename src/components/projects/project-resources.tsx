"use client";

import { motion } from "motion/react";
import { Youtube, Instagram, Music, Github } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data/projects-registry";

/* ═══════════════════════════════════════════════════════════════
   PROJECT RESOURCES — Social links, docs, repos footer
   ═══════════════════════════════════════════════════════════════ */

export function ProjectResources() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        BYSS GROUP — Liens
      </h3>
      <div className="flex flex-wrap gap-3">
        <a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] transition-all hover:text-[#FF0000] hover:bg-[#FF0000]/10"
        >
          <Youtube className="h-4 w-4" />
          YouTube
        </a>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] transition-all hover:text-[#E4405F] hover:bg-[#E4405F]/10"
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </a>
        <a
          href={SOCIAL_LINKS.soundcloud}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] transition-all hover:text-[#FF5500] hover:bg-[#FF5500]/10"
        >
          <Music className="h-4 w-4" />
          SoundCloud
        </a>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] transition-all hover:text-white hover:bg-white/10"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </motion.div>
  );
}
