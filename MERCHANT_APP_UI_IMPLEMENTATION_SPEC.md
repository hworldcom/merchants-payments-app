# Merchant Payments App — UI Implementation Specification

**Status:** MVP implementation spec

**Audience:** Frontend, mobile, backend, product engineering

**Design direction:** Design Concept 2 — clean card dashboard, white-first fintech UI with restrained Solana accents

**MVP network:** Solana Devnet

**Settlement asset:** EURC

> This document translates the selected **Design 2** visual direction into an engineering-ready UI/UX specification and reconciles it with the previously agreed restaurant-payments MVP architecture.

> **Visual-reference correction:** the generated Design 2 image contains an outdated EUR / EURC selector. **Do not implement that control.** The selector is explicitly superseded by this specification.

## Document ownership and shared terminology

This document is authoritative for the merchant interface: visual design, copy, reusable components, responsive behavior, accessibility, and screen presentation. [`DEVELOPER_SPEC.md`](./DEVELOPER_SPEC.md) remains authoritative for shared customer/merchant behavior, payment state, backend security, and Solana verification.

Use these shared contracts throughout implementation:

- internal states: `PENDING`, `SUBMITTED`, `CONFIRMED`, `FAILED`, `EXPIRED`, and `CANCELLED`;
- user-facing confirmed copy: `Payment received` and `Confirmed`;
- API family: `/api/payments`;
- displayed amount: integer euro cents in `amountCents`;
- settlement amount: exact EURC token units in `amountRaw`;
- default payment-request lifetime: 10 minutes.

For the demo, one displayed euro maps to one test EURC before the backend converts the amount to the configured mint's raw token units. Do not use `amountCents` as if it were the token's raw amount.

---

## 1. Product objective

The first iteration is a **merchant-demo MVP**. The goal is to let a merchant see a complete payment flow working end to end:

1. Merchant enters a euro amount.
2. Merchant creates a payment request.
3. A QR code is shown.
4. Customer scans the QR in the customer mobile app.
5. Customer reviews and confirms the payment.
6. Customer sends real **EURC on Solana Devnet**.
7. Backend verifies the on-chain transaction.
8. Merchant UI updates in realtime to **Payment received**.

The product should feel like a normal modern payment product, not a crypto wallet.

### MVP priorities

- Working end-to-end payment flow.
- Fast merchant comprehension.
- Clear payment status.
- Polished visual design suitable for showing real restaurant owners.
- Minimal blockchain terminology in the primary experience.
- Reliable backend verification.

### Explicitly not required for this MVP

- Face ID / biometric signing.
- Fiat funding / SEPA Instant.
- MoonPay or another production on-ramp.
- KYC flow.
- Mainnet.
- Smart contracts.
- Escrow.
- Refund flow.
- Restaurant POS integration.
- Loyalty/rewards.
- Production accounting/export.
- Multiple settlement assets.
- Card payments.

Demo wallets may be pre-funded/admin-funded with Devnet EURC.

---

# 2. Agreed technical architecture

The selected design must sit on top of the previously agreed architecture.

```text
Merchant Web App
Next.js / TypeScript
        |
        | create payment intent
        v
Backend
Next.js API / Node / TypeScript
        |
        +---- Supabase / Postgres
        |       merchants
        |       payments
        |
        +---- Solana RPC
        |       verify EURC transfer
        |
        +---- realtime status update
                |
                v
        Merchant Web App

Customer Mobile App
Expo / React Native / TypeScript
        |
        | scan payment-intent QR
        | resolve payment intent
        | sign/send SPL EURC transfer
        v
Solana Devnet
```

Recommended repository structure:

```text
apps/
  merchant-web/
  customer-mobile/

packages/
  schemas/
  payments/
  solana/
  ui-tokens/
```

Keep backend and shared business logic in **TypeScript**.

---

# 3. Design principle

The product should feel approximately:

> **Polymarket/Kalshi-style fintech clarity with a subtle Solana identity.**

The visual hierarchy is more important than visibly communicating “crypto”.

Use:

- white backgrounds;
- dark typography;
- soft gray surfaces;
- thin borders;
- restrained rounded cards;
- purple for primary actions;
- green for confirmed/success states;
- Solana-style purple → green gradient only for small details.

Do **not** use:

- dark crypto-wallet backgrounds;
- neon full-screen gradients;
- gradient body text;
- excessive glow;
- crypto jargon in primary flows;
- large Solana logos on every screen.

