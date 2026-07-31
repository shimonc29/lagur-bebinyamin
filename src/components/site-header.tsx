import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand" href="/" aria-label="לגור בבנימין — דף הבית">
          <span className="brand-mark" aria-hidden="true">לב</span>
          <span>לגור בבנימין<small>השכירות המקומית, במקום אחד</small></span>
        </Link>
        <nav aria-label="ניווט ראשי">
          <Link href="/rentals">דירות להשכרה</Link>
          <Link href="/alerts">התראות</Link>
          <Link className="nav-cta" href="/publish">פרסום מודעה</Link>
        </nav>
      </div>
    </header>
  );
}
