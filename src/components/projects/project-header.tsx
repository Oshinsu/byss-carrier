"use client";

import { motion } from "motion/react";
import { Cpu, ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ProjectData, projectStatusConfig } from "@/lib/data/projects-registry";

/* ═══════════════════════════════════════════════════════════════
   PROJECT HEADER — Hero section with name, status, tech stack, links
   ═══════════════════════════════════════════════════════════════ */

export function ProjectHeader({ project }: { project: ProjectData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8"
    >
      {/* Accent gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${project.color}, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <Cpu className="h-7 w-7" style={{ color: project.color }} />
          </div>
          <div>
            <h1
              className="font-[family-name:var(--font-clash-display)] text-3xl font-bold"
              style={{ color: project.color }}
            >
              {project.name}
            </h1>
            <p className="mt-1 max-w-lg text-sm text-[var(--color-text-muted)]">
              {project.description}
            </p>

            {/* Status + Tech Stack */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-3 py-0.5 text-[10px] font-semibold", projectStatusConfig[project.status]?.bg, projectStatusConfig[project.status]?.color)}>
                {project.status}
              </span>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
