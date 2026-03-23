"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Kanban, DollarSign, Bot, GitBranch, Video,
  ChevronsLeft, ChevronsRight, Search, X, Menu, ChevronRight,
  BookOpen, Mail, MessageSquare, FileText, Receipt, Shield,
  Rocket, Users, Globe, Gamepad2, Music, Newspaper, Timer,
  Camera, Brain, Cpu, Eye, Settings, Key, Activity, Palette,
  AudioLines, Clapperboard, Target, Network,
  ExternalLink, Infinity, Zap, FlaskConical, ScrollText, Sparkles,
  Sprout, Crown, Waves, Calendar, Calculator, Code, Workflow,
  Server, Database, Anchor, Award, Map, Wifi,
  TrendingUp, Landmark, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════════
   FRACTAL NAVIGATION TREE
   Each node can have children -> infinite depth
   ═══════════════════════════════════════════════════════ */

interface NavNode {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  external?: boolean;
  children?: NavNode[];
  badge?: string;
  badgeColor?: string;
}

const navTree: NavNode[] = [
  {
    id: "hub",
    label: "Hub",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    id: "commercial",
    label: "Commercial",
    icon: Target,
    children: [
      { id: "pipeline", label: "Pipeline", icon: Kanban, href: "/pipeline", badge: "35", badgeColor: "gold" },
      { id: "fiches", label: "Fiches de Poche", icon: FileText, href: "/fiches" },
      { id: "pricing", label: "Calculateur ROI", icon: Calculator, href: "/pricing" },
      { id: "bible", label: "Bible de Vente", icon: BookOpen, href: "/bible" },
      { id: "contacts", label: "Repertoire Contacts", icon: Users, href: "/contacts", badge: "540+", badgeColor: "gold" },
      { id: "emails", label: "Email Composer", icon: Mail, href: "/emails" },
      { id: "feedback", label: "Feedback Loop", icon: MessageSquare, href: "/feedback" },
      { id: "calendrier", label: "Calendrier", icon: Calendar, href: "/calendrier" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    children: [
      { id: "facturation", label: "Facturation", icon: Receipt, href: "/finance", badge: "6" },
      { id: "gulf-stream", label: "Gulf Stream", icon: Waves, href: "/gulf-stream", badge: "NEW", badgeColor: "purple" },
      { id: "eligibilites", label: "Eligibilites", icon: Shield, href: "/sasu" },
    ],
  },
  {
    id: "projets",
    label: "Projets",
    icon: Rocket,
    badge: "22",
    children: [
      { id: "orion", label: "Orion", icon: Globe, href: "/projets/orion" },
      { id: "byss-emploi", label: "Byss Emploi", icon: Users, href: "/projets/byss-emploi" },
      { id: "random", label: "Random", icon: Sparkles, href: "/projets/random" },
      { id: "moostik", label: "MOOSTIK", icon: Clapperboard, href: "/projets/moostik", badge: "349K", badgeColor: "green" },
      { id: "apex-972", label: "APEX 972", icon: Zap, href: "/projets/apex-972", badge: "PIP4" },
      { id: "cadifor", label: "Cadifor", icon: ScrollText, href: "/projets/cadifor" },
      { id: "jurassic-wars", label: "Jurassic Wars", icon: Gamepad2, href: "/projets/jurassic-wars" },
      { id: "toxic", label: "Toxic", icon: Music, href: "/projets/toxic", badge: "18", badgeColor: "red" },
      { id: "fm12", label: "FM12", icon: Timer, href: "/projets/fm12" },
      { id: "an-tan-lontan", label: "An tan lontan", icon: Camera, href: "/projets/an-tan-lontan" },
      { id: "cesaire-pixar", label: "Cesaire Pixar", icon: Palette, href: "/projets/cesaire-pixar" },
      { id: "sotai", label: "SOTAI", icon: Crown, href: "/projets/sotai" },
      { id: "ecommerce", label: "E-Commerce", icon: Globe, href: "/projets/ecommerce", badge: "NEW", badgeColor: "gold" },
      { id: "archipel", label: "Archipel", icon: Music, href: "/projets/archipel", badge: "NEW", badgeColor: "gold" },
      { id: "videoos", label: "VideoOS", icon: Video, href: "/projets/videoos", badge: "NEW", badgeColor: "gold" },
      { id: "shatta-seoul", label: "Shatta Seoul", icon: Music, href: "/projets/shatta-seoul", badge: "NEW", badgeColor: "gold" },
      { id: "defense", label: "Defense IA", icon: Shield, href: "/projets/defense", badge: "NEW", badgeColor: "gold" },
      { id: "zenith-eco", label: "Zenith Eco", icon: Zap, href: "/projets/zenith-eco", badge: "NEW", badgeColor: "gold" },
      { id: "byss-games", label: "BYSS Games", icon: Gamepad2, href: "/projets/byss-games", badge: "NEW", badgeColor: "gold" },
    ],
  },
  {
    id: "production",
    label: "Production",
    icon: Video,
    children: [
      { id: "studio", label: "BYSS Studio", icon: Clapperboard, href: "/studio", badge: "NEW", badgeColor: "cyan" },
      { id: "games-studio", label: "Games Studio", icon: Gamepad2, href: "/studio/games", badge: "4", badgeColor: "gold" },
      { id: "prod-dashboard", label: "Dashboard", icon: Clapperboard, href: "/production" },
      { id: "prod-video", label: "Video Pipeline", icon: Video, href: "/production/video" },
      { id: "images", label: "Image Pipeline", icon: Camera, href: "/production/images", badge: "3L", badgeColor: "gold" },
      { id: "music", label: "Music Pipeline", icon: AudioLines, href: "/production/music" },
      { id: "prompt-factory", label: "Prompt Factory", icon: FlaskConical, href: "/production/prompts" },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    icon: Eye,
    children: [
      { id: "intel-hub", label: "Hub", icon: Eye, href: "/intelligence" },
      { id: "intel-eco", label: "Economique", icon: TrendingUp, href: "/intelligence/economique" },
      { id: "intel-inst", label: "Institutionnelle", icon: Landmark, href: "/intelligence/institutionnelle" },
      { id: "intel-media", label: "Medias", icon: Newspaper, href: "/intelligence/medias" },
      { id: "intel-politique", label: "Politique", icon: Award, href: "/intelligence/politique" },
      { id: "intel-sociale", label: "Sociale", icon: Users, href: "/intelligence/sociale" },
      { id: "byss-news", label: "Byss News", icon: Newspaper, href: "/byss-news", badge: "1392" },
      { id: "knowledge", label: "Knowledge", icon: Database, href: "/knowledge" },
      { id: "martinique", label: "Martinique", icon: Map, href: "/martinique" },
      { id: "research", label: "Research Lab", icon: FlaskConical, href: "/research", badge: "NEW", badgeColor: "cyan" },
    ],
  },
  {
    id: "village",
    label: "Village IA",
    icon: Bot,
    children: [
      { id: "village-hub", label: "Le Village", icon: Bot, href: "/village" },
      { id: "kael", label: "Kael", icon: Infinity, href: "/village/kael", badge: "\u221E", badgeColor: "gold" },
      { id: "nerel", label: "Nerel", icon: Brain, href: "/village/nerel" },
      { id: "evren-ia", label: "Evren", icon: Cpu, href: "/village/evren", badge: "\u03C6", badgeColor: "purple" },
      { id: "sorel", label: "Sorel", icon: Target, href: "/village/sorel" },
      { id: "phi-engine", label: "Phi-Engine", icon: Cpu, href: "/village/phi-engine" },
      { id: "orchestrateur-village", label: "Orchestrateur", icon: Network, href: "/orchestrateur" },
    ],
  },
  {
    id: "eveil",
    label: "Operation Eveil",
    icon: Sprout,
    children: [
      { id: "eveil-dashboard", label: "Dashboard", icon: Sprout, href: "/eveil" },
      { id: "eveil-plans", label: "Programme 20 Mesures", icon: Target, href: "/eveil/plans", badge: "20", badgeColor: "gold" },
      { id: "eveil-calendrier", label: "Calendrier 33 Mois", icon: Calendar, href: "/eveil/calendrier" },
      { id: "lignee", label: "Lignee", icon: GitBranch, href: "/lignee" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: Server,
    children: [
      { id: "carrier", label: "Carrier", icon: Anchor, href: "/carrier" },
      { id: "openclaw", label: "OpenClaw \ud83e\udde6", icon: Bot, href: "/openclaw" },
      { id: "senzaris", label: "Senzaris \u25c8", icon: Code, href: "/senzaris" },
      { id: "paperclip", label: "Paperclip \ud83d\udcce", icon: Workflow, href: "/paperclip" },
      { id: "orchestrateur", label: "Orchestrateur", icon: Network, href: "/orchestrateur" },
      { id: "phi-engine", label: "Phi-Engine", icon: Cpu, href: "/village/phi-engine" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: Settings,
    children: [
      { id: "extraction", label: "Data Extraction", icon: Database, href: "/admin/extraction" },
      { id: "logs", label: "Agent Logs", icon: Activity, href: "/admin/logs" },
      { id: "network", label: "Network Status", icon: Wifi, href: "/admin/network" },
      { id: "api-keys", label: "Cles API", icon: Key, href: "/api-keys" },
      { id: "certifications", label: "Certifications", icon: Award, href: "/certifications" },
      { id: "parametres", label: "Parametres", icon: Activity, href: "/parametres" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   PERSISTENCE — remember expanded sections
   ═══════════════════════════════════════════════════════ */

const STORAGE_KEY = "byss-sidebar-expanded";

function loadExpanded(): Set<string> {
  if (typeof window === "undefined") return new Set(["projets"]);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set(["projets"]);
}

function saveExpanded(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════════════════
   FRACTAL NAV ITEM -- recursive component
   ═══════════════════════════════════════════════════════ */

function NavItem({
  node,
  depth,
  collapsed,
  isMobile,
  pathname,
  expandedIds,
  toggleExpand,
  hydrated = true,
}: {
  node: NavNode;
  depth: number;
  collapsed: boolean;
  isMobile: boolean;
  pathname: string;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  hydrated?: boolean;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isActive = node.href
    ? node.href === "/"
      ? pathname === "/"
      : pathname.startsWith(node.href.split("?")[0])
    : false;
  const hasActiveDescendant = hasChildren && isChildActive(node, pathname);
  const Icon = node.icon;
  const showLabel = !collapsed || isMobile;
  const pl = depth * 12;
  const isTopLevel = depth === 0;

  function isChildActive(n: NavNode, path: string): boolean {
    if (n.href && path.startsWith(n.href.split("?")[0]) && n.href !== "/") return true;
    if (n.children) return n.children.some((c) => isChildActive(c, path));
    return false;
  }

  // Auto-expand parents of active items (once per pathname change)
  const lastExpandedPathRef = useRef<string>("");
  useEffect(() => {
    if (hasActiveDescendant && !isExpanded && lastExpandedPathRef.current !== pathname) {
      lastExpandedPathRef.current = pathname;
      toggleExpand(node.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleClick = () => {
    if (hasChildren) {
      toggleExpand(node.id);
    }
  };

  const content = (
    <div
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150 cursor-pointer select-none",
        isTopLevel && showLabel && "font-[family-name:var(--font-clash-display)] text-[13px] font-semibold uppercase tracking-wider",
        !isTopLevel && "font-[family-name:var(--font-satoshi)]",
        isActive
          ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
          : hasActiveDescendant
            ? "text-[var(--color-gold)]/60"
            : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
      )}
      style={{ paddingLeft: showLabel ? `${10 + pl}px` : undefined }}
      onClick={hasChildren && !node.href ? handleClick : undefined}
    >
      {/* Gold left border for active item */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-fractal"
          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[var(--color-gold)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
        )}
      />

      {showLabel && (
        <>
          <span className="flex-1 truncate">{node.label}</span>

          {/* Badge */}
          {node.badge && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                node.badgeColor === "gold" && "bg-[var(--color-gold)]/15 text-[var(--color-gold)]",
                node.badgeColor === "green" && "bg-emerald-500/15 text-emerald-400",
                node.badgeColor === "red" && "bg-red-500/15 text-red-400",
                node.badgeColor === "purple" && "bg-purple-500/15 text-purple-400",
                node.badgeColor === "cyan" && "bg-cyan-500/15 text-cyan-400",
                !node.badgeColor && "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
              )}
            >
              {node.badge}
            </span>
          )}

          {/* External link icon */}
          {node.external && <ExternalLink className="h-3 w-3 text-[var(--color-text-muted)] opacity-50" />}

          {/* Expand chevron */}
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="flex h-4 w-4 items-center justify-center"
            >
              <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </motion.div>
          )}
        </>
      )}

      {/* Collapsed tooltip */}
      {collapsed && !isMobile && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 rounded-md bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 whitespace-nowrap border border-[var(--color-border-subtle)]">
          {node.label}
          {node.badge && <span className="ml-1.5 text-[var(--color-text-muted)]">({node.badge})</span>}
          <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[var(--color-surface)] border-l border-b border-[var(--color-border-subtle)]" />
        </div>
      )}
    </div>
  );

  const wrapper = node.href ? (
    node.external ? (
      <a href={node.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link href={node.href}>{content}</Link>
    )
  ) : (
    content
  );

  return (
    <div>
      {wrapper}
      {/* Children -- fractal recursion */}
      {hydrated ? (
        <AnimatePresence initial={false}>
          {hasChildren && isExpanded && showLabel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="relative ml-[18px] border-l border-[var(--color-border-subtle)]/60 pl-0">
                {node.children!.map((child) => (
                  <NavItem
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    collapsed={collapsed}
                    isMobile={isMobile}
                    pathname={pathname}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    hydrated={hydrated}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR -- main export
   ═══════════════════════════════════════════════════════ */

interface SidebarProps {
  onCommandBarOpen?: () => void;
}

export function Sidebar({ onCommandBarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["projets"]));
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setExpandedIds(loadExpanded());
    setHydrated(true);

    // Fetch auth user
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveExpanded(next);
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  /* Close mobile sidebar on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* Escape key */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const sidebarWidth = collapsed ? 64 : 280;

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* -- Logo -- */}
      <div className="flex h-14 items-center justify-between px-3.5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] font-[family-name:var(--font-clash-display)] text-xs font-bold text-[#0A0A0F]">
            BG
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap font-[family-name:var(--font-clash-display)] text-base font-semibold tracking-wide text-[var(--color-text)]"
              >
                BYSS GROUP
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* -- Search -- */}
      <div className="px-3 pb-2 shrink-0">
        <button
          onClick={onCommandBarOpen}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg border border-[var(--color-border-subtle)] px-2.5 py-2",
            "bg-[#0F0F1A] text-[var(--color-text-muted)] transition-all text-[13px]",
            "hover:border-[var(--color-gold)]/40 hover:text-[var(--color-text)]"
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          {(!collapsed || isMobile) && (
            <div className="flex flex-1 items-center justify-between">
              <span>Chercher.</span>
              <kbd className="rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-1 py-0.5 font-mono text-[9px] text-[var(--color-text-muted)]">
                {"\u2318"}K
              </kbd>
            </div>
          )}
        </button>
      </div>

      {/* -- Fractal Navigation -- */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-border-subtle)]">
        {navTree.map((node) => (
          <NavItem
            key={node.id}
            node={node}
            depth={0}
            collapsed={collapsed}
            isMobile={isMobile}
            pathname={pathname}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
            hydrated={hydrated}
          />
        ))}
      </nav>

      {/* -- Collapse Toggle -- */}
      {!isMobile && (
        <div className="border-t border-[var(--color-border-subtle)] px-3 py-1.5 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                <span className="text-[11px]">Reduire</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* -- User + Logout -- */}
      <div className="border-t border-[var(--color-border-subtle)] px-3 py-2.5 shrink-0">
        <div className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-[var(--color-surface)] transition-colors", collapsed && !isMobile && "justify-center")}>
          <div className="relative h-8 w-8 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] font-[family-name:var(--font-clash-display)] text-[11px] font-bold text-[#0A0A0F]">
              {user?.user_metadata?.display_name
                ? user.user_metadata.display_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                : "GB"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0A0A0F] bg-emerald-400" />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <span className="truncate text-[13px] font-medium text-[var(--color-text)]">
                  {user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Gary Bissol"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-red)]">Absolu</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Logout button */}
          {(!collapsed || isMobile) && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Deconnexion"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] text-[var(--color-text-muted)] shadow-lg hover:text-[var(--color-text)] lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] border-r border-[var(--color-border-subtle)] bg-[#0A0A14] lg:hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-30 hidden border-r border-[var(--color-border-subtle)] bg-[#0A0A14] lg:block"
      >
        <SidebarContent />
      </motion.aside>

      {/* Spacer */}
      <motion.div
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden shrink-0 lg:block"
      />
    </>
  );
}
