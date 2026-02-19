import type { UseCase } from "../lib/schema/types";

export default function HubTile({ usecase, active, onSelect }: { usecase: UseCase; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`surface-card flex w-full flex-col gap-2 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active ? "border-primary bg-primarySoft/60" : "hover:border-primary/45"
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-primaryStrong/80">{usecase.icon}</span>
      <span className="text-heading">{usecase.title}</span>
      <span className="text-xs leading-5 text-ink/70">{usecase.description}</span>
    </button>
  );
}
