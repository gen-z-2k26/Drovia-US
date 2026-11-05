import Link from "next/link";
import Image from "next/image";
import type { StoreSettings } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/brand/hero-banner-premium.jpg";

export function HeroSection({ settings }: { settings: StoreSettings }) {
  return (
    <section className="border-b border-border bg-[#061018]">
      <Image
        src={HERO_IMAGE}
        alt="Orvexo Electronics. Premium electronics. Top brands, great deals, fast delivery."
        width={1024}
        height={341}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
      <h1 className="sr-only">
        {settings.hero?.headline || "Premium Electronics"}
      </h1>
      <div className={pageContainer("flex flex-col gap-3 py-4 sm:flex-row sm:py-5")}>
        <Link
          href="/products"
          className={cn(buttonVariants({ size: "lg" }), "w-full sm:min-w-40 sm:w-auto")}
        >
          Shop now
        </Link>
        <Link
          href="/#categories"
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "w-full sm:min-w-40 sm:w-auto",
          )}
        >
          Browse categories
        </Link>
      </div>
    </section>
  );
}
