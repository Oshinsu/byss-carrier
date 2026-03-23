"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandBar } from "@/components/layout/command-bar";
import { Notifications } from "@/components/layout/notifications";
import { ShortcutsModal } from "@/components/layout/shortcuts-modal";
import { MusicPlayer } from "@/components/layout/music-player";
import { ToastContainer } from "@/components/ui/toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AdminFooter } from "./footer";
import {
  LayoutDashboard,
  Kanban,
  DollarSign,
  Bot,
  Flame,
  GitBranch,
  Video,
  Code,
  Workflow,
  Network,
  Calendar,
  Calculator,
} from "lucide-react";

/* ─── MODE_CADIFOR Quotes ────────────────────────────── */
const cadiforQuotes = [
  "La compression est une arme.",
  "Chaque phrase \u00e9claire.",
  "Le d\u00e9tail porte le sens.",
  "Souverainet\u00e9, pas excuses.",
  "Le courant entre par les passages \u00e9troits.",
  "L\u2019humour prouve l\u2019intelligence.",
  "Dire plus avec moins.",
  "Le texte EST l\u2019interface.",
  "15 temples. 1 cristal.",
  "L\u2019Empire ne demande pas la permission.",
];

/* ─── Route Metadata ────────────────────────────────── */
const routeMeta: Record<
  string,
  { title: string; icon: React.ElementType; breadcrumb: string[] }
> = {
  "/": {
    title: "Dashboard",
    icon: LayoutDashboard,
    breadcrumb: ["THE EXECUTOR", "Dashboard"],
  },
  "/pipeline": {
    title: "Pipeline",
    icon: Kanban,
    breadcrumb: ["THE EXECUTOR", "Pipeline"],
  },
  "/finance": {
    title: "Finance",
    icon: DollarSign,
    breadcrumb: ["THE EXECUTOR", "Finance"],
  },
  "/village": {
    title: "Village IA",
    icon: Bot,
    breadcrumb: ["THE EXECUTOR", "Village IA"],
  },
  "/eveil": {
    title: "Eveil",
    icon: Flame,
    breadcrumb: ["THE EXECUTOR", "Eveil"],
  },
  "/lignee": {
    title: "Lignee",
    icon: GitBranch,
    breadcrumb: ["THE EXECUTOR", "Lignee"],
  },
  "/production": {
    title: "Production",
    icon: Video,
    breadcrumb: ["THE EXECUTOR", "Production"],
  },
  "/juridique": {
    title: "Juridique SASU",
    icon: GitBranch,
    breadcrumb: ["THE EXECUTOR", "Admin", "Juridique"],
  },
  "/api-keys": {
    title: "API Keys",
    icon: DollarSign,
    breadcrumb: ["THE EXECUTOR", "Admin", "API Keys"],
  },
  "/openclaw": {
    title: "OpenClaw",
    icon: Bot,
    breadcrumb: ["THE EXECUTOR", "Admin", "OpenClaw"],
  },
  "/senzaris": {
    title: "Senzaris",
    icon: Code,
    breadcrumb: ["THE EXECUTOR", "Admin", "Senzaris"],
  },
  "/paperclip": {
    title: "Paperclip",
    icon: Workflow,
    breadcrumb: ["THE EXECUTOR", "Admin", "Paperclip"],
  },
  "/orchestrateur": {
    title: "Orchestrateur",
    icon: Network,
    breadcrumb: ["THE EXECUTOR", "Admin", "Orchestrateur"],
  },
  "/calendrier": {
    title: "Calendrier",
    icon: Calendar,
    breadcrumb: ["THE EXECUTOR", "Commercial", "Calendrier"],
  },
  "/pricing": {
    title: "Calculateur ROI",
    icon: Calculator,
    breadcrumb: ["THE EXECUTOR", "Commercial", "Calculateur ROI"],
  },
};

