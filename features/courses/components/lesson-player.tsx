"use client";

import { useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LessonPlayerProps {
  lesson: {
    id: string;
    title: string;
    content_type: string;
    video_url: string | null;
    content: string | null;
    duration_minutes: number;
  };
  userId: string;
  initialProgress: number;
  initialPosition: number;
}

export function LessonPlayer({
  lesson,
  userId,
  initialProgress,
  initialPosition,
}: LessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const [completed, setCompleted] = useState(initialProgress >= 90);

  const saveProgress = useCallback(
    async (percent: number, positionSec: number) => {
      const isCompleted = percent >= 90;
      const supabase = createClient();
      await supabase.from("lesson_progress").upsert(
        {
          user_id: userId,
          lesson_id: lesson.id,
          progress_percent: percent,
          last_position_seconds: positionSec,
          completed: isCompleted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
      if (isCompleted && !completed) {
        setCompleted(true);
        toast.success("🎉 Урок завершено!");
      }
    },
    [completed, lesson.id, userId],
  );

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Math.round((v.currentTime / v.duration) * 100);
    setProgress(pct);
    // Debounced auto-save every 10s
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(
      () => saveProgress(pct, Math.floor(v.currentTime)),
      10_000,
    );
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play().catch(() => null);
    }
    setPlaying(!playing);
  };

  // ── TEXT lesson ─────────────────────────────────────────
  if (lesson.content_type === "text" || !lesson.video_url) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-8">
          {lesson.content ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              Контент уроку буде додано незабаром
            </p>
          )}
        </div>
        {completed ? (
          <div className="flex items-center justify-center gap-2 py-2 text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Урок завершено</span>
          </div>
        ) : (
          <Button className="w-full" onClick={() => saveProgress(100, 0)}>
            <CheckCircle2 className="h-4 w-4" />
            Позначити як прочитане
          </Button>
        )}
      </div>
    );
  }

  // ── VIDEO lesson ────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="glass group relative overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          src={lesson.video_url ?? ""}
          className="aspect-video w-full"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => saveProgress(100, 0)}
          muted={muted}
          playsInline
        />

        {/* Controls overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          )}
        >
          <Progress value={progress} className="mb-3 h-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-white transition-colors hover:text-green-400"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className="text-white transition-colors hover:text-green-400"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="ml-auto text-xs text-white/70">{progress}%</span>
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="text-white transition-colors hover:text-green-400"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Big play button */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 shadow-glow-brand">
              <Play className="ml-1 h-7 w-7 text-white" />
            </div>
          </button>
        )}
      </div>

      {completed && (
        <div className="flex items-center justify-center gap-2 py-2 text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Урок завершено</span>
        </div>
      )}
    </div>
  );
}
