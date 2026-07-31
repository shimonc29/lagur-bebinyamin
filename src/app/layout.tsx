import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "לגור בבנימין | דירות ובתים להשכרה", template: "%s | לגור בבנימין" },
  description: "לוח השכירויות המקומי של בנימין: דירות ובתים להשכרה, פרסום מודעה בחינם והתראות על נכסים חדשים.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="he" dir="rtl"><body>{children}<Analytics /></body></html>;
}
