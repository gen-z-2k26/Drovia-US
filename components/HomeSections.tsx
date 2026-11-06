import type { Category, Product, StoreSettings } from "@/lib/types";
import { HeroSection } from "@/components/sections/HeroSection";
import { NeedsSection } from "@/components/sections/NeedsSection";
import { TrustStripSection } from "@/components/sections/TrustStripSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { StepsSection } from "@/components/sections/StepsSection";
import { CommitmentSection } from "@/components/sections/CommitmentSection";
import { StorySection } from "@/components/sections/StorySection";
import { SupportSection } from "@/components/sections/SupportSection";
import { FaqPreviewSection } from "@/components/sections/FaqPreviewSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Homepage layout is owned by Next.js (design system).
 * Product and category cards are filled only from WooCommerce props.
 */
export function HomeSections({
  settings,
  products,
  categoryProducts = [],
}: {
  settings: StoreSettings;
  products: Product[];
  categoryProducts?: { category: Category; products: Product[] }[];
}) {
  return (
    <div>
      <HeroSection settings={settings} />
      <NeedsSection />
      <TrustStripSection />
      <FeaturedProductsSection groups={categoryProducts} products={products} />
      <StepsSection />
      <CommitmentSection />
      <StorySection settings={settings} />
      <SupportSection settings={settings} />
      <FaqPreviewSection />
      <NewsletterSection settings={settings} />
    </div>
  );
}
