import { describe, expect, it } from "vitest";
import { readDevnetEnvironment } from "./index";

const validEnvironment = {
  SOLANA_CLUSTER: "devnet",
  SOLANA_RPC_URL: "https://api.devnet.solana.com",
  EURC_MINT_ADDRESS: "configured-at-deployment",
  PUBLIC_PAYMENT_BASE_URL: "http://localhost:3000",
  PAYMENT_INTENT_TTL_SECONDS: "600",
};

describe("readDevnetEnvironment", () => {
  it("accepts the explicit Devnet contract", () => {
    expect(readDevnetEnvironment(validEnvironment)).toEqual({
      cluster: "devnet",
      rpcUrl: "https://api.devnet.solana.com",
      eurcMintAddress: "configured-at-deployment",
      publicPaymentBaseUrl: "http://localhost:3000",
      paymentIntentTtlSeconds: 600,
    });
  });

  it("rejects mainnet configuration", () => {
    expect(() =>
      readDevnetEnvironment({
        ...validEnvironment,
        SOLANA_CLUSTER: "mainnet-beta",
      }),
    ).toThrow("SOLANA_CLUSTER must be devnet");
  });

  it("rejects missing payment configuration", () => {
    expect(() =>
      readDevnetEnvironment({
        ...validEnvironment,
        EURC_MINT_ADDRESS: "",
      }),
    ).toThrow("EURC_MINT_ADDRESS is required");
  });

  it("rejects a request lifetime that differs from the product contract", () => {
    expect(() =>
      readDevnetEnvironment({
        ...validEnvironment,
        PAYMENT_INTENT_TTL_SECONDS: "300",
      }),
    ).toThrow("PAYMENT_INTENT_TTL_SECONDS must be 600");
  });
});
