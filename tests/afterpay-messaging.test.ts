import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultProductPage, type BnplPublicConfig, type StoreSettings } from "@/lib/types";
import {
  EMPTY_BNPL,
  afterpayAmountString,
  afterpayCurrencyOk,
  afterpayMarketplaceSrc,
  afterpayPlacementId,
  canLoadAfterpayOsm,
  shouldShowAfterpay,
  toAfterpayLocale,
} from "@/lib/bnpl";

const root = join(__dirname, "..");

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function settings(partial?: {
  currency?: string;
  locale?: string;
  priceDecimals?: number;
  enableAfterpayMsg?: boolean;
}) {
  return {
    currency: partial?.currency ?? "USD",
    locale: partial?.locale ?? "en-US",
    priceDecimals: partial?.priceDecimals ?? 2,
    productPage: {
      ...defaultProductPage,
      enableAfterpayMsg: partial?.enableAfterpayMsg ?? true,
    },
  } as StoreSettings;
}

function config(partial?: Partial<BnplPublicConfig>): BnplPublicConfig {
  return { ...EMPTY_BNPL, ...partial };
}

describe("Afterpay promotional messaging", () => {
  it("shows on product pages when Afterpay is on and the currency is supported", () => {
    expect(
      shouldShowAfterpay(
        settings(),
        config({ afterpayEnabled: true }),
        true,
        "product-setting",
      ),
    ).toBe(true);
  });

  it("hides product messaging when the product-page toggle is off", () => {
    expect(
      shouldShowAfterpay(
        settings({ enableAfterpayMsg: false }),
        config({ afterpayEnabled: true }),
        true,
        "product-setting",
      ),
    ).toBe(false);
  });

  it("still shows cart and homepage messaging when the product-page toggle is off", () => {
    const store = settings({ enableAfterpayMsg: false });
    const bnpl = config({ afterpayEnabled: true });
    expect(shouldShowAfterpay(store, bnpl, true, "cart")).toBe(true);
    expect(shouldShowAfterpay(store, bnpl, true, "homepage")).toBe(true);
  });

  it("hides messaging for currencies Afterpay does not support", () => {
    expect(
      shouldShowAfterpay(
        settings({ currency: "EUR" }),
        config({ afterpayEnabled: true }),
        true,
        "cart",
      ),
    ).toBe(false);
    expect(afterpayCurrencyOk(settings({ currency: "EUR" }))).toBe(false);
    expect(afterpayCurrencyOk(settings({ currency: "usd" }))).toBe(true);
  });

  it("hides messaging when Afterpay is off and no MPID is configured", () => {
    expect(shouldShowAfterpay(settings(), EMPTY_BNPL, false, "cart")).toBe(false);
  });

  it("uses cart placement, then product placement, and never invents a homepage id", () => {
    const bnpl = config({
      afterpayMpid: "mpid",
      afterpayPlacementId: "product-1",
      afterpayCartPlacementId: "cart-1",
    });
    expect(afterpayPlacementId(bnpl, "product")).toBe("product-1");
    expect(afterpayPlacementId(bnpl, "cart")).toBe("cart-1");
    expect(afterpayPlacementId(bnpl, "homepage")).toBe("");
    expect(afterpayPlacementId(config({ afterpayPlacementId: "product-1" }), "cart")).toBe(
      "product-1",
    );
    expect(canLoadAfterpayOsm(bnpl, "product")).toBe(true);
    expect(canLoadAfterpayOsm(bnpl, "homepage")).toBe(false);
    expect(read("components/AfterpayMessaging.tsx")).toMatch(
      /pageType !== "homepage"/,
    );
  });

  it("formats locales and amounts Afterpay accepts", () => {
    expect(toAfterpayLocale("en-US")).toBe("en_US");
    expect(toAfterpayLocale("en_AU")).toBe("en_AU");
    expect(toAfterpayLocale("nl")).toBe("en_US");
    expect(toAfterpayLocale("fr-CA")).toBe("fr_CA");
    expect(afterpayAmountString(44, 2)).toBe("44.00");
    expect(afterpayAmountString(0, 2)).toBeUndefined();
    expect(afterpayAmountString(-10, 2)).toBeUndefined();
    expect(afterpayAmountString(Number.NaN, 2)).toBeUndefined();
    expect(afterpayAmountString(undefined, 2)).toBeUndefined();
  });

  it("loads the Square marketplace script for the Afterpay mode", () => {
    expect(afterpayMarketplaceSrc("live")).toBe(
      "https://js.squarecdn.com/square-marketplace.js",
    );
    expect(afterpayMarketplaceSrc("sandbox")).toBe(
      "https://js-sandbox.squarecdn.com/square-marketplace.js",
    );
  });
});

describe("Afterpay messaging placements", () => {
  it("sits under the product price, homepage trust strip, cart total, and checkout total", () => {
    expect(read("components/ProductDetail.tsx")).toMatch(/BnplMessaging/);
    expect(read("components/sections/TrustStripSection.tsx")).toMatch(
      /pageType="homepage"/,
    );
    expect(read("components/CartDrawer.tsx")).toMatch(/pageType="cart"/);
    expect(read("components/CheckoutPage.tsx")).toMatch(/pageType="cart"/);
  });

  it("does not mix OSM and the legacy Afterpay.js script when an MPID exists", () => {
    const source = read("components/AfterpayMessaging.tsx");
    expect(source).toMatch(/canLoadAfterpayOsm/);
    expect(source).toMatch(/osmAccount/);
    expect(source).toMatch(/js\.afterpay\.com\/afterpay-1\.x\.js/);
    expect(source).toMatch(/afterpayMarketplaceSrc/);
  });
});
