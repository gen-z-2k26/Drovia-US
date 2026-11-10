import type { Metadata } from "next";
import TrackOrderPage from "../track-order/page";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache-policy";

export const revalidate = CONTENT_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Look up a guest order with your order number, order key, and billing email.",
};

export default TrackOrderPage;
