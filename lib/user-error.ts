import { plainStoreMessage } from "@/lib/cart-result";

const INTERNAL =
  /TURBOPACK|is not a function|Minified React|Server Components|digest|ECONN|fetch failed|unexpected token/i;

export function userErrorMessage(error: unknown, fallback: string) {
  const raw = error instanceof Error ? error.message.trim() : "";
  const plain = plainStoreMessage(raw);
  if (!plain || INTERNAL.test(plain)) return fallback;
  return plain;
}
