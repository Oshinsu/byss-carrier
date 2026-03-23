// Verify API keys are not exposed in client-side code
export function assertServerOnly(context: string) {
  if (typeof window !== 'undefined') {
    throw new Error(`${context} must only run on the server`);
  }
}

// Mask API keys for logging
export function maskKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return key.slice(0, 4) + '...' + key.slice(-4);
}

// Check if all critical env vars are set
export function checkRequiredEnvVars(): { missing: string[]; configured: string[] } {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY',
  ];
  const optional = [
    'OPENROUTER_API_KEY',
    'REPLICATE_API_TOKEN',
    'RESEND_API_KEY',
    'POLYMARKET_API_KEY',
  ];

  const missing = required.filter(k => !process.env[k]);
  const configured = [...required, ...optional].filter(k => process.env[k]);
  return { missing, configured };
}
