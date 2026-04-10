import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ className, size = "md" }: LoadingProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-border border-t-primary",
        sizes[size],
        className,
      )}
    />
  );
}

export function PageLoader({ text = "Завантаження..." }: LoadingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="animate-pulse text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="skeleton h-4 w-2/3 rounded-full" />
      <div className="skeleton h-3 w-full rounded-full" />
      <div className="skeleton h-3 w-4/5 rounded-full" />
      <div className="skeleton mt-2 h-8 w-1/3 rounded-xl" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
