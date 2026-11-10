import type { MetadataRoute } from "next";
import { getSiteSettings, getSiteUrl } from "@/lib/api";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache-policy";

export const revalidate = CONTENT_REVALIDATE_SECONDS;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = getSiteUrl(settings) || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout", "/order/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
