import type { HTMLAttributes } from "react";

export default function Divider({ className = "", ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={`border-0 border-t border-border ${className}`} />;
}
