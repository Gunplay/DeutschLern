import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VocabularyClient } from "@/features/vocabulary/components/vocabulary-client";

export const metadata = { title: "Словник" };

export default async function VocabularyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: words } = await supabase
    .from("vocabulary")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold">Мій словник</h1>
        <p className="text-muted-foreground">Тренуй слова за допомогою флеш-карток</p>
      </div>
      <VocabularyClient words={words ?? []} userId={user.id} />
    </div>
  );
}
