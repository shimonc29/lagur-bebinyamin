import type { Metadata } from "next";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import { demoListings } from "@/data/demo-listings";

export const metadata: Metadata = { title: "דירות ובתים להשכרה" };

export default function RentalsPage() {
  return <><SiteHeader /><main className="page-shell"><div className="container"><p className="eyebrow">המודעות האחרונות</p><h1 className="page-title">דירות ובתים להשכרה בבנימין</h1><div className="listing-grid">{demoListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div></div></main></>;
}
