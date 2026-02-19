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
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0 text-heading">{title}</div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="surface-card p-4">{children}</div>
      </div>
      {bottomNav ? (
        <div className="shrink-0 rounded-card border border-border bg-primarySoft px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-card">
          {bottomNav}
        </div>
      ) : (
        <div className="h-4 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
