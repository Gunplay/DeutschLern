"use client";

import { useState } from "react";
import { Plus, RotateCcw, BookMarked, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { VocabularyWord } from "@/types";

interface Props {
  words: VocabularyWord[];
  userId: string;
}

export function VocabularyClient({ words: initialWords, userId }: Props) {
  const [words, setWords] = useState<VocabularyWord[]>(initialWords);
  const [mode, setMode] = useState<"list" | "flashcard">("list");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState({
    german: "",
    translation: "",
    example: "",
  });

  const unlearnedWords = words.filter((w) => !w.learned);
  const currentCard = unlearnedWords[cardIdx] ?? null;

  const addWord = async () => {
    if (!newWord.german.trim() || !newWord.translation.trim()) {
      toast.error("Заповніть німецьке слово та переклад");
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .insert({ user_id: userId, ...newWord })
      .select()
      .single();

    if (!error && data) {
      setWords((prev) => [data as VocabularyWord, ...prev]);
      setNewWord({ german: "", translation: "", example: "" });
      setShowAdd(false);
      toast.success("Слово додано!");
    } else {
      toast.error("Помилка при додаванні");
    }
  };

  const markLearned = async (id: string, learned: boolean) => {
    const supabase = createClient();
    await supabase.from("vocabulary").update({ learned }).eq("id", id);
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, learned } : w)));
  };

  const deleteWord = async (id: string) => {
    if (!confirm("Видалити слово?")) return;
    const supabase = createClient();
    await supabase.from("vocabulary").delete().eq("id", id);
    setWords((prev) => prev.filter((w) => w.id !== id));
    toast.success("Слово видалено");
  };

  const nextCard = () => {
    setFlipped(false);
    setCardIdx((i) => (i < unlearnedWords.length - 1 ? i + 1 : 0));
  };

  return (
    <div className="space-y-6">
      {/* Mode switcher + Add button */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-xl border border-border">
          {(["list", "flashcard"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "list" ? "Список" : "Флеш-картки"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{words.length} слів</span>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus className="h-4 w-4" />
            Додати слово
          </Button>
        </div>
      </div>

      {/* Add word form */}
      {showAdd && (
        <div className="glass animate-fade-in space-y-4 rounded-2xl p-6">
          <h3 className="font-semibold">Нове слово</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Німецьке слово *</Label>
              <Input
                placeholder="das Haus"
                value={newWord.german}
                onChange={(e) => setNewWord((p) => ({ ...p, german: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Переклад *</Label>
              <Input
                placeholder="будинок"
                value={newWord.translation}
                onChange={(e) =>
                  setNewWord((p) => ({ ...p, translation: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Приклад речення</Label>
            <Input
              placeholder="Das Haus ist groß."
              value={newWord.example}
              onChange={(e) => setNewWord((p) => ({ ...p, example: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={addWord}>Зберегти</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Скасувати
            </Button>
          </div>
        </div>
      )}

      {/* ── FLASHCARD MODE ─────────────────────────── */}
      {mode === "flashcard" && (
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Залишилось вивчити: {unlearnedWords.length}</span>
            {unlearnedWords.length > 0 && (
              <span>
                {cardIdx + 1} / {unlearnedWords.length}
              </span>
            )}
          </div>

          {currentCard ? (
            <div
              className="glass flex min-h-[200px] cursor-pointer select-none flex-col items-center justify-center gap-4 rounded-2xl p-10 text-center transition-transform hover:scale-[1.02]"
              onClick={() => setFlipped(!flipped)}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {flipped ? "Переклад" : "Натисни щоб побачити переклад"}
              </p>
              <p className="font-display text-3xl font-bold">
                {flipped ? currentCard.translation : currentCard.german}
              </p>
              {flipped && currentCard.example && (
                <p className="text-sm italic text-muted-foreground">
                  {currentCard.example}
                </p>
              )}
            </div>
          ) : (
            <div className="glass space-y-3 rounded-2xl p-10 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
              <p className="font-semibold">Всі слова вивчено! 🎉</p>
              <Button
                variant="outline"
                onClick={() => {
                  words.forEach((w) => markLearned(w.id, false));
                }}
              >
                Почати знову
              </Button>
            </div>
          )}

          {currentCard && flipped && (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={nextCard}>
                <RotateCcw className="mr-1 h-4 w-4" />
                Ще раз
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  markLearned(currentCard.id, true);
                  setFlipped(false);
                  setCardIdx((i) => Math.max(0, i - 1));
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Вивчив!
              </Button>
            </div>
          )}

          {currentCard && !flipped && (
            <Button variant="ghost" className="w-full gap-2" onClick={nextCard}>
              <RotateCcw className="h-4 w-4" />
              Пропустити
            </Button>
          )}
        </div>
      )}

      {/* ── LIST MODE ──────────────────────────────── */}
      {mode === "list" && (
        <div className="space-y-2">
          {words.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <BookMarked className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Словник порожній. Додай перше слово!
              </p>
            </div>
          )}
          {words.map((word) => (
            <div
              key={word.id}
              className="glass group flex items-center gap-4 rounded-xl p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{word.german}</span>
                  {word.learned && (
                    <Badge variant="success" className="px-1.5 py-0 text-[10px]">
                      Вивчено
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{word.translation}</p>
                {word.example && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground/70">
                    {word.example}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => markLearned(word.id, !word.learned)}
                  title={word.learned ? "Позначити як невивчене" : "Позначити як вивчене"}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-green-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteWord(word.id)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
