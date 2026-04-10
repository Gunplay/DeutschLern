"use client";

import { createBrowserClient } from "@supabase/ssr";
//import type { Database } from "./database.types";
// ─── Singleton browser client ─────────────────────────────
//let client: ReturnType<typeof createBrowserClient<Database>> | null = null;
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
}
