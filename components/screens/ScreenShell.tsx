import type { ReactNode } from "react";

export default function ScreenShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[420px] flex-1 flex-col gap-phone">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="rounded-card border border-border bg-white p-4 shadow-card">{children}</div>
      <div className="mt-auto h-6" aria-hidden="true" />
    </div>
  );
}
