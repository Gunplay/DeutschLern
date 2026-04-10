import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/courses", "/vocabulary", "/billing", "/add"];
const ADMIN = ["/admin"];
const AUTH = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof response.cookies.set>[2];
  };

  // If Supabase env is not configured yet, skip auth guards.
  // This allows the project to boot locally without Supabase.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED.some((r) => path.startsWith(r));
  const isAdmin = ADMIN.some((r) => path.startsWith(r));
  const isAuth = AUTH.some((r) => path.startsWith(r));

  // Незалогінений → на /login
  if ((isProtected || isAdmin) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // Залогінений → не пускаємо на /login, /register
  if (isAuth && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Адмін перевірка — окремий DB запит тільки для /admin
  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