The merchant should initially perceive this as a **modern payments product**.

---

# 4. Design 2: what to preserve

The selected Design 2 reference should drive visual implementation.

Preserve:

- compact merchant header;
- large purple `New payment` CTA;
- white metric cards;
- lightweight recent-activity list;
- large amount typography;
- numeric keypad;
- green confirmation icon and status chip;
- receipt-style payment details;
- white-first visual system;
- thin gray borders;
- minimal shadows;
- compact bottom navigation.

## Important deviations from the generated concept

The mockup is a visual reference, not a literal functional specification.

### Remove / change

| Mockup element | MVP implementation |
|---|---|
| EUR / EURC selector | **Remove completely.** Merchant sees and enters EUR only. EURC is the settlement rail, never a selectable currency. |
| “Create payment link” | Use `Request payment`. QR is the primary merchant flow. |
| “Customer can pay by card...” | Remove. MVP supports customer app + EURC only. |
| Card payment language | Remove. |
| Analytics tab | Do not prioritize for MVP. |
| Production on-ramp/funding UI | Do not build. |
| Mainnet/explorer assumptions | Devnet only. |

The UX should not imply functionality that is not actually available.

---

# 5. Design tokens

These values should be centralized in a shared token package or duplicated from a single canonical token file.

## 5.1 Color tokens

```ts
export const colors = {
  background: "#FFFFFF",
  surface: "#F8F9FB",
  surfaceRaised: "#FFFFFF",

  textPrimary: "#111318",
  textSecondary: "#667085",
  textTertiary: "#98A2B3",

  border: "#E6E8EC",
  borderStrong: "#D0D5DD",

  brandPurple: "#9945FF",
  brandPurplePressed: "#7F35DB",
  brandPurpleSoft: "#F3EAFF",

  solanaGreen: "#14F195",
  success: "#0F9F64",
  successSoft: "#EAFBF3",

  error: "#D92D20",
  errorSoft: "#FEF3F2",

  warning: "#B54708",
  warningSoft: "#FFFAEB",
};
```

### Gradient token

Use only for subtle details:

```css
--solana-gradient: linear-gradient(
  135deg,
  #9945ff 0%,
  #6f7cff 45%,
  #14f195 100%
);
```

Acceptable uses:

- 1px QR-card outline;
- tiny brand mark;
- selected micro-indicator;
- loading animation accent.

Do not use the gradient as a full primary button background in the default theme. Solid purple should be the dominant CTA treatment.

## 5.2 Typography

Preferred font:

```text
Inter
```

Fallback:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

Suggested scale:

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| displayAmount | 44–48 px | 700 | Amount-entry screen |
| metricLarge | 30–34 px | 700 | Today’s sales |
| heading1 | 24 px | 650–700 | Screen headings |
| heading2 | 18 px | 600 | Card/section headings |
| body | 15–16 px | 400–500 | Primary copy |
| bodySmall | 13–14 px | 400–500 | Secondary copy |
| label | 12–13 px | 500–600 | Status/meta information |

Use tabular numbers where available for money values.

## 5.3 Radius

```ts
export const radius = {
  small: 8,
  control: 12,
  card: 14,
  largeCard: 18,
  pill: 999,
};
```

## 5.4 Spacing

Base unit: **4 px**.

Primary spacing values:

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40
```

Mobile page horizontal padding:

```text
20 px
```

## 5.5 Shadows

Avoid floating-card aesthetics.

Default cards:

```text
border: 1px solid #E6E8EC
shadow: none
```

Optional elevated element:

```css
box-shadow: 0 2px 8px rgba(16, 24, 40, 0.06);
```

Use sparingly.

---

# 6. Navigation model

For the merchant MVP, keep navigation deliberately small.

```text
Home
Payments
Settings
```

Do not ship an empty `Analytics` or `More` tab simply because it exists in the visual reference.

Recommended bottom navigation:

```text
[ Home ]      [ Payments ]      [ Settings ]
```

Active state:

- icon: purple;
- label: purple;
- no large background capsule required.

Inactive state:

- icon/text: secondary gray.

---

# 7. Merchant screen specifications

## 7.1 Home / Dashboard

### Goal

Give the merchant one obvious action: **create a payment**.

### Structure

```text
Merchant / venue name                notification/avatar optional

New payment                         <- primary purple CTA

Sales today
€482.00          +12%

Payments
12

Average ticket
€40.17

Recent payments                    See all
€18.50                              Confirmed
€42.00                              Confirmed
€12.80                              Confirmed

