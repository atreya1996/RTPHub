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
      <div className="text-heading">{title}</div>
      <div className="surface-card p-4">{children}</div>
      {bottomNav ? (
        <div className="mt-auto rounded-card border border-border bg-primarySoft px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-card">
          {bottomNav}
        </div>
      ) : (
        <div className="mt-auto h-6" aria-hidden="true" />
      )}
    </div>
  );
}
