import { createClient } from "@supabase/supabase-js";

/**
 * Human-readable reason admin Supabase client cannot be created (for API 503 bodies).
 * Does not expose secret values.
 */
export function getSupabaseAdminConfigError() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    return "NEXT_PUBLIC_SUPABASE_URL is not set.";
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return "SUPABASE_SERVICE_ROLE_KEY is not set. In Supabase Dashboard → Project Settings → API, copy the service_role key (secret) into .env.local and Vercel Environment Variables.";
  }
  return null;
}

/** Service-role client — server-only (admin routes / uploads). */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
