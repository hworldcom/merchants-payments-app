# Developer Specification — Restaurant EURC Payments MVP

## 1. Purpose

Build a **working merchant-facing proof of concept** for in-person restaurant payments.

The first version uses **Circle EURC test tokens on Solana Devnet** and has no real fiat onboarding or settlement.

The primary product test is not whether crypto works. It is whether a restaurant owner can see a payment experience that feels operationally realistic:

```text
Merchant enters amount
→ QR appears
→ customer scans
→ customer taps Pay
→ Solana transaction confirms
→ merchant screen immediately says Payment received
```

This document defines the recommended implementation for that MVP.

---

## 2. Scope and assumptions

### In scope

- iOS-focused React Native/Expo customer app
- responsive merchant web app
- Solana Devnet
- Circle test EURC
- one merchant wallet per merchant
- one local Devnet wallet per customer installation
- server-side payment intents
- QR-based payment discovery
- direct customer → merchant EURC transfer
- on-chain transaction verification
- real-time merchant status updates
- simple payment histories

### Explicitly out of scope

- real EUR
- mainnet
- MoonPay
- SEPA / SEPA Instant
- KYC/KYB
- production custody
- Face ID/passkeys
- social login
- refunds
- chargebacks
- loyalty/rewards
- merchant bank settlement
- POS integrations
- smart contracts
- multi-token support
- multi-chain support
- public App Store release

---

## 3. UX requirements

### 3.1 Customer flow

Home:

```text
┌──────────────────────────┐
│                          │
│        €16.40            │
│      Demo balance        │
│                          │
│    [ Scan to Pay ]       │
│                          │
│ Recent                   │
│ Pho Hanoi      -€3.60    │
└──────────────────────────┘
```

Tap `Scan to Pay`:

- camera opens immediately;
- QR is recognized;
- app fetches payment intent from backend.

Confirmation:

```text
┌──────────────────────────┐
│           Pay            │
│                          │
│       Pho Hanoi          │
│                          │
│         €3.60            │
│                          │
│        [ PAY ]           │
│                          │
│         Cancel           │
└──────────────────────────┘
```

On `PAY`:

1. ensure payment intent is still payable;
2. ensure local EURC balance is sufficient;
3. construct SPL token transfer;
4. sign with local Devnet wallet;
5. submit transaction;
6. send transaction signature to backend;
7. wait for backend confirmation;
8. show success.

Success:

```text
┌──────────────────────────┐
│            ✓             │
│                          │
│    PAYMENT RECEIVED      │
│                          │
│         €3.60            │
│                          │
│       Pho Hanoi          │
│                          │
│        [ Done ]          │
└──────────────────────────┘
```

### 3.2 Merchant flow

Merchant home:

```text
┌───────────────────────────────┐
│ Pho Hanoi                     │
│                               │
│ New payment                   │
│ [ € 3.60                ]     │
│                               │
│ [ REQUEST PAYMENT ]           │
│                               │
│ Today                         │
│ €24.10 received               │
│ 5 payments                    │
└───────────────────────────────┘
```

After request:

```text
┌───────────────────────────────┐
│            €3.60              │
│                               │
│          [ QR CODE ]          │
│                               │
│     Waiting for payment       │
│                               │
│           Cancel              │
└───────────────────────────────┘
```

After backend verification:

```text
┌───────────────────────────────┐
│               ✓               │
│                               │
│       PAYMENT RECEIVED        │
│                               │
│            €3.60              │
│                               │
│       Payment received        │
│                               │
│       [ NEW PAYMENT ]         │
└───────────────────────────────┘
```

This state transition must occur without manual refresh.

---

## 4. Recommended stack

### Customer

- React Native
- Expo
- TypeScript
- Expo Camera / QR scanning
- secure local key storage
- Solana JavaScript client
- SPL Token helpers

### Merchant + backend

- Next.js
- TypeScript
- Postgres
- Supabase
- Supabase Realtime
- Next.js Route Handlers or a small API service

### Blockchain

- Solana Devnet
- Circle EURC test token
- configurable Solana RPC endpoint

### Why no smart contract

The MVP only needs an SPL token transfer from customer to merchant.

A custom program would add:

- deployment work;
- account design;
- audits/security surface;
- extra failure modes;
- no meaningful merchant-demo benefit.

Keep payment/business state server-side and token settlement on-chain.

