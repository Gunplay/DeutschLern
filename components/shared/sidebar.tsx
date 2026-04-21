"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  BookMarked,
  CreditCard,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile, NavItem, NavIconName } from "@/types";
import { BackButton } from "./buttonBack";

interface SidebarProps {
  user: UserProfile;
  navItems: NavItem[];
}

const ICONS: Record<NavIconName, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  CreditCard,
  Users,
  BarChart3,
  Settings,
};

export function Sidebar({ user, navItems }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleBack = () => {
    router.back(); // Функція браузера "повернутися назад"
  };
  
  return (
    <aside className="glass fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border lg:flex">
      {/* Logo */}
      <div className="border-b border-border p-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold">DeutschLern</span>
        </Link>
        

      </div>
{/* Back Button Section */}
<div className="px-4 py-2">
<BackButton/>
      </div>

      <div className="mx-4 h-[1px] bg-border/50" /> {/* Розділювач */}
      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          console.log(item)
          const Icon = item.icon ? ICONS[item.icon] : undefined;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
              )}
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
            </Link>
          );
        })}
        <div>

       
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-2 border-t border-border p-4">
  
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
        
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.avatar_url ?? ""} />
            <AvatarFallback>{getInitials(user.full_name ?? user.email)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.full_name ?? "Студент"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <ThemeToggle className="shrink-0" />
        </div>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Вийти
        </button>
       
      </div>
    </aside>
  );
}
