import { redirect } from "next/navigation";
import { createClientOrNull } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shared/sidebar";
import { STUDENT_NAV } from "@/constants";
import type { UserProfile } from "@/types";
import { MobileSidebar } from "@/components/shared/mobile-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClientOrNull();
  // Guest mode (Supabase not configured yet)
  if (!supabase) {
    const now = new Date().toISOString();
    const guestProfile: UserProfile = {
      id: "guest",
      email: "guest@local",
      full_name: "Гість",
      avatar_url: null,
      role: "student",
      created_at: now,
      updated_at: now,
    };

    return (
      <div className="min-h-screen bg-background">
        <Sidebar user={guestProfile} navItems={STUDENT_NAV} />
        <main className="lg:pl-64">
          <div className="page-container page-enter py-8">
            <div className="glass mb-6 rounded-2xl border border-border p-4 text-sm text-muted-foreground">
              Авторизація тимчасово вимкнена (немає Supabase ENV). Після підключення бази
              даних увімкнемо логін/реєстрацію.
            </div>
            {children}
          </div>
        </main>
      </div>
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const now = new Date().toISOString();

  const userProfile: UserProfile = profile ?? {
    id: user.id,
    email: user.email ?? "",
    full_name: (user.user_metadata?.full_name as string) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
    role: "student",
    created_at: user.created_at,
    updated_at: now,
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={userProfile} navItems={STUDENT_NAV} />
      <MobileSidebar user={userProfile} navItems={STUDENT_NAV} />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="page-container page-enter py-8">{children}</div>
      </main>
    </div>
  );
}