---

## 5. Devnet wallet design

For iteration 1, use a **Devnet-only local wallet**.

### First launch

1. check secure device storage for an existing keypair;
2. if absent, generate a new Solana keypair;
3. store the secret key in secure storage;
4. store/display only the public address where necessary internally;
5. fetch EURC balance.

No seed phrase UI is required.

No login is required.

### Security boundary

This wallet implementation is acceptable only because:

- Devnet tokens have no real monetary value;
- the objective is a controlled merchant demo;
- it substantially reduces MVP dependencies.

**Do not carry this key-management model to mainnet without a separate security review.**

The wallet layer should be behind an interface so it can later be replaced by a production embedded-wallet provider.

Example abstraction:

```ts
interface WalletService {
  getPublicKey(): Promise<string>;
  signAndSend(transaction: Transaction): Promise<string>;
}
```

Production replacement should not require changes to payment-intent or merchant-domain logic.

---

## 6. EURC configuration

Use Circle's **test EURC on Solana Devnet**.

Configuration:

```bash
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=...
EURC_MINT_ADDRESS=...
```

Requirements:

- never mix mainnet and Devnet mint addresses;
- configure the mint via environment variable;
- validate token mint on application startup/deployment;
- resolve token decimals from the configured mint or validate the expected value;
- store the displayed euro amount as integer cents;
- store the exact EURC transfer amount separately as integer raw token units.

Do not treat JavaScript floating-point values as authoritative payment amounts.

Example:

```text
display amount:  €3.60
amount_cents:    360
settlement:      3.60 test EURC
amount_raw:      calculated using the configured mint decimals
```

For this demo, one displayed euro maps to one test EURC before conversion to raw token units. `amountCents` and `amountRaw` are different values with different scales; never reuse one field for both meanings.

---

## 7. Demo funding

Use Circle's testnet faucet to fund a treasury/admin wallet with EURC on Solana Devnet.

Then provide one of:

### Option A — admin CLI

```bash
pnpm fund-demo-wallet <wallet-address> 20
```

### Option B — protected development endpoint

```http
POST /api/dev/fund-wallet
```

Never expose this endpoint in a production environment.

### Option C — automatic first-run funding

Customer app registers the generated wallet with the backend:

```http
POST /api/demo-wallets
{
  "walletAddress": "..."
}
```

Backend sends a configurable amount of Devnet EURC from the treasury.

For the merchant demo, A or C is enough.

---

## 8. Payment-intent architecture

### 8.1 Rationale

The QR code should not be the authoritative source for:

- merchant wallet;
- amount;
- token mint;
- payment state.

Instead, create a server-side **payment intent**.

This gives us:

- payment expiry;
- duplicate-payment prevention;
- reconciliation;
- merchant transaction history;
- future refunds;
- future POS integration;
- future fiat settlement mapping;
- a stable checkout abstraction independent of the underlying wallet provider.

### 8.2 Payment creation

Merchant submits:

```http
POST /api/payments
Content-Type: application/json

{
  "amountCents": 360,
  "displayCurrency": "EUR",
  "settlementAsset": "EURC"
}
```

Merchant identity comes from the authenticated merchant session; do not accept arbitrary `merchantId` from an untrusted client in a production design.

Backend resolves:

```text
merchant.name
merchant.wallet_address
EURC mint
network
```

Backend creates:

```json
{
  "id": "pay_abc123",
  "merchantId": "merchant_001",
  "amountCents": 360,
  "amountRaw": "3600000",
  "displayCurrency": "EUR",
  "settlementAsset": "EURC",
  "network": "solana-devnet",
  "status": "PENDING",
  "expiresAt": "..."
}
```

`amountRaw` above is illustrative. Compute it from `amountCents` and the actual configured token decimals without floating-point arithmetic.

### 8.3 QR contents

Encode only a stable payment URL:

```text
https://pay.example.com/p/pay_abc123
```

For an installed application, Universal Links/deep links can later route this directly into the app.

For iteration 1, the QR scanner in the app can simply parse the URL and extract the payment ID.

### 8.4 Fetch payment

Customer app:

```http
GET /api/payments/pay_abc123
```

Response:

```json
{
  "id": "pay_abc123",
  "merchant": {
    "name": "Pho Hanoi"
  },
  "amountCents": 360,
  "displayCurrency": "EUR",
  "settlementAsset": "EURC",
  "status": "PENDING",
  "expiresAt": "..."
}
```

