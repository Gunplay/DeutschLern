import { createClient } from "@/lib/supabase/server";
import { AdminCoursesClient } from "@/features/courses/components/admin-courses-client";

export const metadata = { title: "Адмін — Курси" };

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: levels } = await supabase
    .from("levels")
    .select("*, modules(id, title, lessons(id, title, order_index))")
    .order("order_index");

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Управління курсами</h1>
      <AdminCoursesClient levels={levels ?? []} />
    </div>
  );
}
