import Link from "next/link";
import type { ListingSummary } from "@/lib/listings";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";

export function HomePage({ listings }: { listings: ListingSummary[] }) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">לוח השכירויות המקומי של בנימין</p>
              <h1>מוצאים בית להשכרה בבנימין</h1>
              <p className="hero-copy">דירות ובתים אמיתיים מהיישובים באזור, עם פרטים ברורים ופנייה ישירה למפרסם. בלי ללכת לאיבוד בין עשרות קבוצות.</p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/rentals">לצפייה בדירות</Link>
                <Link className="button button-secondary" href="/publish">פרסום מודעה בחינם</Link>
              </div>
              <div className="trust-list" aria-label="יתרונות השירות">
                <span>פרסום ללא הרשמה</span><span>מודעות מאושרות</span><span>פנייה ישירה</span>
              </div>
            </div>
            <div className="hero-panel">
              <div className="panel-orbit orbit-one" /><div className="panel-orbit orbit-two" />
              <div className="panel-house" aria-hidden="true">⌂</div>
              <p>שילה · עפרה · עלי · טלמון · כפר אדומים וכל יישובי המועצה</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">מודעות חדשות</p><h2>בתים שמחכים לדיירים</h2></div>
              <Link href="/rentals">לכל הדירות ←</Link>
            </div>
            <div className="listing-grid">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>
          </div>
        </section>
        <section className="section">
          <div className="container split-cta">
            <div>
              <p className="eyebrow">יש לכם נכס פנוי?</p>
              <h2>מפרסמים פעם אחת ומגיעים למחפשים באזור</h2>
              <p>טופס קצר, תמונות, בדיקה מהירה וקישור אישי לעדכון המודעה.</p>
              <Link className="button button-primary" href="/publish">פרסום מודעה בחינם</Link>
            </div>
            <div className="alert-card">
              <span className="alert-icon" aria-hidden="true">✦</span>
              <h3>עדיין לא מצאתם?</h3>
              <p>ספרו לנו מה אתם מחפשים ונעדכן אתכם כשעולה נכס מתאים.</p>
              <Link className="text-link" href="/alerts">יצירת התראת חיפוש ←</Link>
            </div>
          </div>
        </section>
      </main>
      <footer><div className="container footer-row"><strong>לגור בבנימין</strong><span>פיילוט שכירויות מקומי · 2026</span></div></footer>
    </>
  );
}
