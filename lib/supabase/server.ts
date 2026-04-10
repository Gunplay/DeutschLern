import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
//import type { Database } from "./database.types";
export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ─── Server client (Server Components & Route Handlers) ───
export async function createClient() {
  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof cookieStore.set>[2];
  };
  // return createServerClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return cookieStore.getAll();
  //       },
  //       setAll(cookiesToSet) {
  //         try {
  //           cookiesToSet.forEach(({ name, value, options }) => {
  //             cookieStore.set(name, value, options);
  //           });
  //         } catch {
  //           // Called from Server Component — cookies are read-only here
  //         }
  //       },
  //     },
  //   }
  // );
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component — cookies are read-only here
        }
      },
    },
  });
}

export async function createClientOrNull() {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}
// return createServerClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll();
//       },
//       setAll(cookiesToSet) {
//         try {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             cookieStore.set(name, value, options);
//           });
//         } catch {
//           // Called from Server Component — cookies are read-only here
//         }
//       },
//     },
//   }
// );
// ─── Admin client (bypasses RLS — server only!) ───────────
export function createAdminClient() {
  // return createSupabaseClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!,
  //   {
  //     auth: { persistSession: false },
  //   }
  // );
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase admin client requires SUPABASE_SERVICE_ROLE_KEY");
  }
  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
