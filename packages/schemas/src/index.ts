export type DevnetEnvironment = {
  cluster: "devnet";
  rpcUrl: string;
  eurcMintAddress: string;
  publicPaymentBaseUrl: string;
  paymentIntentTtlSeconds: 600;
};

type EnvironmentInput = Record<string, string | undefined>;

function required(input: EnvironmentInput, key: string): string {
  const value = input[key]?.trim();
  if (!value) {
    throw new Error(`${key} is required before payment actions can run.`);
  }
  return value;
}

export function readDevnetEnvironment(input: EnvironmentInput): DevnetEnvironment {
  const cluster = required(input, "SOLANA_CLUSTER");
  if (cluster !== "devnet") {
    throw new Error("SOLANA_CLUSTER must be devnet for this MVP.");
  }

  const rpcUrl = required(input, "SOLANA_RPC_URL");
  const publicPaymentBaseUrl = required(input, "PUBLIC_PAYMENT_BASE_URL");
  const ttl = Number(required(input, "PAYMENT_INTENT_TTL_SECONDS"));

  if (ttl !== 600) {
    throw new Error("PAYMENT_INTENT_TTL_SECONDS must be 600 for the current contract.");
  }

  return {
    cluster,
    rpcUrl,
    eurcMintAddress: required(input, "EURC_MINT_ADDRESS"),
    publicPaymentBaseUrl,
    paymentIntentTtlSeconds: 600,
  };
}
