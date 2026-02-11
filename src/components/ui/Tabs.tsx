import type { ReactNode } from "react";

export default function Tabs({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-1">{children}</div>;
}
