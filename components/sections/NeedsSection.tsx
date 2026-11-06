import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { pageContainer, sectionStackClass, sectionYClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

const needs = [
  {
    title: "Kitchen and laundry",
    text: "Refrigerators, wine fridges, range hoods, and laundry appliances for everyday household needs.",
    image: "/brand/collection-kitchen.jpg",
    alt: "Kitchen with a refrigerator, range hood, and stacked laundry",
    className: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Heating and air",
    text: "Air conditioners, furnaces, boilers, humidifiers, and space heaters.",
    image: "/brand/collection-climate.jpg",
    alt: "Living room with a wall-mounted air conditioner",
    className: "lg:col-span-2",
  },
  {
    title: "Hair and personal care",
    text: "Dryers, straighteners, curling irons, and styling sets.",
    image: "/brand/collection-care.jpg",
    alt: "Hair dryer and straightener on a bathroom vanity",
    className: "",
  },
  {
    title: "Home and commercial",
    text: "Garage door openers and hand dryers for practical spaces.",
    image: "/brand/collection-home.jpg",
    alt: "Garage with a sectional door and opener rail",
    className: "",
  },
];

export function NeedsSection() {
  return (
    <section
      id="categories"
      aria-labelledby="needs-heading"
      className={cn("border-b border-border", sectionYClass)}
    >
      <div className={pageContainer(sectionStackClass)}>
        <SectionHeader
          eyebrow="Collections"
          title="Shop by what your home needs"
          subtitle="Four places to start. The products themselves come from the live catalog."
          titleId="needs-heading"
        />
        <div className="grid auto-rows-[18rem] gap-3 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4">
          {needs.map((item) => (
            <Link
              key={item.title}
              href="/products"
              className={cn(
                "group relative isolate flex min-h-72 overflow-hidden rounded-2xl bg-[#101613] text-white",
                item.className,
              )}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#101613]/85 via-[#101613]/25 to-transparent"
              />
              <div className="relative mt-auto flex w-full flex-col p-5 sm:p-6">
                <h3 className="font-display text-2xl text-balance sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                  {item.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#9DCFB0]">
                  Shop collection
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
