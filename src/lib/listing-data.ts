import { createSupabaseAdmin } from "@/lib/supabase-admin";
import type { ListingSummary } from "@/lib/listings";

type ListingImageRow = { storage_path: string; position: number };
type ListingRow = {
  id: string; slug: string; title: string; locality: string;
  property_type: ListingSummary["propertyType"];
  rooms: number; price: number; built_area: number; available_from: string;
  status: ListingSummary["status"]; listing_images?: ListingImageRow[];
};

function publicImageUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return undefined;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/listing-images/${encodedPath}`;
}

function sortedImageUrls(row: ListingRow) {
  return [...(row.listing_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((image) => publicImageUrl(image.storage_path))
    .filter((url): url is string => Boolean(url));
}

function toListingSummary(row: ListingRow): ListingSummary {
  return {
    id: row.id, slug: row.slug, title: row.title, locality: row.locality,
    propertyType: row.property_type, rooms: Number(row.rooms), price: row.price,
    builtArea: row.built_area, availableFrom: row.available_from,
    status: row.status, featured: false, imageUrl: sortedImageUrls(row)[0],
  };
}

const publicListingFields = "id,slug,title,locality,property_type,rooms,price,built_area,available_from,status,listing_images(storage_path,position)";

export async function getActiveListings(limit = 100): Promise<ListingSummary[]> {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("listings").select(publicListingFields)
      .eq("status", "active").order("approved_at", { ascending: false, nullsFirst: false }).limit(limit);
    if (error) throw error;
    return (data as unknown as ListingRow[]).map(toListingSummary);
  } catch { return []; }
}

export async function getActiveListingBySlug(slug: string) {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("listings")
      .select(`${publicListingFields},description,contact_name,contact_phone`)
      .eq("slug", slug).eq("status", "active").maybeSingle();
    if (error || !data) return null;
    const row = data as unknown as ListingRow & { description: string; contact_name: string; contact_phone: string };
    return {
      ...toListingSummary(row), description: row.description,
      contactName: row.contact_name, contactPhone: row.contact_phone,
      imageUrls: sortedImageUrls(row),
    };
  } catch { return null; }
}
