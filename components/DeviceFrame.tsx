import type { ReactNode } from "react";

export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[32px] border border-border bg-black/90 p-4 shadow-card">
      <div className="rounded-[24px] bg-surface p-4 text-ink">{children}</div>
    </div>
  );
}
