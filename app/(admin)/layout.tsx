import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shared/sidebar";
import { ADMIN_NAV } from "@/constants";
import type { UserProfile } from "@/types";
import { MobileSidebar } from "@/components/shared/mobile-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const userProfile: UserProfile = profile;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={userProfile} navItems={ADMIN_NAV} />
      <MobileSidebar user={userProfile} navItems={ADMIN_NAV} />
      <main className="lg:pl-64">
        <div className="page-container page-enter py-8">{children}</div>
      </main>
    </div>
  );
}
