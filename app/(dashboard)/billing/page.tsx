import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { LEVEL_BG, LEVEL_COLORS } from "@/constants";
import { CheckoutButton } from "@/features/payments/components/checkout-button";

export const metadata = { title: "Оплата та підписки" };

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id);

  const { data: payments } = await supabase
    .from("payments")
    .select("*, levels(slug, name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const activeIds = new Set(
    (subscriptions ?? [])
      .filter((s: any) => s.status === "active")
      .map((s: any) => s.level_id),
  );

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="mb-1 font-display text-3xl font-bold">Оплата та доступ</h1>
        <p className="text-muted-foreground">
          Керуй підписками та переглядай історію платежів
        </p>
      </div>

      {/* Level cards */}
      <div>
        <h2 className="mb-5 font-display text-xl font-semibold">Рівні</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(levels ?? []).map((level: any) => {
            const hasAccess = level.price === 0 || activeIds.has(level.id);
            return (
              <div
                key={level.id}
                className="glass relative overflow-hidden rounded-2xl p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_BG[level.slug] ?? ""}`}
                  >
                    {level.slug}
                  </span>
                  {hasAccess ? (
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Активний
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Lock className="mr-1 h-3 w-3" />
                      Не куплено
                    </Badge>
                  )}
                </div>
                <h3 className="mb-1 font-semibold">{level.name}</h3>
                <p className="mb-4 font-display text-2xl font-bold">
                  {formatPrice(level.price)}
                </p>
                {!hasAccess && (
                  <CheckoutButton
                    levelId={level.id}
                    levelName={level.name}
                    price={level.price}
                    userId={user.id}
                  />
                )}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${LEVEL_COLORS[level.slug] ?? "from-primary to-brand-600"}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment history */}
      {payments && payments.length > 0 && (
        <div>
          <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-semibold">
            <CreditCard className="h-5 w-5" /> Історія платежів
          </h2>
          <div className="glass divide-y divide-border overflow-hidden rounded-2xl">
            {payments.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.levels?.name ?? "Рівень"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("uk-UA")}
                  </p>
                </div>
                <span className="font-semibold">{formatPrice(p.amount, p.currency)}</span>
                <Badge variant={p.status === "succeeded" ? "success" : "secondary"}>
                  {p.status === "succeeded" ? "Оплачено" : p.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
