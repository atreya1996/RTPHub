import type { ReactNode } from "react";

export default function ScreenShell({
  title,
  children,
  bottomNav
}: {
  title: string;
  children: ReactNode;
  bottomNav?: ReactNode;
}) {
  return (
    <div className="flex min-h-[420px] flex-1 flex-col gap-phone">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="rounded-card border border-border bg-white p-4 shadow-card">{children}</div>
      {bottomNav ? (
        <div className="mt-auto rounded-[1.25rem] border border-[#8ecfbe] bg-[#d7fff2] px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-card">
          {bottomNav}
        </div>
      ) : (
        <div className="mt-auto h-6" aria-hidden="true" />
      )}
    </div>
  );
}
