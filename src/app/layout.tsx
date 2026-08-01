import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const siteUrl = "https://lagur-bebinyamin.vercel.app";
const siteTitle = "לגור בבנימין | דירות ובתים להשכרה";
const siteDescription = "לוח השכירויות המקומי של בנימין: דירות ובתים להשכרה, פרסום מודעה בחינם והתראות על נכסים חדשים.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | לגור בבנימין" },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: "לגור בבנימין",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/hero-image.png", width: 1254, height: 1254, alt: "לגור בבנימין" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/hero-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="he" dir="rtl"><body>{children}<SiteFooter /><Analytics /></body></html>;
}
