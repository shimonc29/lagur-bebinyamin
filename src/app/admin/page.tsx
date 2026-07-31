import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = { title: "ניהול מודעות", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <main className="page-shell"><div className="container"><p className="eyebrow">אזור מנהל</p><h1 className="page-title">אישור וניהול מודעות</h1><p className="page-intro">ממשק פיילוט בסיסי. לפני העלייה לאוויר נחליף את מפתח הניהול בכניסה מאובטחת של Supabase Auth.</p><AdminPanel /></div></main>;
}
