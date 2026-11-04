import type { BnplPublicConfig, StoreSettings } from "@/lib/types";

const AFFIRM_CURRENCIES = new Set(["USD", "CAD"]);
const AFTERPAY_CURRENCIES = new Set(["AUD", "NZD", "USD", "CAD", "GBP"]);

export function amountToCents(price: number, decimals: number) {
  const places = Number.isFinite(decimals) ? decimals : 2;
  return Math.round(price * 10 ** places);
}

export function amountToDecimalString(price: number, decimals: number) {
  const places = Number.isFinite(decimals) ? decimals : 2;
  return price.toFixed(places);
}

export function toAfterpayLocale(locale: string) {
  const normalized = locale.replace("-", "_");
  if (/^[a-z]{2}_[A-Z]{2}$/.test(normalized)) return normalized;
  const lang = locale.slice(0, 2).toLowerCase() || "en";
  return `${lang}_US`;
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

export function shouldShowAfterpay(
  settings: StoreSettings,
  config: BnplPublicConfig,
  gatewayEnabled = false,
) {
  if (!settings.productPage.enableAfterpayMsg) return false;
  if (!gatewayEnabled && (!config.afterpayMpid || !config.afterpayPlacementId)) {
    return false;
  }
  const currency = (settings.currency || "").toUpperCase();
  return !currency || AFTERPAY_CURRENCIES.has(currency) || gatewayEnabled;
}

export function canLoadAffirmWidget(config: BnplPublicConfig) {
  return Boolean(config.affirmPublicKey);
}

export function canLoadAfterpayWidget(config: BnplPublicConfig) {
  return Boolean(config.afterpayMpid && config.afterpayPlacementId);
}

export function affirmCountryCode(currency: string) {
  return currency.toUpperCase() === "CAD" ? "CAN" : "USA";
}

export function affirmLocale(currency: string) {
  return currency.toUpperCase() === "CAD" ? "en_CA" : "en_US";
}
