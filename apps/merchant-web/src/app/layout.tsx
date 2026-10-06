import type { Metadata } from "next";
import "@merchant-payments/ui-tokens/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merchant Payments",
  description: "Request and track restaurant payments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
