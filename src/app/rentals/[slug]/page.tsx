import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getActiveListingBySlug } from "@/lib/listing-data";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getActiveListingBySlug(slug);
  if (!listing) notFound();

  return (
    <><SiteHeader /><main className="page-shell"><div className="container detail-grid">
      <div className={`detail-gallery ${listing.imageUrls.length === 0 ? "detail-gallery-empty" : ""}`}>
        {listing.imageUrls.length > 0
          ? listing.imageUrls.map((url, index) => <img key={url} src={url} alt={`${listing.title} — תמונה ${index + 1}`} />)
          : <span aria-hidden="true">⌂</span>}
      </div>
      <article className="detail-card">
        <p className="eyebrow">{listing.locality} · להשכרה</p><h1 className="detail-title">{listing.title}</h1>
        <p className="detail-price">₪{listing.price.toLocaleString("he-IL")} לחודש</p>
        <div className="detail-facts"><span>{listing.rooms} חדרים</span><span>{listing.builtArea} מ״ר</span><span>כניסה {new Date(listing.availableFrom).toLocaleDateString("he-IL")}</span></div>
        <p>{listing.description}</p>
        <a className="button button-primary" href={`tel:${listing.contactPhone}`}>יצירת קשר עם {listing.contactName}</a>
      </article>
    </div></main></>
  );
}
