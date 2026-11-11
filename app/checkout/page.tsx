import type { Metadata } from "next";
import { connection } from "next/server";
import { CheckoutPage } from "@/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutRoute() {
  // The checkout CSP nonce is per request, so this page cannot be prerendered.
  await connection();
  return <CheckoutPage />;
}
