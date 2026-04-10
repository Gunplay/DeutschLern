"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface NavbarProps {
  user?: UserProfile | null;
  navItems?: { label: string; href: string }[];
}

export function Navbar({ user, navItems = [] }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const authDisabled =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border" : "bg-transparent",
      )}
    >
      <nav className="page-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="group-hover:gradient-text font-display text-lg font-bold tracking-tight transition-all duration-300">
            DeutschLern
          </span>
        </Link>

        {/* Desktop nav */}
        {navItems.length > 0 && (
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Avatar className="h-8 w-8 ring-2 ring-border transition-all duration-200 hover:ring-primary/50">
                <AvatarImage src={user.avatar_url ?? ""} />
                <AvatarFallback>
                  {getInitials(user.full_name ?? user.email)}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              {authDisabled ? (
                <Button size="sm" asChild>
                  <Link href="/dashboard">Гостьовий режим</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Увійти</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Почати</Link>
                  </Button>
                </>
              )}
            </div>
          )}
          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-2 transition-colors hover:bg-secondary md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="glass animate-fade-in border-t border-border md:hidden">
          <div className="page-container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-border pt-2">
                {authDisabled ? (
                  <Button className="flex-1" asChild>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      Гість
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Увійти
                      </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        Почати
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
