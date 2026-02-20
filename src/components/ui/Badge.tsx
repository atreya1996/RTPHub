import type { HTMLAttributes } from "react";

export default function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={`inline-flex items-center rounded-full border border-border bg-primarySoft px-2.5 py-1 text-[11px] font-semibold text-primaryStrong ${className}`} />;
}
