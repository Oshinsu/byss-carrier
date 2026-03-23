"use client";

import { useParams, useRouter } from "next/navigation";
import { Cpu } from "lucide-react";
import { PROJECTS, LONTAN_EPISODES, CESAIRE_SEQUENCES } from "@/lib/data/projects-registry";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectResources } from "@/components/projects/project-resources";
import { ProductionTimelineSection } from "@/components/projects/project-timeline";
import {
  ExternalProjectSection,
  MoostikSection,
  Apex972Section,
  CadiforSection,
  ToxicSection,
  ByssNewsSection,
  FM12Section,
  EveilSection,
  LigneeSection,
  SOTAISection,
} from "@/components/projects/project-stats";

/* ═══════════════════════════════════════════════════════════════
   PROJECT PAGE — Composition of extracted modules
   ═══════════════════════════════════════════════════════════════ */

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const project = PROJECTS[slug];

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Cpu className="h-12 w-12 text-[var(--color-text-muted)]" />
        <p className="text-lg text-[var(--color-text-muted)]">Projet introuvable</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  /* ─── Render project-specific content ─── */
  const renderContent = () => {
    switch (slug) {
      case "moostik":
        return <MoostikSection />;
      case "apex-972":
        return <Apex972Section />;
      case "cadifor":
        return <CadiforSection />;
      case "toxic":
        return <ToxicSection />;
      case "byss-news":
        return <ByssNewsSection />;
      case "fm12":
        return <FM12Section />;
      case "an-tan-lontan":
        return <ProductionTimelineSection title="An tan lontan — 10 Épisodes" items={LONTAN_EPISODES} />;
      case "cesaire-pixar":
        return <ProductionTimelineSection title="Césaire Pixar — 10 Séquences" items={CESAIRE_SEQUENCES} />;
      case "eveil":
        return <EveilSection />;
      case "lignee":
        return <LigneeSection />;
      case "sotai":
        return <SOTAISection />;
      default:
        return <ExternalProjectSection project={project} />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ═══ Hero ═══ */}
      <ProjectHeader project={project} />

      {/* ═══ Project Content ═══ */}
      {renderContent()}

      {/* ═══ Social Links Footer ═══ */}
      <ProjectResources />
    </div>
  );
}
