/**
 * Sentry Error Monitoring — BYSS Carrier
 *
 * To activate:
 * 1. Create a Sentry project at https://sentry.io
 * 2. Add NEXT_PUBLIC_SENTRY_DSN to your environment variables
 * 3. Uncomment the init() call below
 *
 * For full Next.js integration, install the SDK:
 *   pnpm add @sentry/nextjs
 * Then run:
 *   npx @sentry/wizard@latest -i nextjs
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

export function initSentry() {
  if (!SENTRY_DSN) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[Sentry] NEXT_PUBLIC_SENTRY_DSN not set — error monitoring disabled");
    }
    return;
  }

  // Placeholder: once @sentry/nextjs is installed, replace with:
  // import * as Sentry from "@sentry/nextjs";
  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   tracesSampleRate: 0.1,
  //   environment: process.env.NODE_ENV,
  //   enabled: process.env.NODE_ENV === "production",
  // });
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  console.error("[Sentry]", error, context);
  // Once @sentry/nextjs is installed:
  // Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  console.log(`[Sentry][${level}]`, message);
  // Once @sentry/nextjs is installed:
  // Sentry.captureMessage(message, level);
}
