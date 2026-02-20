import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; children: ReactNode };

export default function Button({ className = "", loading, disabled, children, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`w-full min-h-11 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)] transition hover:-translate-y-[1px] hover:opacity-95 active:translate-y-0 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
