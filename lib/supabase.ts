import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ------------------------------------------------------------
// Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// from the environment. Until those are set (e.g. local dev
// before the Supabase project exists), this stays null and the
// data layer in lib/get-data.ts transparently falls back to the
// seed data in /data so the site is never broken.
// ------------------------------------------------------------

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
