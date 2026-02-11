import type { ReactNode } from "react";

export default function Sheet({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/30 p-4">
      <div className="w-full rounded-t-3xl bg-white p-4 shadow-2xl">{children}</div>
    </div>
  );
}
