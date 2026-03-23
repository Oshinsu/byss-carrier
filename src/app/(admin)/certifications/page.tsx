"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, ExternalLink, Clock, DollarSign, Award,
  CheckCircle2, Circle, Loader2, ChevronRight,
  GraduationCap, Megaphone, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

type CertStatus = "a_faire" | "en_cours" | "obtenu";

interface Certification {
  id: string;
  name: string;
  provider: string;
  cost: string;
  costNum: number;
  duration: string;
  details: string;
  validity: string;
  link: string;
  difficulty: "Fondamental" | "Associe" | "Professionnel" | "Expert" | "Academique";
  status: CertStatus;
}

/* ═══════════════════════════════════════════════════════
   CERTIFICATION DATA
   ═══════════════════════════════════════════════════════ */

const tier1Certs: Certification[] = [
  {
    id: "nvidia-agentic",
    name: "Agentic AI Professional",
    provider: "NVIDIA",
    cost: "$200",
    costNum: 200,
    duration: "120 min",
    details: "60-70 Qs",
    validity: "2 ans",
    link: "https://nvcertifications.nvidia.com",
    difficulty: "Professionnel",
    status: "a_faire",
  },
  {
    id: "nvidia-genai",
    name: "Generative AI Associate",
    provider: "NVIDIA",
    cost: "$125",
    costNum: 125,
    duration: "60 min",
    details: "50-60 Qs",
    validity: "2 ans",
    link: "https://nvcertifications.nvidia.com",
    difficulty: "Associe",
    status: "a_faire",
  },
  {
    id: "google-genai-leader",
    name: "Generative AI Leader",
    provider: "Google",
    cost: "$99",
    costNum: 99,
    duration: "90 min",
    details: "50-60 Qs",
    validity: "2 ans",
    link: "https://cloud.google.com/certification",
    difficulty: "Professionnel",
    status: "a_faire",
  },
  {
    id: "google-ml-engineer",
    name: "Professional ML Engineer",
    provider: "Google",
    cost: "$200",
    costNum: 200,
    duration: "120 min",
    details: "60 Qs",
    validity: "2 ans",
    link: "https://cloud.google.com/certification",
    difficulty: "Expert",
    status: "a_faire",
  },
  {
    id: "aws-ai-practitioner",
    name: "AI Practitioner",
    provider: "AWS",
    cost: "$100",
    costNum: 100,
    duration: "90 min",
    details: "65 Qs",
    validity: "3 ans",
    link: "https://aws.amazon.com/certification",
    difficulty: "Fondamental",
    status: "a_faire",
  },
  {
    id: "aws-genai-dev",
    name: "GenAI Developer Professional",
    provider: "AWS",
    cost: "$300",
    costNum: 300,
    duration: "Professional-level",
    details: "Professional",
    validity: "3 ans",
    link: "https://aws.amazon.com/certification",
    difficulty: "Expert",
    status: "a_faire",
  },
  {
    id: "anthropic-claude",
    name: "Claude Certified Architect",
    provider: "Anthropic",
    cost: "$99",
    costNum: 99,
    duration: "120 min",
    details: "60 Qs",
    validity: "2 ans",
    link: "https://anthropic.com/partners",
    difficulty: "Professionnel",
    status: "a_faire",
  },
  {
    id: "openai-foundations",
    name: "AI Foundations",
    provider: "OpenAI",
    cost: "Gratuit",
    costNum: 0,
    duration: "Self-paced",
    details: "3 niveaux",
    validity: "Permanent",
    link: "https://academy.openai.com",
    difficulty: "Fondamental",
    status: "a_faire",
  },
];

const tier2Certs: Certification[] = [
  {
    id: "meta-blueprint",
    name: "Blueprint Media Buying",
    provider: "Meta",
    cost: "$150",
    costNum: 150,
    duration: "Exam-based",
    details: "Media Buying",
    validity: "1 an",
    link: "https://meta.com/blueprint",
    difficulty: "Professionnel",
    status: "a_faire",
  },
  {
    id: "google-ads",
    name: "Google Ads (9 certs)",
    provider: "Google",
    cost: "Gratuit",
    costNum: 0,
    duration: "Self-paced",
    details: "9 certifications",
    validity: "1 an chaque",
    link: "https://skillshop.google.com",
    difficulty: "Associe",
    status: "a_faire",
  },
  {
    id: "linkedin-marketing",
    name: "Marketing Labs (4 certs)",
    provider: "LinkedIn",
    cost: "Gratuit",
    costNum: 0,
    duration: "Self-paced",
    details: "4 certifications",
    validity: "2 ans",
    link: "https://linkedin.com/learning",
    difficulty: "Associe",
    status: "a_faire",
  },
  {
    id: "adobe-firefly",
    name: "Firefly AI Professional",
    provider: "Adobe",
    cost: "~$150",
    costNum: 150,
    duration: "Exam-based",
    details: "AI Creative",
    validity: "3 ans",
    link: "https://certiport.com",
    difficulty: "Professionnel",
    status: "a_faire",
  },
];

