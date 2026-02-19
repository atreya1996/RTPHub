import type { ReactNode } from "react";

export default function ExplainPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="surface-card p-6">
      <h2 className="text-heading">{title}</h2>
      <div className="mt-3 space-y-2 text-body">{children}</div>
    </aside>
  );
}
