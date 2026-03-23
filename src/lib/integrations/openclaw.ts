/**
 * OpenClaw CLI wrapper
 * Uses child_process exec to call openclaw commands.
 * OpenClaw installed at C:/Users/Gary/Desktop/BYSS GROUP/07_OpenClaw/
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const OPENCLAW_DIR = "C:/Users/Gary/Desktop/BYSS GROUP/07_OpenClaw";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CLIResult<T = string> {
  success: boolean;
  data: T;
  error?: string;
}

interface CronJob {
  name: string;
  cron: string;
  message: string;
  enabled: boolean;
}

interface ChannelStatus {
  channels: { name: string; status: string; lastMessage?: string }[];
}

interface GatewayStatus {
  online: boolean;
  uptime?: string;
  connections?: number;
}

// ---------------------------------------------------------------------------
// Agent configuration for BYSS GROUP
// ---------------------------------------------------------------------------

export const BYSS_AGENTS = {
  sorel: {
    name: "sorel-byss",
    model: "anthropic/claude-sonnet-4-6",
    role: "Commercial strategist",
    schedule: {
      briefing: { cron: "0 7 * * 1-6", name: "Morning briefing" },
      emails: { cron: "0 8 * * 1-5", name: "Batch emails" },
      gmail: { cron: "0 10 * * 1-5", name: "Gmail sort" },
      followups: { cron: "0 14 * * 1-5", name: "Follow-ups" },
      crm: { cron: "0 17 * * 1-5", name: "CRM update" },
      report: { cron: "0 18 * * 1-5", name: "Daily report" },
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function runCLI(args: string): Promise<CLIResult> {
  try {
    const { stdout, stderr } = await execAsync(`openclaw ${args}`, {
      cwd: OPENCLAW_DIR,
      timeout: 30_000,
    });
    if (stderr && !stdout) {
      return { success: false, data: "", error: stderr.trim() };
    }
    return { success: true, data: stdout.trim() };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown OpenClaw CLI error";
    return { success: false, data: "", error: message };
  }
}

function parseJSON<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send a message to a specific OpenClaw agent.
 */
export async function sendAgentMessage(
  agentId: string,
  message: string
): Promise<CLIResult> {
  const escaped = message.replace(/"/g, '\\"');
  return runCLI(`agent send "${agentId}" "${escaped}"`);
}

/**
 * List all configured cron jobs.
 */
export async function listCronJobs(): Promise<CLIResult<CronJob[]>> {
  const result = await runCLI("cron list --json");
  if (!result.success) {
    return { success: false, data: [], error: result.error };
  }
  const parsed = parseJSON<CronJob[]>(result.data);
  if (!parsed) {
    return { success: false, data: [], error: "Failed to parse cron list" };
  }
  return { success: true, data: parsed };
}

/**
 * Add a new cron job.
 */
export async function addCronJob(
  name: string,
  cron: string,
  message: string
): Promise<CLIResult> {
  const escapedMsg = message.replace(/"/g, '\\"');
  return runCLI(`cron add --name "${name}" --cron "${cron}" --message "${escapedMsg}"`);
}

/**
 * Get the status of all communication channels.
 */
export async function getChannelStatus(): Promise<CLIResult<ChannelStatus>> {
  const result = await runCLI("channel status --json");
  if (!result.success) {
    return {
      success: false,
      data: { channels: [] },
      error: result.error,
    };
  }
  const parsed = parseJSON<ChannelStatus>(result.data);
  if (!parsed) {
    return {
      success: false,
      data: { channels: [] },
      error: "Failed to parse channel status",
    };
  }
  return { success: true, data: parsed };
}

/**
 * Get the OpenClaw gateway status (online, uptime, connections).
 */
export async function getGatewayStatus(): Promise<CLIResult<GatewayStatus>> {
  const result = await runCLI("gateway status --json");
  if (!result.success) {
    return {
      success: false,
      data: { online: false },
      error: result.error,
    };
  }
  const parsed = parseJSON<GatewayStatus>(result.data);
  if (!parsed) {
    return {
      success: false,
      data: { online: false },
      error: "Failed to parse gateway status",
    };
  }
  return { success: true, data: parsed };
}
