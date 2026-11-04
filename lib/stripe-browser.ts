import { loadStripe, type Stripe } from "@stripe/stripe-js";

const stripePromises = new Map<string, Promise<Stripe | null>>();

export function getStripeJs(publishableKey: string) {
  const key = publishableKey.trim();
  if (!key) return Promise.resolve(null);
  const existing = stripePromises.get(key);
  if (existing) return existing;
  const promise = loadStripe(key);
  stripePromises.set(key, promise);
  return promise;
}
