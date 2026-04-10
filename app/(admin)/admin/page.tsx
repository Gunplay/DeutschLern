import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, CreditCard, TrendingUp } from "lucide-react";

export const metadata = { title: "Адмін — Дашборд" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: usersCount }, { count: lessonsCount }, { data: payments }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("payments").select("amount").eq("status", "succeeded"),
    ]);

  const revenue = (payments ?? []).reduce((sum: number, p: any) => sum + p.amount, 0);

  const stats = [
    {
      label: "Студентів",
      value: usersCount ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Уроків",
      value: lessonsCount ?? 0,
      icon: BookOpen,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Платежів",
      value: (payments ?? []).length,
      icon: CreditCard,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Дохід (₴)",
      value: `${(revenue / 100).toLocaleString("uk-UA")}`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold">Адмін-панель</h1>
        <p className="text-muted-foreground">Управління платформою DeutschLern</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div
              className={`h-10 w-10 rounded-xl ${bg} mb-3 flex items-center justify-center`}
            >
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
