import type { ReactNode } from "react";

export default function ScreenShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="rounded-card border border-border bg-white p-4 shadow-card">{children}</div>
    </div>
  );
}
