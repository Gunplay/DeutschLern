import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// ─── Server-side Stripe (Secret key) ─────────────────────
let stripeServer: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeServer) {
    stripeServer = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
  }
  return stripeServer;
}

// ─── Client-side Stripe (Publishable key) ────────────────
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripeClient() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
