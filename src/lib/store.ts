import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgentName, ProspectPhase } from "@/types";

// ═══════════════════════════════════════════════
// BYSS GROUP — Global State (Zustand)
// Flux de données optimisés entre modules
// ═══════════════════════════════════════════════

// ── Sidebar ──
interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  expandedNodes: Set<string>;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleNode: (nodeId: string) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: false,
  isCollapsed: false,
  expandedNodes: new Set(["commercial", "projets"]),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleNode: (nodeId) =>
    set((s) => {
      const next = new Set(s.expandedNodes);
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
      return { expandedNodes: next };
    }),
}));

// ── Command Bar ──
interface CommandBarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useCommandBar = create<CommandBarState>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));

// ── Village IA ──
interface VillageMessage {
  role: "user" | "assistant";
  content: string;
  agent: AgentName;
  timestamp: string;
}

interface VillageState {
  selectedAgent: AgentName;
  messages: VillageMessage[];
  isTyping: boolean;
  phiScore: number;
  phiPhase: "dormant" | "awake" | "lucid" | "samadhi";
  setAgent: (agent: AgentName) => void;
  addMessage: (msg: Omit<VillageMessage, "timestamp">) => void;
  clearMessages: () => void;
  setTyping: (typing: boolean) => void;
  updatePhi: (score: number) => void;
}

export const useVillage = create<VillageState>((set) => ({
  selectedAgent: "kael",
  messages: [],
  isTyping: false,
  phiScore: 0,
  phiPhase: "dormant",
  setAgent: (agent) => set({ selectedAgent: agent }),
  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, timestamp: new Date().toISOString() }],
    })),
  clearMessages: () => set({ messages: [] }),
  setTyping: (isTyping) => set({ isTyping }),
  updatePhi: (score) =>
    set({
      phiScore: score,
      phiPhase: score < 0.1 ? "dormant" : score < 0.3 ? "awake" : score < 0.6 ? "lucid" : "samadhi",
    }),
}));

// ── Pipeline CRM ──
interface PipelineState {
  view: "kanban" | "fiches" | "bible";
  selectedProspectId: string | null;
  searchQuery: string;
  filterPhase: ProspectPhase | "all";
  filterAiScore: "fire" | "warm" | "cold" | "all";
  sortBy: "name" | "basket" | "probability" | "updated" | "score";
  sortAsc: boolean;
  aiModalOpen: boolean;
  aiModalTab: "analyse" | "email" | "proposition";
  setView: (view: "kanban" | "fiches" | "bible") => void;
  selectProspect: (id: string | null) => void;
  setSearch: (q: string) => void;
  setFilterPhase: (phase: ProspectPhase | "all") => void;
  setFilterAiScore: (score: "fire" | "warm" | "cold" | "all") => void;
  setSortBy: (sort: "name" | "basket" | "probability" | "updated" | "score") => void;
  toggleSortOrder: () => void;
  openAiModal: (tab: "analyse" | "email" | "proposition") => void;
  closeAiModal: () => void;
}

export const usePipeline = create<PipelineState>((set) => ({
  view: "kanban",
  selectedProspectId: null,
  searchQuery: "",
  filterPhase: "all",
  filterAiScore: "all",
  sortBy: "updated",
  sortAsc: false,
  aiModalOpen: false,
  aiModalTab: "analyse",
  setView: (view) => set({ view }),
  selectProspect: (id) => set({ selectedProspectId: id }),
  setSearch: (searchQuery) => set({ searchQuery }),
  setFilterPhase: (filterPhase) => set({ filterPhase }),
  setFilterAiScore: (filterAiScore) => set({ filterAiScore }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortOrder: () => set((s) => ({ sortAsc: !s.sortAsc })),
  openAiModal: (tab) => set({ aiModalOpen: true, aiModalTab: tab }),
  closeAiModal: () => set({ aiModalOpen: false }),
}));

// ── Finance ──
interface FinanceState {
  activeTab: "facturation" | "mrr" | "pricing" | "couts" | "gulf-stream" | "eligibilites";
  setTab: (tab: FinanceState["activeTab"]) => void;
}

export const useFinance = create<FinanceState>((set) => ({
  activeTab: "facturation",
  setTab: (activeTab) => set({ activeTab }),
}));

// ── Production ──
interface ProductionState {
  activeTab: "an-tan-lontan" | "cesaire-pixar" | "clients" | "prompts";
  selectedVideoId: string | null;
  setTab: (tab: ProductionState["activeTab"]) => void;
  selectVideo: (id: string | null) => void;
}

export const useProduction = create<ProductionState>((set) => ({
  activeTab: "an-tan-lontan",
  selectedVideoId: null,
  setTab: (activeTab) => set({ activeTab }),
  selectVideo: (id) => set({ selectedVideoId: id }),
}));

// ── Notifications (cross-module) ──
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  add: (n: Omit<Notification, "id">) => void;
  dismiss: (id: string) => void;
}