const tier3Certs: Certification[] = [
  {
    id: "mit-ai-finance",
    name: "AI for Financial Services",
    provider: "MIT",
    cost: "$5,900",
    costNum: 5900,
    duration: "2 jours",
    details: "Executive Education",
    validity: "Permanent",
    link: "https://executive.mit.edu",
    difficulty: "Academique",
    status: "a_faire",
  },
  {
    id: "berkeley-ai-exec",
    name: "AI for Executives",
    provider: "Berkeley",
    cost: "$6,500",
    costNum: 6500,
    duration: "3 jours",
    details: "Executive Program",
    validity: "Permanent",
    link: "https://executive.berkeley.edu",
    difficulty: "Academique",
    status: "a_faire",
  },
  {
    id: "stanford-ai-pro",
    name: "AI Professional Program",
    provider: "Stanford",
    cost: "$5,850",
    costNum: 5850,
    duration: "3 courses",
    details: "Professional Certificate",
    validity: "Permanent",
    link: "https://online.stanford.edu",
    difficulty: "Academique",
    status: "a_faire",
  },
  {
    id: "harvard-futureproof",
    name: "Future Proof with AI",
    provider: "Harvard",
    cost: "$279",
    costNum: 279,
    duration: "Self-paced",
    details: "Online Course",
    validity: "Permanent",
    link: "https://pll.harvard.edu",
    difficulty: "Academique",
    status: "a_faire",
  },
];

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

