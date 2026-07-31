import { createBrowserClient } from "@supabase/ssr";

console.log("SUPABASE URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "SUPABASE KEY EXISTS =",
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );