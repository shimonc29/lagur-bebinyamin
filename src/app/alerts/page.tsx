import type { Metadata } from "next";
import { AlertForm } from "@/components/alert-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "התראת חיפוש" };

export default function AlertsPage() {
  return <><SiteHeader /><main className="page-shell"><div className="container narrow"><p className="eyebrow">אנחנו נחפש בשבילכם</p><h1 className="page-title">ספרו לנו איזה בית אתם מחפשים</h1><p className="page-intro">כשיעלה נכס שמתאים לתקציב וליישובים שבחרתם, נוכל לעדכן אתכם.</p><AlertForm /></div></main></>;
}
