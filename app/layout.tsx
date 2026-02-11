import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Payments Demo Hub",
  description: "Pack-driven payments demo hub"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg font-sans text-ink">{children}</body>
    </html>
  );
}
