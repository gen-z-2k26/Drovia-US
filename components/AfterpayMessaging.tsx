"use client";

import Script from "next/script";
import { useBnpl } from "@/lib/bnpl-context";
import {
  AFTERPAY_OSM,
  afterpayAmountString,
  afterpayMarketplaceSrc,
  afterpayPlacementId,
  shouldShowAfterpay,
  toAfterpayLocale,
  type AfterpayPageType,
} from "@/lib/bnpl";
import { useStore } from "@/lib/store-context";

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
  const placementId = afterpayPlacementId(pageType);

  if (!show || pageType === "homepage" || !decimal || !placementId) return null;

  return (
    <div className={className ?? "text-sm text-muted-foreground"}>
      <Script
        id={`ppx-afterpay-osm-${config.afterpayMode}`}
        src={afterpayMarketplaceSrc(config.afterpayMode)}
        strategy="afterInteractive"
      />
      <square-placement
        key={`${pageType}-${decimal}-${placementId}`}
        data-mpid={AFTERPAY_OSM.mpid}
        data-placement-id={placementId}
        data-page-type={pageType === "cart" ? "cart" : "product"}
        data-amount={decimal}
        data-currency={(settings.currency || "USD").toUpperCase()}
        data-consumer-locale={toAfterpayLocale(settings.locale)}
        data-item-skus={skus}
        data-item-categories={categories}
        data-is-eligible={eligible ? "true" : "false"}
      />
    </div>
  );
}
