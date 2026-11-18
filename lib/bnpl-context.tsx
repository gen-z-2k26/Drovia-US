"use client";

import { createContext, useContext, type ReactNode } from "react";
import { EMPTY_BNPL } from "@/lib/bnpl";
import type { BnplPublicConfig } from "@/lib/types";

const BnplContext = createContext<BnplPublicConfig>(EMPTY_BNPL);

export function BnplProvider({
  config,
  children,
}: {
  config: BnplPublicConfig;
  children: ReactNode;
}) {
  return <BnplContext.Provider value={config}>{children}</BnplContext.Provider>;
}

export function useBnpl() {
  return useContext(BnplContext);
}
