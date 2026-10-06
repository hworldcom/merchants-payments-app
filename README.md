# Restaurant EURC Payments — MVP

A small proof-of-concept payment system for in-person restaurant payments using **EURC on Solana Devnet**.

The MVP is intentionally narrow: it should let a restaurant owner **see the product work** before we invest in fiat onboarding, compliance, production wallets, App Store distribution, or POS integrations.

> **Important:** This version uses Solana Devnet and test EURC only. It does not move real money.

## Project navigation

| Document | Purpose |
| --- | --- |
| [`DEVELOPER_SPEC.md`](./DEVELOPER_SPEC.md) | Current product and engineering contract, including milestones and acceptance scenarios. |
| [`MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md`](./MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md) | Merchant visual design, copy, component, responsive, accessibility, and screen-state contract. |
| [`AGENTS.md`](./AGENTS.md) | Contributor workflow, ticket, validation, commit, and plain-language rules. |
| [`tickets/README.md`](./tickets/README.md) | Current backlog, completed work, templates, and ticket status. |

Implementation work starts with a development ticket. The initial delivery plan is grouped under [`COR0001`](./tickets/current/organisatory/COR0001-deliver-restaurant-payments-mvp.md) and mapped to the [delivery milestones](./DEVELOPER_SPEC.md#24-delivery-milestones-and-ticket-map).

## Local development

Requirements:

- Node.js 22.13 or newer in the supported 22, 24, or 26 release lines;
- pnpm 9.15.4 through the repository's `packageManager` declaration.

Install dependencies:

```bash
pnpm install
```

Start the merchant web app:

```bash
pnpm dev:merchant
```

Start the Expo customer app:

```bash
pnpm dev:customer
```

Run the complete local validation set:

```bash
pnpm check
```

Copy [`.env.example`](./.env.example) into an ignored local environment file only when a ticket needs live services. Payment actions must reject missing configuration and any cluster other than Solana Devnet. Never add private keys or service credentials to the example file, source, logs, or tickets.

The merchant web app now includes a fixture-driven interface preview. It is not deployed and does not create or settle payments. The customer app remains a foundation shell.

### Merchant interface preview

Run `pnpm dev:merchant`, open the local URL, and select **New payment**. You can enter a euro amount, preview the QR and waiting state, open the clearly labelled fixture receipt, and review the payments and settings screens.

All dashboard totals, payments, wallet details, QR content, and confirmation states are fixtures. The preview has no backend, wallet, realtime connection, or Solana transaction. See [DEV0014](./tickets/archive/merchant/DEV0014-build-static-merchant-interface.md) for the implementation and validation record.

## MVP goal

Demonstrate this flow end-to-end:

1. Merchant enters an amount, e.g. **€18.50**.
2. Merchant web app creates a payment intent and displays a QR code.
3. Customer opens the iOS app and scans the QR.
4. Customer sees **merchant name + €18.50**.
5. Customer taps **Pay**.
6. The app sends test EURC on Solana Devnet.
7. Backend verifies the on-chain transaction.
8. Customer sees **Payment successful**.
9. Merchant screen changes from **Waiting for payment** to **€18.50 received** without refreshing.

The live demo should take roughly 20–30 seconds.

## Product principles

- The user sees **euros**, not crypto jargon.
- Do not show SOL, token mint addresses, seed phrases, network details, or transaction signatures in the primary UX.
- The merchant experience matters as much as the customer experience.
- The first iteration optimizes for a convincing merchant demo, not production-grade custody/security.
- No Face ID/passkey requirement in the first iteration.
- No real fiat or mainnet assets.

## Customer app

Suggested stack:

- React Native
- Expo
- TypeScript
- Solana Devnet
- EURC test token
- Camera/QR scanner
- Local Devnet-only wallet stored securely on the device

Primary screens:

1. **Home**
   - test balance in EUR
   - `Scan to Pay`
   - recent payments

2. **Scanner**
   - camera opens immediately

3. **Payment confirmation**
   - merchant name
   - amount
   - `Pay`

4. **Success**
   - large success state
   - amount
   - merchant name

Example:

```text
┌──────────────────────────┐
│        €18.50            │
│                          │
│       Pho Hanoi          │
│                          │
│        [ PAY ]           │
└──────────────────────────┘
```

## Merchant app

The merchant side is a **responsive web app**, not a native app.

Suggested stack:

- Next.js
- TypeScript
- Supabase/Postgres
- Supabase Realtime (or simple polling if preferred)

Primary screens:

1. Enter payment amount
2. Display QR code
3. Waiting for payment
4. Payment received
5. Simple list of today's payments

Example:

```text
┌──────────────────────────────┐
│ Pho Hanoi                    │
│                              │
│ Amount                       │
│ [ € 18.50              ]     │
│                              │
│ [ REQUEST PAYMENT ]          │
└──────────────────────────────┘
```

After payment:

```text
┌──────────────────────────────┐
│              ✓               │
│                              │
│      PAYMENT RECEIVED        │
│           €18.50             │
│                              │
│      [ NEW PAYMENT ]         │
└──────────────────────────────┘
```

## QR/payment-intent architecture

The QR should reference a server-side payment intent rather than contain the merchant wallet, token mint, and amount as authoritative data.

Example QR payload:

```text
https://pay.example.com/p/pay_abc123
```

The backend stores:

```text
pay_abc123
merchant = Pho Hanoi
amount_cents = 1850
display_currency = EUR
settlement_asset = EURC
amount_raw = calculated from the configured EURC mint decimals
status = PENDING
expires_at = ...
```

The customer app scans `pay_abc123`, retrieves the payment details from the backend, displays them, constructs the Solana transaction, sends it, and submits the transaction signature to the backend.

The backend independently validates the transaction on Solana before marking the payment as paid.

See [`DEVELOPER_SPEC.md`](./DEVELOPER_SPEC.md) for the detailed flow.

## High-level architecture

```text
Merchant Web App
      │
      │ create payment intent
      ▼
Backend / Database
      │
      │ payment URL
      ▼
QR Code
      │
      │ scan
      ▼
Customer iOS App
      │
      │ fetch payment intent
      │
      │ send EURC
      ▼
Solana Devnet
      │
      │ verify transaction
      ▼
Backend
      │
      ├────────► Customer: ✓ Paid
      │
      └────────► Merchant: ✓ €18.50 received
```

## MVP scope

### P0 — required

- [ ] Merchant creation/configuration
- [ ] Merchant enters payment amount
- [ ] Backend creates unique payment intent
- [ ] Merchant QR generation
- [ ] iOS QR scanner
- [ ] Fetch payment intent
- [ ] Show merchant + amount
- [ ] Send EURC Devnet transfer
- [ ] Backend verifies transaction
- [ ] Payment state changes to `CONFIRMED`
- [ ] Merchant receives real-time status update
- [ ] Customer success screen
- [ ] Balance refresh after payment

### P1 — useful for merchant demos

- [ ] Merchant payment history
- [ ] Customer payment history
- [ ] Demo-wallet funding/admin utility
- [ ] Payment expiry
- [ ] Cancel payment
- [ ] Basic error states

### Not in first iteration

- Face ID/passkeys
- Production embedded-wallet provider
- Mainnet
- MoonPay
- SEPA / SEPA Instant
- KYC/KYB
- Real EURC
- EUR bank settlement
- Refunds
- Loyalty/rewards
- POS integrations
- Apple App Store launch
- Smart contracts
- Multi-chain support

## Devnet funding

Use Circle's public testnet faucet to obtain test EURC on **Solana Devnet** and fund a development treasury wallet.

The treasury can then send demo EURC to customer wallets.

For the first pilot, this can be an admin script or protected development endpoint.

Do **not** expose the faucet or blockchain funding mechanics to restaurant users.

Circle faucet:

https://faucet.circle.com/

## Suggested repository layout

A monorepo is convenient but not mandatory.

```text
/
├── apps/
│   ├── customer-mobile/     # Expo / React Native
│   └── merchant-web/        # Next.js
├── packages/
│   ├── schemas/             # environment and data boundaries
│   ├── payments/            # shared payment types/formatting
│   ├── solana/              # Solana/EURC service boundaries
│   └── ui-tokens/           # shared color, spacing, and radius values
├── supabase/
│   └── migrations/
├── scripts/
│   └── fund-demo-wallet.ts
├── tickets/                  # plans, status, and implementation evidence
├── AGENTS.md                # contributor workflow
├── README.md
└── DEVELOPER_SPEC.md
```

## Suggested environment variables

```bash
# Network
SOLANA_RPC_URL=
SOLANA_CLUSTER=devnet

# EURC
EURC_MINT_ADDRESS=

# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# URLs
PUBLIC_PAYMENT_BASE_URL=https://pay.example.com
MERCHANT_WEB_URL=
```

The EURC mint address should be configured, not scattered through application code. Validate the configured mint against the intended Circle test token before demos.

## Definition of "working MVP"

The MVP is ready for merchant demonstrations when:

- a merchant can create a payment in under 5 seconds;
- the customer can scan and see the correct merchant/amount;
- pressing `Pay` creates a real EURC Devnet transfer;
- the backend verifies the transfer instead of trusting the client;
- the merchant UI changes to **Payment received** automatically;
- the customer's balance updates;
- repeated scans cannot pay an already-completed payment intent;
- common failures do not leave the merchant with a false success state.

## Later production path

The intended evolution is:

```text
Devnet test EURC
      ↓
production embedded wallet
      ↓
SEPA Instant / MoonPay or other provider
      ↓
real EURC
      ↓
merchant settlement to EUR bank account
```

The payment-intent model should remain usable through these later stages, so the MVP does not need to be redesigned when real funding and settlement are introduced.

## References

- Solana Pay documentation: https://solana.com/docs/tools/solana-pay
- Solana Pay transfer requests: https://solana.com/docs/tools/solana-pay/quickstart/transfer-requests
- Circle testnet faucet: https://faucet.circle.com/
- Circle EURC: https://www.circle.com/eurc
