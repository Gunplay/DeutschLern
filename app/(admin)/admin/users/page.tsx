import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, timeAgo } from "@/lib/utils";

export const metadata = { title: "Адмін — Користувачі" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*, subscriptions(status, levels(slug))")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold">Користувачі</h1>
        <p className="text-muted-foreground">{users?.length ?? 0} зареєстрованих</p>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Користувач", "Роль", "Рівні", "Реєстрація"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(users ?? []).map((u: any) => {
                const activeLevels = (u.subscriptions ?? [])
                  .filter((s: any) => s.status === "active")
                  .map((s: any) => s.levels?.slug)
                  .filter(Boolean);
                return (
                  <tr key={u.id} className="transition-colors hover:bg-secondary/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={u.avatar_url ?? ""} />
                          <AvatarFallback>
                            {getInitials(u.full_name ?? u.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{u.full_name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {activeLevels.length > 0 ? (
                          activeLevels.map((slug: string) => (
                            <Badge key={slug} variant="success" className="text-[10px]">
                              {slug}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {timeAgo(u.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
