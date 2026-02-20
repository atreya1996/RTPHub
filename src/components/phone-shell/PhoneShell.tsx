import type { ReactNode } from "react";

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] rounded-[48px] border border-[#1c2724] bg-[#040a09] p-3 shadow-[0_18px_48px_rgba(4,12,10,0.35)]">
      <div className="rounded-[40px] bg-[#020705] p-2">
        <div className="flex items-center justify-between px-4 pb-2 pt-1 text-[11px] font-medium text-white/80">
          <span>9:41</span>
          <span>5G • 100%</span>
        </div>
        <div className="min-h-[740px]">{children}</div>
      </div>
    </div>
  );
}
