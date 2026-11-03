const INTERNAL =
  /TURBOPACK|is not a function|Minified React|Server Components|digest|ECONN|fetch failed|unexpected token/i;

export function userErrorMessage(error: unknown, fallback: string) {
  const raw = error instanceof Error ? error.message.trim() : "";
  if (!raw || INTERNAL.test(raw)) return fallback;
  return raw;
}
