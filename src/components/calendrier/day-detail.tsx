"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Check, Pencil, Clock, CalendarDays, Phone, User, Receipt, Zap, Users, Flag, Briefcase, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent, FollowUp, InvoiceDue } from "./calendar-grid";

const EVENT_TYPES_MAP: Record<string, { label: string; icon: typeof CalendarDays; dotColor: string }> = {
  event: { label: "\u00c9v\u00e9nement", icon: CalendarDays, dotColor: "bg-cyan-400" },
  rdv: { label: "RDV", icon: Users, dotColor: "bg-emerald-400" },
  relance: { label: "Relance", icon: Phone, dotColor: "bg-orange-400" },
  deadline: { label: "Deadline", icon: Flag, dotColor: "bg-red-400" },
  production: { label: "Production", icon: Briefcase, dotColor: "bg-purple-400" },
  meeting: { label: "Meeting", icon: Target, dotColor: "bg-blue-400" },
};

function getTypeConfig(type: string) { return EVENT_TYPES_MAP[type] ?? EVENT_TYPES_MAP.event; }
function formatTime(time: string | null) { if (!time) return ""; return time.slice(0, 5); }
function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(y, m - 1, d));
}

export function DayDetail({
  selectedDay, events, followups, invoices, onClose, onCreateEvent, onEditEvent, onToggleComplete,
}: {
  selectedDay: string;
  events: CalendarEvent[];
  followups: FollowUp[];
  invoices: InvoiceDue[];
  onClose: () => void;
  onCreateEvent: (date: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onToggleComplete: (event: CalendarEvent) => void;
}) {
  const panelHasData = events.length > 0 || followups.length > 0 || invoices.length > 0;
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.time_start && b.time_start) return a.time_start.localeCompare(b.time_start);
      if (a.time_start) return -1;
      if (b.time_start) return 1;
      return 0;
    });
  }, [events]);

  return (
    <motion.div key={selectedDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }} className="w-80 shrink-0 space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">{formatDateLabel(selectedDay)}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => onCreateEvent(selectedDay)} className="rounded-lg p-1.5 text-cyan-400 transition-colors hover:bg-cyan-400/10" title="Ajouter"><Plus className="h-4 w-4" /></button>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"><X className="h-4 w-4" /></button>
        </div>
      </div>

      {!panelHasData && (
        <div className="flex flex-col items-center py-10 text-center">
          <Zap className="mb-3 h-10 w-10 text-[var(--color-border)]" />
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Journ\u00e9e libre.</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]/60">MODE_CADIFOR : le vide est une opportunit\u00e9.</p>
          <button onClick={() => onCreateEvent(selectedDay)} className="mt-4 flex items-center gap-1.5 rounded-lg border border-cyan-400/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-400/10">
            <Plus className="h-3.5 w-3.5" />Ajouter
          </button>
        </div>
      )}

      {sortedEvents.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            <CalendarDays className="h-3 w-3" />\u00c9v\u00e9nements ({sortedEvents.length})
          </h4>
          <div className="space-y-2">
            {sortedEvents.map((ev) => {
              const typeConf = getTypeConfig(ev.type);
              const TypeIcon = typeConf.icon;
              return (
                <motion.div key={ev.id} layout className={cn("group rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3 transition-all hover:border-cyan-400/30", ev.completed && "opacity-60")}>
                  <div className="flex items-start gap-2">
                    <button onClick={() => onToggleComplete(ev)}
                      className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
                        ev.completed ? "border-emerald-400 bg-emerald-400 text-white" : "border-[var(--color-border-subtle)] hover:border-cyan-400")}>
                      {ev.completed && <Check className="h-2.5 w-2.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ev.color }} />
                        <span className={cn("text-sm font-semibold text-[var(--color-text)] truncate", ev.completed && "line-through text-[var(--color-text-muted)]")}>{ev.title}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <TypeIcon className="h-3 w-3 text-[var(--color-text-muted)]" />
                        <span className="text-[10px] uppercase text-[var(--color-text-muted)]">{typeConf.label}</span>
                        {ev.time_start && (
                          <><Clock className="h-3 w-3 text-[var(--color-text-muted)]" />
                          <span className="text-[10px] text-[var(--color-text-muted)]">{formatTime(ev.time_start)}{ev.time_end && ` \u2013 ${formatTime(ev.time_end)}`}</span></>
                        )}
                      </div>
                      {ev.description && <p className="mt-1 text-xs text-[var(--color-text-muted)] line-clamp-2">{ev.description}</p>}
                    </div>
                    <button onClick={() => onEditEvent(ev)} className="shrink-0 rounded p-1 text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-white/5 hover:text-cyan-400 group-hover:opacity-100">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {followups.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            <Phone className="h-3 w-3" />Prospects ({followups.length})
          </h4>
          <div className="space-y-2">
            {followups.map((f) => (
              <div key={f.id} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", f.type === "rdv" ? "bg-emerald-400" : "bg-orange-400")} />
                  <span className="text-sm font-semibold text-[var(--color-text)]">{f.prospect}</span>
                  <span className="ml-auto text-[10px] uppercase text-[var(--color-text-muted)]">{f.type === "rdv" ? "RDV" : "Relance"}</span>
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

      {invoices.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            <Receipt className="h-3 w-3" />\u00c9ch\u00e9ances factures ({invoices.length})
          </h4>
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    <span className="text-sm font-semibold text-[var(--color-text)]">{inv.number || `Facture #${inv.id.slice(0, 6)}`}</span>
                  </div>
                  <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-blue-400">{inv.amount.toLocaleString("fr-FR")} \u20ac</span>
                </div>
                {inv.status && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{inv.status}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
