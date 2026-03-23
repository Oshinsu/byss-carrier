"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown, Search, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — DataTable
   Sortable, filterable, clickable. MODE_CADIFOR empty state.
   Deep-space glass panel. Cyan accents. Clash Display headers.
   ═══════════════════════════════════════════════════════ */

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "Aucune donnee detectee dans ce secteur.",
  searchable = false,
  searchPlaceholder = "Rechercher...",
  onRowClick,
  rowKey,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((prev) =>
          prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
        );
        if (sortDir === "desc") setSortKey(null);
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey, sortDir]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = getNestedValue(row, col.key);
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey);
      const bVal = getNestedValue(b, sortKey);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col || !sortDir) {
      return <ChevronsUpDown className="h-3 w-3 text-[var(--color-text-subtle)]" />;
    }
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-[var(--color-gold)]" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[var(--color-gold)]" />
    );
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--color-border-subtle)]",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.10 0.01 270 / 0.6) 0%, oklch(0.08 0.01 270 / 0.8) 100%)",
      }}
    >
      {/* Search bar */}
      {searchable && (
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-2 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]",
                    col.sortable !== false && "cursor-pointer select-none hover:text-[var(--color-gold)]"
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && <SortIcon col={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm italic text-[var(--color-text-subtle)]"
                  >
                    {emptyMessage}
                  </td>
                </motion.tr>
              ) : (
                sorted.map((row, i) => (
                  <motion.tr
                    key={rowKey ? rowKey(row) : i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors",
                      onRowClick &&
                        "cursor-pointer hover:bg-[var(--color-gold-glow)]"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-sm text-[var(--color-text)]"
                      >
                        {col.render
                          ? col.render(row)
                          : (getNestedValue(row, col.key) as React.ReactNode) ??
                            "—"}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