const tabs = [
  { key: "tier1", label: "Tier 1 — Marche", icon: Shield },
  { key: "tier2", label: "Tier 2 — Marketing", icon: Megaphone },
  { key: "tier3", label: "Tier 3 — Academique", icon: GraduationCap },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const difficultyColors: Record<string, string> = {
  Fondamental: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Associe: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Professionnel: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Expert: "bg-red-500/15 text-red-400 border-red-500/30",
  Academique: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const statusConfig: Record<CertStatus, { label: string; icon: typeof Circle; color: string }> = {
  a_faire: { label: "A faire", icon: Circle, color: "text-[#6A6A7A]" },
  en_cours: { label: "En cours", icon: Loader2, color: "text-[#00D4FF]" },
  obtenu: { label: "Obtenu", icon: CheckCircle2, color: "text-emerald-400" },
};

const providerLogos: Record<string, { bg: string; text: string; abbr: string }> = {
  NVIDIA: { bg: "from-[#76B900] to-[#5A8F00]", text: "text-white", abbr: "NV" },
  Google: { bg: "from-[#4285F4] to-[#2B6BD6]", text: "text-white", abbr: "G" },
  AWS: { bg: "from-[#FF9900] to-[#D67F00]", text: "text-[#0A0A0F]", abbr: "AWS" },
  Anthropic: { bg: "from-[#D4A574] to-[#B8895C]", text: "text-[#0A0A0F]", abbr: "A" },
  OpenAI: { bg: "from-[#10A37F] to-[#0D8466]", text: "text-white", abbr: "OAI" },
  Meta: { bg: "from-[#0668E1] to-[#0552B5]", text: "text-white", abbr: "M" },
  LinkedIn: { bg: "from-[#0A66C2] to-[#084D94]", text: "text-white", abbr: "Li" },
  Adobe: { bg: "from-[#FF0000] to-[#CC0000]", text: "text-white", abbr: "Ad" },
  MIT: { bg: "from-[#A31F34] to-[#8A1A2C]", text: "text-white", abbr: "MIT" },
  Berkeley: { bg: "from-[#003262] to-[#002449]", text: "text-[#FDB515]", abbr: "UCB" },
  Stanford: { bg: "from-[#8C1515] to-[#6E1010]", text: "text-white", abbr: "SU" },
  Harvard: { bg: "from-[#A51C30] to-[#861627]", text: "text-white", abbr: "H" },
};

/* ═══════════════════════════════════════════════════════
   STATUS CYCLE BUTTON
   ═══════════════════════════════════════════════════════ */

function StatusToggle({ status, onCycle }: { status: CertStatus; onCycle: () => void }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <button
      onClick={onCycle}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all",
        status === "a_faire" && "border-[#2A2A3E] bg-[#0F0F1A] text-[#6A6A7A] hover:border-[#00D4FF]/40 hover:text-[#00D4FF]",
        status === "en_cours" && "border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20",
        status === "obtenu" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
      )}
    >
      <Icon className={cn("h-3 w-3", cfg.color, status === "en_cours" && "animate-spin")} />
      {cfg.label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   CERT CARD
   ═══════════════════════════════════════════════════════ */

function CertCard({
  cert,
  index,
  onCycleStatus,
}: {
  cert: Certification;
  index: number;
  onCycleStatus: (id: string) => void;
}) {
  const logo = providerLogos[cert.provider] || { bg: "from-[#333] to-[#555]", text: "text-white", abbr: "?" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn(
        "imperial-glass group relative overflow-hidden rounded-xl border transition-all duration-300",
        cert.status === "obtenu"
          ? "border-emerald-500/30 bg-emerald-500/[0.03]"
          : "border-[#1A1A2E] hover:border-[#00D4FF]/30",
      )}
    >
      {/* Scanline overlay */}
      <div className="scanline pointer-events-none absolute inset-0 opacity-[0.02]" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Provider logo + info */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-[family-name:var(--font-clash-display)] text-xs font-bold shadow-lg",
                logo.bg,
                logo.text,
              )}
            >
              {logo.abbr}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[#E0E0E8] tracking-wide">
                  {cert.name}
                </h3>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                    difficultyColors[cert.difficulty],
                  )}
                >
                  {cert.difficulty}
                </span>
              </div>

              <p className="mt-0.5 text-[12px] font-medium text-[#8A8A9A]">{cert.provider}</p>

              {/* Meta row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[#6A6A7A]">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {cert.cost}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {cert.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {cert.details}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {cert.validity}
                </span>
              </div>
            </div>
          </div>

          {/* Right side: status + link */}
          <div className="flex flex-col items-end gap-2.5">
            <StatusToggle status={cert.status} onCycle={() => onCycleStatus(cert.id)} />
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[#6A6A7A] transition-colors hover:text-[#00D4FF]"
            >
              S&apos;inscrire
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Obtained glow */}
      {cert.status === "obtenu" && (
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function CertificationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("tier1");
  const [statuses, setStatuses] = useState<Record<string, CertStatus>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("byss_cert_statuses");
        if (saved) return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return {};
  });

  // Persist certification statuses to localStorage
  useEffect(() => {
    localStorage.setItem("byss_cert_statuses", JSON.stringify(statuses));
  }, [statuses]);

  const cycleStatus = (id: string) => {
    setStatuses((prev) => {
      const current = prev[id] || "a_faire";
      const next: CertStatus =
        current === "a_faire" ? "en_cours" : current === "en_cours" ? "obtenu" : "a_faire";
      return { ...prev, [id]: next };
    });
  };

  const getStatus = (cert: Certification): Certification => ({
    ...cert,
    status: statuses[cert.id] || cert.status,
  });

  const allCerts = useMemo(
    () => [...tier1Certs, ...tier2Certs, ...tier3Certs].map(getStatus),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statuses],
  );

  const totalCerts = allCerts.length;
  const obtainedCount = allCerts.filter((c) => c.status === "obtenu").length;
  const inProgressCount = allCerts.filter((c) => c.status === "en_cours").length;
  const progressPct = totalCerts > 0 ? Math.round((obtainedCount / totalCerts) * 100) : 0;

  const tier12Cost = [...tier1Certs, ...tier2Certs].reduce((acc, c) => acc + c.costNum, 0);

  const currentCerts = useMemo(() => {
    const map: Record<TabKey, Certification[]> = {
      tier1: tier1Certs,
      tier2: tier2Certs,
      tier3: tier3Certs,
    };
    return map[activeTab].map(getStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, statuses]);

  return (
    <div className="min-h-screen bg-[#06080F] px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="mb-8">
        <PageHeader
          title="Certifications"
          titleAccent="& Labels"
          subtitle="The Executor"
        />
      </div>

      {/* ── Summary Bar ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="imperial-glass mb-8 rounded-xl border border-[#1A1A2E] p-5"
      >
        <div className="flex flex-wrap items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-[#6A6A7A]">Total certs:</span>
            <span className="font-[family-name:var(--font-clash-display)] font-bold text-[#E0E0E8]">{totalCerts}+</span>
          </div>
          <div className="h-4 w-px bg-[#2A2A3E]" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[#6A6A7A]">Obtenu:</span>
            <span className="font-bold text-emerald-400">{obtainedCount}</span>
          </div>
          <div className="h-4 w-px bg-[#2A2A3E]" />
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 text-[#00D4FF]" />
            <span className="text-[#6A6A7A]">En cours:</span>
            <span className="font-bold text-[#00D4FF]">{inProgressCount}</span>
          </div>
          <div className="h-4 w-px bg-[#2A2A3E]" />
          <div className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-[#C4A000]" />
            <span className="text-[#6A6A7A]">Cout Tier 1+2:</span>
            <span className="font-bold text-[#C4A000]">${tier12Cost.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#6A6A7A]">Progression globale</span>
            <span className="font-[family-name:var(--font-clash-display)] font-bold text-[#00D4FF]">{progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#1A1A2E]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00D4FF]/60"
              style={{ boxShadow: "0 0 12px rgba(0,212,255,0.4)" }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="mb-6 flex gap-1 rounded-lg border border-[#1A1A2E] bg-[#0A0A0F] p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-all",
                isActive
                  ? "text-[#00D4FF]"
                  : "text-[#6A6A7A] hover:text-[#8A8A9A]",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="cert-tab-active"
                  className="absolute inset-0 rounded-md border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5" />
              <span className="relative hidden sm:inline font-[family-name:var(--font-clash-display)]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Cert Cards ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {currentCerts.map((cert, i) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={i}
              onCycleStatus={cycleStatus}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Tier info footer ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-[11px] text-[#6A6A7A]"
      >
        <ChevronRight className="h-3 w-3 text-[#00D4FF]/40" />
        <span>
          Cliquer sur le statut pour alterner: A faire → En cours → Obtenu
        </span>
      </motion.div>
    </div>
  );
}
