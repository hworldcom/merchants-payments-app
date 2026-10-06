"use client";

import { formatEuroCents, type PaymentStatus, type PaymentSummary } from "@merchant-payments/payments";
import {
  ArrowLeft,
  Delete,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Home,
  Plus,
  ReceiptText,
  Settings,
  SlidersHorizontal,
  Utensils,
  WifiOff,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useState } from "react";
import { amountDraftToCents, appendAmountKey } from "./amount";
import { fixturePayments, merchant } from "./fixtures";
import styles from "./merchant-app.module.css";

type TopLevelView = "home" | "payments" | "settings";
type View = TopLevelView | "amount" | "request" | "receipt";
type PaymentFilter = "ALL" | "CONFIRMED" | "PENDING";

type PreviewRequest = {
  id: string;
  amountCents: number;
  note?: string;
};

const keypadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"];

function StatusBadge({ status }: { status: PaymentStatus }) {
  const label = status === "CONFIRMED" ? "Confirmed" : status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span className={`${styles.statusBadge} ${styles[`status${status}`]}`}>
      {status === "CONFIRMED" ? <Check size={13} strokeWidth={2.5} aria-hidden="true" /> : <Clock3 size={13} aria-hidden="true" />}
      {label}
    </span>
  );
}

function ScreenHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <header className={styles.screenHeader}>
      <button className={styles.iconButton} type="button" onClick={onBack} aria-label="Go back">
        <ArrowLeft size={21} aria-hidden="true" />
      </button>
      <h1>{title}</h1>
      <div className={styles.headerAction}>{action}</div>
    </header>
  );
}

function PaymentRow({ payment, onSelect }: { payment: PaymentSummary; onSelect?: (payment: PaymentSummary) => void }) {
  const content = (
    <>
      <div className={styles.paymentRowCopy}>
        <strong>{formatEuroCents(payment.amountCents)}</strong>
        <span>{payment.note ?? "Restaurant payment"}</span>
        <small>{payment.createdAt}</small>
      </div>
      <div className={styles.paymentRowMeta}>
        <StatusBadge status={payment.status} />
        <span>{payment.settlementAsset}</span>
      </div>
      {onSelect ? <ChevronRight className={styles.rowChevron} size={18} aria-hidden="true" /> : null}
    </>
  );

  if (!onSelect) {
    return <div className={styles.paymentRow}>{content}</div>;
  }

  return (
    <button className={`${styles.paymentRow} ${styles.paymentRowButton}`} type="button" onClick={() => onSelect(payment)}>
      {content}
    </button>
  );
}

function BottomNavigation({ active, onChange }: { active: TopLevelView; onChange: (view: TopLevelView) => void }) {
  const items = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "payments" as const, label: "Payments", icon: ReceiptText },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <nav className={styles.bottomNavigation} aria-label="Merchant navigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          className={active === id ? styles.navItemActive : styles.navItem}
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={20} strokeWidth={active === id ? 2.4 : 2} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Dashboard({ onNewPayment, onNavigate, onOpenPayment }: { onNewPayment: () => void; onNavigate: (view: TopLevelView) => void; onOpenPayment: (payment: PaymentSummary) => void }) {
  return (
    <div className={styles.topLevelScreen}>
      <main className={styles.pageContent}>
        <header className={styles.merchantHeader}>
          <div className={styles.merchantIdentity}>
            <span className={styles.brandMark} aria-hidden="true"><Utensils size={17} /></span>
            <div>
              <strong>{merchant.name}</strong>
              <span>{merchant.venue}</span>
            </div>
          </div>
          <button className={styles.iconButton} type="button" aria-label="Notifications">
            <Bell size={20} aria-hidden="true" />
            <span className={styles.notificationDot} aria-hidden="true" />
          </button>
        </header>

        <section className={styles.welcomeBlock}>
          <span className={styles.previewBadge}>Interface preview</span>
          <h1>Ready for the next table.</h1>
          <p>Request a payment in a few taps.</p>
        </section>

        <button className={styles.primaryButton} type="button" onClick={onNewPayment}>
          <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
          New payment
        </button>

        <section className={styles.metricsSection} aria-labelledby="sales-heading">
          <div className={styles.sectionHeadingRow}>
            <h2 id="sales-heading">Today</h2>
            <span>Updated now</span>
          </div>
          <div className={styles.metricsGrid}>
            <article className={`${styles.metricCard} ${styles.metricCardFeatured}`}>
              <span>Sales today</span>
              <strong>€482.00</strong>
              <small className={styles.positiveMetric}>+12% from yesterday</small>
            </article>
            <article className={styles.metricCard}>
              <span>Payments</span>
              <strong>12</strong>
              <small>Confirmed today</small>
            </article>
            <article className={styles.metricCard}>
              <span>Average ticket</span>
              <strong>€40.17</strong>
              <small>Across all payments</small>
            </article>
          </div>
        </section>

        <section className={styles.activitySection} aria-labelledby="recent-heading">
          <div className={styles.sectionHeadingRow}>
            <h2 id="recent-heading">Recent payments</h2>
            <button className={styles.textButton} type="button" onClick={() => onNavigate("payments")}>See all</button>
          </div>
          <div className={styles.paymentList}>
            {fixturePayments.slice(0, 3).map((payment) => (
              <PaymentRow key={payment.id} payment={payment} onSelect={payment.status === "CONFIRMED" ? onOpenPayment : undefined} />
            ))}
          </div>
        </section>
      </main>
      <BottomNavigation active="home" onChange={onNavigate} />
    </div>
  );
}

