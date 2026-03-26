"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Users, Phone, Flag, Briefcase, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const EVENT_TYPES = [
  { value: "event", label: "\u00c9v\u00e9nement", icon: CalendarDays, dotColor: "bg-cyan-400" },
  { value: "rdv", label: "RDV", icon: Users, dotColor: "bg-emerald-400" },
  { value: "relance", label: "Relance", icon: Phone, dotColor: "bg-orange-400" },
  { value: "deadline", label: "Deadline", icon: Flag, dotColor: "bg-red-400" },
  { value: "production", label: "Production", icon: Briefcase, dotColor: "bg-purple-400" },
  { value: "meeting", label: "Meeting", icon: Target, dotColor: "bg-blue-400" },
] as const;

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = ["Janvier", "F\u00e9vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao\u00fbt", "Septembre", "Octobre", "Novembre", "D\u00e9cembre"];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getStartDay(year: number, month: number) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }
function toKey(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
function isToday(y: number, m: number, d: number) { const t = new Date(); return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d; }

export interface CalendarEvent {
  id: string; title: string; description: string | null; date: string;
  time_start: string | null; time_end: string | null; type: string;
  color: string; prospect_id: string | null; completed: boolean; created_at: string;
}

export interface FollowUp {
  id: string; prospect: string; contact: string; date: string;
  next_action: string; type: "followup" | "rdv"; phase: string;
}

export interface InvoiceDue {
  id: string; number: string; client: string; amount: number; date: string; status: string;
}

export function CalendarGrid({
  year, month, selectedDay, followupMap, invoiceMap, eventMap,
  onSelectDay, onCreateEvent, onPrev, onNext, onToday,
}: {
  year: number; month: number; selectedDay: string | null;
  followupMap: Record<string, FollowUp[]>;
  invoiceMap: Record<string, InvoiceDue[]>;
  eventMap: Record<string, CalendarEvent[]>;
  onSelectDay: (key: string) => void;
  onCreateEvent: (date: string) => void;
  onPrev: () => void; onNext: () => void; onToday: () => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const calendarCells = useMemo(() => {
    const cells: { day: number; currentMonth: boolean; key: string }[] = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      cells.push({ day: d, currentMonth: false, key: toKey(prevYear, prevMonth, d) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, currentMonth: true, key: toKey(year, month, d) });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false, key: toKey(nextYear, nextMonth, d) });
    }
    return cells;
  }, [year, month, startDay, daysInMonth, daysInPrevMonth, prevYear, prevMonth, nextYear, nextMonth]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onPrev} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] transition-colors hover:border-cyan-400/40 hover:text-[var(--color-text)]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">{MOIS[month]} {year}</h2>
          <button onClick={onNext} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] transition-colors hover:border-cyan-400/40 hover:text-[var(--color-text)]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button onClick={onToday} className="rounded-lg border border-cyan-400/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-400/10">Aujourd&apos;hui</button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {JOURS.map((j) => (<div key={j} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{j}</div>))}
      </div>

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
            <button key={cell.key} onClick={() => onSelectDay(cell.key)}
              className={cn("group relative flex h-20 flex-col items-start rounded-lg border p-1.5 text-left transition-all",
                cell.currentMonth ? "border-[var(--color-border-subtle)] hover:border-cyan-400/30" : "border-transparent opacity-30",
                isTodayCell && "border-cyan-400/60 bg-cyan-400/5", isSelected && cell.currentMonth && "border-cyan-400 bg-cyan-400/10")}>
              <span className={cn("text-xs font-medium", isTodayCell ? "font-bold text-cyan-400" : cell.currentMonth ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]")}>{cell.day}</span>
              {cell.currentMonth && (
                <div onClick={(e) => { e.stopPropagation(); onCreateEvent(cell.key); }}
                  className="absolute right-1 top-1 hidden rounded p-0.5 text-[var(--color-text-muted)] transition-colors hover:bg-cyan-400/20 hover:text-cyan-400 group-hover:block">
                  <Plus className="h-3 w-3" />
                </div>
              )}
              <div className="mt-auto flex flex-wrap gap-0.5">
                {cellEvents.map((ev) => (<div key={ev.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ev.color }} title={ev.title} />))}
                {relances.map((_, i) => (<div key={`r${i}`} className="h-1.5 w-1.5 rounded-full bg-orange-400" title="Relance" />))}
                {rdvs.map((_, i) => (<div key={`v${i}`} className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="RDV" />))}
                {cellInvoices.map((_, i) => (<div key={`f${i}`} className="h-1.5 w-1.5 rounded-full bg-blue-400" title="\u00c9ch\u00e9ance" />))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-border-subtle)] pt-3">
        {EVENT_TYPES.map((t) => (
          <div key={t.value} className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
            <div className={cn("h-2 w-2 rounded-full", t.dotColor)} />{t.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
          <div className="h-2 w-2 rounded-full bg-blue-400" />Facture
        </div>
      </div>
    </motion.div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="flex-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-6 w-40 rounded bg-[#1A1A2E] animate-pulse" />
        <div className="h-8 w-24 rounded bg-[#1A1A2E] animate-pulse" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(42)].map((_, i) => (<div key={i} className="h-20 rounded-lg bg-[#1A1A2E] animate-pulse" />))}
      </div>
    </div>
  );
}
