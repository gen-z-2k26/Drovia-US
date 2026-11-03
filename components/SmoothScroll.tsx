"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMotionEnabled } from "@/lib/use-motion-enabled";

function shouldPrevent(node: HTMLElement) {
  return Boolean(
    node.closest(
      "[data-lenis-prevent],[data-slot='dialog-content'],[data-slot='sheet-content'],[role='dialog']",
    ),
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const { enabled, prefersReducedMotion } = useMotionEnabled();
  const pathname = usePathname();
  const nativeScroll = pathname === "/checkout";

  useEffect(() => {
    if (!enabled || prefersReducedMotion || nativeScroll) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      prevent: shouldPrevent,
    });

    return () => {
      lenis.destroy();
    };
  }, [enabled, nativeScroll, prefersReducedMotion]);

  return children;
}
