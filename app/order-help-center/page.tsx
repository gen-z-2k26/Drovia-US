import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomerCarePage } from "@/components/CustomerCarePage";
import { getSiteSettings } from "@/lib/api";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { customerCareBySlug } from "@/lib/customer-care";

export const revalidate = CONTENT_REVALIDATE_SECONDS;

const PAGE = customerCareBySlug("order-help-center");

export const metadata: Metadata = {
  title: PAGE?.title ?? "Order Help Center",
  description: PAGE?.description,
};

export default async function OrderHelpPage() {
  if (!PAGE) notFound();
  const settings = await getSiteSettings();
  return <CustomerCarePage page={PAGE} settings={settings} />;
}
