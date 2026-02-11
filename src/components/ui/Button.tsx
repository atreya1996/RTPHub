import type { ButtonHTMLAttributes } from "react";

export default function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-2xl bg-[var(--epf-primary,#0F4FA8)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--epf-primary,#0F4FA8)] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}