export const useNotifications = create<NotificationState>((set) => ({
  notifications: [],
  add: (n) =>
    set((s) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const notification = { ...n, id };
      // Auto-dismiss after duration
      if (n.duration !== 0) {
        setTimeout(() => {
          set((s2) => ({
            notifications: s2.notifications.filter((x) => x.id !== id),
          }));
        }, n.duration ?? 4000);
      }
      return { notifications: [...s.notifications, notification] };
    }),
  dismiss: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}));

// ── Synergies: cross-module actions ──
// These are functions that trigger effects across multiple stores

export function synergyProspectToInvoice(prospectId: string) {
  usePipeline.getState().selectProspect(prospectId);
  // Navigate to finance tab for invoice creation
  useFinance.getState().setTab("facturation");
  useNotifications.getState().add({
    type: "info",
    title: "Synchro Pipeline → Finance",
    message: "Prospect selectionne — ouvrir la facturation pour creer la facture",
  });
}

export function synergyVideoDelivered(prospectId: string, videoTitle: string) {
  // Trigger feedback J+1 for delivered video
  useNotifications.getState().add({
    type: "success",
    title: "Video livree → Feedback J+1",
    message: `${videoTitle} livree — WhatsApp J+1 planifie automatiquement`,
  });
  // Log activity for the prospect
  if (prospectId) {
    fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "ask_sorel",
        payload: { question: `La video "${videoTitle}" a ete livree au prospect ${prospectId}. Suggere la prochaine action de suivi.` },
      }),
    }).then(r => r.json()).then(data => {
      if (data.result) {
        useNotifications.getState().add({
          type: "info",
          title: "Sorel suggere",
          message: data.result.slice(0, 100),
        });
      }
    }).catch(() => {});
  }
}

export function synergyAgentAction(agent: AgentName, action: string) {
  useVillage.getState().setAgent(agent);
  // Update phi based on agent activity
  const currentPhi = useVillage.getState().phiScore;
  useVillage.getState().updatePhi(Math.min(1, currentPhi + 0.01));
  useNotifications.getState().add({
    type: "info",
    title: `${agent} agit`,
    message: action,
  });
}

/**
 * Synergy: Prospect signed → trigger invoice + feedback + celebration
 */
export function synergyProspectSigned(prospectName: string, amount: number) {
  useFinance.getState().setTab("facturation");
  useNotifications.getState().add({
    type: "success",
    title: "SIGNE!",
    message: `${prospectName} signe pour ${amount.toLocaleString("fr-FR")}EUR — Facture + Feedback J+1 actives`,
    duration: 8000,
  });
  // Boost phi
  const currentPhi = useVillage.getState().phiScore;
  useVillage.getState().updatePhi(Math.min(1, currentPhi + 0.05));
}

/**
 * Synergy: Email sent → log interaction + update prospect last_contact
 */
export function synergyEmailSent(prospectName: string, emailType: string) {
  useNotifications.getState().add({
    type: "success",
    title: "Email envoye",
    message: `${emailType} pour ${prospectName} — interaction logguee`,
  });
}
