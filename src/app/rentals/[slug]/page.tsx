import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { demoListings } from "@/data/demo-listings";

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = demoListings.find((item) => item.slug === slug);
  if (!listing) notFound();
  return <><SiteHeader /><main className="page-shell"><div className="container detail-grid"><div className="detail-visual"><span aria-hidden="true">⌂</span></div><article className="detail-card"><p className="eyebrow">{listing.locality} · להשכרה</p><h1 className="detail-title">{listing.title}</h1><p className="detail-price">₪{listing.price.toLocaleString("he-IL")} לחודש</p><div className="detail-facts"><span>{listing.rooms} חדרים</span><span>{listing.builtArea} מ״ר</span><span>כניסה {new Date(listing.availableFrom).toLocaleDateString("he-IL")}</span></div><p>מודעת הדגמה לצורך בניית הפיילוט. לאחר חיבור Supabase יוצגו כאן התיאור, התמונות ופרטי המפרסם שהוזנו במערכת.</p><a className="button button-primary" href="/alerts">הנכס לא מתאים? צרו התראה</a></article></div></main></>;
}
