import { Reveal } from "@/components/sections/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { getTrustIcon } from "@/lib/icons";
import { pageContainer, sectionStackClass, sectionYClass } from "@/lib/layout";
import type { TrustItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const items: TrustItem[] = [
  {
    icon: "truck",
    title: "Shipping from $5",
    text: "Standard shipping is $5 under $100 and free at $100 or more. Large appliances may include freight charges shown at checkout. Estimated parcel delivery is 3-6 business days.",
  },
  {
    icon: "refresh",
    title: "30-day returns",
    text: "Eligible products can be requested for return within 30 days. Conditions, customer-paid return shipping, and a $5 restocking fee may apply.",
  },
  {
    icon: "shield",
    title: "Secure checkout",
    text: "Pay safely online. Review the full total before you complete your order.",
  },
  {
    icon: "message",
    title: "Help when you need it",
    text: "Reach us by email or phone during opening hours. Live chat 24/7.",
  },
];

export function TrustSection() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className={cn("border-b border-border", sectionYClass)}
    >
      <div className={pageContainer(sectionStackClass)}>
        <SectionHeader
          eyebrow="Peace of mind"
          title="Clear from purchase to delivery"
          subtitle="See what to expect when you order with us."
          titleId="trust-heading"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getTrustIcon(item.icon);
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="surface-card h-full space-y-3 p-6">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="text-lg tracking-tight">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
