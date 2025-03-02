"use client"; // 🔥 Garante que este código roda apenas no CLIENTE

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database/types/database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing env.SUPABASE_ANON_KEY");
}

// 🚀 Cliente Supabase para o CLIENTE (Autenticação e Usuário)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    global: {
      fetch: (url, options) =>
        fetch(url, { ...options, credentials: "include" }), // 🔥 Garante que os cookies são usados
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
