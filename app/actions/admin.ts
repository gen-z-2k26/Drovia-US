"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { pingAffirm } from "@/lib/affirm";
import { pingAfterpay } from "@/lib/afterpay";
import {
  adminAuthReady,
  adminPasswordMatches,
  clearAdminSession,
  createAdminSession,
  requireAdmin,
} from "@/lib/admin-session";
import { pingPayPal } from "@/lib/paypal";
import {
  clearProviderSecrets,
  getAdminPaymentView,
  savePaymentSettings,
  type PaymentMode,
  type PaymentProviderId,
  type PaymentSettingsInput,
} from "@/lib/payment-config";
import { pingStripe } from "@/lib/stripe";

const hits = new Map<string, { count: number; resetAt: number }>();

function clientKey(headerList: Headers) {
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local"
  );
}

function allow(key: string) {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

export async function loginAdminAction(password: string) {
  const headerList = await headers();
  if (!allow(clientKey(headerList))) {
    throw new Error("Too many attempts. Wait a minute and try again.");
  }
  if (!adminAuthReady() || !adminPasswordMatches(password)) {
    throw new Error("Invalid credentials.");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function savePaymentSettingsAction(input: PaymentSettingsInput) {
  await requireAdmin();
  await savePaymentSettings(input);
  return getAdminPaymentView();
}

export async function clearProviderAction(provider: PaymentProviderId) {
  await requireAdmin();
  await clearProviderSecrets(provider);
  return getAdminPaymentView();
}

export type PaymentConnectionDraft = {
  stripe?: { secretKey?: string };
  paypal?: { mode?: PaymentMode; clientId?: string; clientSecret?: string };
  affirm?: { mode?: PaymentMode; publicKey?: string; privateKey?: string };
  afterpay?: { mode?: PaymentMode; merchantId?: string; secret?: string };
};

export async function testProviderAction(
  provider: PaymentProviderId,
  draft?: PaymentConnectionDraft,
) {
  await requireAdmin();
  try {
    if (provider === "stripe") {
      await pingStripe(draft?.stripe?.secretKey);
    } else if (provider === "paypal") {
      await pingPayPal(draft?.paypal);
    } else if (provider === "affirm") {
      await pingAffirm(draft?.affirm);
    } else {
      await pingAfterpay(draft?.afterpay);
    }
    return { ok: true as const, message: "Connection succeeded." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed.";
    return {
      ok: false as const,
      message: message === "Add the keys first." ? message : message,
    };
  }
}