Home       Payments       Settings
```

### Required elements

#### Merchant header

- merchant or restaurant name;
- optional venue name/subtitle;
- no wallet address in primary header.

#### New payment CTA

```text
New payment
```

Style:

```text
height: 56 px
background: brandPurple
text: white
radius: 12–14 px
font weight: 600
```

#### Metric cards

For MVP:

- Sales today;
- Payments;
- Average ticket.

These values can initially come from seeded/demo data plus real completed demo payments.

Do not block the payment flow on analytics correctness.

#### Recent payments

Each row:

```text
€25.00                         Confirmed
Today, 11:42                   EURC
```

Optional merchant note:

```text
Table 4
```

Status colors:

- Confirmed → success green;
- Pending → neutral/purple;
- Expired → gray;
- Failed → red.

---

## 7.2 New Payment — Amount Entry

### Goal

Merchant should be able to request a payment in a few seconds.

### Structure

```text
< Back                 New payment

Enter amount

              €25.00

[ optional note ]

[ 1 ] [ 2 ] [ 3 ]
[ 4 ] [ 5 ] [ 6 ]
[ 7 ] [ 8 ] [ 9 ]
[ . ] [ 0 ] [ ← ]

[ Request payment ]
```

### Important currency behavior — hard rule

The merchant-facing product has **one denomination: EUR**.

Do **not** render:

- a EUR / EURC segmented control;
- a currency dropdown;
- an asset selector;
- a `Pay in EURC` choice;
- any interaction suggesting that EUR and EURC are two payment options.

The merchant enters and sees a euro amount such as:

```text
€25.00
```

The payment system maps that request to the corresponding EURC transfer on Solana Devnet:

```text
merchant display:  €25.00
settlement rail:   25.00 EURC
```

This EURC mapping is implementation infrastructure, not a merchant decision. Token decimals and asset selection must remain outside the normal payment flow.

If blockchain details are exposed at all, show them only on an optional **Payment details** / technical-details view after the transaction, for example `Settlement asset: EURC` and `Network: Solana Devnet`. They should not appear as choices on the amount-entry or QR-request screens.

### Amount validation

Frontend rules:

```text
minimum > €0.00
maximum configurable
max 2 visible decimal places
```

Send integer euro cents to the backend:

```ts
amountCents: 2500
displayCurrency: "EUR"
settlementAsset: "EURC"
```

The backend derives a separate `amountRaw` value using the configured EURC mint decimals. Never use floating-point money values or reuse `amountCents` as the canonical token amount.

### Note field

Optional:

```text
Add note
```

Examples:

- Table 4;
- Lunch;
- Order 128.

Limit recommended:

```text
80 characters
```

Do not put PII-sensitive restaurant data on-chain.

---

## 7.3 Payment Request — QR / Waiting

This screen is not shown explicitly in Design 2 but is required for the agreed flow.

### Structure

```text
< Back                 Cancel

Scan to pay

              €25.00
        Customer pays 25.00 EURC

┌─────────────────────────────┐
│                             │
│          QR CODE            │
│                             │
└─────────────────────────────┘

Waiting for payment…

Request expires in 09:42

[ Cancel request ]
```

### QR visual treatment

- white card;
- 16–18px radius;
- optional 1px Solana gradient border;
- black/white QR itself;
- do not recolor QR modules purple/green;
- sufficient quiet zone around QR.

### QR contents

The QR must contain only a server-side payment-intent URL:

```text
https://pay.<domain>/p/<publicIntentId>
```

Example:

```text
https://pay.example.com/p/pay_abc123
```

Do **not** encode the entire Solana transfer instruction as the source of truth.

The QR is an untrusted transport mechanism. The backend payment intent is authoritative.

### Why this architecture is required

It lets the backend control:

- merchant recipient;
- amount;
- asset;
- expiration;
- duplicate-payment prevention;
- transaction correlation;
- reconciliation;
- receipts;
- later refunds/accounting/POS extensions.

---

## 7.4 Payment Success

This screen should visually match Design 2 closely.

### Structure

```text
              ✓

           €25.00
      Payment received

         Confirmed

Today at 11:42

┌─────────────────────────────┐
│ Merchant      Café Luna     │
│ Amount        €25.00        │
│ Asset         EURC          │
│ Network       Solana        │
│ Status        Confirmed     │
│ Transaction   3f2a…9c7e ↗  │
└─────────────────────────────┘

