"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Brain, Mail, FileText, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prospect } from "./prospect-card";

/* ─── Types ──────────────────────────────────────────── */
type TabKey = "analyse" | "email" | "proposition";

interface AIActionsProps {
  prospect: Prospect;
  initialTab: TabKey;
  onClose: () => void;
}

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "analyse", label: "Analyse", icon: Brain },
  { key: "email", label: "Email", icon: Mail },
  { key: "proposition", label: "Proposition", icon: FileText },
];

/* ─── Component ──────────────────────────────────────── */
export function AIActions({ prospect, initialTab, onClose }: AIActionsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
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
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative w-full max-w-2xl rounded-xl",
            "bg-[var(--color-surface)] border border-[var(--color-border)]",
            "shadow-[var(--shadow-elevated)]",
            "max-h-[85vh] overflow-hidden flex flex-col"
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
            <div>
              <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text)]">
                IA &mdash; {prospect.company}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {prospect.contact} &bull; {prospect.sector}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-[var(--color-border-subtle)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--color-gold)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="ai-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-gold)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Content ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === "analyse" && (
                <motion.div
                  key="analyse"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <AnalyseTab prospect={prospect} />
                </motion.div>
              )}
              {activeTab === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <EmailTab prospect={prospect} onCopy={handleCopy} copied={copied} />
                </motion.div>
              )}
              {activeTab === "proposition" && (
                <motion.div
                  key="proposition"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <PropositionTab prospect={prospect} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Loader2 className="h-3 w-3 animate-spin text-[var(--color-gold)]" />
              Contenu IA &mdash; sera g{"\u00E9"}n{"\u00E9"}r{"\u00E9"} par Claude API
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-[var(--color-surface-2)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Analyse Tab ────────────────────────────────────── */
function AnalyseTab({ prospect }: { prospect: Prospect }) {
  const analysisPoints = [
    {
      title: "Force du lead",
      content: `${prospect.company} montre un int\u00E9r\u00EAt significatif pour l'IA g\u00E9n\u00E9rative. Leur secteur ${prospect.sector} est en pleine mutation num\u00E9rique. Score de maturit\u00E9 digitale estim\u00E9 : ${prospect.score}/5.`,
      color: "var(--color-gold)",
    },
    {
      title: "Blockers identifi\u00E9s",
      content: "Budget potentiellement contraint par les investissements IT en cours. D\u00E9cideur final non encore identifi\u00E9 avec certitude. Concurrence possible avec une solution interne.",
      color: "var(--color-fire)",
    },
    {
      title: "Approche recommand\u00E9e",
      content: "Approche consultative centr\u00E9e sur le ROI. D\u00E9montrer les gains rapides possibles avec un POC en 2 semaines. Cibler le pain point principal : automatisation des processus r\u00E9p\u00E9titifs.",
      color: "var(--color-blue)",
    },
    {
      title: "Phrase d'ouverture sugg\u00E9r\u00E9e",
      content: `\u00AB J'ai analys\u00E9 votre positionnement dans le secteur ${prospect.sector} et j'ai identifi\u00E9 3 leviers IA qui pourraient vous faire gagner 40% de productivit\u00E9 d\u00E8s le premier trimestre. \u00BB`,
      color: "var(--color-green)",
    },
    {
      title: "Timing optimal",
      content: "Contacter en d\u00E9but de semaine (mardi/mercredi matin). Le march\u00E9 local est r\u00E9ceptif aux innovations IA. Profiter de l'\u00E9lan post-salons pour relancer.",
      color: "var(--color-amber)",
    },
  ];

  return (
    <div className="space-y-4">
      {analysisPoints.map((point, i) => (
        <motion.div
          key={point.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: point.color }}
            />
            <h4 className="text-sm font-semibold text-[var(--color-text)]">
              {point.title}
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
            {point.content}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Email Tab ──────────────────────────────────────── */
function EmailTab({
  prospect,
  onCopy,
  copied,
}: {
  prospect: Prospect;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  const subject = `${prospect.company} x BYSS GROUP \u2014 Acc\u00E9l\u00E9rez avec l'IA`;
  const body = `Bonjour ${prospect.contact.split(" ")[0]},

J'esp\u00E8re que vous allez bien.

Je me permets de vous contacter car j'ai analys\u00E9 le positionnement de ${prospect.company} dans le secteur ${prospect.sector}, et j'ai identifi\u00E9 des opportunit\u00E9s concr\u00E8tes d'optimisation gr\u00E2ce \u00E0 l'intelligence artificielle.

Chez BYSS GROUP, nous accompagnons les entreprises de la Martinique et des Cara\u00EFbes dans leur transformation IA \u2014 avec des r\u00E9sultats mesurables d\u00E8s les premi\u00E8res semaines.

Seriez-vous disponible pour un \u00E9change de 15 minutes cette semaine afin que je vous pr\u00E9sente nos solutions adapt\u00E9es \u00E0 votre activit\u00E9 ?

Bien cordialement,
Gary Bissol
Fondateur \u2014 BYSS GROUP
Le premier studio IA de la Martinique`;

  const fullEmail = `Objet: ${subject}\n\n${body}`;

  return (
    <div className="space-y-4">
      {/* Subject */}
      <div>
        <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
          Objet
        </label>
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]">
          {subject}
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
          Corps du message
        </label>
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-4 text-xs leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">
          {body}
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={() => onCopy(fullEmail)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
          copied
            ? "bg-[var(--color-green)] text-white"
            : "bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-bg)] hover:opacity-90"
        )}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copi\u00E9 !
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copier l&apos;email complet
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Proposition Tab ────────────────────────────────── */
function PropositionTab({ prospect }: { prospect: Prospect }) {
  const plans = [
    {
      name: "Essentiel",
      price: "1 500",
      features: [
        "Audit IA de 2h",
        "1 automatisation cl\u00E9 en main",
        "Formation \u00E9quipe (1 session)",
        "Support email 5j/7",
      ],
      highlight: false,
    },
    {
      name: "Croissance",
      price: "3 500",
      features: [
        "Audit IA complet + roadmap",
        "3 automatisations IA",
        "Chatbot client custom",
        "Formation \u00E9quipe (3 sessions)",
        "Support prioritaire",
        "Dashboard analytique",
      ],
      highlight: true,
    },
    {
      name: "Domination",
      price: "7 500",
      features: [
        "Strat\u00E9gie IA compl\u00E8te",
        "Automatisations illimit\u00E9es",
        "Agent IA d\u00E9di\u00E9",
        "SaaS custom (Orion)",
        "Formation continue",
        "Support 24/7 + Slack priv\u00E9",
        "R&D IA sur mesure",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--color-text-muted)]">
        Proposition commerciale g\u00E9n\u00E9r\u00E9e pour{" "}
        <span className="font-semibold text-[var(--color-text)]">
          {prospect.company}
        </span>{" "}
        &mdash; Panier estim\u00E9 : {prospect.basket.toLocaleString("fr-FR")} EUR/mois
      </p>

      <div className="grid grid-cols-3 gap-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-lg border p-4 transition-all",
              plan.highlight
                ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)] shadow-[var(--shadow-gold)]"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]"
            )}
          >
            <h4
              className={cn(
                "mb-1 text-center font-[family-name:var(--font-clash-display)] text-sm font-semibold",
                plan.highlight ? "text-[var(--color-gold)]" : "text-[var(--color-text)]"
              )}
            >
              {plan.name}
            </h4>
            <div className="mb-3 text-center">
              <span className="text-xl font-bold text-[var(--color-text)]">
                {plan.price}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]"> EUR/mois</span>
            </div>
            <ul className="space-y-1.5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-1.5 text-[10px] text-[var(--color-text-muted)]"
                >
                  <span className="mt-0.5 text-[var(--color-gold)]">&bull;</span>
                  {f}
                </li>
              ))}
            </ul>
            {plan.highlight && (
              <div className="mt-3 rounded-md bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-bg)]">
                Recommand\u00E9
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
