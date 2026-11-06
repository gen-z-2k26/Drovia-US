import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { VerbatimDocument } from "@/components/VerbatimDocument";
import { narrowContainer } from "@/lib/layout";
import { discoverBySlug } from "@/lib/discover";

export const revalidate = 60;

const PAGE = discoverBySlug("contact-us");

export const metadata: Metadata = {
  title: PAGE?.title ?? "Contact Us",
  description: PAGE?.description,
};

export default async function ContactPage() {
  if (!PAGE?.lines?.length) notFound();
  return (
    <>
      <VerbatimDocument lines={PAGE.lines} />
      <div className={narrowContainer("bg-primary/15 pb-16")}>
        <div className="rounded-xl border border-primary/40 bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
