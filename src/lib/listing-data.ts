import { createSupabaseAdmin } from "@/lib/supabase-admin";
import type { ListingSummary } from "@/lib/listings";

type ListingRow = {
  id: string;
  slug: string;
  title: string;
  locality: string;
  property_type: ListingSummary["propertyType"];
  rooms: number;
  price: number;
  built_area: number;
  available_from: string;
  status: ListingSummary["status"];
};

function toListingSummary(row: ListingRow): ListingSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    locality: row.locality,
    propertyType: row.property_type,
    rooms: Number(row.rooms),
    price: row.price,
    builtArea: row.built_area,
    availableFrom: row.available_from,
    status: row.status,
    featured: false,
  };
}

export async function getActiveListings(limit = 100): Promise<ListingSummary[]> {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("listings")
      .select("id,slug,title,locality,property_type,rooms,price,built_area,available_from,status")
      .eq("status", "active")
      .order("approved_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return (data as ListingRow[]).map(toListingSummary);
  } catch {
    return [];
  }
}

export async function getActiveListingBySlug(slug: string) {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("listings")
      .select("id,slug,title,locality,property_type,rooms,price,built_area,available_from,status,description,contact_name,contact_phone")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) return null;
    return {
      ...toListingSummary(data as ListingRow),
      description: data.description as string,
      contactName: data.contact_name as string,
      contactPhone: data.contact_phone as string,
    };
  } catch {
    return null;
  }
}
