"use client";

import { motion } from "motion/react";
import { Video, Megaphone, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingItem } from "@/types/finance";

/* ═══════════════════════════════════════════════════════
   PRICING TAB — Video, Marketing, Orion grids
   ═══════════════════════════════════════════════════════ */

const PRICING_VIDEO: PricingItem[] = [
  { tier: "Clip social", desc: "15-30s, 9:16, social", prix: "500\u20AC HT", accent: false },
  { tier: "Clip standard", desc: "30-60s, post-prod, 2 formats", prix: "750\u20AC HT", accent: false },
  { tier: "Clip premium", desc: "1-3min, DA compl\u00E8te, musique", prix: "1 500\u20AC HT", accent: true },
  { tier: "\u00C9pisode s\u00E9rie", desc: "3-5min, sc\u00E9nario+DA+edit (MOOSTIK)", prix: "2 500\u20AC HT", accent: true },
  { tier: "Pack mensuel", desc: "6 vid\u00E9os (social+standard mix)", prix: "3 500\u20AC/mois", accent: false },
  { tier: "Pack annuel", desc: "72 vid\u00E9os (mod\u00E8le Digicel)", prix: "45 000\u20AC/an", accent: true },
];

const PRICING_MARKETING: PricingItem[] = [
  { tier: "Maintenance", desc: "Campagnes existantes + reporting", prix: "800\u20AC/mois", accent: false },
  { tier: "Growth", desc: "+ Cr\u00E9ation, A/B, optimisation", prix: "1 500\u20AC/mois", accent: true },
  { tier: "Full service", desc: "+ Strat\u00E9gie, cr\u00E9atifs, landing", prix: "3 000\u20AC/mois", accent: true },
];

const PRICING_ORION: PricingItem[] = [
  { tier: "Free", desc: "1 plateforme, rapports basiques", prix: "0\u20AC", accent: false },
  { tier: "Starter", desc: "3 plateformes, Unified CMO", prix: "99\u20AC/mois", accent: false },
  { tier: "Pro", desc: "10 plateformes, IA cr\u00E9ative", prix: "249\u20AC/mois", accent: true },
  { tier: "Enterprise", desc: "24 plateformes, API, white-label", prix: "449\u20AC/mois", accent: true },
  { tier: "Institutional", desc: "CTM/R\u00E9gion", prix: "10 000\u20AC+/an", accent: true },
];

function PricingSection({
  title,
  icon: Icon,
  items,
  accentColor,
}: {
  title: string;
  icon: typeof Video;
  items: PricingItem[];
  accentColor: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
        <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)]">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.tier}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "group relative overflow-hidden rounded-xl border p-4 transition-all hover:scale-[1.02]",
              item.accent
                ? "border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)]"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
            )}
            style={item.accent ? { boxShadow: "0 0 24px oklch(0.75 0.12 85 / 0.08)" } : undefined}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[oklch(1_0_0/0.03)] to-transparent" />
            <h3 className="mb-1 font-[family-name:var(--font-display)] text-sm font-bold" style={{ color: item.accent ? accentColor : "var(--color-text)" }}>
              {item.tier}
            </h3>
            <p className="mb-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">{item.desc}</p>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold" style={{ color: accentColor }}>
              {item.prix}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PricingTab() {
  return (
    <div className="space-y-8">
      <PricingSection title="Video IA Production" icon={Video} items={PRICING_VIDEO} accentColor="var(--color-fire)" />
      <PricingSection title="Marketing Digital" icon={Megaphone} items={PRICING_MARKETING} accentColor="var(--color-blue)" />
      <PricingSection title="Orion SaaS" icon={Cpu} items={PRICING_ORION} accentColor="var(--color-gold)" />
    </div>
  );
}
