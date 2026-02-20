import type { ReactNode } from "react";
import PhoneShell from "@/components/phone-shell/PhoneShell";

const DEVICE_VIEWPORT_WIDTH = 430;
const DEVICE_VIEWPORT_HEIGHT = 932;

export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <PhoneShell>
      <div
        className="relative overflow-hidden rounded-[28px] border border-[#2a3a36] bg-[#020705]"
        style={{
          aspectRatio: `${DEVICE_VIEWPORT_WIDTH} / ${DEVICE_VIEWPORT_HEIGHT}`
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-8 w-36 -translate-x-1/2 rounded-full bg-black/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
        <div className="absolute inset-[10px] overflow-hidden rounded-[26px] bg-surface shadow-[inset_0_0_0_1px_rgba(11,47,43,0.08)]">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/8 to-transparent" aria-hidden="true" />
          <div className="flex h-full min-h-0 flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(2.85rem,env(safe-area-inset-top))] text-ink">
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            <div className="pointer-events-none mx-auto mt-3 h-1.5 w-32 rounded-full bg-ink/20" aria-hidden="true" />
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