/* ─── Admin Layout — THE EXECUTOR ──────────────────── */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cadiforQuote, setCadiforQuote] = useState("");

  useEffect(() => {
    setHydrated(true);
    setCadiforQuote(
      cadiforQuotes[Math.floor(Math.random() * cadiforQuotes.length)]
    );
  }, [pathname]);

  const currentRoute = useMemo(() => {
    return (
      routeMeta[pathname] ?? {
        title: "THE EXECUTOR",
        icon: LayoutDashboard,
        breadcrumb: ["THE EXECUTOR"],
      }
    );
  }, [pathname]);

  const CurrentIcon = currentRoute.icon;

  /* ── Keyboard Shortcuts ── */
  const { shortcuts, shortcutsOpen, setShortcutsOpen } = useKeyboardShortcuts({
    router,
    onCommandBar: () => setCommandBarOpen(true),
    onCloseModal: () => setCommandBarOpen(false),
  });

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* ── Sidebar ── */}
      <Sidebar onCommandBarOpen={() => setCommandBarOpen(true)} />

      {/* ── Main Content ── */}
      <main className="flex min-h-screen flex-1 flex-col">
        {/* ── Top Bar — Imperial Bridge ── */}
        <header
          className="scanline sticky top-0 z-20 flex h-16 items-center justify-between border-b px-6 lg:px-8"
          style={{
            background: "rgba(10,22,40,0.9)",
            borderColor: "rgba(0,212,255,0.1)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Left: breadcrumb + title */}
          <div className="flex items-center gap-4 pl-12 lg:pl-0">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "rgba(0,212,255,0.08)" }}
            >
              <CurrentIcon className="h-5 w-5" style={{ color: "#00D4FF" }} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(0,212,255,0.5)" }}>
                {currentRoute.breadcrumb.map((crumb, i) => (
                  <span key={crumb} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span style={{ color: "rgba(0,212,255,0.2)" }}>/</span>
                    )}
                    <span
                      className={
                        i === currentRoute.breadcrumb.length - 1
                          ? "font-medium"
                          : ""
                      }
                      style={{
                        color: i === currentRoute.breadcrumb.length - 1
                          ? "rgba(0,212,255,0.8)"
                          : undefined,
                      }}
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </div>
              <h1
                className="text-lg font-semibold"
                style={{
                  fontFamily: "var(--font-clash-display, var(--font-display)), system-ui",
                  color: "var(--color-text)",
                }}
              >
                {currentRoute.title}
              </h1>
            </div>
          </div>

          {/* Right: quote + date + notifications + command shortcut */}
          <div className="flex items-center gap-3">
            {/* MODE_CADIFOR quote in cyan italic */}
            {hydrated && cadiforQuote && (
              <span
                className="hidden max-w-[280px] truncate text-[11px] italic xl:block"
                style={{ color: "rgba(0,212,255,0.5)" }}
              >
                {cadiforQuote}
              </span>
            )}
            {/* Separator */}
            <div
              className="hidden h-4 w-px xl:block"
              style={{ background: "rgba(0,212,255,0.15)" }}
            />
            <time
              className="hidden text-xs sm:block"
              style={{ color: "rgba(0,212,255,0.6)" }}
            >
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </time>
            {hydrated && <Notifications />}
            <button
              onClick={() => setCommandBarOpen(true)}
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors"
              style={{
                borderColor: "rgba(0,212,255,0.2)",
                background: "rgba(0,212,255,0.05)",
                color: "rgba(0,212,255,0.7)",
              }}
            >
              <span>{"\u2318"}K</span>
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>

        {/* ── Footer ── */}
        <AdminFooter />
      </main>

      {/* ── Command Bar ── */}
      <CommandBar open={commandBarOpen} onOpenChange={setCommandBarOpen} />

      {/* ── Keyboard Shortcuts Modal ── */}
      <ShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={shortcuts}
      />

      <ToastContainer />

      {/* ── Music Player ── */}
      <MusicPlayer />
    </div>
  );
}
