"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export function BackButton({ 
  className, 
  label = "Попередня сторінка" 
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        // Міняємо w-full на w-auto на мобільних, щоб кнопка не займала весь рядок
        "flex items-center gap-3 rounded-xl px-2 py-2 md:px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground group w-auto md:w-full",
        className
      )}
    >
      {/* Контейнер для іконки */}
      <div className="flex h-8 w-8 md:h-7 md:w-7 items-center justify-center rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors">
        <ChevronLeft className="h-5 w-5 md:h-4 md:w-4 transition-transform group-hover:-translate-x-0.5" />
      </div>

      {/* Текст: приховуємо на мобільних (hidden) і показуємо від md (md:block) */}
      <span className="hidden md:block">
        {label}
      </span>
    </button>
  );
}