The public response should not need to expose the merchant wallet if the app later obtains a server-composed transaction. For the simple MVP, returning the merchant recipient address is acceptable after the payment ID has been validated.

The UI must refuse payment if state is not `PENDING`.

---

## 9. Payment lifecycle

Recommended states:

```text
PENDING
   │
   ├──► CANCELLED
   │
   ├──► EXPIRED
   │
   ▼
SUBMITTED
   │
   ├──► FAILED
   ▼
CONFIRMED
```

Meaning:

- `PENDING`: created, waiting for customer;
- `SUBMITTED`: client submitted a signature; backend is verifying/confirming;
- `CONFIRMED`: backend verified the expected transfer;
- `FAILED`: submitted transaction failed or did not match;
- `EXPIRED`: payment window expired;
- `CANCELLED`: merchant cancelled it.

The merchant UI may display `PENDING` and `SUBMITTED` both as `Waiting for payment`.

Only `CONFIRMED` maps to the visible **Payment received** state.

---

## 10. Customer transaction construction

For iteration 1, the customer app may construct the SPL transfer itself.

Inputs must originate from the server-side payment intent:

```text
recipient merchant wallet
EURC mint
amount
cluster
payment ID
```

High-level transaction:

```text
customer EURC associated token account
        │
        │ exact expected token amount
        ▼
merchant EURC associated token account
```

If the merchant's associated token account does not exist, the transaction may create it.

### Transaction fees

Solana transactions require network fees in SOL.

For the MVP, choose one:

1. pre-fund demo customer wallets with a small amount of Devnet SOL; or
2. use a sponsored/fee-payer flow later.

**Recommendation for iteration 1:** pre-fund with Devnet SOL because it is the least implementation work.

The user should not see a SOL balance.

---

## 11. Signature submission

After broadcasting:

```http
POST /api/payments/pay_abc123/submit
Content-Type: application/json

{
  "signature": "<solana-transaction-signature>",
  "payerWallet": "<customer-public-key>"
}
```

The backend must treat this as an untrusted claim.

Do **not** update the payment directly to `CONFIRMED`.

Set:

```text
PENDING → SUBMITTED
```

Then verify on-chain.

---

## 12. Backend transaction verification

The backend must independently fetch and inspect the submitted transaction.

Before marking `CONFIRMED`, verify at minimum:

1. transaction exists on configured Solana cluster;
2. transaction executed successfully;
3. transaction has sufficient confirmation level;
4. token mint equals configured EURC Devnet mint;
5. transferred raw token amount equals the payment intent amount;
6. destination token account belongs to the expected merchant wallet;
7. source corresponds to the submitting customer wallet where practical;
8. signature has not already been bound to another payment intent;
9. payment intent was not already `CONFIRMED`, `CANCELLED`, or `EXPIRED`;
10. transaction is consistent with the expected timing/payment request.

Use database uniqueness on `transaction_signature`.

### Commitment

For the merchant demo, `confirmed` commitment is sufficient for a fast UX.

Production settlement policy can later require stronger/finalized confirmation.

---

## 13. Payment references

For the minimal MVP, `payment_id + submitted transaction signature` is enough because the backend validates the signature against the intended transfer.

For robustness, add one of these later:

- Solana Pay `reference` key;
- Memo instruction containing an opaque payment reference;
- server-composed Solana Pay transaction request.

A reference gives the backend another way to find/reconcile a payment if the mobile client disconnects after sending the transaction.

Solana Pay supports per-payment references specifically for matching on-chain transfers back to orders.

This is **P1**, not required for the first merchant demo.

---

## 14. Suggested database model

### `merchants`

```sql
id                  uuid primary key
name                text not null
slug                text unique not null
wallet_address      text not null
created_at          timestamptz not null
```

Optional later:

```text
address
logo_url
settlement_preferences
owner_user_id
```

### `payments`

```sql
id                      text primary key
merchant_id             uuid not null
amount_cents            bigint not null
amount_raw              numeric/text not null
display_currency        text not null default 'EUR'
settlement_asset        text not null default 'EURC'
network                  text not null default 'solana-devnet'
status                   text not null
customer_wallet          text null
transaction_signature   text unique null
expires_at               timestamptz not null
created_at               timestamptz not null
submitted_at             timestamptz null
confirmed_at             timestamptz null
failure_reason           text null
```

