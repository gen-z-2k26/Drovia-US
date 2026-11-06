import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function originOf(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

const STORE_FALLBACK = "https://droviia.us";

/** CTX writes WordPress permalinks. Keep media on that host; point product links at the storefront. */
function rewriteProductLinks(xml: string, wpOrigin: string, storeOrigin: string) {
  if (!wpOrigin || !storeOrigin || wpOrigin === storeOrigin) return xml;
  const store = new URL(storeOrigin);

  return xml.replace(
    /<((?:g:)?)(link|canonical_link)>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/\1\2>/g,
    (match, ns: string, name: string, raw: string) => {
      let url: URL;
      try {
        url = new URL(raw.trim());
      } catch {
        return match;
      }
      if (url.origin !== wpOrigin) return match;
      if (!url.pathname.startsWith("/product/") && url.pathname !== "/") return match;
      url.protocol = store.protocol;
      url.host = store.host;
      url.pathname = url.pathname.replace(/^\/product\//, "/products/");
      return `<${ns}${name}>${url.toString()}</${ns}${name}>`;
    },
  );
}

export async function GET() {
  const feedUrl = process.env.CTX_FEED_URL?.trim();
  if (!feedUrl) {
    return NextResponse.json(
      { error: "CTX_FEED_URL is not configured." },
      { status: 500 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(feedUrl, { cache: "no-store" });
  } catch {
    return NextResponse.json(
      { error: "CTX feed could not be fetched." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "CTX feed could not be fetched." },
      { status: 502 },
    );
  }

  const wpOrigin = originOf(process.env.WC_URL?.trim() || feedUrl);
  const storeOrigin = originOf(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || STORE_FALLBACK,
  );
  const body = rewriteProductLinks(await upstream.text(), wpOrigin, storeOrigin);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
}
