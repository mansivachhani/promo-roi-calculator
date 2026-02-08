import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "iGaming PO Starter",
  description: "A simple Next.js starter for product-focused demos."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