[ Done ]
```

### Visual rules

- large green check;
- success background only as a subtle pale green surface;
- do not make the entire screen green;
- amount is visually dominant;
- blockchain details remain lower in hierarchy.

### Primary copy

Use:

```text
Payment received
```

Avoid:

```text
Transaction finalized on Solana Devnet
```

in the main success heading.

Technical details belong below the fold or inside the details card.

---

## 7.5 Payments / Activity Screen

### Goal

Provide a simple merchant payment history.

### Row structure

```text
€25.00                            Confirmed
Table 4
Today, 11:42                      EURC
```

Recommended filters for MVP:

```text
All | Confirmed | Pending
```

Do not build complex reporting filters yet.

Payment detail page may show:

- amount;
- note;
- created time;
- paid time;
- status;
- token;
- network;
- truncated payer wallet;
- transaction signature;
- Devnet explorer link.

---

## 7.6 Settings

Minimal settings only:

```text
Restaurant / merchant name
Settlement wallet
Network: Solana Devnet
Asset: EURC
App version
```

Wallet values may be read-only for the demo.

Do not add production treasury or withdrawal workflows yet.

---

# 8. Customer mobile payment flow

The customer app remains an Expo / React Native app.

The visual language should match the merchant product:

- white;
- dark typography;
- purple primary CTA;
- green confirmation;
- crypto details secondary.

## 8.1 Scan / resolve payment intent

The customer scans:

```text
https://pay.<domain>/p/<publicIntentId>
```

App resolves:

```http
GET /api/payments/:publicIntentId
```

Backend returns a sanitized public intent:

```ts
type PublicPaymentIntent = {
  id: string;
  merchantName: string;
  amountCents: number;
  displayCurrency: "EUR";
  settlementAsset: "EURC";
  expiresAt: string;
  status:
    | "PENDING"
    | "SUBMITTED"
    | "CONFIRMED"
    | "FAILED"
    | "EXPIRED"
    | "CANCELLED";
};
```

Do not expose internal database IDs where avoidable.

## 8.2 Customer review screen

```text
Pay Café Luna

€25.00
25.00 EURC

[ Pay €25.00 ]
```

Secondary information:

```text
EURC • Solana Devnet
```

Wallet balance may be shown if already available.

Face ID is not required for the first iteration.

## 8.3 Payment processing

After the customer presses Pay:

```text
Sending payment…
```

The mobile app:

1. obtains authoritative transfer data from backend/shared payment logic;
2. constructs the SPL EURC transfer;
3. signs using the customer demo wallet;
4. submits to Solana Devnet;
5. sends the resulting signature to the backend for verification.

Do not update UI to final success solely because the client successfully submitted a transaction.

Use:

```text
Payment submitted
```

while backend verification is pending.

## 8.4 Customer success

After backend verification:

```text
✓
Payment complete
€25.00
Café Luna
```

Optional lower-level detail:

```text
Paid with EURC on Solana
```

---

# 9. Payment intent state model

Use a persisted server-side state.

Recommended MVP states:

```text
PENDING
SUBMITTED
CONFIRMED
FAILED
EXPIRED
CANCELLED
```

Possible transitions:

```text
PENDING -> SUBMITTED
PENDING -> EXPIRED
PENDING -> CANCELLED
SUBMITTED -> CONFIRMED
SUBMITTED -> FAILED
```

`CONFIRMED`, `FAILED`, `EXPIRED`, and `CANCELLED` are terminal for the MVP. Only `CONFIRMED` maps to the merchant's `Payment received` presentation.

Do not allow a second transaction to overwrite an already confirmed payment.

---

# 10. Payment intent API

## 10.1 Create intent

```http
POST /api/payments
```

Request:

```json
{
  "amountCents": 2500,
  "displayCurrency": "EUR",
  "settlementAsset": "EURC",
  "note": "Table 4"
}
```

Response:

```json
{
  "id": "pay_abc123",
  "status": "PENDING",
  "amountCents": 2500,
  "displayCurrency": "EUR",
  "settlementAsset": "EURC",
  "expiresAt": "...",
  "paymentUrl": "https://pay.example.com/p/pay_abc123"
}
```

## 10.2 Resolve public intent

```http
GET /api/payments/:id
```

Return public-safe data only.

## 10.3 Submit transaction signature

```http
POST /api/payments/:id/submit
```

Request:

```json
{
  "signature": "..."
}
```

The backend changes the payment to `SUBMITTED` while verifying. It may change the payment to `CONFIRMED` only after successful verification.

---

# 11. Backend verification requirements

The backend is the source of truth for payment completion.

For a payment to become `CONFIRMED`, verify at minimum:

```text
transaction exists on configured Solana cluster
transaction succeeded
transaction is sufficiently confirmed for MVP policy
EURC mint matches configured Devnet EURC mint
recipient token account belongs to the intended merchant
transferred amount exactly matches the intent
intent was eligible and PENDING when the signature was bound
intent is now SUBMITTED and not expired or cancelled
intent is not expired
signature has not already been used for another intent
```

Recommended environment variables:

```env
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=...
EURC_MINT_DEVNET=...
MERCHANT_SETTLEMENT_WALLET=...
PAYMENT_INTENT_TTL_SECONDS=600
```

Do not trust:

- QR contents beyond the public intent identifier;
- amount supplied by the customer client;
- recipient supplied by the customer client;
- client-side `success` state;
- a transaction signature without server-side inspection.

---

# 12. Database fields relevant to UI

A minimal schema could look like:

```ts
type Payment = {
  id: string;
  publicId: string;
  merchantId: string;

  amountCents: number;
  amountRaw: string;
  displayCurrency: "EUR";
  settlementAsset: "EURC";

  destinationWallet: string;
  destinationTokenAccount: string;

  status:
    | "PENDING"
    | "SUBMITTED"
    | "CONFIRMED"
    | "FAILED"
    | "EXPIRED"
    | "CANCELLED";

  note: string | null;
  txSignature: string | null;
  payerWallet: string | null;

  createdAt: Date;
  expiresAt: Date;
  submittedAt: Date | null;
  confirmedAt: Date | null;
};
```

The `payments` row represents the payment intent throughout its lifecycle. `confirmedAt` and the unique transaction signature supply the immutable evidence needed by the MVP; a separate settlement table is later work unless an owning ticket demonstrates a need.

---

# 13. Realtime merchant update

The merchant should not need to refresh the page after a customer pays.

Recommended MVP flow:

```text
Backend verifies transaction
        |
        v
