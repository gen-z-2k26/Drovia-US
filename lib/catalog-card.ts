import type { Product } from "@/lib/types";

/** Grid cards do not render descriptions or spec tables. */
export function toCardProduct(product: Product): Product {
  return {
    ...product,
    description: "",
    tags: [],
    specGroups: [],
    relatedIds: [],
    images: product.images.slice(0, 1),
    imageAlts: product.imageAlts.slice(0, 1),
  };
}
