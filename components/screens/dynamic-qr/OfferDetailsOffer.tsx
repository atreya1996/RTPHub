import ScreenShell from "../ScreenShell";

export default function OfferDetailsOffer({ onAction }: { onAction: (event: string) => void }) {
  return (
    <ScreenShell title="Offer Details">
      <div className="space-y-3 text-sm">
        <div className="rounded-card border border-border bg-surface px-3 py-2.5">
          <div className="font-medium text-ink">Offer applied</div>
          <div className="text-xs text-ink/65">Enjoy partner-exclusive savings for this invoice payment.</div>
        </div>
        <button className="min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)]" onClick={() => onAction("OFFERS_ACCEPTED")}>
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}
