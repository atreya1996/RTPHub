import type { ReactNode } from "react";

export default function Tabs({ children }: { children: ReactNode }) {
  return <div className="rounded-card border border-border bg-surface p-1">{children}</div>;
}
