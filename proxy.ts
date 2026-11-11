import { NextResponse, type NextRequest } from "next/server";
import { getEnabledCheckoutMethods } from "@/lib/api/payments";
import { themeInitScript } from "@/lib/theme-script";

// Reign's payment page policy (docs.reign.com/payments-js/content-security-policy).
// Sent only while Reign is on. The other processors' hosts stay allowed so they
// keep working when they are on at the same time as Reign.
const REIGN_LIVE = {
  js: "https://js.reign.com",
  api: "https://checkout-api.reign.com",
};
const REIGN_SANDBOX = {
  js: "https://js.reign-sandbox.com",
  api: "https://checkout-api.reign-sandbox.com",
};
const SPREEDLY = "https://core.spreedly.com";
const SPREEDLY_LOGS = "https://pci.browser-intake-datadoghq.com";

const OTHER_SCRIPTS = [
  "https://js.stripe.com",
  "https://www.paypal.com",
  "https://*.paypal.com",
  "https://*.paypalobjects.com",
  "https://cdn1.affirm.com",
  "https://cdn1-sandbox.affirm.com",
  "https://js.afterpay.com",
  "https://portal.afterpay.com",
];
const OTHER_FRAMES = [
  "https://js.stripe.com",
  "https://hooks.stripe.com",
  "https://www.paypal.com",
  "https://*.paypal.com",
  "https://*.affirm.com",
  "https://*.afterpay.com",
];
const OTHER_CONNECT = [
  "https://api.stripe.com",
  "https://*.paypal.com",
  "https://*.affirm.com",
  "https://*.afterpay.com",
];

const OTHER_ASSETS = [
  "https://*.paypal.com",
  "https://*.paypalobjects.com",
  "https://*.affirm.com",
  "https://*.afterpay.com",
];

let themeHash: Promise<string> | null = null;

function inlineHash(source: string) {
  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(source))
    .then((digest) => `'sha256-${Buffer.from(digest).toString("base64")}'`);
}

export async function proxy(request: NextRequest) {
  const methods = await getEnabledCheckoutMethods().catch(() => []);
  if (!methods.some((method) => method.kind === "reign")) return NextResponse.next();

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const reign =
    process.env.VERCEL_ENV === "production" ? [REIGN_LIVE] : [REIGN_LIVE, REIGN_SANDBOX];
  themeHash ??= inlineHash(themeInitScript);

  const policy = [
    "default-src 'self'",
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      await themeHash,
      "'strict-dynamic'",
      ...reign.map((host) => host.js),
      SPREEDLY,
      ...OTHER_SCRIPTS,
      isDev ? "'unsafe-eval'" : "",
    ].join(" "),
    ["frame-src", SPREEDLY, ...reign.map((host) => host.js), ...OTHER_FRAMES].join(" "),
    ["child-src", SPREEDLY, ...reign.map((host) => host.js), ...OTHER_FRAMES].join(" "),
    [
      "connect-src 'self'",
      ...reign.map((host) => host.api),
      SPREEDLY,
      SPREEDLY_LOGS,
      ...OTHER_CONNECT,
    ].join(" "),
    // React style attributes (theme variables on <html>) and Stripe Elements need inline styles.
    ["style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", ...OTHER_ASSETS].join(" "),
    ["font-src 'self' data: https://fonts.gstatic.com", ...OTHER_ASSETS].join(" "),
    "img-src 'self' data: blob: https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'self'",
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ")
    .replace(/\s{2,}/g, " ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/checkout",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
