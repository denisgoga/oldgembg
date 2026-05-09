import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase (anon/publishable key). Used by Express dev, Vercel API routes, and catalog logic.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase URL/key. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY / VITE_*).",
    );
  }

  return createClient(url, key);
}
