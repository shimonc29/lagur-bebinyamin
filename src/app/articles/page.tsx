import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "כתבות ומדריכים" };

export default function ArticlesPage() {
  return (
    <><SiteHeader /><main className="page-shell"><div className="container narrow">
      <p className="eyebrow">להכיר את בנימין</p><h1 className="page-title">כתבות ומדריכים</h1>
      <p className="page-intro">בקרוב יעלו כאן מדריכים לשוכרים ולמשכירים, סיפורים מהיישובים ומידע שימושי על החיים בבנימין.</p>
      <div className="form-card"><h2>אזור הכתבות בהקמה</h2><p>בשלב הבא נחבר אותו לממשק האדמין, כדי שתוכל לפרסם ולערוך כתבות בעצמך.</p><Link className="button button-primary" href="/rentals">ללוח השכירויות</Link></div>
    </div></main></>
  );
}
