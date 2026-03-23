"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search, Users, Building, Network, Globe, Eye,
  TrendingUp, Landmark, Newspaper, UserCheck,
  Plus, Star, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { IntelDomain } from "@/types";

/* ═══════════════════════════════════════════════════════
   INTELLIGENCE CARTOGRAPHY — Shared component for 5 domains
   Economique, Institutionnelle, Media, Politique, Sociale
   ═══════════════════════════════════════════════════════ */

const DOMAIN_CONFIG: Record<IntelDomain, {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  entityTypes: string[];
}> = {
  economique: {
    title: "Cartographie Economique",
    subtitle: "Reseaux economiques, flux financiers, groupes industriels Martinique",
    icon: TrendingUp,
    color: "#00B4D8",
    entityTypes: ["Groupe", "Entreprise", "Holding", "Association patronale", "Banque", "Fonciere"],
  },
  institutionnelle: {
    title: "Cartographie Institutionnelle",
    subtitle: "CTM, prefectures, services deconcentres, agences publiques",
    icon: Landmark,
    color: "#3B82F6",
    entityTypes: ["CTM", "Prefecture", "Mairie", "Agence", "Chambre consulaire", "Etablissement public"],
  },
  media: {
    title: "Cartographie Media",
    subtitle: "Presse, radio, TV, influenceurs, reseaux sociaux Martinique",
    icon: Newspaper,
    color: "#8B5CF6",
    entityTypes: ["Journal", "Radio", "TV", "Blog", "Influenceur", "Agence de presse"],
  },
  politique: {
    title: "Cartographie Politique",
    subtitle: "Elus, partis, mouvements, 34 maires, 51 conseillers CTM",
    icon: UserCheck,
    color: "#EF4444",
    entityTypes: ["Parti", "Elu", "Mouvement", "Syndicat", "Association politique", "Lobby"],
  },
  sociale: {
    title: "Cartographie Sociale",
    subtitle: "Associations, ONG, mouvements sociaux, leaders d'opinion",
    icon: Users,
    color: "#10B981",
    entityTypes: ["Association", "ONG", "Syndicat", "Collectif", "Leader communautaire", "Reseau"],
  },
};

interface IntelEntity {
  id: string;
  name: string;
  type: string | null;
  description: string | null;
  influence_score: number;
  contacts: Array<{ name: string; role: string; email?: string; phone?: string }>;
  relationships: Array<{ entity_id: string; type: string; strength: number }>;
  tags: string[];
}

interface IntelCartographyProps {
  domain: IntelDomain;
}

export function IntelCartography({ domain }: IntelCartographyProps) {
  const config = DOMAIN_CONFIG[domain];
  const Icon = config.icon;

  const [entities, setEntities] = useState<IntelEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("intel_entities")
      .select("*")
      .eq("domain", domain)
      .order("influence_score", { ascending: false })
      .then(({ data }) => {
        if (data) setEntities(data as IntelEntity[]);
        setLoading(false);
      });
  }, [domain]);

  const filtered = useMemo(() => {
    let result = entities;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedType) {
      result = result.filter((e) => e.type === selectedType);
    }
    return result;
  }, [entities, searchQuery, selectedType]);

  const stats = useMemo(() => ({
    total: entities.length,
    withContacts: entities.filter((e) => e.contacts && e.contacts.length > 0).length,
    avgInfluence: entities.length > 0
      ? (entities.reduce((s, e) => s + e.influence_score, 0) / entities.length).toFixed(1)
      : "0",
    types: new Set(entities.map((e) => e.type).filter(Boolean)).size,
  }), [entities]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            <span style={{ color: config.color }}>{config.title.split(" ")[1]}</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{config.subtitle}</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-black" style={{ backgroundColor: config.color }}>
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Entites", value: stats.total, icon: Building },
          { label: "Avec contacts", value: stats.withContacts, icon: Users },
          { label: "Influence moy.", value: stats.avgInfluence, icon: Star },
          { label: "Types", value: stats.types, icon: Network },
        ].map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <div className="flex items-center gap-2">
                <SIcon className="h-4 w-4" style={{ color: config.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>{s.label}</span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Type Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une entite..."
            className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none transition-colors"
            style={{ borderColor: searchQuery ? config.color : undefined }}
          />
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType(null)}
          className={cn("rounded-full px-3 py-1 text-xs font-medium transition-all", !selectedType ? "text-black" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}
          style={!selectedType ? { backgroundColor: config.color } : undefined}
        >
          Tous
        </button>
        {config.entityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={cn("rounded-full px-3 py-1 text-xs font-medium transition-all", selectedType === type ? "text-black" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}
            style={selectedType === type ? { backgroundColor: config.color } : undefined}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Entity List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-12 text-center">
          <Eye className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" />
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            {searchQuery ? `Aucune entite pour "${searchQuery}"` : `Aucune entite dans le domaine ${domain}`}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Ajoutez des entites via le bouton + ou importez depuis le fichier SOSO.txt
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entity, i) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-colors hover:border-opacity-60"
              style={{ borderLeftColor: config.color, borderLeftWidth: "3px" }}
            >
              <button
                onClick={() => setExpandedId(expandedId === entity.id ? null : entity.id)}
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                {/* Influence badge */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                  {entity.influence_score}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">{entity.name}</h3>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{entity.description || entity.type}</p>
                </div>

                {entity.type && (
                  <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[9px] font-medium uppercase text-[var(--color-text-muted)]">
                    {entity.type}
                  </span>
                )}

                {entity.contacts && entity.contacts.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                    <Users className="h-3 w-3" />
                    {entity.contacts.length}
                  </span>
                )}

                {entity.tags.length > 0 && (
                  <div className="hidden gap-1 xl:flex">
                    {entity.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded px-1.5 py-0.5 text-[8px] font-medium" style={{ backgroundColor: `${config.color}10`, color: config.color }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>

              {/* Expanded detail */}
              {expandedId === entity.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-[var(--color-border-subtle)] px-4 py-3"
                >
                  {entity.description && (
                    <p className="mb-3 text-xs leading-relaxed text-[var(--color-text-muted)]">{entity.description}</p>
                  )}

                  {entity.contacts && entity.contacts.length > 0 && (
                    <div className="mb-3">
                      <h4 className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>Contacts</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {entity.contacts.map((c, ci) => (
                          <div key={ci} className="rounded bg-[var(--color-surface-2)] p-2">
                            <p className="text-xs font-semibold text-[var(--color-text)]">{c.name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{c.role}</p>
                            {c.email && <p className="text-[10px] text-[var(--color-cyan)]">{c.email}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entity.tags.map((tag) => (
                        <span key={tag} className="rounded px-2 py-0.5 text-[9px] font-medium" style={{ backgroundColor: `${config.color}10`, color: config.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          {filtered.length} entite{filtered.length > 1 ? "s" : ""} — Domaine {domain}
        </p>
      )}
    </div>
  );
}
