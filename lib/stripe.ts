import Stripe from "stripe";
import { getPaymentAccounts } from "@/lib/payment-config";

const ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

let stripeCache: { key: string; client: Stripe } | null = null;

function envYes(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized === "yes" || normalized === "true" || normalized === "1";
}

/** Local-only. Skips Stripe charge; Woo order is still created and set paid. */
export function isMockPaymentEnabled() {
  if (process.env.NODE_ENV === "production") return false;
  return envYes(process.env.SKIP_STRIPE_PAYMENT);
}

export function mockPaymentIntentId(orderId: string) {
  return `dev_mock_${orderId.trim()}`;
}

export function isMockPaymentIntentId(id: string) {
  return id.startsWith("dev_mock_");
}

export async function isStripeConfigured() {
  const accounts = await getPaymentAccounts();
  return Boolean(accounts.stripe.secretKey);
}

export async function getStripeWebhookSecret() {
  const accounts = await getPaymentAccounts();
  return accounts.stripe.webhookSecret;
}

export async function getStripe(): Promise<Stripe> {
  const accounts = await getPaymentAccounts();
  const key = accounts.stripe.secretKey;
  if (!key) {
    throw new Error("Stripe is not configured. Add a secret key in Admin.");
  }
  if (!stripeCache || stripeCache.key !== key) {
    stripeCache = { key, client: new Stripe(key) };
  }
  return stripeCache.client;
}

export async function pingStripe(secretKey?: string) {
  const key = secretKey?.trim() || (await getPaymentAccounts()).stripe.secretKey;
  if (!key) throw new Error("Add the keys first.");
  const stripe = new Stripe(key);
  await stripe.balance.retrieve();
}

export function toStripeAmount(total: string | number, currency: string) {
  const amount = Number(total);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Order total is invalid.");
  }
  const code = currency.trim().toUpperCase();
  if (ZERO_DECIMAL.has(code)) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}

export function stripeAmountMatches(
  total: string | number,
  currency: string,
  stripeAmount: number,
  stripeCurrency: string,
) {
  const expected = toStripeAmount(total, currency);
  return (
    expected === stripeAmount &&
    currency.trim().toLowerCase() === stripeCurrency.trim().toLowerCase()
  );
}
