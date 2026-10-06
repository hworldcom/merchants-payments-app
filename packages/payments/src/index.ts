export const paymentStatuses = [
  "PENDING",
  "SUBMITTED",
  "CONFIRMED",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export type PaymentSummary = {
  id: string;
  merchantName: string;
  amountCents: number;
  displayCurrency: "EUR";
  settlementAsset: "EURC";
  status: PaymentStatus;
  createdAt: string;
  note?: string;
};

export function formatEuroCents(amountCents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}
