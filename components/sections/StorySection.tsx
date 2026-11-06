import Link from "next/link";
import type { StoreSettings } from "@/lib/types";
import { Reveal } from "@/components/sections/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { pageContainer, sectionYClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function StorySection({ settings }: { settings: StoreSettings }) {
  return (
    <section
      aria-labelledby="story-heading"
      className={cn("border-b border-border", sectionYClass)}
    >
      <div
        className={pageContainer(
          "grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16",
        )}
      >
        <Reveal className="space-y-5">
          <p className="text-sm font-medium tracking-wide text-accent">
            About {settings.name}
          </p>
          <h2
            id="story-heading"
            className="font-display text-balance text-3xl sm:text-4xl"
          >
            A better home starts with the right essentials
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            DROVIIA is a U.S. online shop for home appliances, climate comfort,
            and personal care, operated by {settings.contact.legalName} in
            Gardena, California.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-us"
              className={cn(buttonVariants({ size: "lg" }), "mt-2 inline-flex")}
            >
              About us
            </Link>
            <Link
              href="/contact-us"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "mt-2 inline-flex",
              )}
            >
              Contact
            </Link>
          </div>
        </Reveal>

        <Reveal className="rounded-lg bg-card p-6 sm:p-8">
          <p className="font-display text-2xl text-balance">
            Your home. Your comfort. Your everyday essentials.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>Product details, prices, and shipping charges shown before checkout.</li>
            <li>Order updates and tracking when a shipment is created.</li>
            <li>
              Customer care at {settings.contact.email} or {settings.contact.phone}.
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
