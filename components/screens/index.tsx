import ScreenShell from "./ScreenShell";
import { useMemo, useState } from "react";
import type { ResolvedContext } from "../../lib/schema/types";
import { formatMoney } from "../../lib/runtime/formatMoney";

export type ScreenProps = {
  context: ResolvedContext;
  onAction: (event: string) => void;
  props?: Record<string, unknown>;
};

type BottomMenuKey = "home" | "bills" | "scan" | "wallet" | "profile";
type BillCategory = "electricity" | "mobile" | "government" | "rfid";

type BillItem = {
  id: string;
  label: string;
  helper: string;
  amount: number;
  category: BillCategory;
};

function MenuIcon({ path, active }: { path: string; active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? "1.3" : "1.8"}
      aria-hidden="true"
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BillCategoryIcon({ category }: { category: BillCategory }) {
  const iconPathByCategory: Record<BillCategory, string> = {
    electricity: "M13 2 5 14h6l-1 8 9-12h-6l1-8Z",
    mobile: "M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 15h.01",
    government: "M3 10h18M5 10V8l7-4 7 4v2M6 10v7m4-7v7m4-7v7m4-7v7M4 17h16",
    rfid: "M5 13h14l-1.5-4h-11L5 13Zm2 0v3m10-3v3M8 9l1-2h6l1 2"
  };

  return (
    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-button border border-border bg-primarySoft text-primaryStrong">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d={iconPathByCategory[category]} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function BillListItem({ item, dense = false }: { item: BillItem; dense?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-card border border-border bg-surface ${dense ? "px-2.5 py-2" : "px-3 py-2.5"}`}>
      <BillCategoryIcon category={item.category} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{item.label}</div>
        <div className="truncate text-xs text-ink/65">{item.helper}</div>
      </div>
      <div className="shrink-0 pl-2 text-xs font-semibold text-ink/80">{item.amount.toFixed(2)}</div>
    </div>
  );
}

function isPhilippinesLocale(locale: string): boolean {
  return locale.trim().toUpperCase().endsWith("-PH") || locale.trim().toUpperCase() === "PH";
}

function getBillItems(locale: string): BillItem[] {
  const rfidLabel = isPhilippinesLocale(locale) ? "Auto Sweep" : "RFID";
  return [
    {
      id: "biller_tng_electricity",
      label: "TNG Electricity Bill",
      helper: "Electricity • Due in 2 days",
      amount: 182.3,
      category: "electricity"
    },
    {
      id: "biller_celcomdigi_postpaid",
      label: "CelcomDigi Postpaid",
      helper: "Mobile postpaid • Due tomorrow",
      amount: 96,
      category: "mobile"
    },
    {
      id: "biller_mobile_prepaid_topup",
      label: "Mobile Prepaid Top-up",
      helper: "Mobile prepaid • Quick reload",
      amount: 30,
      category: "mobile"
    },
    {
      id: "biller_land_tax",
      label: "Land Tax",
      helper: "Government dues • Annual",
      amount: 220,
      category: "government"
    },
    {
      id: "biller_rfid_reload",
      label: `${rfidLabel} Balance Reload`,
      helper: `${rfidLabel} toll tag • Low balance`,
      amount: 50,
      category: "rfid"
    }
  ];
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
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-button px-1 py-2 text-[11px] font-medium transition ${
              isActive ? "bg-primary text-white shadow-[var(--shadow-interactive)]" : "text-primaryStrong"
            }`}
          >
            <MenuIcon path={item.path} active={isActive} />
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
        <div className="h-32 w-32 rounded-card border border-dashed border-border" />
        <button
          className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]"
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
        <div className="text-2xl font-semibold tracking-tight text-ink">{formatMoney(12.5, context.currency, context.locale)}</div>
        <div className="flex flex-wrap gap-2">
          {suggested.map((amount) => (
            <span key={amount} className="pill-chip">
              {formatMoney(amount, context.currency, context.locale)}
            </span>
          ))}
        </div>
        <button
          className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]"
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("PAY")}>
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
        <span className="pill-chip border-none bg-accentLime/30 text-ink">In flight</span>
      </div>
    </ScreenShell>
  );
}

export function PaymentResult({ onAction, props, context }: ScreenProps) {
  const status = typeof props?.status === "string" ? props.status : "SUCCESS";
  const retry = props?.retry as boolean | undefined;
  return (
    <ScreenShell title="Payment Result">
      <div className="space-y-3 text-sm">
        <div className="text-lg font-semibold">{status}</div>
        <div>{formatMoney(18, context.currency, context.locale)} • {context.merchant?.name ?? "Merchant"}</div>
        <div className="flex gap-2">
          {retry ? (
            <button className="min-h-11 rounded-button border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink" onClick={() => onAction("RETRY")}>
              Retry
            </button>
          ) : null}
          <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("DONE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("CONTINUE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("CONTINUE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("DONE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("DONE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("CONTINUE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("DONE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("PAY")}>
          Pay request
        </button>
      </div>
    </ScreenShell>
  );
}

export function BillBoxHome({ onAction, context }: ScreenProps) {
  const bills = getBillItems(context.locale);
  return (
    <ScreenShell title="BillBox Home" bottomNav={<BottomNavigation active="bills" />}>
      <div className="space-y-3 text-sm">
        <div>{bills.length} bills due this week.</div>
        <div className="space-y-2">
          {bills.map((item) => (
            <BillListItem key={item.id} item={item} />
          ))}
        </div>
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("OPEN_BILL")}
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("PAY")}>
          Pay bill
        </button>
      </div>
    </ScreenShell>
  );
}

export function PayAllBills({ onAction, context }: ScreenProps) {
  const bills = getBillItems(context.locale).slice(0, 4);
  return (
    <ScreenShell title="Pay All Bills" bottomNav={<BottomNavigation active="scan" />}>
      <div className="space-y-3 text-sm">
        <div>{bills.length} bills selected for payment.</div>
        <div className="space-y-1.5">
          {bills.map((item) => (
            <BillListItem key={item.id} item={item} dense />
          ))}
        </div>
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("PAY_ALL")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("DONE")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("DONE")}>
          Done
        </button>
      </div>
    </ScreenShell>
  );
}

export function ChatAgent({ onAction }: ScreenProps) {
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const canSend = draft.trim().length > 0 && !isLoading;
  const composerStateLabel = useMemo(() => {
    if (isLoading) return "Disabled/loading";
    if (selectedAttachment) return "Attachment selected";
    if (draft.trim().length > 0) return "Typing";
    return "Empty";
  }, [draft, isLoading, selectedAttachment]);

  const attachmentOptions = [
    { id: "camera", label: "Take photo" },
    { id: "gallery", label: "Choose from gallery" },
    { id: "file", label: "Upload file/document" }
  ];

  function handleAttachmentSelect(label: string) {
    setSelectedAttachment(label);
    setShowAttachmentOptions(false);
  }

  function handleSend() {
    if (!canSend) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDraft("");
      setSelectedAttachment(null);
      onAction("CONFIRM");
    }, 900);
  }

  return (
    <ScreenShell title="Agentic Chat" bottomNav={<BottomNavigation active="home" />}>
      <div className="flex h-[440px] min-h-0 flex-col rounded-[1rem] border border-border/80 bg-surface/40 text-sm">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Bills Assistant</p>
            <p className="text-xs text-ink/60">Connected to JomPay</p>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-ink/70">Online</span>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4">
          <div className="flex justify-start">
            <div className="max-w-[82%] rounded-2xl rounded-tl-md border border-[#b8e5d8] bg-[#e7fff7] px-3 py-2 text-ink">
              Hi! I can pay bills, parse invoices, and remind you before due dates.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-primary px-3 py-2 text-white">
              Help me settle my electricity and mobile bills this week.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[82%] rounded-2xl rounded-tl-md border border-[#b8e5d8] bg-[#e7fff7] px-3 py-2 text-ink">
              Sure — upload your invoice or pick an action below.
            </div>
          </div>
        </div>

        <div className="border-t border-border/80 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="mb-3 flex flex-wrap gap-2">
            <button className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-ink/70" onClick={() => onAction("UPLOAD")}>
              Upload bill
            </button>
            <button className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-ink/70" onClick={() => setDraft("Summarize my due bills")}>
              Summarize dues
            </button>
            <button className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-ink/70" onClick={() => onAction("CONFIRM")}>
              Confirm payment
            </button>
          </div>

          {selectedAttachment ? (
            <div className="mb-2 rounded-card border border-border bg-surface bg-white px-3 py-2 text-xs text-ink/70">Attached: {selectedAttachment}</div>
          ) : null}

          {showAttachmentOptions ? (
            <div className="mb-2 rounded-card border border-border bg-surface bg-white p-2 shadow-sm">
              {attachmentOptions.map((option) => (
                <button
                  key={option.id}
                  className="flex w-full items-center justify-start rounded-lg px-2 py-2 text-left text-xs text-ink/80 hover:bg-surface"
                  aria-label={option.label}
                  onClick={() => handleAttachmentSelect(option.label)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink"
              aria-label="Add attachment"
              onClick={() => setShowAttachmentOptions((value) => !value)}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Message Bills Assistant..."
              aria-label="Message Bills Assistant"
              disabled={isLoading}
              className="h-10 flex-1 rounded-full border border-border bg-white px-3 text-xs text-ink outline-none placeholder:text-ink/50 focus:ring-2 focus:ring-primary/30 disabled:opacity-70"
            />
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white ${
                canSend ? "bg-primary" : "bg-primary/40"
              }`}
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 12 14-7-4 7 4 7-14-7Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mt-2 px-1 text-[11px] text-ink/55">Composer state: {composerStateLabel}</p>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("EXTRACT")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("CONFIRM")}>
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
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("PAY")}>
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
