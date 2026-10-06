export type WalletService = {
  getPublicKey(): Promise<string>;
  signAndSend(serializedTransaction: Uint8Array): Promise<string>;
};

export type DevnetTransferRequest = {
  paymentId: string;
  amountRaw: bigint;
  mintAddress: string;
  recipientWallet: string;
};
