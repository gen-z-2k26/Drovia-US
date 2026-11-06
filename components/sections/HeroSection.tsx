import Link from "next/link";
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
    <section className="border-b border-border bg-background">
      <div
        className={pageContainer(
          "grid items-end gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:py-24",
        )}
      >
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
            {settings.name}
          </p>
          <h1 className="font-display mt-4 text-balance text-4xl leading-[1.05] text-foreground sm:text-6xl">
            {headline}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {support}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className={cn(buttonVariants({ size: "lg" }), "sm:min-w-36")}
            >
              Shop all
            </Link>
            <Link
              href="/about-us"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "sm:min-w-36",
              )}
            >
              About DROVIIA
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-accent">Shop by need</p>
          <ul className="mt-4 space-y-1">
            {collections.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between border-b border-border py-3 text-base text-foreground transition-colors last:border-b-0 hover:text-accent"
                >
                  <span>{item.label}</span>
                  <span aria-hidden className="text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
