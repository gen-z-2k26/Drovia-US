# Ecom Builder storefront

Next.js storefront for one WooCommerce shop. Products, cart, shipping, tax, and coupons come from WooCommerce. Card charges use the Stripe account saved in Admin.

## Local

```bash
cp env.example .env.local
pnpm install
pnpm dev
```

Fill `.env.local`:

- `WC_URL`, `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET` from Woo REST API
- `PAYMENT_CONFIG_KEY`, a 32-byte base64 key that encrypts payment accounts
- `BLOB_READ_WRITE_TOKEN` from a Vercel Blob store
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Open `/admin`, sign in, and save Stripe, PayPal, Affirm, or Afterpay there. A method appears at checkout only when its switch is on and its keys are saved. WordPress payment gateway checkboxes are not used.

Leave `SKIP_STRIPE_PAYMENT=no` so checkout uses Stripe. `yes` is local-only and skips the card charge; Woo still creates the order.

## Checkout flow

1. Catalog and cart use Woo REST and Store API.
2. Checkout creates a pending Woo order, then charges the provider selected in Admin.
3. The shopper pays with that provider.
4. The app (or the Stripe webhook) marks the Woo order paid.

Do not install WooPayments or the official Stripe plugin for this path.

## Webhook (deployed site)

Local Stripe CLI is optional. For Vercel, add a webhook:

- URL: `https://YOUR-PROJECT.vercel.app/api/stripe/webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
- Paste the endpoint signing secret (`whsec_...`) into Admin, on the Stripe card
- Set `NEXT_PUBLIC_SITE_URL` to the same Vercel origin

## Vercel env

Set the Woo keys, `NEXT_PUBLIC_SITE_URL`, `PAYMENT_CONFIG_KEY`, and `BLOB_READ_WRITE_TOKEN`. Do not put Stripe, PayPal, Affirm, or Afterpay secrets in env. Do not set `SKIP_STRIPE_PAYMENT` on Vercel.
