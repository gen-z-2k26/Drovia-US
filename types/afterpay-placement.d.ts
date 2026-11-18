import type { HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "afterpay-placement": HTMLAttributes<HTMLElement> & {
        "data-locale"?: string;
        "data-currency"?: string;
        "data-amount"?: string;
        "data-size"?: string;
        "data-logo-type"?: string;
        "data-badge-theme"?: string;
      };
    }
  }
}