function AmountEntry({ amountDraft, note, onAmountKey, onNoteChange, onBack, onRequest }: { amountDraft: string; note: string; onAmountKey: (key: string) => void; onNoteChange: (value: string) => void; onBack: () => void; onRequest: () => void }) {
  const amountCents = amountDraftToCents(amountDraft);
  const displayAmount = amountDraft ? `€${amountDraft}` : "€0.00";

  return (
    <main className={styles.flowScreen}>
      <ScreenHeader title="New payment" onBack={onBack} />
      <section className={styles.amountSection} aria-labelledby="amount-heading">
        <p id="amount-heading">Enter amount</p>
        <output className={amountCents ? styles.amountDisplay : styles.amountDisplayMuted} aria-live="polite">
          {displayAmount}
        </output>
        <span>Euro amount</span>
      </section>

      <label className={styles.noteField}>
        <span>Add note <small>Optional</small></span>
        <input
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          maxLength={80}
          placeholder="Table 4, lunch, order number…"
        />
        <small>{note.length}/80</small>
      </label>

      <div className={styles.keypad} aria-label="Amount keypad">
        {keypadKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onAmountKey(key)}
            aria-label={key === "backspace" ? "Delete last digit" : key === "." ? "Decimal point" : `Digit ${key}`}
          >
            {key === "backspace" ? <Delete size={23} aria-hidden="true" /> : key}
          </button>
        ))}
      </div>

      <div className={styles.flowFooter}>
        <p>Maximum €9,999.99</p>
        <button className={styles.primaryButton} type="button" disabled={!amountCents} onClick={onRequest}>
          Request payment
        </button>
      </div>
    </main>
  );
}

function RequestScreen({ request, onBack, onCancel, onPreviewConfirmed }: { request: PreviewRequest; onBack: () => void; onCancel: () => void; onPreviewConfirmed: () => void }) {
  const eurcAmount = (request.amountCents / 100).toFixed(2);
  const paymentUrl = `https://pay.example.com/p/${request.id}`;

  return (
    <main className={styles.flowScreen}>
      <ScreenHeader
        title="Scan to pay"
        onBack={onBack}
        action={<button className={styles.textButtonDanger} type="button" onClick={onCancel}>Cancel</button>}
      />
      <section className={styles.requestSummary}>
        <span>Payment request</span>
        <strong>{formatEuroCents(request.amountCents)}</strong>
        <p>Customer pays {eurcAmount} EURC</p>
        {request.note ? <small>{request.note}</small> : null}
      </section>

      <div className={styles.qrOutline}>
        <div className={styles.qrCard}>
          <QRCodeSVG value={paymentUrl} size={210} level="M" marginSize={2} aria-label="Fixture payment request QR code" />
        </div>
      </div>

      <section className={styles.waitingPanel} aria-live="polite">
        <span className={styles.pulseDot} aria-hidden="true" />
        <div>
          <strong>Waiting for payment…</strong>
          <span>Request expires in 09:42</span>
        </div>
      </section>

      <aside className={styles.previewNotice}>
        <SlidersHorizontal size={18} aria-hidden="true" />
        <div>
          <strong>Fixture preview</strong>
          <p>No payment or payment intent has been created.</p>
        </div>
      </aside>

      <div className={styles.flowFooter}>
        <button className={styles.secondaryButton} type="button" onClick={onCancel}>Cancel request</button>
        <button className={styles.previewButton} type="button" onClick={onPreviewConfirmed}>Preview confirmed state</button>
      </div>
    </main>
  );
}

