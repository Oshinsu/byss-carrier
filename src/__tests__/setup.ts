// ═══════════════════════════════════════════════════════
// Test Environment Setup
// Mock env vars so Supabase client doesn't crash on import
// ═══════════════════════════════════════════════════════

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-placeholder';