Store euro cents and the exact raw token amount without floating-point loss. Add constraints so the display currency remains `EUR`, the settlement asset remains `EURC`, and both amount fields are positive for an active payment.

### `demo_wallets`

Optional:

```sql
wallet_address       text primary key
created_at           timestamptz not null
last_funded_at       timestamptz null
```

---

## 15. API surface

Minimum endpoints:

### Merchant

```text
POST   /api/payments
GET    /api/merchants/me/payments
POST   /api/payments/:id/cancel
```

### Customer

```text
GET    /api/payments/:id
POST   /api/payments/:id/submit
```

### Development/admin

```text
POST   /api/dev/fund-wallet
```

Protect or disable the development endpoint outside Devnet/demo deployments.

---

## 16. Realtime merchant update

Recommended:

```text
payments row
status changes
SUBMITTED → CONFIRMED
        │
        ▼
Supabase Realtime
        │
        ▼
merchant browser
        │
        ▼
✓ €3.60 received
```

Fallback if the realtime subscription is unavailable or reconnecting:

- poll `GET /api/payments/:id` every 2 seconds while the payment screen is open.

Supabase Realtime is the preferred path. Low-frequency polling is an acceptable recovery path for the MVP.

Do not delay the whole project for websocket infrastructure.

---

## 17. Expiration and duplicate payment handling

Default suggested expiry:

```text
10 minutes
```

If intent expires before submission:

```text
PENDING → EXPIRED
```

Customer app should display:

```text
This payment request has expired.
Please ask the merchant to create a new one.
```

If a `CONFIRMED` QR is rescanned:

```text
This payment has already been completed.
```

Never allow an already-confirmed intent to create another transfer.

---

## 18. Merchant payment history

The merchant homepage should show enough information to make the system feel like a real payment product.

Example:

```text
TODAY

€24.10
received

5 payments

10:58   €3.60   Paid
10:42   €5.50   Paid
10:21   €4.20   Paid
09:57   €6.80   Paid
09:31   €4.00   Paid
```

No blockchain details by default.

Optional details drawer:

```text
Payment ID
Timestamp
Transaction signature
Customer wallet
Network: Solana Devnet
```

---

## 19. Customer payment history

Persist locally or retrieve by wallet address for MVP.

Display:

```text
Pho Hanoi      -€3.60
Oct 6, 10:58
```

Do not expose blockchain details in the primary list.

---

## 20. Error handling

At minimum handle:

### Insufficient EURC

```text
Not enough demo balance.
```

### Insufficient Devnet SOL for gas

Prefer automatically fixing this through demo funding rather than exposing a technical error.

Fallback:

```text
Demo wallet needs to be refilled.
```

### Payment expired

```text
This payment request has expired.
```

### Already paid

```text
This payment has already been completed.
```

### Transaction rejected/failed

```text
Payment did not complete.
Please try again.
```

### Backend cannot verify

Do **not** show paid.

Merchant remains waiting or sees:

```text
Payment verification failed.
```

False positives are worse than delayed confirmations.

---

## 21. QR security model

A malicious QR should not be able to authoritatively choose the recipient wallet.

The QR contains only something like:

```text
https://pay.example.com/p/pay_abc123
```

The app asks the backend:

```text
What is pay_abc123?
```

The backend resolves:

```text
merchant
amount
recipient
token
status
expiry
```

Therefore a QR sticker such as:

```text
merchant=Pho Hanoi
wallet=ATTACKER
amount=3.60
```

is not a valid payment instruction in our application.

The server-side merchant record remains authoritative.

---

## 22. Why a server-side payment intent instead of a pure Solana Pay transfer URL

A direct Solana Pay transfer request can encode:

```text
recipient
amount
spl-token
reference
label
message
```

and is a valid/simple payment architecture.

For this product, the server-side payment intent is preferred because it creates an application-level order/payment object that can evolve into:

- receipts;
- expiry;
- merchant reporting;
- refunds;
- POS order IDs;
- restaurant tables/orders;
- MoonPay funding;
- merchant settlement batches;
- accounting exports.

Solana remains the settlement layer; the payment intent is the commerce/reconciliation layer.

The two approaches are not mutually exclusive.

A later iteration may generate a standards-compatible Solana Pay request from the payment intent.

