import { HomePage } from "@/components/home-page";
import { demoListings } from "@/data/demo-listings";

export default function Home() {
  return <HomePage listings={demoListings} />;
}