payments.status = CONFIRMED
        |
        v
Supabase Realtime / server realtime channel
        |
        v
Merchant QR screen receives CONFIRMED
        |
        v
Animate into Payment received screen
```

The server/database remains authoritative.

Frontend should gracefully reconnect if realtime connectivity drops.

Fallback polling can be low frequency if needed, but do not make aggressive polling the primary design.

---

# 14. Component model

## Merchant web

Recommended components:

```text
AppShell
MerchantHeader
BottomNavigation
PrimaryButton
SecondaryButton
MetricCard
MetricCardGroup
RecentPaymentRow
StatusBadge
MoneyAmount
AmountInput
NumericKeypad
NoteInput
PaymentQrCard
PaymentStatusPanel
ReceiptCard
EmptyState
ErrorState
```

## Customer mobile

```text
ScreenContainer
MoneyAmount
MerchantIdentity
PrimaryButton
StatusBadge
PaymentSummaryCard
PaymentProcessingState
PaymentSuccessState
PaymentErrorState
```

Avoid large component abstraction layers before the visual system is stable.

---

# 15. Responsive behavior

The merchant app is mobile-first.

Primary design width:

```text
390–430 px
```

For desktop browser usage:

- keep the primary payment flow inside a centered column;
- recommended max content width: `480px` for POS-like screens;
- dashboard may expand modestly on tablet/desktop;
- do not stretch amount entry / QR to full desktop width.

Suggested shell:

```css
width: 100%;
max-width: 480px;
margin: 0 auto;
min-height: 100dvh;
background: #fff;
```

Dashboard can optionally use a wider max-width later.

---

# 16. Motion

Motion should communicate payment state rather than decorate the product.

Use:

- 150–220ms button transitions;
- short QR → success transition;
- success check scale/fade animation around 250–400ms;
- subtle progress indicator while verifying.

Avoid:

- looping neon animations;
- large background gradients;
- confetti;
- crypto-style particle effects.

---

# 17. Accessibility and interaction rules

- Minimum tap target: `44 x 44 px`.
- Primary button height: `52–56 px`.
- Do not use color alone to communicate status.
- Green success text must use a darker accessible green rather than raw `#14F195` on white.
- Money values should be readable at a glance.
- QR should have sufficient contrast and quiet zone.
- Loading, error and disabled states must be visible.
- Respect mobile safe-area insets.

---

# 18. Error and edge states

