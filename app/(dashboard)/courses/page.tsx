import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { formatPrice, formatDuration } from "@/lib/utils";
import { LEVEL_BG, LEVEL_COLORS } from "@/constants";

export const metadata = { title: "Курси" };

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: levels } = await supabase
    .from("levels")
    .select("*, modules(id, lessons(id))")
    .eq("is_active", true)
    .order("order_index");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("level_id, status")
    .eq("user_id", user.id);

  const activeLevelIds = new Set(
    (subscriptions ?? [])
      .filter((s: any) => s.status === "active")
      .map((s: any) => s.level_id),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold">Каталог курсів</h1>
        <p className="text-muted-foreground">Оберіть свій рівень і почни навчання</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(levels ?? []).map((level: any) => {
          console.log(levels)
          const lessonCount =
            level.modules?.reduce(
              (acc: number, m: any) => acc + (m.lessons?.length ?? 0),
              0,
            ) ?? 0;
          const hasAccess = level.price === 0 || activeLevelIds.has(level.id);

          return (
            <div
              key={level.id}
              className="bento-card group relative flex flex-col overflow-hidden"
            >
              {/* Level badge */}
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_BG[level.slug] ?? "border-border bg-secondary text-foreground"}`}
                >
                  {level.slug}
                </span>
                {hasAccess ? (
                  <Badge variant="success">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Доступно
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <Lock className="mr-1 h-3 w-3" />
                    Закрито
                  </Badge>
                )}
              </div>

              <h3 className="mb-2 font-display text-xl font-bold">{level.name}</h3>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">
                {level.description}
              </p>

              <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {lessonCount} уроків
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />~{Math.ceil((lessonCount * 15) / 60)}{" "}
                  год
                </span>
              </div>

              {hasAccess ? (
                <Button asChild className="w-full">
                  <Link href={`/courses/${level.id}`}>
                    Перейти до курсу <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold">
                      {formatPrice(level.price)}
                    </span>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/billing">Придбати доступ</Link>
                  </Button>
                </div>
              )}

              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${LEVEL_COLORS[level.slug] ?? "from-primary to-brand-600"} opacity-60 transition-opacity group-hover:opacity-100`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
