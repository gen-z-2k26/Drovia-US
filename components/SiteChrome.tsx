"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartHydrator } from "@/components/CartHydrator";
import { Toaster } from "@/components/Toaster";
import { SmoothScroll } from "@/components/SmoothScroll";
import type { StoreSettings } from "@/lib/types";

export function SiteChrome({
  settings,
  children,
}: {
  settings: StoreSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const focusedCheckout = pathname === "/checkout";

  return (
    <SmoothScroll>
      {focusedCheckout ? null : <Header />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {focusedCheckout ? null : <Footer settings={settings} />}
      <CartHydrator />
      <CartDrawer />
      <Toaster />
    </SmoothScroll>
  );
}
