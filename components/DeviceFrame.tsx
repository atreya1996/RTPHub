import type { ReactNode } from "react";

export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[32px] border border-border bg-[#031310] p-4 shadow-card">
      <div className="flex min-h-[640px] flex-col rounded-[24px] bg-surface px-4 pt-phone pb-safe text-ink">{children}</div>
    </div>
  );
}
