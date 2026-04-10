"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LEVEL_BG } from "@/constants";

export function AdminCoursesClient({ levels: initialLevels }: { levels: any[] }) {
  const [levels, setLevels] = useState<any[]>(initialLevels);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content_type: "video",
    duration_minutes: 15,
    is_preview: false,
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addLesson = async (moduleId: string) => {
    if (!newLesson.title) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        ...newLesson,
        order_index: 999,
      })
      .select()
      .single();

    if (!error && data) {
      setLevels((prev) =>
        prev.map((level) => ({
          ...level,
          modules: level.modules.map((mod: any) =>
            mod.id === moduleId
              ? { ...mod, lessons: [...(mod.lessons ?? []), data] }
              : mod,
          ),
        })),
      );
      setShowAddLesson(null);
      setNewLesson({
        title: "",
        content_type: "video",
        duration_minutes: 15,
        is_preview: false,
      });
      toast.success("Урок додано!");
    } else {
      toast.error("Помилка при додаванні");
    }
  };

  const deleteLesson = async (lessonId: string, moduleId: string) => {
    if (!confirm("Видалити урок?")) return;
    const supabase = createClient();
    await supabase.from("lessons").delete().eq("id", lessonId);
    setLevels((prev) =>
      prev.map((level) => ({
        ...level,
        modules: level.modules.map((mod: any) =>
          mod.id === moduleId
            ? { ...mod, lessons: mod.lessons.filter((l: any) => l.id !== lessonId) }
            : mod,
        ),
      })),
    );
    toast.success("Урок видалено");
  };

  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <div key={level.id} className="glass overflow-hidden rounded-2xl">
          {/* Level header */}
          <button
            onClick={() => toggleExpand(level.id)}
            className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-secondary/30"
          >
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${LEVEL_BG[level.slug] ?? ""}`}
            >
              {level.slug}
            </span>
            <span className="flex-1 font-semibold">{level.name}</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" /> {level.modules?.length ?? 0} модулів
            </span>
            {expanded.has(level.id) ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {/* Modules */}
          {expanded.has(level.id) && (
            <div className="divide-y divide-border border-t border-border">
              {(level.modules ?? []).map((mod: any) => (
                <div key={mod.id}>
                  <div className="flex items-center gap-3 bg-secondary/20 px-5 py-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{mod.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {mod.lessons?.length ?? 0} уроків
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAddLesson(mod.id)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Урок
                    </Button>
                  </div>

                  {/* Add lesson form */}
                  {showAddLesson === mod.id && (
                    <div className="animate-fade-in space-y-3 border-b border-border bg-secondary/10 px-5 py-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">Назва уроку</Label>
                          <Input
                            placeholder="Назва уроку"
                            value={newLesson.title}
                            onChange={(e) =>
                              setNewLesson((p) => ({ ...p, title: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Тип</Label>
                          <select
                            className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-3 text-sm"
                            value={newLesson.content_type}
                            onChange={(e) =>
                              setNewLesson((p) => ({
                                ...p,
                                content_type: e.target.value,
                              }))
                            }
                          >
                            {["video", "text", "audio", "mixed"].map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => addLesson(mod.id)}>
                          Зберегти
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowAddLesson(null)}
                        >
                          Скасувати
                        </Button>
                        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={newLesson.is_preview}
                            onChange={(e) =>
                              setNewLesson((p) => ({
                                ...p,
                                is_preview: e.target.checked,
                              }))
                            }
                          />
                          Демо-урок
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Lessons list */}
                  {(mod.lessons ?? []).map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="group flex items-center gap-3 px-5 py-3 hover:bg-secondary/10"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary font-mono text-xs text-muted-foreground">
                        {lesson.order_index}
                      </div>
                      <span className="flex-1 truncate text-sm">{lesson.title}</span>
                      {lesson.is_preview && (
                        <Badge variant="secondary" className="text-[10px]">
                          Демо
                        </Badge>
                      )}
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteLesson(lesson.id, mod.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
