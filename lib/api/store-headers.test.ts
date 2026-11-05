import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isStoreNonceError, storeRequestHeaders } from "./store-headers.ts";

describe("store cart headers", () => {
  it("sends the nonce on remove, update, and other writes", () => {
    for (const method of ["POST", "DELETE", "PUT"]) {
      const headers = storeRequestHeaders({
        method,
        token: "cart-token",
        nonce: "store-nonce",
      });
      assert.equal(headers.Nonce, "store-nonce");
      assert.equal(headers["Cart-Token"], "cart-token");
    }
  });

  it("does not send a nonce on cart reads", () => {
    const headers = storeRequestHeaders({
      method: "GET",
      token: "cart-token",
      nonce: "store-nonce",
    });
    assert.equal(headers.Nonce, undefined);
    assert.equal(headers["Cart-Token"], "cart-token");
  });

  it("omits empty session headers", () => {
    const headers = storeRequestHeaders({ method: "POST" });
    assert.equal(headers.Nonce, undefined);
    assert.equal(headers["Cart-Token"], undefined);
  });

  it("recognizes WooCommerce nonce failures so remove can retry", () => {
    assert.equal(isStoreNonceError("woocommerce_rest_missing_nonce"), true);
    assert.equal(isStoreNonceError("woocommerce_rest_invalid_nonce"), true);
    assert.equal(isStoreNonceError("woocommerce_rest_cart_invalid_key"), false);
    assert.equal(isStoreNonceError(undefined), false);
  });
});
