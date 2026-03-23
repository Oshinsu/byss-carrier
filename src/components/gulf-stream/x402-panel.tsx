"use client";

import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Copy,
  Globe,
  Wallet,
  Zap,
} from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { glassCard, glassBg, inputCls } from "@/types/gulf-stream";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — x402 Panel
   Merchant status, wallet config, setup guide, protocols.
   ═══════════════════════════════════════════════════════ */

interface X402PanelProps {
  configured: boolean;
  wallet: string;
  txCount: number;
  onSaveWallet: (address: string) => void;
}

export function X402Panel({ configured, wallet, txCount, onSaveWallet }: X402PanelProps) {
  const [, copy] = useCopyToClipboard();
  return (
    <div className="space-y-4">
      {/* Merchant Status */}
      <div className={glassCard} style={glassBg}>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-text)]">
            <Zap className="mr-2 inline h-4 w-4 text-cyan-400" />
            x402 Merchant Status
          </p>
          <Badge variant={configured ? "success" : "warning"} size="sm" dot>
            {configured ? "Active" : "Non configure"}
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Config card */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Configuration
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Protocol</span>
                <span className="font-mono text-cyan-300">HTTP 402</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Type</span>
                <span className="font-mono text-cyan-300">Machine-to-machine</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Status</span>
                <span className={cn("font-mono font-bold", configured ? "text-emerald-400" : "text-amber-400")}>
                  {configured ? "ACTIVE" : "PENDING"}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet */}
          <div className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-4">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Wallet Marchand
            </p>
            {configured ? (
              <div className="space-y-2">
                <p className="break-all font-mono text-xs text-[var(--color-gold)]">{wallet}</p>
                <button
                  onClick={() => copy(wallet)}
                  className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <Copy className="h-3 w-3" />
                  Copier
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="0x..."
                  className={cn(inputCls, "text-xs")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveWallet((e.target as HTMLInputElement).value);
                  }}
                />
                <p className="text-[9px] text-[var(--color-text-muted)]">
                  Entrez votre adresse wallet Base/Polygon puis Entree
                </p>
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Transactions
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Total</span>
                <span className="font-mono text-purple-300">{txCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Network</span>
                <span className="font-mono text-purple-300">Base (L2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Settlement</span>
                <span className="font-mono text-purple-300">USDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup guide */}
        {!configured && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
          >
            <p className="mb-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="mr-1.5 inline h-3.5 w-3.5" />
              Guide de configuration x402
            </p>
            <ol className="ml-4 list-decimal space-y-1.5 text-[11px] text-[var(--color-text-muted)]">
              <li>
                Installer le SDK:{" "}
                <code className="rounded bg-black/30 px-1 py-0.5 text-cyan-300">npm install x402-next</code>
              </li>
              <li>Creer un wallet Coinbase Developer Platform (CDP) sur Base</li>
              <li>
                Configurer les variables:{" "}
                <code className="rounded bg-black/30 px-1 py-0.5 text-cyan-300">X402_WALLET_ADDRESS</code> et{" "}
                <code className="rounded bg-black/30 px-1 py-0.5 text-cyan-300">X402_WALLET_PRIVATE_KEY</code>
              </li>
              <li>
                Wrapper les API routes avec{" "}
                <code className="rounded bg-black/30 px-1 py-0.5 text-cyan-300">withPayment()</code> middleware
              </li>
              <li>Entrer votre adresse wallet ci-dessus pour activer le suivi</li>
            </ol>
          </motion.div>
        )}
      </div>

      {/* Other protocols */}
      <div className={glassCard} style={glassBg}>
        <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
          <Globe className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
          Autres Protocoles
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[var(--color-gold)]" />
              <p className="font-semibold text-[var(--color-gold)]">Stripe MPP</p>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              Merchant Payment Protocol — Virtual card provisioning pour agents autonomes
            </p>
            <Badge variant="warning" size="sm" className="mt-2">
              Pending
            </Badge>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <p className="font-semibold text-purple-400">TAP Protocol</p>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              Transaction Agent Protocol — Orchestration financiere multi-agents
            </p>
            <Badge variant="warning" size="sm" className="mt-2">
              Pending
            </Badge>
          </div>
        </div>

        {/* SDK Stack */}
        <div className="mt-4 rounded-lg border border-[var(--color-border-subtle)] bg-black/20 p-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
            SDK &amp; Integration Stack
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Python CLOB</span>
              <span className="text-cyan-300">py-clob-client</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">TypeScript CLOB</span>
              <span className="text-cyan-300">@polymarket/clob-client</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">x402 SDK</span>
              <span className="text-cyan-300">x402-next</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">WebSocket</span>
              <span className="text-cyan-300">wss://ws-subscriptions-clob</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Auth L1</span>
              <span className="text-amber-300">Wallet signer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Auth L2</span>
              <span className="text-amber-300">API key+secret+passphrase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
