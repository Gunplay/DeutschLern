import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonPlayer } from "@/features/courses/components/lesson-player";
import { QuizEngine } from "@/features/quiz/components/quiz-engine";
import type { Question } from "@/types";

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export default async function LessonPage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, modules(title, level_id, levels(slug, name, price))")
    .eq("id", params.lessonId)
    .single();

  if (!lesson) notFound();

  const level = (lesson.modules as any)?.levels;

  // Access check
  const isFreeAccess = (level?.price ?? 0) === 0 || lesson.is_preview;
  if (!isFreeAccess) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .eq("level_id", (lesson.modules as any)?.level_id ?? "")
      .single();
    if (sub?.status !== "active") redirect(`/courses/${params.courseId}`);
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", params.lessonId)
    .order("order_index");

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", params.lessonId)
    .single();

  return (
    <div className="max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/courses/${params.courseId}`}
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {(lesson.modules as any)?.title ?? "Курс"}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="truncate font-medium">{lesson.title}</span>
      </div>

      {/* Header */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          {level?.slug && <Badge variant="secondary">{level.slug}</Badge>}
          <Badge variant="outline" className="capitalize">
            {lesson.content_type}
          </Badge>
          {lesson.is_preview && <Badge variant="success">Демо-урок</Badge>}
        </div>
        <h1 className="font-display text-3xl font-bold">{lesson.title}</h1>
        {lesson.description && (
          <p className="mt-2 text-muted-foreground">{lesson.description}</p>
        )}
      </div>

      {/* Player */}
      <LessonPlayer
        lesson={{
          id: lesson.id,
          title: lesson.title,
          content_type: lesson.content_type,
          video_url: lesson.video_url,
          content: lesson.content,
          duration_minutes: lesson.duration_minutes,
        }}
        userId={user.id}
        initialProgress={progress?.progress_percent ?? 0}
        initialPosition={progress?.last_position_seconds ?? 0}
      />

      {/* Quiz */}
      {questions && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BookMarked className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Тест до уроку</h2>
          </div>
          <QuizEngine
            lessonId={params.lessonId}
            questions={questions as Question[]}
            userId={user.id}
          />
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button variant="outline" asChild>
          <Link href={`/courses/${params.courseId}`}>
            <ChevronLeft className="h-4 w-4" />
            До курсу
          </Link>
        </Button>
      </div>
    </div>
  );
}
