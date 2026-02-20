import type { UseCase } from "../lib/schema/types";

const tileMeta: Record<string, { proves: string; value: string }> = {
  static_qr: { proves: "Fast merchant-presented scan to pay", value: "Drives QR acceptance and low-cost acquiring" },
  dynamic_qr: { proves: "Invoice-aware checkout with offer injection", value: "Improves conversion with contextual promos" },
  loyalty_combo: { proves: "Rewards redemption + earn in one checkout", value: "Increases retention and spend frequency" },
  billbox: { proves: "Unified inbox-driven bill payment", value: "Raises bill-pay MAU and fee revenue" },
  pay_all: { proves: "Bulk settlement with one confirmation", value: "Boosts throughput for heavy billers" },
  agentic: { proves: "Conversational payment orchestration", value: "Differentiates digital assistant capabilities" }
};

export default function HubTile({ usecase, active, onSelect }: { usecase: UseCase; active: boolean; onSelect: () => void }) {
  const meta = tileMeta[usecase.id] ?? { proves: usecase.description, value: "Reusable payments journey blueprint" };
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`surface-card flex w-full flex-col gap-2 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active ? "border-primary bg-primarySoft/60" : "hover:border-primary/45"
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-primaryStrong/80">{usecase.icon.replaceAll("_", " ")}</span>
      <span className="text-heading">{usecase.title}</span>
      <span className="text-xs leading-5 text-ink/70">{meta.proves}</span>
      <span className="text-xs leading-5 text-primaryStrong/90">{meta.value}</span>
    </button>
  );
}
