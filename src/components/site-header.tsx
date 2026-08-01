"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand" href="/" aria-label="לגור בבנימין — דף הבית" onClick={close}>
          <span className="brand-mark" aria-hidden="true">לב</span>
          <span>לגור בבנימין<small>השכירות המקומית, במקום אחד</small></span>
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span /><span /><span />
        </button>
        <nav id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="ניווט ראשי">
          <Link href="/rentals" onClick={close}>דירות להשכרה</Link>
          <Link href="/articles" onClick={close}>כתבות</Link>
          <Link href="/alerts" onClick={close}>התראות</Link>
          <Link className="nav-cta" href="/publish" onClick={close}>פרסום מודעה</Link>
        </nav>
      </div>
    </header>
  );
}
