"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Clock,
  User,
  Receipt,
  Plus,
  Trash2,
  Check,
  Pencil,
  Briefcase,
  Target,
  Zap,
  Users,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onEventCreated } from "@/lib/synergies";

/* ═══════════════════════════════════════════════════════
   FRENCH LOCALE
   ═══════════════════════════════════════════════════════ */
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */
const EVENT_TYPES = [
  { value: "event", label: "Événement", icon: CalendarDays, dotColor: "bg-cyan-400" },
  { value: "rdv", label: "RDV", icon: Users, dotColor: "bg-emerald-400" },
  { value: "relance", label: "Relance", icon: Phone, dotColor: "bg-orange-400" },
  { value: "deadline", label: "Deadline", icon: Flag, dotColor: "bg-red-400" },
  { value: "production", label: "Production", icon: Briefcase, dotColor: "bg-purple-400" },
  { value: "meeting", label: "Meeting", icon: Target, dotColor: "bg-blue-400" },
] as const;

const PRESET_COLORS = [
  { value: "#00B4D8", label: "Cyan", className: "bg-cyan-400" },
  { value: "#EF4444", label: "Rouge", className: "bg-red-400" },
  { value: "#22C55E", label: "Vert", className: "bg-emerald-400" },
  { value: "#A855F7", label: "Violet", className: "bg-purple-400" },
  { value: "#F97316", label: "Orange", className: "bg-orange-400" },
  { value: "#E2E8F0", label: "Blanc", className: "bg-slate-200" },
] as const;

function getTypeConfig(type: string) {
  return EVENT_TYPES.find((t) => t.value === type) ?? EVENT_TYPES[0];
}

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time_start: string | null;
  time_end: string | null;
  type: string;
  color: string;
  prospect_id: string | null;
  completed: boolean;
  created_at: string;
}

interface FollowUp {
  id: string;
  prospect: string;
  contact: string;
  date: string;
  next_action: string;
  type: "followup" | "rdv";
  phase: string;
}

interface InvoiceDue {
  id: string;
  number: string;
  client: string;
  amount: number;
  date: string;
  status: string;
}

interface ProspectOption {
  id: string;
  name: string;
}

interface EventFormData {
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  type: string;
  description: string;
  prospect_id: string;
  color: string;
}

const EMPTY_FORM: EventFormData = {
  title: "",
  date: "",
  time_start: "",
  time_end: "",
  type: "event",
  description: "",
  prospect_id: "",
  color: "#00B4D8",
};

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDay(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function isToday(y: number, m: number, d: number) {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
}

function formatTime(time: string | null) {
  if (!time) return "";
  return time.slice(0, 5);
}

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(y, m - 1, d));
}