function ReceiptScreen({ payment, onDone }: { payment: PaymentSummary; onDone: () => void }) {
  return (
    <main className={`${styles.flowScreen} ${styles.receiptScreen}`}>
      <div className={styles.successIcon} aria-hidden="true"><Check size={35} strokeWidth={2.6} /></div>
      <section className={styles.successHeading}>
        <strong>{formatEuroCents(payment.amountCents)}</strong>
        <h1>Payment received</h1>
        <StatusBadge status="CONFIRMED" />
        <p>{payment.createdAt}</p>
      </section>

      <dl className={styles.receiptCard}>
        <div><dt>Merchant</dt><dd>{merchant.name}</dd></div>
        {payment.note ? <div><dt>Note</dt><dd>{payment.note}</dd></div> : null}
        <div><dt>Amount</dt><dd>{formatEuroCents(payment.amountCents)}</dd></div>
        <div><dt>Settlement asset</dt><dd>{payment.settlementAsset}</dd></div>
        <div><dt>Network</dt><dd>Solana Devnet</dd></div>
        <div><dt>Status</dt><dd>Confirmed</dd></div>
        <div><dt>Transaction</dt><dd>3f2a…9c7e</dd></div>
      </dl>

      <aside className={styles.previewNotice}>
        <SlidersHorizontal size={18} aria-hidden="true" />
        <div>
          <strong>Fixture receipt</strong>
          <p>This screen does not represent a verified transaction yet.</p>
        </div>
      </aside>

      <div className={styles.flowFooter}>
        <button className={styles.primaryButton} type="button" onClick={onDone}>Done</button>
      </div>
    </main>
  );
}

