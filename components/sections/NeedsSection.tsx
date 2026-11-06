import Link from "next/link";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Reveal } from "@/components/sections/Reveal";
import { pageContainer, sectionStackClass, sectionYClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

const needs = [
  {
    title: "Kitchen and laundry",
    text: "Refrigerators, wine fridges, range hoods, and laundry appliances for everyday household needs.",
  },
  {
    title: "Heating and air",
    text: "Air conditioners, furnaces, boilers, humidifiers, and space heaters for a more comfortable room.",
  },
  {
    title: "Hair and personal care",
    text: "Dryers, straighteners, curling irons, and styling sets for a daily routine.",
  },
  {
    title: "Home and commercial",
    text: "Garage door openers and hand dryers for practical residential and commercial spaces.",
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
        <div className="grid gap-4 sm:grid-cols-2">
          {needs.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <Link
                href="/products"
                className="surface-card flex h-full flex-col p-6 transition-colors hover:border-accent/40"
              >
                <p className="font-display text-sm text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-xl tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
