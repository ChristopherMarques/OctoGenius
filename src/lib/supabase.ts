"use client";

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database/types/database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    global: {
      fetch: (url, options) =>
        fetch(url, { ...options, credentials: "include" }),
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
