import type { ReactNode } from "react";

export default function ExplainPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-card border border-border bg-surface p-6 shadow-card">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-2 text-sm text-ink/80">{children}</div>
    </aside>
  );
}
