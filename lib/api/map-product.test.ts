import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapWooProduct, productIsInStock } from "./map-product.ts";
import { plainStoreMessage } from "../cart-result.ts";

describe("product stock", () => {
  it("treats managed stock with no quantity as out of stock", () => {
    assert.equal(
      productIsInStock({
        stock_status: "instock",
        manage_stock: true,
        stock_quantity: null,
        backorders: "no",
      }),
      false,
    );
    const product = mapWooProduct({
      id: 1351,
      name: "15-inch Apple MacBook Air M5",
      slug: "15-inch-apple-macbook-air-m5",
      price: "999",
      stock_status: "instock",
      manage_stock: true,
      stock_quantity: null,
      backorders: "no",
    });
    assert.equal(product.inStock, false);
  });

  it("keeps a positive managed quantity in stock", () => {
    assert.equal(
      productIsInStock({
        stock_status: "instock",
        manage_stock: true,
        stock_quantity: 50,
        backorders: "no",
      }),
      true,
    );
  });

  it("keeps backorders available", () => {
    assert.equal(
      productIsInStock({
        stock_status: "onbackorder",
        manage_stock: true,
        stock_quantity: 0,
        backorders: "yes",
      }),
      true,
    );
  });
});

describe("store text", () => {
  it("turns WooCommerce entities into readable characters", () => {
    assert.equal(
      plainStoreMessage(
        "Gigabyte Aero X16 16&#8243; 2560&times;1600",
      ),
      "Gigabyte Aero X16 16″ 2560×1600",
    );
  });
});
