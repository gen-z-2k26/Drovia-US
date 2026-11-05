import Link from "next/link";
import Image from "next/image";
import type { StoreSettings } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/brand/hero-banner-hd.jpg";

export function HeroSection({ settings }: { settings: StoreSettings }) {
  return (
    <section className="border-b border-border bg-[#061018]">
      <div className="relative h-[calc(100svh-8rem)] min-h-64 w-full overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Orvexo Electronics. Premium electronics. Top brands, great deals, fast delivery."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className={pageContainer("absolute inset-x-0 bottom-[32%] flex flex-row flex-wrap gap-3 sm:bottom-[22%]")}>
          <Link
            href="/products"
            className={cn(buttonVariants({ size: "lg" }), "min-w-36")}
          >
            Shop now
          </Link>
          <Link
            href="/#categories"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "min-w-36 border-white/35 bg-black/35 text-white hover:bg-black/50 hover:text-white",
            )}
          >
            Browse categories
          </Link>
        </div>
      </div>
      <h1 className="sr-only">
        {settings.hero?.headline || settings.name}
      </h1>
    </section>
  );
}
