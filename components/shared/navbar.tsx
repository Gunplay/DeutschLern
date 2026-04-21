"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, LayoutDashboard } from "lucide-react";
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
         
        {user ? (
  <div className="flex items-center gap-4">
    {/* Перемикач теми окремо */}
    
    
    <ThemeToggle />

    <Link href="/dashboard" className="group relative">
      {/* Зовнішнє сяйво при наведенні на всю капсулу */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      {/* Головна капсула-посилання */}
      <div className="relative flex items-center bg-black/40 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1.5 pr-4 transition-all duration-300 group-hover:bg-black/60 dark:group-hover:bg-white/10 group-hover:border-white/20">
        
        {/* Аватар з градієнтною підкладкою */}
        <div className="relative shrink-0">
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-brand-400 to-brand-600 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
          <Avatar className="h-8 w-8 relative border-2 border-background dark:border-gray-950">
            <AvatarImage src={user.avatar_url ?? ""} />
            <AvatarFallback className="bg-neutral-800 text-white text-[10px] font-black">
              {getInitials(user.full_name ?? user.email)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Текстовий блок */}
        <div className="ml-3 flex flex-col justify-center">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-brand-400 leading-none mb-0.5">
           Сторінка навчання
          </span>
          <span className="text-sm font-bold text-white/90 leading-none group-hover:text-white transition-colors">
            {user.full_name?.split(' ')[0] ?? "Vova"}
          </span>
        </div>

        {/* Розділювач, який стає яскравішим при ховері */}
        <div className="h-4 w-[1px] bg-white/10 mx-4 group-hover:bg-white/20 transition-colors" />

        {/* Іконка, яка крутиться при ховері на ВСЮ капсулу */}
        <div className="text-white/50 group-hover:text-white transition-all duration-300 group-hover:rotate-12">
          <LayoutDashboard className="h-4 w-4" />
        </div>
      </div>
    </Link>
  </div>
) : (
  // Секція для тих, хто не увійшов
  <div className="hidden items-center gap-2 md:flex">
    {authDisabled ? (
      <Button size="sm" asChild className="rounded-full px-6">
        <Link href="/dashboard">Гостьовий режим</Link>
      </Button>
    ) : (
      <>
        <Button variant="ghost" size="sm" asChild className="rounded-full">
          <Link href="/login">Увійти</Link>
        </Button>
        <Button size="sm" asChild className="rounded-full px-6 bg-brand-500 hover:bg-brand-600">
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
