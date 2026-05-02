import { envServer } from "@/data/env/server";
import { Stripe } from "stripe";

export const stripe = new Stripe(envServer.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});
