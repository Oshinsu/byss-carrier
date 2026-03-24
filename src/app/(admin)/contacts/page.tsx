"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search, Users, Building, Mail, Phone, MapPin,
  Filter, SortAsc, Download, Plus, Star, X, Trash2,
  Zap, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { onContactAdded } from "@/lib/synergies";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════
   CONTACTS DIRECTORY — 540+ contacts cartographies
   Import depuis SOSO.txt : 71 emails verifies, 306 telephones
   Secteurs : Telecom, Hotellerie, Restauration, Tourisme, etc.
   ═══════════════════════════════════════════════════════ */

interface Contact {
  id: string;
  name: string;
  organization: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  sector: string | null;
  region: string | null;
  influence_score: number;
  tags: string[];
}

const SECTORS = [
  "Tous", "Telecom", "Hotellerie", "Restauration", "Tourisme",
  "Distillerie", "Institutionnel", "Media", "Immobilier", "Commerce",
];

const EMPTY_FORM = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  entreprise: "",
  fonction: "",
  vertical: "",
  influence_score: 5,
  siret: "",
  codeNAF: "",
  adresseEnrichie: "",
  effectif: "",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("Tous");
  const [sortBy, setSortBy] = useState<"name" | "influence">("influence");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enriched, setEnriched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    const supabase = createClient();
    try {
      const { data, error: fetchErr } = await supabase
        .from("contacts_directory")
        .select("*")
        .order("influence_score", { ascending: false });
      if (fetchErr) throw fetchErr;
      if (data) setContacts(data as Contact[]);
    } catch (err) {
      console.error("Contacts fetch error:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement des contacts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async () => {
    if (!formData.nom.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const fullName = [formData.prenom.trim(), formData.nom.trim()].filter(Boolean).join(" ");
    const { error } = await supabase.from("contacts_directory").insert({
      name: fullName,
      email: formData.email || null,
      phone: formData.telephone || null,
      organization: formData.entreprise || null,
      title: formData.fonction || null,
      sector: formData.vertical || null,
      influence_score: formData.influence_score,
      tags: [],
    });
    if (error) {
      toast("Erreur: " + error.message, "error");
      setSubmitting(false);
      return;
    }
    onContactAdded(fullName, formData.vertical || "");
    toast(`Contact ajouté — ${fullName}`, "success");
    setFormData(EMPTY_FORM);
    setShowAddForm(false);
    setSubmitting(false);
    setEnriched(false);
    await fetchContacts();
  };

  const handleDeleteContact = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("contacts_directory").delete().eq("id", id);
    if (error) {
      toast("Erreur: " + error.message, "error");
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast("Contact supprimé", "success");
  };

  const handleEnrichSirene = async () => {
    const entreprise = formData.entreprise.trim();
    if (!entreprise) {
      toast("Saisis un nom d'entreprise d'abord", "error");
      return;
    }
    setEnriching(true);
    setEnriched(false);
    try {
      const res = await fetch(`/api/sirene?q=${encodeURIComponent(entreprise)}`);
      if (!res.ok) throw new Error("Erreur API");
      const { results } = await res.json();
      if (!results || results.length === 0) {
        toast("Aucune entreprise trouvee dans SIRENE", "error");
        setEnriching(false);
        return;
      }
      const best = results[0];
      setFormData((prev) => ({
        ...prev,
        siret: best.siret || "",
        codeNAF: best.codeNAF || "",
        adresseEnrichie: [best.adresse, best.codePostal, best.commune].filter(Boolean).join(", "),
        effectif: best.trancheEffectif || best.effectif || "",
        entreprise: best.denomination || prev.entreprise,
      }));
      setEnriched(true);
      toast(`Enrichi via SIRENE — ${best.denomination}`, "success");
    } catch {
      toast("Echec enrichissement SIRENE", "error");
    } finally {
      setEnriching(false);
    }
  };

  const filtered = useMemo(() => {
    let result = contacts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.organization?.toLowerCase().includes(q) ||
          c.title?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }

    if (selectedSector !== "Tous") {
      result = result.filter((c) => c.sector?.toLowerCase() === selectedSector.toLowerCase());
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => b.influence_score - a.influence_score);
    }

    return result;
  }, [contacts, searchQuery, selectedSector, sortBy]);

  const stats = useMemo(() => ({
    total: contacts.length,
    withEmail: contacts.filter((c) => c.email).length,
    withPhone: contacts.filter((c) => c.phone).length,
    sectors: new Set(contacts.map((c) => c.sector).filter(Boolean)).size,
  }), [contacts]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <PageHeader
        title="Repertoire"
        titleAccent="Contacts"
        subtitle={`${stats.total} contacts — ${stats.withEmail} emails — ${stats.withPhone} telephones — ${stats.sectors} secteurs`}
        actions={
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        }
      />

      {/* Error Banner */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border px-5 py-4"
          style={{
            borderColor: "rgba(255,45,45,0.2)",
            background: "rgba(255,45,45,0.05)",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D2D" }} />
          <p className="flex-1 text-sm" style={{ color: "#FF6B6B" }}>
            {error}
          </p>
          <button
            onClick={() => { setError(null); setLoading(true); fetchContacts(); }}
            className="rounded-lg px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(0,212,255,0.1)",
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "#00D4FF" },
          { label: "Emails verifies", value: stats.withEmail, icon: Mail, color: "#10B981" },
          { label: "Telephones", value: stats.withPhone, icon: Phone, color: "#F59E0B" },
          { label: "Secteurs", value: stats.sectors, icon: Building, color: "#8B5CF6" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, entreprise, secteur..."
            className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === "name" ? "influence" : "name")}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <SortAsc className="h-3.5 w-3.5" />
          {sortBy === "name" ? "A-Z" : "Influence"}
        </button>
      </div>

      {/* Sector tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTORS.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              selectedSector === sector
                ? "bg-[var(--color-gold)] text-black"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            )}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-12 text-center">
              <Users className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" />
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                {searchQuery ? `Rien pour \u201C${searchQuery}\u201D. Cherche autrement.` : "Ce territoire est vierge. Cartographie-le."}
              </p>
            </div>
          )}
          {filtered.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="flex items-center gap-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-gold-muted)]"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-glow)] font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">
                {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-[var(--color-text)]">{contact.name}</h3>
                  {contact.influence_score >= 7 && (
                    <Star className="h-3 w-3 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                  )}
                </div>
                <p className="truncate text-xs text-[var(--color-text-muted)]">
                  {contact.title}{contact.organization ? ` — ${contact.organization}` : ""}
                </p>
              </div>

              {/* Sector */}
              {contact.sector && (
                <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[9px] font-medium uppercase text-[var(--color-text-muted)]">
                  {contact.sector}
                </span>
              )}

              {/* Contact details */}
              <div className="flex items-center gap-3">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)]">
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)]">
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                )}
                {contact.region && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                    <MapPin className="h-3 w-3" />
                    {contact.region}
                  </span>
                )}
              </div>

              {/* Influence score */}
              <div className="w-12 text-right">
                <span className="font-mono text-xs font-bold text-[var(--color-gold)]">
                  {contact.influence_score}/10
                </span>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDeleteContact(contact.id)}
                className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                title="Supprimer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          {filtered.length} contact{filtered.length > 1 ? "s" : ""} affiche{filtered.length > 1 ? "s" : ""}
        </p>
      )}

      {/* ═══ Add Contact Modal ═══ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={() => { setShowAddForm(false); setFormData(EMPTY_FORM); setEnriched(false); }}
              className="absolute right-4 top-4 rounded-lg p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">
              Nouveau <span className="text-[var(--color-gold)]">Contact</span>
            </h2>
            <p className="mb-5 mt-1 text-xs text-[var(--color-text-muted)]">
              Un nom. Un territoire. Une ligne de plus.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "nom", label: "Nom *", placeholder: "Dupont" },
                { key: "prenom", label: "Prenom", placeholder: "Jean" },
                { key: "email", label: "Email", placeholder: "jean@exemple.com" },
                { key: "telephone", label: "Telephone", placeholder: "+596 ..." },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={formData[field.key as keyof typeof formData] as string}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                  />
                </div>
              ))}

              {/* Entreprise + Enrichir SIRENE */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Entreprise
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => { setFormData((prev) => ({ ...prev, entreprise: e.target.value })); setEnriched(false); }}
                    placeholder="Nom de l'entreprise"
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleEnrichSirene}
                    disabled={enriching || !formData.entreprise.trim()}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40",
                      enriched
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20"
                    )}
                  >
                    {enriching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : enriched ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                    {enriching ? "..." : enriched ? "Enrichi" : "Enrichir"}
                  </button>
                </div>
              </div>

              {/* Fonction */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Fonction
                </label>
                <input
                  type="text"
                  value={formData.fonction}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fonction: e.target.value }))}
                  placeholder="Directeur, Manager..."
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                />
              </div>

              {/* SIRENE enriched fields */}
              {enriched && (
                <>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> SIRET
                    </label>
                    <input
                      type="text"
                      value={formData.siret}
                      readOnly
                      className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Code NAF
                    </label>
                    <input
                      type="text"
                      value={formData.codeNAF}
                      readOnly
                      className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Adresse SIRENE
                    </label>
                    <input
                      type="text"
                      value={formData.adresseEnrichie}
                      readOnly
                      className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300"
                    />
                  </div>
                  {formData.effectif && (
                    <div>
                      <label className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Effectif
                      </label>
                      <input
                        type="text"
                        value={formData.effectif}
                        readOnly
                        className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300 font-mono"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Vertical / Sector */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Vertical
                </label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData((prev) => ({ ...prev, vertical: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-gold)] focus:outline-none"
                >
                  <option value="">Selectionner...</option>
                  {SECTORS.filter((s) => s !== "Tous").map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Influence score */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Score d&apos;influence ({formData.influence_score}/10)
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={formData.influence_score}
                  onChange={(e) => setFormData((prev) => ({ ...prev, influence_score: Number(e.target.value) }))}
                  className="w-full accent-[#00B4D8]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowAddForm(false); setFormData(EMPTY_FORM); setEnriched(false); }}
                className="rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                Annuler
              </button>
              <button
                onClick={handleAddContact}
                disabled={submitting || !formData.nom.trim()}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] px-5 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Ajout..." : "Ajouter le contact"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
