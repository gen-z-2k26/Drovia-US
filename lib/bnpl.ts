import type { BnplPublicConfig, StoreSettings } from "@/lib/types";

const AFFIRM_CURRENCIES = new Set(["USD", "CAD"]);
const AFTERPAY_CURRENCIES = new Set(["AUD", "NZD", "USD", "CAD", "GBP"]);

export type AfterpayPageType = "product" | "cart" | "homepage";

export const EMPTY_BNPL: BnplPublicConfig = {
  affirmPublicKey: "",
  affirmEnv: "sandbox",
  afterpayEnabled: false,
  afterpayMode: "sandbox",
  afterpayMpid: "",
  afterpayPlacementId: "",
  afterpayCartPlacementId: "",
  afterpayHomepagePlacementId: "",
};

/** Square on-site messaging snippets (product + cart only). */
export const AFTERPAY_OSM = {
  mpid: "851cd3de-8160-4f42-be75-966d3fb239c9",
  productPlacementId: "c60a81a3-730b-499f-9fa2-1048e65e4455",
  cartPlacementId: "79ee097e-67c7-4916-a9c7-6fd6504f6094",
} as const;

export function amountToCents(price: number, decimals: number) {
  const places = Number.isFinite(decimals) ? decimals : 2;
  return Math.round(price * 10 ** places);
}

export function amountToDecimalString(price: number, decimals: number) {
  const places = Number.isFinite(decimals) ? decimals : 2;
  return price.toFixed(places);
}

const AFTERPAY_LOCALES = new Set([
  "en_US",
  "en_AU",
  "en_CA",
  "en_GB",
  "en_NZ",
  "fr_CA",
  "es_US",
]);

export function toAfterpayLocale(locale: string) {
  const normalized = locale.trim().replace("-", "_");
  if (AFTERPAY_LOCALES.has(normalized)) return normalized;
  const lang = (normalized.slice(0, 2) || "en").toLowerCase();
  if (lang === "fr") return "fr_CA";
  if (lang === "es") return "es_US";
  return "en_US";
}

export function shouldShowAffirm(
  settings: StoreSettings,
  config: BnplPublicConfig,
  gatewayEnabled = false,
) {
  if (!settings.productPage.enableAffirmMsg) return false;
  if (!gatewayEnabled && !config.affirmPublicKey) return false;
  const currency = (settings.currency || "").toUpperCase();
  return !currency || AFFIRM_CURRENCIES.has(currency) || gatewayEnabled;
}

export function afterpayCurrencyOk(settings: StoreSettings) {
  const currency = (settings.currency || "USD").toUpperCase();
  return AFTERPAY_CURRENCIES.has(currency);
}

export function afterpayAmountString(amount: number | undefined, decimals: number) {
  if (amount === undefined || !Number.isFinite(amount) || amount <= 0) return undefined;
  return amountToDecimalString(amount, decimals);
}

export function shouldShowAfterpay(
  settings: StoreSettings,
  config: BnplPublicConfig,
  gatewayEnabled = false,
  surface: AfterpayPageType | "product-setting" = "product-setting",
) {
  if (surface === "product-setting" && !settings.productPage.enableAfterpayMsg) {
    return false;
  }
  if (!gatewayEnabled && !config.afterpayEnabled) {
    return false;
  }
  return afterpayCurrencyOk(settings);
}

export function afterpayPlacementId(pageType: AfterpayPageType) {
  if (pageType === "cart") return AFTERPAY_OSM.cartPlacementId;
  if (pageType === "product") return AFTERPAY_OSM.productPlacementId;
  return "";
}

export function canLoadAffirmWidget(config: BnplPublicConfig) {
  return Boolean(config.affirmPublicKey);
}

export function canLoadAfterpayOsm(pageType: AfterpayPageType) {
  return Boolean(afterpayPlacementId(pageType));
}

export function canLoadAfterpayWidget() {
  return canLoadAfterpayOsm("product");
}

export function afterpayMarketplaceSrc(mode: "sandbox" | "live") {
  return mode === "live"
    ? "https://js.squarecdn.com/square-marketplace.js"
    : "https://js-sandbox.squarecdn.com/square-marketplace.js";
}

export function affirmCountryCode(currency: string) {
  return currency.toUpperCase() === "CAD" ? "CAN" : "USA";
}

export function affirmLocale(currency: string) {
  return currency.toUpperCase() === "CAD" ? "en_CA" : "en_US";
}
