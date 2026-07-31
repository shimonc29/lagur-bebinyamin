import { HomePage } from "@/components/home-page";
import { getActiveListings } from "@/lib/listing-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listings = await getActiveListings(6);
  return <HomePage listings={listings} />;
}
