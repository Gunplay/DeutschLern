import { redirect } from "next/navigation";
import { createClientOrNull } from "@/lib/supabase/server";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Trophy,
  Flame,
  BookMarked,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { LEVEL_BG, LEVEL_COLORS } from "@/constants";

export const metadata = { title: "Дашборд" };

export default async function DashboardPage() {
  const supabase = await createClientOrNull();
  if (!supabase) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold">Привіт, Гість!</h1>
          <p className="text-muted-foreground">
            Авторизація тимчасово вимкнена, бо немає ENV ключів Supabase. UI можна
            дивитися, але прогрес/курси/оплати не зберігаються.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-2 font-display text-xl font-semibold">Що зробити далі</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Створи Supabase project</li>
            <li>Скопіюй URL + anon key в `.env.local`</li>
            <li>Перезапусти `npm run dev`</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/">На головну</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/courses">Подивитись курси</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, levels(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const { data: recentProgress } = await supabase
    .from("lesson_progress")
    .select("*, lessons(title, duration_minutes, modules(levels(slug)))")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(4);

  const { count: completedCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true);

  const { count: vocabCount } = await supabase
    .from("vocabulary")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = (profileData?.full_name ?? user.email ?? "Студент").split(" ")[0];

  const stats = [
    {
      label: "Уроків пройдено",
      value: completedCount ?? 0,
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Streak",
      value: "7 днів",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "Слів у словнику",
      value: vocabCount ?? 0,
      icon: BookMarked,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Тестів здано",
      value: "—",
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold">Привіт, {firstName}! 👋</h1>
        <p className="text-muted-foreground">Продовжуй навчання — ти молодець!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div
              className={`h-10 w-10 rounded-xl ${bg} mb-3 flex items-center justify-center`}
            >
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Active courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Мої курси</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/courses">
              Всі курси <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subscriptions.map((sub) => {
              const level = (sub as any).levels;
              if (!level) return null;
              return (
                <div key={sub.id} className="bento-card group relative overflow-hidden">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div
                        className={`mb-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                          LEVEL_BG[level.slug] ??
                          "border-border bg-secondary text-foreground"
                        }`}
                      >
                        {level.slug}
                      </div>
                      <h3 className="font-semibold">{level.name}</h3>
                    </div>
                    <Badge variant="success">Активний</Badge>
                  </div>
                  <Progress value={42} className="mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>42% пройдено</span>
                    <span>18 / 32 уроки</span>
                  </div>
                  <Button size="sm" className="mt-4 w-full" asChild>
                    <Link href={`/courses/${level.id}`}>Продовжити</Link>
                  </Button>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                      LEVEL_COLORS[level.slug] ?? "from-primary to-green-600"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">Ще немає активних курсів</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Почни з безкоштовного рівня A1
            </p>
            <Button asChild>
              <Link href="/courses">Переглянути курси</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent lessons */}
      {recentProgress && recentProgress.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Останні уроки</h2>
          <div className="space-y-3">
            {recentProgress.map((p) => {
              const lesson = (p as any).lessons;
              const slug = lesson?.modules?.levels?.slug as string | undefined;
              return (
                <div key={p.id} className="glass flex items-center gap-4 rounded-xl p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      p.completed ? "bg-green-500/15" : "bg-secondary"
                    }`}
                  >
                    {p.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {lesson?.title ?? "Урок"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {slug && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-xs font-bold ${
                            LEVEL_BG[slug] ?? ""
                          }`}
                        >
                          {slug}
                        </span>
                      )}
                      {lesson?.duration_minutes && (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(lesson.duration_minutes)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={p.progress_percent} className="hidden w-24 sm:block" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
