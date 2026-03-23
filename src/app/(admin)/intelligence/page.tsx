"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Landmark,
  Tv,
  Vote,
  Users,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Eye,
  Link2,
  Filter,
  BarChart3,
  Banknote,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
interface Entity {
  id: string;
  name: string;
  type: string;
  influence: number; // 0-10
  contacts: string[];
  relationships: string[];
  details: string;
  domain: DomainKey;
}

type DomainKey = "economique" | "institutionnelle" | "medias" | "politique" | "sociale";

interface Domain {
  key: DomainKey;
  name: string;
  icon: typeof Building2;
  color: string;
  description: string;
}

/* ═══════════════════════════════════════════════════════════════
   DOMAINS
   ═══════════════════════════════════════════════════════════════ */
const DOMAINS: Domain[] = [
  {
    key: "economique",
    name: "Économique",
    icon: Building2,
    color: "#00B4D8",
    description: "Békés, réseaux économiques, acteurs majeurs, flux financiers",
  },
  {
    key: "institutionnelle",
    name: "Institutionnelle",
    icon: Landmark,
    color: "#3B82F6",
    description: "CTM, Préfecture, Communes, contacts clés institutionnels",
  },
  {
    key: "medias",
    name: "Médias",
    icon: Tv,
    color: "#F59E0B",
    description: "RCI, France-Antilles, Martinique 1ère, influenceurs",
  },
  {
    key: "politique",
    name: "Politique",
    icon: Vote,
    color: "#EF4444",
    description: "PPM, MIM, partis, élus, rapport de force territorial",
  },
  {
    key: "sociale",
    name: "Sociale",
    icon: Users,
    color: "#10B981",
    description: "Associations, syndicats, société civile, mouvements",
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAP DB ROW → Entity
   ═══════════════════════════════════════════════════════════════ */
function mapRowToEntity(row: Record<string, unknown>): Entity {
  const contacts = row.contacts as Record<string, unknown> | null;
  const contactList: string[] = [];
  if (contacts) {
    if (Array.isArray(contacts)) {
      contactList.push(...contacts.map(String));
    } else if (typeof contacts === "object") {
      Object.values(contacts).forEach((v) => {
        if (v) contactList.push(String(v));
      });
    }
  }

  const tags = row.tags as string[] | null;

  return {
    id: row.id as string,
    name: (row.name as string) || "Sans nom",
    type: (row.type as string) || "",
    influence: Number(row.influence_score) || 0,
    contacts: contactList,
    relationships: tags || [],
    details: (row.description as string) || (row.notes as string) || "",
    domain: (row.domain as DomainKey) || "economique",
  };
}

/* ═══════════════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════════════ */
function EntitySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#1A1A2E] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-[#1A1A2E] animate-pulse" />
              <div className="h-2 w-24 rounded bg-[#1A1A2E] animate-pulse" />
            </div>
            <div className="h-4 w-4 rounded bg-[#1A1A2E] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INFLUENCE BAR COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function InfluenceBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ delay, duration: 0.6 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold" style={{ color }}>
        {value}/10
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENTITY CARD
   ═══════════════════════════════════════════════════════════════ */
function EntityCard({
  entity,
  color,
  delay = 0,
  expanded,
  onToggle,
}: {
  entity: Entity;
  color: string;
  delay?: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "rounded-xl border transition-all cursor-pointer",
        expanded
          ? "border-[var(--color-gold)] shadow-[var(--shadow-gold)]"
          : "border-[var(--color-border-subtle)] hover:border-[var(--color-gold-muted)]"
      )}
    >
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-4 text-left">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Star className="h-5 w-5" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-[var(--color-text)]">{entity.name}</h4>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {entity.type}
            </span>
          </div>
          <InfluenceBar value={entity.influence} color={color} delay={delay} />
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform",
            expanded && "rotate-90"
          )}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border-subtle)] px-4 py-4 space-y-3">
              {/* Details */}
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                {entity.details}
              </p>

              {/* Contacts */}
              {entity.contacts.length > 0 && (
                <div>
                  <h5 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Contacts
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {entity.contacts.map((c) => (
                      <span
                        key={c}
                        className="flex items-center gap-1 rounded-md bg-[var(--color-surface-2)] px-2 py-1 text-[11px] text-[var(--color-text-muted)]"
                      >
                        <Mail className="h-3 w-3" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relationships */}
              {entity.relationships.length > 0 && (
                <div>
                  <h5 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Relations
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {entity.relationships.map((r) => (
                      <span
                        key={r}
                        className="flex items-center gap-1 rounded-full border border-[var(--color-border-subtle)] px-2.5 py-0.5 text-[10px] text-[var(--color-text-muted)]"
                      >
                        <Link2 className="h-2.5 w-2.5" />
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA SECTION (Elections / Fiscalite)
   ═══════════════════════════════════════════════════════════════ */
function DataSection({
  title,
  icon: Icon,
  iconColor,
  type,
  scriptPath,
  emptyText,
}: {
  title: string;
  icon: typeof Vote;
  iconColor: string;
  type: string;
  scriptPath: string;
  emptyText: string;
}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("intel_entities")
      .select("*")
      .eq("type", type)
      .order("name", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        setRows(data || []);
        setLoading(false);
        setLoaded(true);
      });
  }, [open, loaded, type]);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-raised)]/30"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
          <p className="text-[10px] text-[var(--color-text-muted)]">{emptyText}</p>
        </div>
        {loaded && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
          >
            {rows.length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-[var(--color-border-subtle)]"
          >
            <div className="max-h-80 overflow-y-auto p-4">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-[#1A1A2E] animate-pulse" />
                  ))}
                </div>
              ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Terminal className="mb-2 h-6 w-6 text-[var(--color-text-muted)]" />
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Donnees en cours de chargement
                  </p>
                  <code className="mt-2 rounded-md bg-[var(--color-surface-raised)] px-3 py-1.5 text-[10px] text-[var(--color-gold)]">
                    node {scriptPath}
                  </code>
                </div>
              ) : (
                <div className="space-y-2">
                  {rows.map((row) => {
                    const name = String(row.name || "");
                    const desc = String(row.description || "");
                    const tags = (row.tags as string[]) || [];
                    return (
                      <div
                        key={String(row.id)}
                        className="rounded-lg border border-[var(--color-border-subtle)] p-3 transition-colors hover:border-[var(--color-gold-muted)]"
                      >
                        <h4 className="text-xs font-semibold text-[var(--color-text)]">{name}</h4>
                        <p className="mt-1 text-[10px] leading-relaxed text-[var(--color-text-muted)]">
                          {desc.length > 200 ? desc.slice(0, 200) + "..." : desc}
                        </p>
                        {tags.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {tags.slice(0, 5).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[var(--color-surface-raised)] px-1.5 py-0.5 text-[9px] text-[var(--color-text-muted)]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADD ENTITY MODAL
   ═══════════════════════════════════════════════════════════════ */
function AddEntityModal({
  open,
  onClose,
  activeDomain,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  activeDomain: DomainKey;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    influence: 5,
    contacts: "",
    relationships: "",
    details: "",
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  if (!open) return null;

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const contactsArr = formData.contacts
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const tagsArr = formData.relationships
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      const { error } = await supabase.from("intel_entities").insert({
        name: formData.name,
        type: formData.type,
        influence_score: formData.influence,
        contacts: contactsArr,
        tags: tagsArr,
        description: formData.details,
        domain: activeDomain,
      });

      if (error) { toast("Erreur: " + error.message, "error"); return; }
      toast(`Entité ajoutée — ${formData.name}`, "success");
      setFormData({ name: "", type: "", influence: 5, contacts: "", relationships: "", details: "" });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Ajouter une entité
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom de l'entité..."
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Entreprise, Institution, Parti..."
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
          </div>

          {/* Influence */}
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-[var(--color-text-muted)]">
              <span>Score d&apos;influence</span>
              <span className="text-[var(--color-gold)]">{formData.influence}/10</span>
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={formData.influence}
              onChange={(e) => setFormData({ ...formData, influence: Number(e.target.value) })}
              className="w-full accent-[var(--color-gold)]"
            />
          </div>

          {/* Contacts */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Contacts (séparés par virgule)</label>
            <input
              type="text"
              value={formData.contacts}
              onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
              placeholder="email@example.com, 0696..."
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
          </div>

          {/* Relationships */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Relations (séparées par virgule)</label>
            <input
              type="text"
              value={formData.relationships}
              onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
              placeholder="CTM, PPM, GBH..."
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
          </div>

          {/* Details */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Détails</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Description, rôle, influence..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
          </div>

          {/* Domain indicator */}
          <div className="rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
            Domaine : <span className="font-semibold text-[var(--color-gold)]">{DOMAINS.find((d) => d.key === activeDomain)?.name}</span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving || !formData.name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Enregistrement..." : "Ajouter l'entité"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INTELLIGENCE PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function IntelligencePage() {
  const [activeDomain, setActiveDomain] = useState<DomainKey>("economique");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  /* ─── Fetch entities from Supabase ─── */
  const fetchEntities = () => {
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("intel_entities")
      .select("*")
      .order("influence_score", { ascending: false })
      .then(({ data }) => {
        setEntities((data || []).map(mapRowToEntity));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const activeDomainData = DOMAINS.find((d) => d.key === activeDomain)!;

  /* ─── Filter entities ─── */
  const filteredEntities = useMemo(() => {
    let list = entities.filter((e) => e.domain === activeDomain);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = entities.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          e.relationships.some((r) => r.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => b.influence - a.influence);
  }, [entities, activeDomain, searchQuery]);

  const totalEntities = entities.length;

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of DOMAINS) {
      counts[d.key] = entities.filter((e) => e.domain === d.key).length;
    }
    return counts;
  }, [entities]);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <PageHeader
          title="Intelligence"
          titleAccent="Cartography"
          subtitle={`Cartographie territoriale. ${totalEntities} entités. 5 domaines.`}
          actions={
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--color-gold-glow)] px-3 py-1.5">
              <BarChart3 className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">
                {totalEntities}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">entités</span>
            </div>
          }
        />
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ── Domain tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeDomain === domain.key;
            return (
              <button
                key={domain.key}
                onClick={() => {
                  setActiveDomain(domain.key);
                  setSearchQuery("");
                  setExpandedEntity(null);
                }}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-2 shadow-lg"
                    : "border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)]"
                )}
                style={
                  isActive
                    ? {
                        borderColor: domain.color,
                        backgroundColor: `${domain.color}10`,
                        color: domain.color,
                        boxShadow: `0 4px 20px ${domain.color}20`,
                      }
                    : undefined
                }
              >
                <Icon className="h-4 w-4" />
                {domain.name}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-white/20" : "bg-[var(--color-surface-2)]"
                  )}
                >
                  {domainCounts[domain.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Domain description ── */}
        <motion.div
          key={activeDomain}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${activeDomainData.color}15` }}
            >
              <activeDomainData.icon className="h-5 w-5" style={{ color: activeDomainData.color }} />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
                Cartographie {activeDomainData.name}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">{activeDomainData.description}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Search + Add ── */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une entité, un type, une relation..."
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
            {searchQuery && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold-glow)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-gold)]">
                {filteredEntities.length} résultats
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {/* ── Entity list ── */}
        {loading ? (
          <EntitySkeleton />
        ) : (
          <div className="space-y-3">
            {filteredEntities.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-12">
                <Search className="mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  {searchQuery ? "Aucun résultat pour cette recherche" : "Aucune entité dans ce domaine"}
                </p>
              </div>
            ) : (
              filteredEntities.map((entity, i) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  color={searchQuery ? DOMAINS.find((d) => d.key === entity.domain)?.color ?? activeDomainData.color : activeDomainData.color}
                  delay={i * 0.04}
                  expanded={expandedEntity === entity.id}
                  onToggle={() => setExpandedEntity(expandedEntity === entity.id ? null : entity.id)}
                />
              ))
            )}
          </div>
        )}

        {/* ── Domain overview (mini cards at bottom) ── */}
        {!searchQuery && !loading && (
          <div className="mt-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Tous les domaines
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {DOMAINS.map((domain, i) => {
                const Icon = domain.icon;
                const count = domainCounts[domain.key] ?? 0;
                const isActive = activeDomain === domain.key;
                const domainEntities = entities.filter((e) => e.domain === domain.key);
                const avgInfluence = count > 0
                  ? Math.round(domainEntities.reduce((s, e) => s + e.influence, 0) / count)
                  : 0;
                return (
                  <motion.button
                    key={domain.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    onClick={() => {
                      setActiveDomain(domain.key);
                      setExpandedEntity(null);
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-center transition-all",
                      isActive
                        ? "border-[var(--color-gold)] shadow-[var(--shadow-gold)]"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-gold-muted)]"
                    )}
                  >
                    <div
                      className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${domain.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: domain.color }} />
                    </div>
                    <h4 className="text-xs font-semibold text-[var(--color-text)]">{domain.name}</h4>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{count} entités</p>
                    {/* Avg influence */}
                    {count > 0 && (
                      <div className="mt-2 flex justify-center">
                        <InfluenceBar
                          value={avgInfluence}
                          color={domain.color}
                          delay={0.4 + i * 0.05}
                        />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Elections + Fiscalite data sections ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Donnees open data 972
          </h3>
          <DataSection
            title="Elections"
            icon={Vote}
            iconColor="#EF4444"
            type="election"
            scriptPath="scripts/batch-elections-972.mjs"
            emptyText="Presidentielle 2022 — resultats par commune Martinique"
          />
          <DataSection
            title="Fiscalite"
            icon={Banknote}
            iconColor="#10B981"
            type="fiscalite"
            scriptPath="scripts/batch-fiscalite-972.mjs"
            emptyText="Impots locaux — TF, CFE, taux par commune 972"
          />
        </div>
      </div>

      {/* ── Modal ── */}
      <AddEntityModal
        open={showModal}
        onClose={() => setShowModal(false)}
        activeDomain={activeDomain}
        onSaved={fetchEntities}
      />
    </div>
  );
}
