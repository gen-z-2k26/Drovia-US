import { getPaymentAccounts } from "@/lib/payment-config";

const SANDBOX = "https://sandbox.affirm.com";
const LIVE = "https://api.affirm.com";

async function affirmAccount() {
  const accounts = await getPaymentAccounts();
  return accounts.affirm;
}

export async function isAffirmConfigured() {
  const account = await affirmAccount();
  return Boolean(account.publicKey && account.privateKey);
}

function affirmBase(mode: "sandbox" | "live") {
  return mode === "live" ? LIVE : SANDBOX;
}

async function affirmFetch<T>(
  path: string,
  body: unknown,
  override?: { mode?: "sandbox" | "live"; publicKey?: string; privateKey?: string },
): Promise<{ ok: boolean; status: number; data: T }> {
  const account = await affirmAccount();
  const mode = override?.mode || account.mode;
  const publicKey = override?.publicKey?.trim() || account.publicKey;
  const privateKey = override?.privateKey?.trim() || account.privateKey;
  if (!publicKey || !privateKey) throw new Error("Add the keys first.");
  const response = await fetch(`${affirmBase(mode)}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${publicKey}:${privateKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  let data = {} as T;
  try {
    data = raw ? (JSON.parse(raw) as T) : ({} as T);
  } catch {
    data = {} as T;
  }
  return { ok: response.ok, status: response.status, data };
}

export async function pingAffirm(override?: {
  mode?: "sandbox" | "live";
  publicKey?: string;
  privateKey?: string;
}) {
  const result = await affirmFetch<{ message?: string; code?: string }>(
    "/api/v2/charges",
    { checkout_token: "connection-test" },
    override,
  );
  if (result.status === 401 || result.status === 403) {
    throw new Error("Affirm rejected these keys.");
  }
  if (result.status >= 500) {
    throw new Error("Affirm could not be reached.");
  }
}

export async function captureAffirmCheckout(input: {
  checkoutToken: string;
  orderId: string;
}) {
  const created = await affirmFetch<{
    id?: string;
    amount?: number;
    currency?: string;
    order_id?: string;
    message?: string;
  }>("/api/v2/charges", {
    checkout_token: input.checkoutToken,
    order_id: input.orderId,
  });
  if (!created.ok || !created.data.id) {
    throw new Error(created.data.message || "Affirm payment was not approved.");
  }
  const captured = await affirmFetch<{ id?: string; message?: string }>(
    `/api/v2/charges/${encodeURIComponent(created.data.id)}/capture`,
    {},
  );
  if (!captured.ok) {
    throw new Error(captured.data.message || "Affirm capture failed.");
  }
  return {
    chargeId: created.data.id,
    orderId: created.data.order_id || "",
    amount: Number(created.data.amount || 0) / 100,
    currency: created.data.currency || "",
  };
}
