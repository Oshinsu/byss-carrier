"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onEventCreated } from "@/lib/synergies";
import { CalendarGrid, CalendarSkeleton, type CalendarEvent, type FollowUp, type InvoiceDue } from "@/components/calendrier/calendar-grid";
import { EventModal, EMPTY_FORM, type EventFormData, type ProspectOption } from "@/components/calendrier/event-modal";
import { DayDetail } from "@/components/calendrier/day-detail";

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function formatTime(time: string | null) { if (!time) return ""; return time.slice(0, 5); }

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

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const [prospectsRes, invoicesRes, eventsRes, prospectListRes] = await Promise.all([
      supabase.from("prospects").select("id, name, key_contact, next_action, followup_date, phase").not("followup_date", "is", null),
      supabase.from("invoices").select("id, number, amount_ht, due_date, status").not("due_date", "is", null),
      supabase.from("calendar_events").select("*").order("date", { ascending: true }),
      supabase.from("prospects").select("id, name").order("name", { ascending: true }),
    ]);
    const mappedFollowups: FollowUp[] = (prospectsRes.data || []).map((row: Record<string, unknown>) => {
      const phase = (row.phase as string) || "prospect";
      const isRdv = phase === "rdv_planifie" || phase === "demo_faite";
      return { id: row.id as string, prospect: (row.name as string) || "Sans nom", contact: (row.key_contact as string) || "",
        date: ((row.followup_date as string) || "").split("T")[0], next_action: (row.next_action as string) || "",
        type: isRdv ? ("rdv" as const) : ("followup" as const), phase };
    });
    const mappedInvoices: InvoiceDue[] = (invoicesRes.data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string, number: (row.number as string) || "", client: "",
      amount: Number(row.amount_ht) || 0, date: ((row.due_date as string) || "").split("T")[0], status: (row.status as string) || "",
    }));
    setFollowups(mappedFollowups);
    setInvoices(mappedInvoices);
    setEvents((eventsRes.data as CalendarEvent[]) || []);
    setProspects((prospectListRes.data || []).map((p: Record<string, unknown>) => ({ id: p.id as string, name: (p.name as string) || "Sans nom" })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("calendar_events").insert({
      title: form.title.trim(), description: form.description.trim() || null, date: form.date,
      time_start: form.time_start || null, time_end: form.time_end || null,
      type: form.type, color: form.color, prospect_id: form.prospect_id || null,
    });
    setSaving(false);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    onEventCreated(form.title.trim(), form.description.trim() || undefined);
    toast("\u00c9v\u00e9nement cr\u00e9\u00e9", "success");
    setShowModal(false); setForm(EMPTY_FORM); await fetchData();
  };

  const handleUpdate = async () => {
    if (!editingEvent || !form.title.trim() || !form.date) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("calendar_events").update({
      title: form.title.trim(), description: form.description.trim() || null, date: form.date,
      time_start: form.time_start || null, time_end: form.time_end || null,
      type: form.type, color: form.color, prospect_id: form.prospect_id || null,
    }).eq("id", editingEvent.id);
    setSaving(false);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    toast("\u00c9v\u00e9nement mis \u00e0 jour", "success");
    setShowModal(false); setEditingEvent(null); setForm(EMPTY_FORM); await fetchData();
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("calendar_events").delete().eq("id", editingEvent.id);
    setSaving(false);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    toast("\u00c9v\u00e9nement supprim\u00e9", "success");
    setShowModal(false); setEditingEvent(null); setForm(EMPTY_FORM); await fetchData();
  };

  const handleToggleComplete = async (event: CalendarEvent) => {
    const supabase = createClient();
    await supabase.from("calendar_events").update({ completed: !event.completed }).eq("id", event.id);
    toast(event.completed ? "Marqu\u00e9 non-termin\u00e9" : "Marqu\u00e9 termin\u00e9", "success");
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
      title: event.title, date: event.date, time_start: event.time_start ? formatTime(event.time_start) : "",
      time_end: event.time_end ? formatTime(event.time_end) : "", type: event.type,
      description: event.description || "", prospect_id: event.prospect_id || "", color: event.color,
    });
    setShowModal(true);
  };

  const followupMap = useMemo(() => { const map: Record<string, FollowUp[]> = {}; for (const f of followups) { if (f.date) (map[f.date] ??= []).push(f); } return map; }, [followups]);
  const invoiceMap = useMemo(() => { const map: Record<string, InvoiceDue[]> = {}; for (const inv of invoices) { if (inv.date) (map[inv.date] ??= []).push(inv); } return map; }, [invoices]);
  const eventMap = useMemo(() => { const map: Record<string, CalendarEvent[]> = {}; for (const ev of events) { if (ev.date) (map[ev.date] ??= []).push(ev); } return map; }, [events]);

  const goPrev = () => { if (month === 0) { setYear(year - 1); setMonth(11); } else { setMonth(month - 1); } setSelectedDay(null); };
  const goNext = () => { if (month === 11) { setYear(year + 1); setMonth(0); } else { setMonth(month + 1); } setSelectedDay(null); };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDay(null); };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Calendrier" titleAccent="BYSS"
        subtitle={`${events.length} \u00e9v\u00e9nement${events.length !== 1 ? "s" : ""}, ${followups.length} relances/RDVs, ${invoices.length} \u00e9ch\u00e9ances.`}
        actions={
          <button onClick={() => openCreateModal()} className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            <Plus className="h-4 w-4" />Nouvel \u00e9v\u00e9nement
          </button>
        }
      />

      <div className="flex gap-6">
        {loading ? <CalendarSkeleton /> : (
          <CalendarGrid
            year={year} month={month} selectedDay={selectedDay}
            followupMap={followupMap} invoiceMap={invoiceMap} eventMap={eventMap}
            onSelectDay={setSelectedDay} onCreateEvent={openCreateModal}
            onPrev={goPrev} onNext={goNext} onToday={goToday}
          />
        )}

        <AnimatePresence mode="wait">
          {selectedDay && (
            <DayDetail selectedDay={selectedDay}
              events={eventMap[selectedDay] ?? []} followups={followupMap[selectedDay] ?? []} invoices={invoiceMap[selectedDay] ?? []}
              onClose={() => setSelectedDay(null)} onCreateEvent={openCreateModal}
              onEditEvent={openEditModal} onToggleComplete={handleToggleComplete}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <EventModal form={form} setForm={setForm} onSubmit={editingEvent ? handleUpdate : handleCreate}
            onClose={() => { setShowModal(false); setEditingEvent(null); setForm(EMPTY_FORM); }}
            onDelete={editingEvent ? handleDelete : undefined} isEditing={!!editingEvent}
            prospects={prospects} saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