The visual implementation must include these states even if the happy path is the demo focus.

## Payment expired

```text
Payment request expired
Create a new request to continue.

[ New payment ]
```

## Merchant cancels

```text
Payment request cancelled
```

Customer attempting to load the intent receives a cancelled state.

## Customer transaction fails

```text
Payment failed
Your EURC was not sent.

[ Try again ]
```

Only show this when failure is known.

## Submitted but not verified

```text
Confirming payment…
```

Do not prematurely show `Payment received`.

## Wrong / invalid on-chain transfer

The backend must not mark the intent as paid.

For MVP, display a generic customer error and log the verification reason server-side.

## Merchant loses realtime connection

Show:

```text
Reconnecting…
```

The backend payment state must remain intact.

---

# 19. Copy guide

Prefer normal payment language.

## Use

```text
New payment
Request payment
Scan to pay
Waiting for payment
Payment received
Payment complete
Confirmed
Recent payments
Payment details
```

## Keep secondary

```text
EURC
Solana
Transaction
Wallet
Devnet
```

## Avoid as primary copy

```text
SPL transfer
Token account
Mint
Transaction finalized
Block confirmation
On-chain settlement instruction
```

Technical terminology is allowed in a details/debug surface.

---

# 20. Suggested frontend implementation order

## Phase 1 — static UI

Implement:

1. design tokens;
2. app shell;
3. dashboard;
4. amount-entry screen;
5. QR/waiting screen;
6. success/receipt screen;
7. payments list.

Use fixture data.

## Phase 2 — payment intent integration

Connect:

```text
New payment
    -> POST payment intent
    -> render QR
```

## Phase 3 — customer app integration

Connect:

```text
scan QR
    -> resolve intent
    -> review amount
    -> send EURC
    -> submit signature
```

## Phase 4 — verification + realtime

Connect:

```text
backend verifies chain transfer
    -> DB status CONFIRMED
    -> merchant realtime update
    -> success screen
```

## Phase 5 — polish

Add:

- loading states;
- expiration timer;
- error states;
- responsive behavior;
- animation;
- accessibility pass.

---

# 21. MVP acceptance criteria

The implementation is ready for the merchant demo when all of the following are true.

## Visual

- [ ] UI matches Design 2 visual hierarchy.
- [ ] Primary surfaces are white/light neutral.
- [ ] Purple is the dominant CTA accent.
- [ ] Green is reserved for success/confirmed states.
- [ ] Solana gradient is subtle and not a dominant background treatment.
- [ ] UI does not resemble a crypto trading wallet.

## Merchant flow

- [ ] Merchant can enter a euro amount.
- [ ] Merchant can create a payment intent.
- [ ] Merchant sees a scannable QR code.
- [ ] Merchant sees payment request expiry/status.
- [ ] Merchant receives a realtime success update.
- [ ] Merchant sees amount, EURC, time and transaction details after payment.

## Customer flow

- [ ] Customer app can scan/resolve the payment-intent URL.
- [ ] Customer sees merchant + amount before paying.
- [ ] Customer can send real Devnet EURC.
- [ ] Customer sees processing while backend verifies.
- [ ] Customer sees success only after verification.

## Backend

- [ ] Backend creates unique payment intents.
- [ ] Backend verifies Solana transaction success.
- [ ] Backend verifies EURC mint.
- [ ] Backend verifies intended merchant destination.
- [ ] Backend verifies exact amount.
- [ ] Backend rejects expired/cancelled intents.
- [ ] Backend prevents signature reuse / duplicate payment attachment.
- [ ] Backend updates a payment to `CONFIRMED` only after verification.

## Scope discipline

- [ ] No Face ID dependency.
- [ ] No fiat/on-ramp dependency.
- [ ] No card-payment UI.
- [ ] No smart-contract dependency.
- [ ] No mainnet dependency.
- [ ] No refund/POS integration dependency.

---

# 22. Final design rule

When there is a conflict between showing blockchain mechanics and making the payment flow obvious, choose the payment flow.

The default merchant experience should communicate:

```text
Amount -> QR -> Payment received
```

not:

```text
Wallet -> token -> network -> transaction -> confirmation
```

EURC and Solana are the infrastructure. The interface should make them feel dependable, not complicated.

---

## Companion design reference

Use the selected **Design Concept 2 / Card Dashboard** image as the visual reference for layout density, cards, purple CTAs and green confirmation treatment.

Companion filename:

```text
merchant_app_design_2_reference.png
```
