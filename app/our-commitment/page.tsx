import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VerbatimDocument } from "@/components/VerbatimDocument";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { discoverBySlug } from "@/lib/discover";

export const revalidate = CONTENT_REVALIDATE_SECONDS;

const PAGE = discoverBySlug("our-commitment");

export const metadata: Metadata = {
  title: PAGE?.title ?? "Our Commitment",
  description: PAGE?.description,
};

export default async function CommitmentPage() {
  if (!PAGE?.lines?.length) notFound();
  return <VerbatimDocument lines={PAGE.lines} />;
}
