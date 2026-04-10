import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const authDisabled = !isSupabaseConfigured();

  return (
    <div className="bg-mesh flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold">DeutschLern</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        {authDisabled ? (
          <div className="glass w-full max-w-md rounded-2xl p-8 text-center">
            <h1 className="font-display text-2xl font-bold">Авторизацію вимкнено</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Поки немає Supabase ENV ключів, логін/реєстрація недоступні.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Link
                href="/"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                На головну
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
              >
                В гостьовий режим
              </Link>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
