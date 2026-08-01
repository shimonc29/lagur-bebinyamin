import Link from "next/link";
import type { ListingSummary } from "@/lib/listings";

const formatter = new Intl.NumberFormat("he-IL");

export function ListingCard({ listing }: { listing: ListingSummary }) {
  return (
    <article className="listing-card">
      <Link className="listing-visual" href={`/rentals/${listing.slug}`} aria-label={listing.title}>
        {listing.imageUrl ? <img src={listing.imageUrl} alt={listing.title} loading="lazy" /> : <span className="visual-mark" aria-hidden="true">⌂</span>}
        <span className="listing-badge">להשכרה</span>
      </Link>
      <div className="listing-content">
        <p className="listing-price">₪{formatter.format(listing.price)}<span> לחודש</span></p>
        <h3><Link href={`/rentals/${listing.slug}`}>{listing.title}</Link></h3>
        <div className="listing-facts">
          <span>{listing.rooms} חדרים</span>{listing.builtArea && <span>{listing.builtArea} מ״ר</span>}
          {listing.availableFrom && <span>כניסה {new Date(listing.availableFrom).toLocaleDateString("he-IL")}</span>}
        </div>
      </div>
    </article>
  );
}
