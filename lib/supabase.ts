import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

// ------------------------------------------------------------
// Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// from the environment. Until those are set (e.g. local dev
// before the Supabase project exists), this stays null and the
// data layer in lib/get-data.ts transparently falls back to the
// seed data in /data so the site is never broken.
//
// IMPORTANT: this file is imported at module scope by many pages
// (via lib/get-data.ts), so constructing the client here MUST NOT
// throw — a malformed URL (e.g. pasting the wrong value, like an
// anon key, into NEXT_PUBLIC_SUPABASE_URL) would otherwise crash
// every page that imports this file. We validate the URL shape
// first and fail safe (null) instead of throwing.
// ------------------------------------------------------------

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function buildClient(): SupabaseClient | null {
  if (!isValidSupabaseUrl(url) || !anonKey) {
    if (url && !isValidSupabaseUrl(url)) {
      // eslint-disable-next-line no-console
      console.error(
        `[supabase] NEXT_PUBLIC_SUPABASE_URL is not a valid https URL: "${url}". ` +
        `It should look like https://xxxxxxxxxxxx.supabase.co — check you didn't paste an API key into this field.`
      );
    }
    return null;
  }
  try {
    return createSupabaseClient(url, anonKey);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[supabase] Failed to construct client:", err);
    return null;
  }
}

export const supabase: SupabaseClient | null = buildClient();

export const isSupabaseConfigured = Boolean(supabase);
