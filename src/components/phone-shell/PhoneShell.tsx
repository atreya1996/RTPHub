import type { ReactNode } from "react";

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[34px] border-8 border-slate-900 bg-[#f7f9fd] shadow-2xl">
      <div className="h-7 bg-slate-900" />
      <div className="min-h-[740px] bg-[#f7f9fd]">{children}</div>
    </div>
  );
}
