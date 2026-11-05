export function storeRequestHeaders(input: {
  method?: string;
  token?: string;
  nonce?: string;
}): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Ecom-Builder-Storefront/1.0",
  };
  if (input.token) headers["Cart-Token"] = input.token;
  const method = (input.method || "GET").toUpperCase();
  if (method !== "GET" && input.nonce) headers.Nonce = input.nonce;
  return headers;
}

export function isStoreNonceError(code?: string) {
  return (
    code === "woocommerce_rest_missing_nonce" ||
    code === "woocommerce_rest_invalid_nonce"
  );
}
