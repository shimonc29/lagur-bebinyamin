import Link from "next/link";
import type { ListingSummary } from "@/lib/listings";

const formatter = new Intl.NumberFormat("he-IL");

export function ListingCard({ listing }: { listing: ListingSummary }) {
  return (
    <article className="listing-card">
      <Link className="listing-visual" href={`/rentals/${listing.slug}`} aria-label={listing.title}>
        <span className="listing-badge">להשכרה</span>
        <span className="visual-mark" aria-hidden="true">⌂</span>
      </Link>
      <div className="listing-content">
        <p className="listing-price">₪{formatter.format(listing.price)}<span> לחודש</span></p>
        <h3><Link href={`/rentals/${listing.slug}`}>{listing.title}</Link></h3>
        <div className="listing-facts">
          <span>{listing.rooms} חדרים</span>
          <span>{listing.builtArea} מ״ר</span>
          <span>כניסה {new Date(listing.availableFrom).toLocaleDateString("he-IL")}</span>
        </div>
      </div>
    </article>
  );
}
