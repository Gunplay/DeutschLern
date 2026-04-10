import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/client";
import { APP_URL } from "@/constants";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, levelName, price } = await req.json();

  if (!levelId || !price) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const stripe = getStripeServer();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "uah",
          unit_amount: price,
          product_data: {
            name: `DeutschLern — ${levelName}`,
            description: `Доступ до рівня ${levelName}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
      levelId,
    },
    success_url: `${APP_URL}/billing?success=1`,
    cancel_url: `${APP_URL}/billing?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
