import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = { title: "ניהול המערכת", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main className="page-shell">
      <div className="container">
        <p className="eyebrow">אזור מנהל</p>
        <h1 className="page-title">מודעות ולידים</h1>
        <p className="page-intro">אישור מודעות, צפייה בפרטי המפרסמים וניהול בקשות ההתראה שנשלחו באתר.</p>
        <AdminPanel />
      </div>
    </main>
  );
}
