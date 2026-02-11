import type { UseCase } from "../lib/schema/types";

export default function HubTile({ usecase, active, onSelect }: { usecase: UseCase; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-2 rounded-card border px-4 py-3 text-left shadow-card transition ${
        active ? "border-primary bg-white" : "border-border bg-surface"
      }`}
    >
      <span className="text-xs uppercase text-ink/50">{usecase.icon}</span>
      <span className="text-sm font-semibold text-ink">{usecase.title}</span>
      <span className="text-xs text-ink/60">{usecase.description}</span>
    </button>
  );
}
