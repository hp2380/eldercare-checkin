import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// This client uses the SECRET key, which bypasses row-level security.
// The "server-only" import at the top is a guard: if any client component
// ever imports this file by accident, the build fails instead of shipping
// the key to the browser.

let client: SupabaseClient | null = null;

/**
 * The server-side Supabase client, created on first use.
 *
 * It's lazy rather than created at import time so that `next build` (and a
 * Vercel deploy) doesn't fail before the environment variables are set. A
 * missing key then shows up as a clear error on the first request instead.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Copy .env.example to .env.local and fill it in.",
    );
  }

  client = createClient(url, secretKey, {
    auth: {
      // There are no user sessions in v1, so don't let the client try to
      // persist or refresh one.
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}
