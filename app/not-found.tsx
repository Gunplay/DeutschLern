import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand">
        <GraduationCap className="h-8 w-8 text-white" />
      </div>
      <h1 className="gradient-text mb-4 font-display text-8xl font-bold">404</h1>
      <h2 className="mb-3 font-display text-2xl font-bold">Сторінку не знайдено</h2>
      <p className="mb-8 max-w-sm text-muted-foreground">
        Схоже, ця сторінка пішла вчити німецьку і не повернулась.
      </p>
      <Button asChild>
        <Link href="/">Повернутись на головну</Link>
      </Button>
    </div>
  );
}
