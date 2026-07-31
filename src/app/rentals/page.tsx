import type { Metadata } from "next";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import { getActiveListings } from "@/lib/listing-data";

export const metadata: Metadata = { title: "דירות ובתים להשכרה" };
export const dynamic = "force-dynamic";

export default async function RentalsPage() {
  const listings = await getActiveListings();

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <div className="container">
          <p className="eyebrow">המודעות האחרונות</p>
          <h1 className="page-title">דירות ובתים להשכרה בבנימין</h1>
          {listings.length > 0 ? (
            <div className="listing-grid">
              {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          ) : (
            <p>עדיין אין מודעות מאושרות. אפשר להיות הראשונים שמפרסמים נכס.</p>
          )}
        </div>
      </main>
    </>
  );
}
