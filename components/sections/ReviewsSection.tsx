import Link from "next/link";
import type { StoreSettings } from "@/lib/types";
import { ReviewStars } from "@/components/ReviewStars";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { pageContainer, sectionStackClass, sectionYClass } from "@/lib/layout";
import { storeReviewSummary, storeReviews } from "@/lib/store-reviews";
import { cn } from "@/lib/utils";

export function ReviewsSection({ settings }: { settings: StoreSettings }) {
  const reviews = storeReviews().slice(0, 3);
  const { total } = storeReviewSummary();
  if (reviews.length === 0) return null;

  return (
    <section
      aria-labelledby="reviews-heading"
      className={cn("border-b border-border bg-muted/40", sectionYClass)}
    >
      <div className={pageContainer(sectionStackClass)}>
        <SectionHeader
          eyebrow="Shopper notes"
          title="A few words from recent orders"
          subtitle={`${total} ${settings.name} reviews from shoppers across the United States.`}
          titleId="reviews-heading"
          action={
            <Link
              href="/reviews"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Read all {total} reviews
            </Link>
          }
        />
        <ul className="grid gap-4 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={`${review.reviewer}-${review.date}`} className="surface-card flex h-full flex-col p-6">
              <ReviewStars rating={review.rating} />
              {review.title ? (
                <h3 className="mt-4 text-lg tracking-tight">{review.title}</h3>
              ) : null}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {review.content}
              </p>
              <p className="mt-5 text-sm">
                <span className="font-medium">{review.reviewer}</span>
                {review.location ? (
                  <span className="text-muted-foreground"> · {review.location}</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