function PaymentsScreen({ onNavigate, onOpenPayment }: { onNavigate: (view: TopLevelView) => void; onOpenPayment: (payment: PaymentSummary) => void }) {
  const [filter, setFilter] = useState<PaymentFilter>("ALL");
  const filteredPayments = useMemo(
    () => filter === "ALL" ? fixturePayments : fixturePayments.filter((payment) => payment.status === filter),
    [filter],
  );

  return (
    <div className={styles.topLevelScreen}>
      <main className={styles.pageContent}>
        <header className={styles.titleHeader}>
          <div>
            <span>Activity</span>
            <h1>Payments</h1>
          </div>
          <button className={styles.iconButton} type="button" aria-label="Payment filters"><SlidersHorizontal size={20} aria-hidden="true" /></button>
        </header>
        <div className={styles.filterGroup} aria-label="Filter payments">
          {(["ALL", "CONFIRMED", "PENDING"] as const).map((value) => (
            <button key={value} className={filter === value ? styles.filterActive : styles.filter} type="button" onClick={() => setFilter(value)}>
              {value.charAt(0) + value.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <section className={styles.activityCard} aria-label={`${filter.toLowerCase()} payments`}>
          {filteredPayments.length ? filteredPayments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} onSelect={payment.status === "CONFIRMED" ? onOpenPayment : undefined} />
          )) : (
            <div className={styles.emptyState}>
              <ReceiptText size={24} aria-hidden="true" />
              <strong>No payments here</strong>
              <span>New payments will appear automatically.</span>
            </div>
          )}
        </section>
      </main>
      <BottomNavigation active="payments" onChange={onNavigate} />
    </div>
  );
}

function SettingsScreen({ onNavigate }: { onNavigate: (view: TopLevelView) => void }) {
  return (
    <div className={styles.topLevelScreen}>
      <main className={styles.pageContent}>
        <header className={styles.titleHeader}>
          <div>
            <span>Merchant profile</span>
            <h1>Settings</h1>
          </div>
          <span className={styles.brandMark} aria-hidden="true"><Settings size={18} /></span>
        </header>

        <section className={styles.settingsCard} aria-labelledby="restaurant-settings">
          <h2 id="restaurant-settings">Restaurant</h2>
          <div className={styles.settingRow}><span>Name</span><strong>{merchant.name}</strong></div>
          <div className={styles.settingRow}><span>Venue</span><strong>{merchant.venue}</strong></div>
        </section>

        <section className={styles.settingsCard} aria-labelledby="settlement-settings">
          <h2 id="settlement-settings">Payment setup</h2>
          <div className={styles.settingRow}><span>Settlement wallet</span><strong>7x9m…L2qp</strong></div>
          <div className={styles.settingRow}><span>Network</span><strong>Solana Devnet</strong></div>
          <div className={styles.settingRow}><span>Settlement asset</span><strong>EURC</strong></div>
        </section>

        <aside className={styles.connectionCard}>
          <WifiOff size={19} aria-hidden="true" />
          <div><strong>Preview data only</strong><span>No wallet or backend is connected.</span></div>
        </aside>
        <p className={styles.versionLabel}>Merchant Payments · Preview 0.1.0</p>
      </main>
      <BottomNavigation active="settings" onChange={onNavigate} />
    </div>
  );
}

export function MerchantApp() {
  const [view, setView] = useState<View>("home");
  const [amountDraft, setAmountDraft] = useState("");
  const [note, setNote] = useState("");
  const [request, setRequest] = useState<PreviewRequest | null>(null);
  const [receipt, setReceipt] = useState<PaymentSummary | null>(null);

  const navigate = (nextView: TopLevelView) => {
    setView(nextView);
  };

  const startPayment = () => {
    setAmountDraft("");
    setNote("");
    setRequest(null);
    setView("amount");
  };

  const createPreviewRequest = () => {
    const amountCents = amountDraftToCents(amountDraft);
    if (!amountCents) return;

    setRequest({
      id: "pay_fixture_abc123",
      amountCents,
      note: note.trim() || undefined,
    });
    setView("request");
  };

  const openFixtureReceipt = (payment: PaymentSummary) => {
    if (payment.status !== "CONFIRMED") return;
    setReceipt(payment);
    setView("receipt");
  };

  const previewConfirmedRequest = () => {
    if (!request) return;
    setReceipt({
      id: request.id,
      merchantName: merchant.name,
      amountCents: request.amountCents,
      displayCurrency: "EUR",
      settlementAsset: "EURC",
      status: "CONFIRMED",
      createdAt: "Today, 11:42",
      note: request.note,
    });
    setView("receipt");
  };

  return (
    <div className={styles.viewport}>
      <div className={styles.appShell}>
        {view === "home" ? <Dashboard onNewPayment={startPayment} onNavigate={navigate} onOpenPayment={openFixtureReceipt} /> : null}
        {view === "payments" ? <PaymentsScreen onNavigate={navigate} onOpenPayment={openFixtureReceipt} /> : null}
        {view === "settings" ? <SettingsScreen onNavigate={navigate} /> : null}
        {view === "amount" ? (
          <AmountEntry
            amountDraft={amountDraft}
            note={note}
            onAmountKey={(key) => setAmountDraft((current) => appendAmountKey(current, key))}
            onNoteChange={setNote}
            onBack={() => setView("home")}
            onRequest={createPreviewRequest}
          />
        ) : null}
        {view === "request" && request ? (
          <RequestScreen
            request={request}
            onBack={() => setView("amount")}
            onCancel={() => setView("home")}
            onPreviewConfirmed={previewConfirmedRequest}
          />
        ) : null}
        {view === "receipt" && receipt ? <ReceiptScreen payment={receipt} onDone={() => setView("home")} /> : null}
      </div>
    </div>
  );
}