/* ═══════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════ */
function CalendarSkeleton() {
  return (
    <div className="flex-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-6 w-40 rounded bg-[#1A1A2E] animate-pulse" />
        <div className="h-8 w-24 rounded bg-[#1A1A2E] animate-pulse" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(42)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-[#1A1A2E] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EVENT MODAL
   ═══════════════════════════════════════════════════════ */
function EventModal({
  form,
  setForm,
  onSubmit,
  onClose,
  onDelete,
  isEditing,
  prospects,
  saving,
}: {
  form: EventFormData;
  setForm: (f: EventFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  onDelete?: () => void;
  isEditing: boolean;
  prospects: ProspectOption[];
  saving: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            {isEditing ? "Modifier l\u2019\u00e9v\u00e9nement" : "Nouvel \u00e9v\u00e9nement"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Call client, Livraison..."
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 outline-none transition-colors focus:border-cyan-400/60"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                D\u00e9but
              </label>
              <input
                type="time"
                value={form.time_start}
                onChange={(e) => setForm({ ...form, time_start: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Fin
              </label>
              <input
                type="time"
                value={form.time_end}
                onChange={(e) => setForm({ ...form, time_end: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EVENT_TYPES.map((t) => {
                const Icon = t.icon;
                const active = form.type === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setForm({ ...form, type: t.value })}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      active
                        ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-400"
                        : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-white/20 hover:text-[var(--color-text)]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Notes, d\u00e9tails..."
              className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 outline-none transition-colors focus:border-cyan-400/60"
            />
          </div>

          {/* Prospect */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Prospect li\u00e9
            </label>
            <select
              value={form.prospect_id}
              onChange={(e) => setForm({ ...form, prospect_id: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]"
            >
              <option value="">Aucun</option>
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Couleur
            </label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    c.className,
                    form.color === c.value
                      ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0F0F1A] scale-110"
                      : "opacity-60 hover:opacity-100"
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {isEditing && onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-400/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              Annuler
            </button>
            <button
              onClick={onSubmit}
              disabled={!form.title.trim() || !form.date || saving}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {isEditing ? "Mettre \u00e0 jour" : "Cr\u00e9er"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CALENDAR PAGE
   ═══════════════════════════════════════════════════════ */
export default function CalendrierPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDue[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [prospects, setProspects] = useState<ProspectOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  /* ── Fetch all data ── */
  const fetchData = useCallback(async () => {
    const supabase = createClient();

    const [prospectsRes, invoicesRes, eventsRes, prospectListRes] = await Promise.all([
      supabase
        .from("prospects")
        .select("id, name, key_contact, next_action, followup_date, phase")
        .not("followup_date", "is", null),
      supabase
        .from("invoices")
        .select("id, number, amount_ht, due_date, status")
        .not("due_date", "is", null),
      supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true }),
      supabase
        .from("prospects")
        .select("id, name")
        .order("name", { ascending: true }),
    ]);

    // Map prospects to FollowUp
    const mappedFollowups: FollowUp[] = (prospectsRes.data || []).map(
      (row: Record<string, unknown>) => {
        const phase = (row.phase as string) || "prospect";
        const isRdv = phase === "rdv_planifie" || phase === "demo_faite";
        return {
          id: row.id as string,
          prospect: (row.name as string) || "Sans nom",
          contact: (row.key_contact as string) || "",
          date: ((row.followup_date as string) || "").split("T")[0],
          next_action: (row.next_action as string) || "",
          type: isRdv ? ("rdv" as const) : ("followup" as const),
          phase,
        };
      }
    );

    // Map invoices
    const mappedInvoices: InvoiceDue[] = (invoicesRes.data || []).map(
      (row: Record<string, unknown>) => ({
        id: row.id as string,
        number: (row.number as string) || "",
        client: "",
        amount: Number(row.amount_ht) || 0,
        date: ((row.due_date as string) || "").split("T")[0],
        status: (row.status as string) || "",
      })
    );

    setFollowups(mappedFollowups);
    setInvoices(mappedInvoices);
    setEvents((eventsRes.data as CalendarEvent[]) || []);
    setProspects(
      (prospectListRes.data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: (p.name as string) || "Sans nom",
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── CRUD operations ── */
  const handleCreate = async () => {
    if (!form.title.trim() || !form.date) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("calendar_events").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      time_start: form.time_start || null,
      time_end: form.time_end || null,
      type: form.type,
      color: form.color,
      prospect_id: form.prospect_id || null,
    });
    setSaving(false);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    onEventCreated(form.title.trim(), form.description.trim() || undefined);
    toast("Événement créé", "success");
    setShowModal(false);
    setForm(EMPTY_FORM);
    await fetchData();
  };

  const handleUpdate = async () => {
    if (!editingEvent || !form.title.trim() || !form.date) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("calendar_events")
      .update({
        title: form.title.trim(),
        description: form.description.trim() || null,
        date: form.date,
        time_start: form.time_start || null,
        time_end: form.time_end || null,
        type: form.type,
        color: form.color,
        prospect_id: form.prospect_id || null,
      })
      .eq("id", editingEvent.id);
    setSaving(false);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    toast("Événement mis à jour", "success");
    setShowModal(false);
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    await fetchData();
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("calendar_events").delete().eq("id", editingEvent.id);
    setSaving(false);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    toast("Événement supprimé", "success");
    setShowModal(false);
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    await fetchData();
  };

  const handleToggleComplete = async (event: CalendarEvent) => {
    const supabase = createClient();
    await supabase
      .from("calendar_events")
      .update({ completed: !event.completed })
      .eq("id", event.id);
    toast(event.completed ? "Marqué non-terminé" : "Marqué terminé", "success");
    await fetchData();
  };

  const openCreateModal = (date?: string) => {
    setEditingEvent(null);
    setForm({ ...EMPTY_FORM, date: date || selectedDay || toKey(year, month, today.getDate()) });
    setShowModal(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      date: event.date,
      time_start: event.time_start ? formatTime(event.time_start) : "",
      time_end: event.time_end ? formatTime(event.time_end) : "",
      type: event.type,
      description: event.description || "",
      prospect_id: event.prospect_id || "",
      color: event.color,
    });
    setShowModal(true);
  };

  /* ── Build index maps ── */
  const followupMap = useMemo(() => {
    const map: Record<string, FollowUp[]> = {};
    for (const f of followups) {
      if (f.date) (map[f.date] ??= []).push(f);
    }
    return map;
  }, [followups]);

  const invoiceMap = useMemo(() => {
    const map: Record<string, InvoiceDue[]> = {};
    for (const inv of invoices) {
      if (inv.date) (map[inv.date] ??= []).push(inv);
    }
    return map;
  }, [invoices]);

  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (ev.date) (map[ev.date] ??= []).push(ev);
    }
    return map;
  }, [events]);

  /* ── Calendar grid ── */
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const calendarCells: { day: number; currentMonth: boolean; key: string }[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarCells.push({ day: d, currentMonth: false, key: toKey(prevYear, prevMonth, d) });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, currentMonth: true, key: toKey(year, month, d) });
  }

  const remaining = 42 - calendarCells.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let d = 1; d <= remaining; d++) {
    calendarCells.push({ day: d, currentMonth: false, key: toKey(nextYear, nextMonth, d) });
  }

  /* ── Navigation ── */
  const goPrev = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); } else { setMonth(month - 1); }
    setSelectedDay(null);
  };

  const goNext = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); } else { setMonth(month + 1); }
    setSelectedDay(null);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDay(null);
  };

  /* ── Side panel data ── */
  const panelFollowups = selectedDay ? followupMap[selectedDay] ?? [] : [];
  const panelInvoices = selectedDay ? invoiceMap[selectedDay] ?? [] : [];
  const panelEvents = selectedDay ? eventMap[selectedDay] ?? [] : [];
  const panelHasData = panelFollowups.length > 0 || panelInvoices.length > 0 || panelEvents.length > 0;

  // Sort events by time
  const sortedPanelEvents = useMemo(() => {
    return [...panelEvents].sort((a, b) => {
      if (a.time_start && b.time_start) return a.time_start.localeCompare(b.time_start);
      if (a.time_start) return -1;
      if (b.time_start) return 1;
      return 0;
    });
  }, [panelEvents]);

  const totalEvents = events.length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Heading ── */}
      <PageHeader
        title="Calendrier"
        titleAccent="BYSS"
        subtitle={`${totalEvents} \u00e9v\u00e9nement${totalEvents !== 1 ? "s" : ""}, ${followups.length} relances/RDVs, ${invoices.length} \u00e9ch\u00e9ances.`}
        actions={
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <Plus className="h-4 w-4" />
            Nouvel \u00e9v\u00e9nement
          </button>
        }
      />

      <div className="flex gap-6">
        {/* ═══════════════════════════════════════════════
           CALENDAR GRID
           ═══════════════════════════════════════════════ */}
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
          >
            {/* Top bar */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] transition-colors hover:border-cyan-400/40 hover:text-[var(--color-text)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
                  {MOIS[month]} {year}
                </h2>
                <button
                  onClick={goNext}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] transition-colors hover:border-cyan-400/40 hover:text-[var(--color-text)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={goToday}
                className="rounded-lg border border-cyan-400/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-400/10"
              >
                Aujourd&apos;hui
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {JOURS.map((j) => (
                <div
                  key={j}
                  className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                >
                  {j}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell) => {
                const cellFollowups = followupMap[cell.key] ?? [];
                const cellInvoices = invoiceMap[cell.key] ?? [];
                const cellEvents = eventMap[cell.key] ?? [];
                const rdvs = cellFollowups.filter((f) => f.type === "rdv");
                const relances = cellFollowups.filter((f) => f.type === "followup");
                const isTodayCell = cell.currentMonth && isToday(year, month, cell.day);
                const isSelected = selectedDay === cell.key;

                return (
                  <button
                    key={cell.key}
                    onClick={() => setSelectedDay(cell.key)}
                    className={cn(
                      "group relative flex h-20 flex-col items-start rounded-lg border p-1.5 text-left transition-all",
                      cell.currentMonth
                        ? "border-[var(--color-border-subtle)] hover:border-cyan-400/30"
                        : "border-transparent opacity-30",
                      isTodayCell && "border-cyan-400/60 bg-cyan-400/5",
                      isSelected && cell.currentMonth && "border-cyan-400 bg-cyan-400/10"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isTodayCell
                          ? "font-bold text-cyan-400"
                          : cell.currentMonth
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)]"
                      )}
                    >
                      {cell.day}
                    </span>

                    {/* Quick add on hover */}
                    {cell.currentMonth && (
                      <div
                        onClick={(e) => { e.stopPropagation(); openCreateModal(cell.key); }}
                        className="absolute right-1 top-1 hidden rounded p-0.5 text-[var(--color-text-muted)] transition-colors hover:bg-cyan-400/20 hover:text-cyan-400 group-hover:block"
                      >
                        <Plus className="h-3 w-3" />
                      </div>
                    )}

                    {/* Dots */}
                    <div className="mt-auto flex flex-wrap gap-0.5">
                      {cellEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: ev.color }}
                          title={ev.title}
                        />
                      ))}
                      {relances.map((_, i) => (
                        <div key={`r${i}`} className="h-1.5 w-1.5 rounded-full bg-orange-400" title="Relance" />
                      ))}
                      {rdvs.map((_, i) => (
                        <div key={`v${i}`} className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="RDV" />
                      ))}
                      {cellInvoices.map((_, i) => (
                        <div key={`f${i}`} className="h-1.5 w-1.5 rounded-full bg-blue-400" title="\u00c9ch\u00e9ance" />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-border-subtle)] pt-3">
              {EVENT_TYPES.map((t) => (
                <div key={t.value} className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                  <div className={cn("h-2 w-2 rounded-full", t.dotColor)} />
                  {t.label}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Facture
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
           SIDE PANEL
           ═══════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {selectedDay && (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-80 shrink-0 space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
                  {formatDateLabel(selectedDay)}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openCreateModal(selectedDay)}
                    className="rounded-lg p-1.5 text-cyan-400 transition-colors hover:bg-cyan-400/10"
                    title="Ajouter un \u00e9v\u00e9nement"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Empty state */}
              {!panelHasData && (
                <div className="flex flex-col items-center py-10 text-center">
                  <Zap className="mb-3 h-10 w-10 text-[var(--color-border)]" />
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">
                    Journ\u00e9e libre.
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]/60">
                    MODE_CADIFOR : le vide est une opportunit\u00e9.
                  </p>
                  <button
                    onClick={() => openCreateModal(selectedDay)}
                    className="mt-4 flex items-center gap-1.5 rounded-lg border border-cyan-400/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-400/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Ajouter
                  </button>
                </div>
              )}

              {/* Calendar Events */}
              {sortedPanelEvents.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <CalendarDays className="h-3 w-3" />
                    \u00c9v\u00e9nements ({sortedPanelEvents.length})
                  </h4>
                  <div className="space-y-2">
                    {sortedPanelEvents.map((ev) => {
                      const typeConf = getTypeConfig(ev.type);
                      const TypeIcon = typeConf.icon;
                      return (
                        <motion.div
                          key={ev.id}
                          layout
                          className={cn(
                            "group rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3 transition-all hover:border-cyan-400/30",
                            ev.completed && "opacity-60"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {/* Complete toggle */}
                            <button
                              onClick={() => handleToggleComplete(ev)}
                              className={cn(
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
                                ev.completed
                                  ? "border-emerald-400 bg-emerald-400 text-white"
                                  : "border-[var(--color-border-subtle)] hover:border-cyan-400"
                              )}
                            >
                              {ev.completed && <Check className="h-2.5 w-2.5" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ev.color }} />
                                <span
                                  className={cn(
                                    "text-sm font-semibold text-[var(--color-text)] truncate",
                                    ev.completed && "line-through text-[var(--color-text-muted)]"
                                  )}
                                >
                                  {ev.title}
                                </span>
                              </div>

                              <div className="mt-1 flex items-center gap-2">
                                <TypeIcon className="h-3 w-3 text-[var(--color-text-muted)]" />
                                <span className="text-[10px] uppercase text-[var(--color-text-muted)]">
                                  {typeConf.label}
                                </span>
                                {ev.time_start && (
                                  <>
                                    <Clock className="h-3 w-3 text-[var(--color-text-muted)]" />
                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                      {formatTime(ev.time_start)}
                                      {ev.time_end && ` \u2013 ${formatTime(ev.time_end)}`}
                                    </span>
                                  </>
                                )}
                              </div>

                              {ev.description && (
                                <p className="mt-1 text-xs text-[var(--color-text-muted)] line-clamp-2">
                                  {ev.description}
                                </p>
                              )}
                            </div>

                            {/* Edit button */}
                            <button
                              onClick={() => openEditModal(ev)}
                              className="shrink-0 rounded p-1 text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-white/5 hover:text-cyan-400 group-hover:opacity-100"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Followups / RDVs */}
              {panelFollowups.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <Phone className="h-3 w-3" />
                    Prospects ({panelFollowups.length})
                  </h4>
                  <div className="space-y-2">
                    {panelFollowups.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              f.type === "rdv" ? "bg-emerald-400" : "bg-orange-400"
                            )}
                          />
                          <span className="text-sm font-semibold text-[var(--color-text)]">
                            {f.prospect}
                          </span>
                          <span className="ml-auto text-[10px] uppercase text-[var(--color-text-muted)]">
                            {f.type === "rdv" ? "RDV" : "Relance"}
                          </span>
                        </div>
                        {f.next_action && (
                          <div className="mt-1.5 flex items-start gap-1.5">
                            <Clock className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                            <p className="text-xs text-[var(--color-text-muted)]">{f.next_action}</p>
                          </div>
                        )}
                        {f.contact && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <User className="h-3 w-3 text-[var(--color-text-muted)]" />
                            <span className="text-[10px] text-[var(--color-text-muted)]">{f.contact}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {panelInvoices.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <Receipt className="h-3 w-3" />
                    \u00c9ch\u00e9ances factures ({panelInvoices.length})
                  </h4>
                  <div className="space-y-2">
                    {panelInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-400" />
                            <span className="text-sm font-semibold text-[var(--color-text)]">
                              {inv.number || `Facture #${inv.id.slice(0, 6)}`}
                            </span>
                          </div>
                          <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-blue-400">
                            {inv.amount.toLocaleString("fr-FR")} \u20ac
                          </span>
                        </div>
                        {inv.status && (
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{inv.status}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════
         EVENT MODAL
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <EventModal
            form={form}
            setForm={setForm}
            onSubmit={editingEvent ? handleUpdate : handleCreate}
            onClose={() => {
              setShowModal(false);
              setEditingEvent(null);
              setForm(EMPTY_FORM);
            }}
            onDelete={editingEvent ? handleDelete : undefined}
            isEditing={!!editingEvent}
            prospects={prospects}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
