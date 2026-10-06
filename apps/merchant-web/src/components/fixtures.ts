import type { PaymentSummary } from "@merchant-payments/payments";

export const merchant = {
  name: "Café Luna",
  venue: "Kreuzberg",
} as const;

export const fixturePayments: PaymentSummary[] = [
  {
    id: "pay_demo_1850",
    merchantName: merchant.name,
    amountCents: 1850,
    displayCurrency: "EUR",
    settlementAsset: "EURC",
    status: "CONFIRMED",
    createdAt: "Today, 11:42",
    note: "Table 4",
  },
  {
    id: "pay_demo_4200",
    merchantName: merchant.name,
    amountCents: 4200,
    displayCurrency: "EUR",
    settlementAsset: "EURC",
    status: "CONFIRMED",
    createdAt: "Today, 11:18",
    note: "Lunch",
  },
  {
    id: "pay_demo_1280",
    merchantName: merchant.name,
    amountCents: 1280,
    displayCurrency: "EUR",
    settlementAsset: "EURC",
    status: "PENDING",
    createdAt: "Today, 10:56",
    note: "Order 128",
  },
  {
    id: "pay_demo_2650",
    merchantName: merchant.name,
    amountCents: 2650,
    displayCurrency: "EUR",
    settlementAsset: "EURC",
    status: "CONFIRMED",
    createdAt: "Today, 10:21",
  },
];