---

## 23. Observability

Log at minimum:

```text
payment_intent_created
payment_intent_scanned
payment_submitted
solana_signature
verification_started
verification_failed
payment_confirmed
payment_expired
```

Useful fields:

```text
payment_id
merchant_id
amount_raw
customer_wallet
transaction_signature
latency_ms
error_code
```

Do not log private keys or secrets.

### Useful demo metric

Track:

```text
time from merchant pressing REQUEST PAYMENT
to backend marking CONFIRMED
```

and:

```text
time from customer pressing PAY
to merchant seeing Payment received
```

Those are product metrics, not just engineering metrics.

---

## 24. Delivery milestones and ticket map

Milestones describe product outcomes. Development tickets own the implementation and evidence needed to reach them. A milestone heading is not permission to implement work without a ticket.

### M0 — delivery foundation

Outcome:

- contributor workflow and work records are available;
- the monorepo, merchant web app, customer app, shared packages, and validation commands exist;
- Devnet-only configuration fails fast when network or token settings do not match;
- the initial merchant and payment data model is migrated and tested.

Exit check:

```text
both applications start locally
shared validation runs
the database can create and read a pending payment intent
```

Owning tickets: [DEV0002](tickets/archive/organisatory/DEV0002-scaffold-applications-and-tooling.md) and [DEV0003](tickets/current/backend/DEV0003-establish-payment-data-and-api-foundation.md).

### M1 — request and scan

Outcome:

- a merchant can enter a euro amount and create a server-side payment intent;
- the merchant receives a QR code containing only the payment URL;
- the customer can scan the QR and see the server-provided merchant name and amount;
- invalid, unknown, expired, cancelled, or already-paid requests cannot reach the payable confirmation state.

Exit check:

```text
merchant creates payment
customer scans the QR
customer sees the correct merchant and amount
```

Owning tickets: [DEV0004](tickets/current/merchant/DEV0004-build-merchant-payment-request.md) and [DEV0005](tickets/current/customer/DEV0005-build-customer-scan-and-confirmation.md).

Supporting visual foundation: [DEV0014](tickets/archive/merchant/DEV0014-build-static-merchant-interface.md).

### M2 — Devnet EURC transfer

Outcome:

- the customer app creates and securely stores a Devnet-only local wallet;
- demo tooling provides the wallet with test EURC and enough Devnet SOL for fees;
- pressing `Pay` sends the exact requested test EURC amount to the expected merchant and returns a signature;
- the interface does not expose SOL, token addresses, seed phrases, or fee mechanics.

Exit check:

```text
the expected EURC balance moves on Solana Devnet
the customer app returns the transaction signature to the payment flow
```

Owning tickets: [DEV0006](tickets/current/blockchain/DEV0006-provision-demo-customer-wallets.md) and [DEV0007](tickets/current/blockchain/DEV0007-send-eurc-devnet-payment.md).

### M3 — verified paid state

Outcome:

- the backend treats the submitted signature as an untrusted claim and verifies the transaction independently;
- only an exact successful transfer can move `PENDING` through `SUBMITTED` to `CONFIRMED`;
- wrong amount, recipient, mint, network, failed transaction, reused signature, or terminal intent never displays as paid;
- the merchant changes to **Payment received** without refreshing and the customer sees success only after backend confirmation.

Exit check:

```text
customer taps Pay
backend verifies the exact transfer
merchant automatically sees Payment received
customer sees confirmed success
```

Owning tickets: [DEV0008](tickets/current/blockchain/DEV0008-verify-submitted-eurc-transfers.md) and [DEV0009](tickets/current/merchant/DEV0009-present-live-confirmed-payment.md).

### M4 — repeatable restaurant demo

Outcome:

- merchants and customers can see useful payment history without blockchain details in the main view;
- expiry, cancellation, repeat scans, insufficient demo funds, verification failure, retry, and recovery have clear behavior;
- the full demo succeeds repeatedly on supported devices and merchant viewport sizes;
- setup, funding, rehearsal, known limitations, and measured payment timing are documented.

Exit check:

```text
the documented 20–30 second happy path succeeds repeatedly
the P0 rejection scenarios never produce a false success state
a new developer can set up and rehearse the demo from repository documentation
```

