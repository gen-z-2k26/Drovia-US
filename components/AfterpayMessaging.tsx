"use client";

import Script from "next/script";
import { useBnpl } from "@/lib/bnpl-context";
import {
  afterpayAmountString,
  afterpayMarketplaceSrc,
  afterpayPlacementId,
  canLoadAfterpayOsm,
  shouldShowAfterpay,
  toAfterpayLocale,
  type AfterpayPageType,
} from "@/lib/bnpl";
import { useStore } from "@/lib/store-context";

function osmPageType(pageType: AfterpayPageType) {
  return pageType === "cart" ? "cart" : "product";
}

export function AfterpayMessaging({
  pageType,
  amount,
  skus,
  categories,
  eligible = true,
  className,
}: {
  pageType: AfterpayPageType;
  amount?: number;
  skus?: string;
  categories?: string;
  eligible?: boolean;
  className?: string;
}) {
  const { settings } = useStore();
  const config = useBnpl();
  const show = shouldShowAfterpay(
    settings,
    config,
    config.afterpayEnabled,
    pageType === "product" ? "product-setting" : pageType,
  );
  const decimal = afterpayAmountString(amount, settings.priceDecimals);
  const needsAmount = pageType !== "homepage";
  const osm =
    show && pageType !== "homepage" && canLoadAfterpayOsm(config, pageType);
  const osmAccount = Boolean(config.afterpayMpid);
  const currency = (settings.currency || "USD").toUpperCase();
  const locale = toAfterpayLocale(settings.locale);
  const placementId = afterpayPlacementId(config, pageType);

  if (!show) return null;
  if (needsAmount && !decimal) return null;

  const copy = osmAccount ? (
    <p>
      Pay in 4 interest-free payments with Afterpay{" "}
      <span data-afterpay-modal className="cursor-pointer" aria-label="Afterpay information">
        ⓘ
      </span>
    </p>
  ) : (
    <p>Pay in 4 interest-free payments with Afterpay.</p>
  );

  return (
    <div className={className ?? "text-sm text-muted-foreground"}>
      {osm ? (
        <>
          <Script
            id={`ppx-afterpay-osm-${config.afterpayMode}`}
            src={afterpayMarketplaceSrc(config.afterpayMode)}
            strategy="afterInteractive"
          />
          <square-placement
            key={`${pageType}-${decimal ?? "none"}-${placementId}`}
            data-mpid={config.afterpayMpid}
            data-placement-id={placementId}
            data-page-type={osmPageType(pageType)}
            data-amount={decimal}
            data-currency={currency}
            data-consumer-locale={locale}
            data-item-skus={skus}
            data-item-categories={categories}
            data-is-eligible={eligible ? "true" : "false"}
            data-cart-is-eligible={
              pageType === "cart" ? (eligible ? "true" : "false") : undefined
            }
          />
        </>
      ) : osmAccount ? (
        <>
          <Script
            id={`ppx-afterpay-osm-${config.afterpayMode}`}
            src={afterpayMarketplaceSrc(config.afterpayMode)}
            strategy="afterInteractive"
          />
          {copy}
        </>
      ) : (
        <>
          <Script
            id="ppx-afterpay-js"
            src="https://js.afterpay.com/afterpay-1.x.js"
            strategy="afterInteractive"
          />
          {decimal ? (
            <afterpay-placement
              key={`legacy-${decimal}`}
              data-locale={locale}
              data-currency={currency}
              data-amount={decimal}
              data-logo-type="lockup"
              data-size="sm"
            />
          ) : (
            copy
          )}
        </>
      )}
    </div>
  );
}
