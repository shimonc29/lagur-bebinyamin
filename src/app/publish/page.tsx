import type { Metadata } from "next";
import { PublishForm } from "@/components/publish-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "פרסום מודעה בחינם" };

export default function PublishPage() {
  return <><SiteHeader /><main className="page-shell"><div className="container narrow"><p className="eyebrow">בלי הרשמה ובלי סיסמה</p><h1 className="page-title">פרסום נכס להשכרה</h1><p className="page-intro">ממלאים את הפרטים, אנחנו בודקים, והמודעה עולה ללוח לאחר אישור.</p><PublishForm /></div></main></>;
}
