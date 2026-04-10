import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, Play, FileText, Clock, ChevronLeft } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { LEVEL_BG } from "@/constants";

export const metadata = { title: "Курс" };

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: level } = await supabase
    .from("levels")
    .select("*, modules(*, lessons(*))")
    .eq("id", params.courseId)
    .single();

  if (!level) notFound();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("level_id", level.id)
    .single();

  const hasAccess = level.price === 0 || sub?.status === "active";

  const { data: progressData } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, progress_percent")
    .eq("user_id", user.id);

  const progressMap = Object.fromEntries(
    (progressData ?? []).map((p: any) => [p.lesson_id, p]),
  );

  const allLessons = (level.modules ?? []).flatMap((m: any) => m.lessons ?? []);
  const completedLessons = allLessons.filter(
    (l: any) => progressMap[l.id]?.completed,
  ).length;
  const overallProgress =
    allLessons.length > 0 ? Math.round((completedLessons / allLessons.length) * 100) : 0;

  return (
    <div className="max-w-3xl space-y-8">
      {/* Back */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Всі курси
      </Link>
  
      {/* Course header */}
      <div className="glass rounded-2xl p-8">
        <div
          className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_BG[level.slug] ?? ""}`}
        >
          {level.slug}
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold">{level.name}</h1>
        <p className="mb-6 text-muted-foreground">{level.description}</p>

        {hasAccess && (
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Загальний прогрес</span>
              <span className="font-medium">
                {completedLessons} / {allLessons.length} уроків
              </span>
            </div>
            <Progress value={overallProgress} className="h-2.5" />
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {(level.modules ?? []).map((mod: any, modIdx: number) => (
          <div key={mod.id} className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-border p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {modIdx + 1}
              </div>
              <div>
                <h3 className="font-semibold">{mod.title}</h3>
                {mod.description && (
                  <p className="text-xs text-muted-foreground">{mod.description}</p>
                )}
              </div>
            </div>
            <div className="divide-y divide-border">
              {(mod.lessons ?? []).map((lesson: any, lesIdx: number) => {
                const progress = progressMap[lesson.id];
                const isCompleted = progress?.completed;
                const isLocked = !hasAccess && !lesson.is_preview;
                const icon = lesson.content_type === "video" ? Play : FileText;
                const Icon = icon;

                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-brand-500/15"
                          : isLocked
                            ? "bg-secondary"
                            : "bg-primary/10"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-brand-400" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Icon className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${isLocked ? "text-muted-foreground" : ""}`}
                      >
                        {lesIdx + 1}. {lesson.title}
                      </p>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDuration(lesson.duration_minutes)}
                        {lesson.is_preview && (
                          <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 py-0 text-[10px]"
                          >
                            Демо
                          </Badge>
                        )}
                      </span>
                    </div>
                    {!isLocked && (
                      <Button
                        size="sm"
                        variant={isCompleted ? "ghost" : "default"}
                        asChild
                      >
                        <Link href={`/courses/${level.id}/lessons/${lesson.id}`}>
                          {isCompleted ? "Повторити" : progress ? "Продовжити" : "Почати"}
                        </Link>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
