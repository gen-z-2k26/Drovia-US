"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { completeCheckoutAction } from "@/app/actions/checkout";
import { unwrapResult } from "@/lib/cart-result";
import { userErrorMessage } from "@/lib/user-error";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store-context";
import { getStripeJs } from "@/lib/stripe-browser";
import { stripeBillingDetails } from "@/lib/stripe-address";
import type {
  Address,
  CheckoutPaymentKind,
  CreateOrderResult,
} from "@/lib/types";

export type PaymentStepProps = {
  amount: number;
  currency: string;
  clientSecret: string;
  orderId: string;
  orderKey: string;
  email: string;
  shipping: Address;
  billing: Address;
  mockPayment?: boolean;
  paymentKind?: CheckoutPaymentKind | "mock";
  redirectUrl?: string;
  stripePublishableKey?: string;
  paypalClientId?: string;
  affirmPublicKey?: string;
  affirmEnv?: "sandbox" | "live";
  onPaid: (order: CreateOrderResult) => void;
  onError: (message: string) => void;
};

function SecureNote({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground/75">
      <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function Unavailable({ children }: { children: string }) {
  return (
    <p className="rounded-2xl border border-foreground/15 bg-muted px-4 py-4 text-sm font-medium text-foreground">
      {children}
    </p>
  );
}

export function PaymentFormSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading payment form">
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

function MockPaymentForm({
  amount,
  currency,
  orderId,
  orderKey,
  clientSecret,
  onPaid,
  onError,
}: Pick<
  PaymentStepProps,
  | "amount"
  | "currency"
  | "orderId"
  | "orderKey"
  | "clientSecret"
  | "onPaid"
  | "onError"
>) {
  const { settings } = useStore();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = unwrapResult(
        await completeCheckoutAction({
          orderId,
          orderKey,
          paymentIntentId: clientSecret,
        }),
      );
      onPaid(result);
    } catch (submitError) {
      onError(userErrorMessage(submitError, "Could not complete the development checkout."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting
          ? "Confirming order..."
          : `Place order ${formatPrice(amount, settings, currency)} (dev)`}
      </Button>
    </form>
  );
}

const cardElementOptions = {
  style: {
    base: {
      color: "#1C2420",
      fontSize: "16px",
      fontFamily: "inherit",
      "::placeholder": { color: "#5C6B62" },
    },
    invalid: { color: "#b91c1c" },
  },
};

function StripePaymentForm({
  clientSecret,
  amount,
  currency,
  orderId,
  orderKey,
  email,
  billing,
  onPaid,
  onError,
}: Omit<PaymentStepProps, "mockPayment" | "paymentKind" | "shipping">) {
  const stripe = useStripe();
  const elements = useElements();
  const { settings } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [readyCount, setReadyCount] = useState(0);
  const [cardError, setCardError] = useState("");
  const ready = readyCount >= 3;
  const billingDetails = useMemo(
    () => stripeBillingDetails(billing, email),
    [
      billing.firstName,
      billing.lastName,
      billing.email,
      billing.phone,
      billing.address1,
      billing.address2,
      billing.city,
      billing.state,
      billing.postcode,
      billing.country,
      email,
    ],
  );

  function markReady() {
    setReadyCount((count) => count + 1);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements || submitting || !ready) return;
    const card = elements.getElement(CardNumberElement);
    if (!card) {
      onError("The card form is still loading. Wait a moment and try again.");
      return;
    }
    setSubmitting(true);
    setCardError("");
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: billingDetails,
        },
        receipt_email: email || undefined,
      });

      if (error) {
        const message = error.message || "Payment could not be completed.";
        setCardError(
          message.includes("No such payment_intent")
            ? "Stripe could not find this payment. In Admin, the publishable key and secret key must be from the same Stripe account, both live or both test."
            : message,
        );
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const result = unwrapResult(
          await completeCheckoutAction({
            orderId,
            orderKey,
            paymentIntentId: paymentIntent.id,
          }),
        );
        onPaid(result);
        return;
      }

      if (paymentIntent?.status === "processing") {
        onError("Payment is still processing. Check your email for confirmation.");
        return;
      }

      onError("Payment was not completed. Try again.");
    } catch (submitError) {
      onError(userErrorMessage(submitError, "Payment could not be completed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <CardField label="Card number">
          <CardNumberElement
            options={{ ...cardElementOptions, placeholder: "1234 1234 1234 1234" }}
            onReady={markReady}
            onChange={(event) => setCardError(event.error?.message || "")}
          />
        </CardField>
        <div className="grid grid-cols-2 gap-3">
          <CardField label="Expiration date">
            <CardExpiryElement
              options={cardElementOptions}
              onReady={markReady}
              onChange={(event) => setCardError(event.error?.message || "")}
            />
          </CardField>
          <CardField label="Security code">
            <CardCvcElement
              options={cardElementOptions}
              onReady={markReady}
              onChange={(event) => setCardError(event.error?.message || "")}
            />
          </CardField>
        </div>
        {cardError ? (
          <p className="text-sm text-destructive" role="alert">
            {cardError}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || !elements || !ready || submitting}
        aria-busy={submitting}
      >
        {submitting
          ? "Paying..."
          : `Pay ${formatPrice(amount, settings, currency)}`}
      </Button>
      <SecureNote>
        Card numbers are encrypted by Stripe and are not stored on this site.
      </SecureNote>
    </form>
  );
}

function PayPalPayment({
  amount,
  currency,
  orderId,
  orderKey,
  clientSecret,
  paypalClientId,
  onPaid,
  onError,
}: Pick<
  PaymentStepProps,
  | "amount"
  | "currency"
  | "orderId"
  | "orderKey"
  | "clientSecret"
  | "paypalClientId"
  | "onPaid"
  | "onError"
> & { paypalClientId: string }) {
  const slot = useRef<HTMLDivElement>(null);
  const onPaidRef = useRef(onPaid);
  const onErrorRef = useRef(onError);
  const { settings } = useStore();
  const clientId = paypalClientId.trim();
  onPaidRef.current = onPaid;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!clientId || !slot.current) return;
    let cancelled = false;

    function render() {
      const paypal = (
        window as Window & {
          paypal?: {
            Buttons: (options: {
              createOrder: () => Promise<string>;
              onApprove: () => Promise<void>;
              onError: (error: { message?: string }) => void;
              onCancel: () => void;
            }) => { render: (target: HTMLElement) => Promise<void> };
          };
        }
      ).paypal;
      if (!paypal || !slot.current || cancelled) return;
      slot.current.replaceChildren();
      void paypal
        .Buttons({
          createOrder: () => Promise.resolve(clientSecret),
          onApprove: async () => {
            try {
              const result = unwrapResult(
                await completeCheckoutAction({
                  orderId,
                  orderKey,
                  paymentIntentId: clientSecret,
                  provider: "paypal",
                }),
              );
              onPaidRef.current(result);
            } catch (error) {
              onErrorRef.current(userErrorMessage(error, "PayPal could not be completed."));
            }
          },
          onCancel: () => {
            onErrorRef.current("PayPal payment was cancelled.");
          },
          onError: (error) => {
            onErrorRef.current(error.message || "PayPal could not be completed.");
          },
        })
        .render(slot.current);
    }

    if (
      (
        window as Window & {
          paypal?: unknown;
        }
      ).paypal
    ) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture`;
    script.async = true;
    script.onload = () => {
      if (!cancelled) render();
    };
    document.body.appendChild(script);
    return () => {
      cancelled = true;
      slot.current?.replaceChildren();
    };
  }, [clientId, clientSecret, currency, orderId, orderKey]);

  if (!clientId) {
    return <Unavailable>PayPal is not available right now.</Unavailable>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">
        Pay {formatPrice(amount, settings, currency)} with PayPal.
      </p>
      <div
        ref={slot}
        className="min-h-12 rounded-2xl border border-foreground/15 bg-card p-3"
      />
      <SecureNote>
        You will approve this payment in PayPal. We only receive the result.
      </SecureNote>
    </div>
  );
}

export function AfterpayPayment({
  amount,
  currency,
  redirectUrl,
  showAction = true,
}: Pick<PaymentStepProps, "amount" | "currency" | "redirectUrl"> & {
  showAction?: boolean;
}) {
  const { settings } = useStore();
  if (!redirectUrl) {
    return <Unavailable>Afterpay is not available right now.</Unavailable>;
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/80">
        You will complete {formatPrice(amount, settings, currency)} on Afterpay,
        then return here to confirm the order.
      </p>
      {showAction ? (
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => {
            window.location.assign(redirectUrl);
          }}
        >
          Continue to Afterpay
        </Button>
      ) : null}
      <SecureNote>
        Afterpay collects the installment details. This store never sees them.
      </SecureNote>
    </div>
  );
}

function AffirmPayment({
  amount,
  currency,
  orderId,
  orderKey,
  email,
  shipping,
  billing,
  affirmPublicKey,
  affirmEnv,
  onPaid,
  onError,
}: Pick<
  PaymentStepProps,
  | "amount"
  | "currency"
  | "orderId"
  | "orderKey"
  | "email"
  | "shipping"
  | "billing"
  | "affirmPublicKey"
  | "affirmEnv"
  | "onPaid"
  | "onError"
>) {
  const { settings } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const publicKey = affirmPublicKey?.trim() || "";

  async function start() {
    if (!publicKey) {
      onError("Affirm is not available right now.");
      return;
    }
    setSubmitting(true);
    try {
      await loadAffirm(publicKey, affirmEnv === "live" ? "live" : "sandbox");
      type AffirmApi = {
        checkout: ((payload: unknown) => void) & {
          open: (handlers: {
            onSuccess: (result: { checkout_token?: string }) => void;
            onFail: () => void;
          }) => void;
        };
      };
      const affirm = (window as unknown as { affirm?: AffirmApi }).affirm;
      if (!affirm) throw new Error("Affirm could not be loaded.");
      const shipTo = {
        name: { first: shipping.firstName, last: shipping.lastName },
        address: {
          line1: shipping.address1,
          line2: shipping.address2 || undefined,
          city: shipping.city,
          state: shipping.state,
          zipcode: shipping.postcode,
          country: shipping.country,
        },
        email,
      };
      affirm.checkout({
        merchant: {
          public_api_key: publicKey,
          user_confirmation_url: window.location.href,
          user_cancel_url: window.location.href,
          user_confirmation_url_action: "GET",
        },
        shipping: shipTo,
        billing: {
          name: { first: billing.firstName, last: billing.lastName },
          address: {
            line1: billing.address1,
            line2: billing.address2 || undefined,
            city: billing.city,
            state: billing.state,
            zipcode: billing.postcode,
            country: billing.country,
          },
          email,
        },
        items: [
          {
            display_name: `Order ${orderId}`,
            sku: orderId,
            unit_price: Math.round(amount * 100),
            qty: 1,
          },
        ],
        order_id: orderId,
        currency: currency.toUpperCase(),
        total: Math.round(amount * 100),
        metadata: { mode: "modal" },
      });
      affirm.checkout.open({
        onSuccess: (checkout) => {
          const token = checkout.checkout_token || "";
          if (!token) {
            onError("Affirm did not return a payment.");
            setSubmitting(false);
            return;
          }
          void completeCheckoutAction({
            orderId,
            orderKey,
            paymentIntentId: token,
            provider: "affirm",
          })
            .then(unwrapResult)
            .then(onPaid)
            .catch((error: unknown) => {
              onError(userErrorMessage(error, "Affirm payment failed."));
            })
            .finally(() => setSubmitting(false));
        },
        onFail: () => {
          onError("Affirm payment was cancelled.");
          setSubmitting(false);
        },
      });
    } catch (error) {
      onError(userErrorMessage(error, "Affirm could not be started."));
      setSubmitting(false);
    }
  }

  if (!publicKey) {
    return <Unavailable>Affirm is not available right now.</Unavailable>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">
        Pay {formatPrice(amount, settings, currency)} with Affirm.
      </p>
      <Button type="button" size="lg" className="w-full" disabled={submitting} onClick={() => void start()}>
        {submitting ? "Opening Affirm..." : "Continue with Affirm"}
      </Button>
      <SecureNote>
        Affirm reviews the installment plan. This store only receives the approval.
      </SecureNote>
    </div>
  );
}

function loadAffirm(publicKey: string, env: "sandbox" | "live") {
  const scriptUrl =
    env === "live"
      ? "https://cdn1.affirm.com/js/v2/affirm.js"
      : "https://cdn1-sandbox.affirm.com/js/v2/affirm.js";
  return new Promise<void>((resolve, reject) => {
    const runtime = window as unknown as {
      affirm?: unknown;
      _affirm_config?: Record<string, string>;
    };
    if (runtime.affirm) {
      resolve();
      return;
    }
    runtime._affirm_config = { public_api_key: publicKey, script: scriptUrl };
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Affirm could not be loaded."));
    document.body.appendChild(script);
  });
}

export function PaymentStep(props: PaymentStepProps) {
  if (props.mockPayment) {
    return (
      <MockPaymentForm
        amount={props.amount}
        currency={props.currency}
        orderId={props.orderId}
        orderKey={props.orderKey}
        clientSecret={props.clientSecret}
        onPaid={props.onPaid}
        onError={props.onError}
      />
    );
  }

  if (props.paymentKind === "paypal") {
    return (
      <PayPalPayment
        amount={props.amount}
        currency={props.currency}
        orderId={props.orderId}
        orderKey={props.orderKey}
        clientSecret={props.clientSecret}
        paypalClientId={props.paypalClientId || ""}
        onPaid={props.onPaid}
        onError={props.onError}
      />
    );
  }

  if (props.paymentKind === "affirm") {
    return (
      <AffirmPayment
        amount={props.amount}
        currency={props.currency}
        orderId={props.orderId}
        orderKey={props.orderKey}
        email={props.email}
        shipping={props.shipping}
        billing={props.billing}
        affirmPublicKey={props.affirmPublicKey}
        affirmEnv={props.affirmEnv}
        onPaid={props.onPaid}
        onError={props.onError}
      />
    );
  }

  if (props.paymentKind === "afterpay") {
    return (
      <AfterpayPayment
        amount={props.amount}
        currency={props.currency}
        redirectUrl={props.redirectUrl}
      />
    );
  }

  if (props.paymentKind !== "stripe") {
    return <Unavailable>This payment method is not available.</Unavailable>;
  }

  if (!props.stripePublishableKey || !props.clientSecret.includes("_secret_")) {
    return <Unavailable>Card payment is not available right now.</Unavailable>;
  }

  return (
    <StripeCheckout
      publishableKey={props.stripePublishableKey}
      clientSecret={props.clientSecret}
      amount={props.amount}
      currency={props.currency}
      orderId={props.orderId}
      orderKey={props.orderKey}
      email={props.email}
      billing={props.billing}
      onPaid={props.onPaid}
      onError={props.onError}
    />
  );
}

function CardField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-foreground">{label}</span>
      <div className="rounded-[8px] border border-border bg-white px-3.5 py-3.5">{children}</div>
    </label>
  );
}

function StripeCheckout({
  publishableKey,
  clientSecret,
  ...form
}: {
  publishableKey: string;
  clientSecret: string;
} & Omit<
  PaymentStepProps,
  | "mockPayment"
  | "paymentKind"
  | "shipping"
  | "redirectUrl"
  | "stripePublishableKey"
  | "paypalClientId"
  | "affirmPublicKey"
  | "affirmEnv"
>) {
  return (
    <Elements key={publishableKey} stripe={getStripeJs(publishableKey)}>
      <StripePaymentForm clientSecret={clientSecret} {...form} />
    </Elements>
  );
}
