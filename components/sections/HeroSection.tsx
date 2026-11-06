import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StoreSettings } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";

const collections = [
  { label: "Kitchen and laundry", href: "/products" },
  { label: "Heating and air", href: "/products" },
  { label: "Hair and personal care", href: "/products" },
  { label: "Home and commercial", href: "/products" },
];

export function HeroSection({ settings }: { settings: StoreSettings }) {
  const headline = settings.hero?.headline || settings.name;
  const support = settings.hero?.support || settings.tagline;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#101613] text-white"
    >
      <Image
        src="/brand/home-hero.jpg"
        alt="Sunlit kitchen with a refrigerator, range, and kettle"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#101613]/92 via-[#101613]/70 to-[#101613]/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#101613]/85 via-[#101613]/20 to-[#101613]/25"
      />

      <div
        className={pageContainer(
          "relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-between gap-8 py-8 sm:min-h-[calc(100svh-4rem)] sm:py-10",
        )}
      >
        <div className="flex flex-1 flex-col justify-center">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.18em] text-[#9DCFB0] uppercase">
              {settings.name}
            </p>
            <h1
              id="hero-heading"
              className="font-display mt-3 max-w-xl text-balance text-4xl leading-[1.05] text-white sm:text-5xl xl:text-6xl"
            >
              {headline}
            </h1>
            <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              {support}
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#9DCFB0] text-[#101613] hover:bg-[#b7dcc4] sm:min-w-40",
                )}
              >
                Shop all
              </Link>
            </div>
          </div>
        </div>

        <nav aria-label="Shop by need" className="shrink-0">
          <p className="mb-3 text-xs font-medium tracking-[0.16em] text-white/70 uppercase">
            Shop by need
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {collections.map((item, index) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex h-full items-center justify-between gap-3 rounded-xl border border-white/25 bg-[#101613]/55 px-4 py-3 text-white backdrop-blur-md transition-colors hover:bg-[#101613]/75"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] tracking-[0.14em] text-[#9DCFB0]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium">
                      {item.label}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-white/80" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
