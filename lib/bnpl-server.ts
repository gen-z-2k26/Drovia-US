import { checkoutPublicConfig, getPaymentAccounts } from "@/lib/payment-config";
import { EMPTY_BNPL } from "@/lib/bnpl";
import type { BnplPublicConfig } from "@/lib/types";

export async function getBnplPublicConfig(): Promise<BnplPublicConfig> {
  const accounts = await getPaymentAccounts();
  const config = checkoutPublicConfig(accounts);
  return {
    affirmPublicKey: config.affirmPublicKey,
    affirmEnv: config.affirmEnv,
    afterpayEnabled: config.afterpayEnabled,
    afterpayMode: config.afterpayMode,
    afterpayMpid: config.afterpayMpid,
    afterpayPlacementId: config.afterpayPlacementId,
    afterpayCartPlacementId: config.afterpayCartPlacementId,
    afterpayHomepagePlacementId: config.afterpayHomepagePlacementId,
  };
}

export async function getBnplPublicConfigSafe(): Promise<BnplPublicConfig> {
  try {
    return await getBnplPublicConfig();
  } catch {
    return EMPTY_BNPL;
  }
}
