import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderFromQuery } from "@/components/OrderFromQuery";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache-policy";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export const revalidate = CONTENT_REVALIDATE_SECONDS;

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <p className="py-24 text-center text-sm text-muted-foreground">
          Loading order...
        </p>
      }
    >
      <OrderFromQuery />
    </Suspense>
  );
}
