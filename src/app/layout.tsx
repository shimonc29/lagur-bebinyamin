import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "׳׳’׳•׳¨ ׳‘׳‘׳ ׳™׳׳™׳ | ׳“׳™׳¨׳•׳× ׳•׳‘׳×׳™׳ ׳׳”׳©׳›׳¨׳”", template: "%s | ׳׳’׳•׳¨ ׳‘׳‘׳ ׳™׳׳™׳" },
  description: "׳׳•׳— ׳”׳©׳›׳™׳¨׳•׳™׳•׳× ׳”׳׳§׳•׳׳™ ׳©׳ ׳‘׳ ׳™׳׳™׳: ׳“׳™׳¨׳•׳× ׳•׳‘׳×׳™׳ ׳׳”׳©׳›׳¨׳”, ׳₪׳¨׳¡׳•׳ ׳׳•׳“׳¢׳” ׳‘׳—׳™׳ ׳ ׳•׳”׳×׳¨׳׳•׳× ׳¢׳ ׳ ׳›׳¡׳™׳ ׳—׳“׳©׳™׳.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="he" dir="rtl"><body>{children}<Analytics /></body></html>;
}
