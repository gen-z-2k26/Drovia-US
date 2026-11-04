import { checkoutPublicConfig, getPaymentAccounts } from "@/lib/payment-config";
import type { BnplPublicConfig } from "@/lib/types";

export async function getBnplPublicConfig(): Promise<BnplPublicConfig> {
  const accounts = await getPaymentAccounts();
  const config = checkoutPublicConfig(accounts);
  return {
    affirmPublicKey: config.affirmPublicKey,
    affirmEnv: config.affirmEnv,
    afterpayMpid: config.afterpayMpid,
    afterpayPlacementId: config.afterpayPlacementId,
  };
}
