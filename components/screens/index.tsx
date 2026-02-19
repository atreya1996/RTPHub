import ScreenShell from "./ScreenShell";
import type { ResolvedContext } from "../../lib/schema/types";
import { formatMoney } from "../../lib/runtime/formatMoney";

export type ScreenProps = {
  context: ResolvedContext;
  onAction: (event: string) => void;
  props?: Record<string, unknown>;
};

type BottomMenuKey = "home" | "bills" | "scan" | "wallet" | "profile";

function MenuIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MENU_ITEMS: Array<{ key: BottomMenuKey; label: string; path: string }> = [
  { key: "home", label: "Home", path: "M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5Z" },
  { key: "bills", label: "Bills", path: "M7 4h10a2 2 0 0 1 2 2v14l-3-1.5L13 20l-3-1.5L7 20V6a2 2 0 0 1 2-2Z" },
  { key: "scan", label: "Scan/Pay", path: "M8 4H5a1 1 0 0 0-1 1v3m15-4h-3a1 1 0 0 0-1 1v3m4 11v-3a1 1 0 0 0-1-1h-3m-7 4H5a1 1 0 0 1-1-1v-3" },
  { key: "wallet", label: "Wallet", path: "M4 8h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Zm0 0V7a3 3 0 0 1 3-3h9" },
  { key: "profile", label: "Help", path: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-3-6a3 3 0 0 1 6 0m-3-3.5h.01" }
];

function BottomNavigation({ active }: { active: BottomMenuKey }) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {MENU_ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <div
            key={item.key}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium ${
              isActive ? "bg-[#00f5a8] text-[#025a50] shadow-sm" : "text-[#0f6d63]"
            }`}
          >
            <MenuIcon path={item.path} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ScanQR({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Scan QR">
      <div className="flex flex-col items-center gap-3">
        <div className="h-32 w-32 rounded-xl border border-dashed border-border" />
        <button
          className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => onAction("SCANNED")}
        >
          Simulate scan
        </button>
      </div>
    </ScreenShell>
  );
}

export function EnterAmount({ onAction, context, props }: ScreenProps) {
  const suggested = (props?.suggested as number[]) ?? [5, 10, 20];
  return (
    <ScreenShell title="Enter Amount">
      <div className="space-y-3">
        <div className="text-2xl font-semibold text-ink">{formatMoney(12.5, context.currency, context.locale)}</div>
        <div className="flex flex-wrap gap-2">
          {suggested.map((amount) => (
            <span key={amount} className="rounded-button border border-border px-3 py-1 text-xs">
              {formatMoney(amount, context.currency, context.locale)}
            </span>
          ))}
        </div>
        <button
          className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => onAction("AMOUNT_CONFIRMED")}
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

export function ConfirmPay({ onAction, context }: ScreenProps) {
  return (
    <ScreenShell title="Confirm Payment">
      <div className="space-y-3 text-sm">
        <div>Paying {context.merchant?.name ?? "Merchant"}</div>
        <div className="text-lg font-semibold">{formatMoney(18, context.currency, context.locale)}</div>
        <button className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => onAction("PAY")}>
          Pay now
        </button>
      </div>
    </ScreenShell>
  );
}

export function Processing() {
  return (
    <ScreenShell title="Processing">
      <div className="flex items-center justify-between text-sm">
        <span>Contacting network...</span>
        <span className="rounded-full bg-accent1/20 px-2 py-1 text-xs text-ink">In flight</span>
      </div>
    </ScreenShell>
  );
}

export function PaymentResult({ onAction, props, context }: ScreenProps) {
  const status = props?.status ?? "SUCCESS";
  const retry = props?.retry as boolean | undefined;
  return (
    <ScreenShell title="Payment Result">
      <div className="space-y-3 text-sm">
        <div className="text-lg font-semibold">{status}</div>
        <div>{formatMoney(18, context.currency, context.locale)} • {context.merchant?.name ?? "Merchant"}</div>
        <div className="flex gap-2">
          {retry ? (
            <button className="rounded-button border border-border px-3 py-2 text-sm" onClick={() => onAction("RETRY")}>
              Retry
            </button>
          ) : null}
          <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("DONE")}>
            Done
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

export function OfferApplied({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Offer Applied">
      <div className="space-y-3 text-sm">
        <div>Cashback applied: 5% on this payment.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("CONTINUE")}>
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

export function LoyaltySummary({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Loyalty Summary">
      <div className="space-y-3 text-sm">
        <div>Earn 120 points + 1 stamp.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("CONTINUE")}>
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

export function ReserveTimeline({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Reserve Timeline">
      <div className="space-y-3 text-sm">
        <div>Reservation hold placed. Funds will capture at fulfilment.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("DONE")}>
          Done
        </button>
      </div>
    </ScreenShell>
  );
}

export function MultiDebitLedger({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Multi Debit Ledger">
      <div className="space-y-3 text-sm">
        <div>Splitting payment across three instruments.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("DONE")}>
          Done
        </button>
      </div>
    </ScreenShell>
  );
}

export function MandateSetup({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Mandate Setup">
      <div className="space-y-3 text-sm">
        <div>Set up a recurring mandate for monthly bills.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("CONTINUE")}>
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

export function MandateList({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Mandate List">
      <div className="space-y-3 text-sm">
        <div>Upcoming mandates scheduled.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("DONE")}>
          Done
        </button>
      </div>
    </ScreenShell>
  );
}

export function CollectRequestInbox({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Collect Request Inbox">
      <div className="space-y-3 text-sm">
        <div>2 requests waiting for approval.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("PAY")}>
          Pay request
        </button>
      </div>
    </ScreenShell>
  );
}

export function BillBoxHome({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="BillBox Home" bottomNav={<BottomNavigation active="bills" />}>
      <div className="space-y-3 text-sm">
        <div>3 bills due this week.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("OPEN_BILL")}
        >
          Open bill
        </button>
      </div>
    </ScreenShell>
  );
}

export function BillDetails({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Bill Details" bottomNav={<BottomNavigation active="bills" />}>
      <div className="space-y-3 text-sm">
        <div>Amount due today.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("PAY")}>
          Pay bill
        </button>
      </div>
    </ScreenShell>
  );
}

export function PayAllBills({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Pay All Bills" bottomNav={<BottomNavigation active="scan" />}>
      <div className="space-y-3 text-sm">
        <div>2 bills selected for payment.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("PAY_ALL")}>
          Pay all
        </button>
      </div>
    </ScreenShell>
  );
}

export function AutopayRulesBuilder({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Autopay Rules">
      <div className="space-y-3 text-sm">
        <div>Set caps and timing for recurring bills.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("DONE")}>
          Save rules
        </button>
      </div>
    </ScreenShell>
  );
}

export function ExecutionResultsList({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Execution Results">
      <div className="space-y-3 text-sm">
        <div>2 payments succeeded, 1 pending confirmation.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("DONE")}>
          Done
        </button>
      </div>
    </ScreenShell>
  );
}

export function ChatAgent({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Agentic Chat" bottomNav={<BottomNavigation active="home" />}>
      <div className="space-y-3 text-sm">
        <div className="rounded-card border border-border bg-surface p-3">
          Hi! I can pay bills or extract uploaded invoices.
        </div>
        <div className="flex gap-2">
          <button className="rounded-button border border-border px-3 py-2 text-sm" onClick={() => onAction("UPLOAD")}>
            Upload bill
          </button>
          <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("CONFIRM")}>
            Confirm payment
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

export function UploadBill({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Upload Bill" bottomNav={<BottomNavigation active="scan" />}>
      <div className="space-y-3 text-sm">
        <div className="h-24 rounded-card border border-dashed border-border" />
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("EXTRACT")}>
          Extract details
        </button>
      </div>
    </ScreenShell>
  );
}

export function ExtractionPreview({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Extraction Preview" bottomNav={<BottomNavigation active="bills" />}>
      <div className="space-y-3 text-sm">
        <div>Invoice extracted with due date and total.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("CONFIRM")}>
          Confirm
        </button>
      </div>
    </ScreenShell>
  );
}

export function ConfirmPayFromAgent({ onAction }: ScreenProps) {
  return (
    <ScreenShell title="Confirm from Agent" bottomNav={<BottomNavigation active="scan" />}>
      <div className="space-y-3 text-sm">
        <div>Paying recommended bill from agent.</div>
        <button className="rounded-button bg-primary px-3 py-2 text-sm text-white" onClick={() => onAction("PAY")}>
          Pay now
        </button>
      </div>
    </ScreenShell>
  );
}

export const screenRegistry = {
  ScanQR,
  EnterAmount,
  ConfirmPay,
  Processing,
  PaymentResult,
  OfferApplied,
  LoyaltySummary,
  ReserveTimeline,
  MultiDebitLedger,
  MandateSetup,
  MandateList,
  CollectRequestInbox,
  BillBoxHome,
  BillDetails,
  PayAllBills,
  AutopayRulesBuilder,
  ExecutionResultsList,
  ChatAgent,
  UploadBill,
  ExtractionPreview,
  ConfirmPayFromAgent
};
