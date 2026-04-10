import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const stripe = getStripeServer();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, levelId } = session.metadata ?? {};

    if (!userId || !levelId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Record payment
    await supabase.from("payments").insert({
      user_id: userId,
      level_id: levelId,
      amount: session.amount_total ?? 0,
      currency: session.currency?.toUpperCase() ?? "UAH",
      status: "succeeded",
      stripe_payment_intent_id: session.payment_intent as string,
    });

    // Create / activate subscription
    await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        level_id: levelId,
        status: "active",
        current_period_start: new Date().toISOString(),
      },
      { onConflict: "user_id,level_id" },
    );
  }

  return NextResponse.json({ received: true });
}