Owning tickets: [DEV0010](tickets/current/backend/DEV0010-complete-payment-lifecycle-guards.md), [DEV0011](tickets/current/customer/DEV0011-add-payment-history-and-demo-recovery.md), and [DEV0012](tickets/current/organisatory/DEV0012-rehearse-and-document-the-demo.md).

The shared delivery order, dependencies, and completion conditions are tracked in [COR0001](tickets/current/organisatory/COR0001-deliver-restaurant-payments-mvp.md).

---

## 25. P0 acceptance tests

### Happy path

1. merchant creates `€3.60` payment;
2. QR displayed;
3. customer scans QR;
4. app shows correct merchant and `€3.60`;
5. customer presses `Pay`;
6. EURC transaction succeeds on Devnet;
7. backend validates exact amount/mint/recipient;
8. database becomes `CONFIRMED`;
9. merchant receives status update;
10. both sides show success;
11. customer balance decreases by `€3.60`.

### Wrong amount

Submit a transaction for `€3.59`.

Expected:

```text
payment != CONFIRMED
```

### Wrong recipient

Submit same amount to a different wallet.

Expected:

```text
payment != CONFIRMED
```

### Wrong token

Submit another SPL token.

Expected:

```text
payment != CONFIRMED
```

### Failed transaction

Expected:

```text
payment != CONFIRMED
```

### Duplicate signature

Attempt to attach one transaction to two payment intents.

Expected:

```text
second attempt rejected
```

### Rescan completed QR

Expected:

```text
already paid
no new transaction created
```

### Expired QR

Expected:

```text
payment blocked
```

---

## 26. Environment separation

At minimum:

```text
development
demo
production-later
```

The MVP/demo environment must enforce:

```text
SOLANA_CLUSTER=devnet
```

Add a visible developer-only indicator in non-production builds if useful.

Do not allow an accidental mainnet RPC + Devnet mint configuration to start silently.

Fail fast on network/token configuration mismatch.

---

## 27. Production migration considerations

The payment-intent API should be designed so these components can be replaced later without changing the merchant checkout model.

### Replace

```text
local Devnet wallet
```

with:

```text
production embedded wallet
+ passkey/Face ID as appropriate
```

### Replace

```text
admin faucet funding
```

with:

```text
SEPA Instant
→ regulated on-ramp
→ EURC
```

### Replace

```text
merchant holds EURC
```

with optional:

```text
merchant EURC
→ regulated off-ramp/settlement provider
→ merchant EUR bank account
```

The checkout remains:

```text
payment intent
→ QR
→ customer confirms
→ transfer
→ verification
→ merchant sees paid
```

This is the architectural reason to keep payment intent and settlement mechanics separate.

---

## 28. Estimated effort

For one engineer comfortable with TypeScript, Next.js, and basic Solana development:

| Area | Estimate |
|---|---:|
| Project skeleton + DB | 0.5–1 day |
| Merchant create/QR flow | 1 day |
| Mobile scanner + payment UI | 1 day |
| Devnet wallet + EURC transfer | 1–2 days |
| Verification + payment state | 1–1.5 days |
| Realtime/polling merchant update | 0.5 day |
| Histories/funding/error states | 1–2 days |
| Demo polish/testing | 1–2 days |
| **Expected clean MVP** | **~7–10 dev-days** |

A rough functional proof can be achieved earlier; the goal above is a version worth putting in front of restaurant owners.

---

## 29. Key engineering principles

1. **Never trust the mobile client to declare a payment successful.**
2. **Never trust arbitrary payment details from the QR.**
3. **Only the backend changes a payment to `CONFIRMED` after on-chain verification.**
4. **Keep blockchain details out of the primary user experience.**
5. **No smart contract unless a concrete future requirement needs one.**
6. **Treat all local wallet code as Devnet-only.**
7. **Keep wallet, on-ramp, and settlement providers replaceable.**
8. **Optimize the first iteration for a convincing live merchant demo.**

---

## 30. References

Circle testnet faucet:

https://faucet.circle.com/

Circle EURC:

https://www.circle.com/eurc

Solana Pay overview:

https://solana.com/docs/tools/solana-pay

Solana Pay transfer requests:

https://solana.com/docs/tools/solana-pay/quickstart/transfer-requests

Solana Pay QR integration:

https://solana.com/docs/tools/solana-pay/quickstart/qr-codes

Solana payment acceptance overview:

https://platform.solana.com/docs/payments/accept-overview
