"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QUIZ_PASS_THRESHOLD } from "@/constants";
import type { Question } from "@/types";

interface QuizEngineProps {
  lessonId: string;
  questions: Question[];
  userId: string;
}

type QuizState = "idle" | "answering" | "result" | "complete";

export function QuizEngine({ lessonId, questions, userId }: QuizEngineProps) {
  const [state, setState] = useState<QuizState>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = questions[currentIdx];
  const totalQ = questions.length;
  const isLast = currentIdx === totalQ - 1;

  const correctAnswers = Object.entries(answers).filter(([qId, ans]) => {
    const q = questions.find((q) => q.id === qId);
    return q?.correct_answer === ans;
  }).length;

  const score = totalQ > 0 ? Math.round((correctAnswers / totalQ) * 100) : 0;
  const passed = score >= QUIZ_PASS_THRESHOLD;

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    setState("result");
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz();
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setState("answering");
    }
  };

  const finishQuiz = async () => {
    const supabase = createClient();
    await supabase.from("quiz_attempts").insert({
      user_id: userId,
      lesson_id: lessonId,
      score,
      total_questions: totalQ,
      passed,
      answers,
      completed_at: new Date().toISOString(),
    });
    setState("complete");
    if (passed) {
      toast.success(`Тест пройдено! Результат: ${score}%`);
    } else {
      toast.error(`Не вистачило балів. Результат: ${score}%`);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setAnswers({});
    setState("idle");
  };

  // ── IDLE ────────────────────────────────────────────────
  if (state === "idle") {
    return (
      <div className="glass space-y-4 rounded-2xl p-8 text-center">
        <Trophy className="mx-auto h-12 w-12 text-primary" />
        <h3 className="font-display text-xl font-bold">Перевір свої знання</h3>
        <p className="text-sm text-muted-foreground">
          {totalQ} питань · Для проходження потрібно {QUIZ_PASS_THRESHOLD}%
        </p>
        <Button onClick={() => setState("answering")}>Розпочати тест</Button>
      </div>
    );
  }

  // ── COMPLETE ────────────────────────────────────────────
  if (state === "complete") {
    return (
      <div className="glass space-y-6 rounded-2xl p-8 text-center">
        <div
          className={cn(
            "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
            passed ? "bg-green-500/15" : "bg-destructive/15",
          )}
        >
          {passed ? (
            <Trophy className="h-10 w-10 text-green-400" />
          ) : (
            <XCircle className="h-10 w-10 text-destructive" />
          )}
        </div>
        <div>
          <h3 className="mb-1 font-display text-2xl font-bold">
            {passed ? "Вітаємо! 🎉" : "Спробуй ще раз"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Правильно: {correctAnswers} з {totalQ}
          </p>
        </div>
        <div className="gradient-text font-display text-5xl font-bold">{score}%</div>
        <Badge variant={passed ? "success" : "destructive"} className="px-4 py-1 text-sm">
          {passed ? "Тест пройдено ✓" : "Потрібно більше балів"}
        </Badge>
        {!passed && (
          <Button variant="outline" onClick={restart} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Спробувати знову
          </Button>
        )}
      </div>
    );
  }

  // ── QUESTION ────────────────────────────────────────────
  const options = (current.options as string[] | null) ?? [];
  const isCorrect = selected === current.correct_answer;

  return (
    <div className="glass space-y-6 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Питання {currentIdx + 1} / {totalQ}
        </span>
        <span className="text-sm font-medium">
          {Math.round((currentIdx / totalQ) * 100)}%
        </span>
      </div>
      <Progress value={Math.round((currentIdx / totalQ) * 100)} />

      <h3 className="text-lg font-semibold leading-relaxed">{current.question}</h3>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isRight = option === current.correct_answer;
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={cn(
                "quiz-answer",
                selected && isRight && "correct",
                selected && isSelected && !isRight && "incorrect",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    selected && isRight
                      ? "border-green-500 bg-green-500"
                      : selected && isSelected && !isRight
                        ? "border-destructive bg-destructive"
                        : "border-border",
                  )}
                >
                  {selected && isRight && <CheckCircle2 className="h-3 w-3 text-white" />}
                  {selected && isSelected && !isRight && (
                    <XCircle className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-left text-sm">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className={cn(
            "rounded-xl p-4 text-sm",
            isCorrect
              ? "border border-green-500/20 bg-green-500/10 text-green-400"
              : "border border-destructive/20 bg-destructive/10 text-destructive",
          )}
        >
          <p className="mb-1 font-medium">
            {isCorrect ? "✓ Правильно!" : "✗ Неправильно"}
          </p>
          {current.explanation && (
            <p className="text-xs opacity-80">{current.explanation}</p>
          )}
        </div>
      )}

      {selected && (
        <Button onClick={handleNext} className="w-full gap-2">
          {isLast ? "Завершити тест" : "Наступне питання"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
