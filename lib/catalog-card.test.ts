import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toCardProduct } from "./catalog-card.ts";
import type { Product } from "./types.ts";

function product(): Product {
  return {
    id: "12",
    slug: "sample",
    name: "Sample",
    price: 10,
    regularPrice: 20,
    salePrice: 10,
    onSale: true,
    description: "A".repeat(8000),
    sku: "sku",
    tags: [{ id: 1, name: "Tag", slug: "tag" }],
    specGroups: [{ title: "Specs", rows: [{ label: "CPU", value: "M5" }] }],
    relatedIds: [3, 4],
    images: ["https://example.com/a.jpg", "https://example.com/b.jpg"],
    imageAlts: ["a", "b"],
    category: "Laptops",
    categories: [{ id: 2, name: "Laptops", slug: "laptops" }],
    featured: false,
    averageRating: 0,
    ratingCount: 0,
    menuOrder: 0,
    inStock: true,
  };
}

describe("catalog cards", () => {
  it("drops the fields that made cart refreshes too large", () => {
    const card = toCardProduct(product());
    assert.equal(card.description, "");
    assert.deepEqual(card.tags, []);
    assert.deepEqual(card.specGroups, []);
    assert.deepEqual(card.relatedIds, []);
    assert.deepEqual(card.images, ["https://example.com/a.jpg"]);
    assert.equal(card.name, "Sample");
    assert.equal(card.price, 10);
    assert.equal(card.inStock, true);
  });
});
