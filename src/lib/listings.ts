import { z } from "zod";

export const LOCALITIES = [
  "אדם - גבע בנימין",
  "אחיה",
  "אלון",
  "אש קודש",
  "בית חורון",
  "גבעון החדשה",
  "גבעת אסף",
  "גבעת הראל",
  "גבעת הרואה",
  "גני מודיעין",
  "דולב",
  "חוות ישוב הדעת",
  "חרשה",
  "חשמונאים",
  "טלמון",
  "כוכב השחר",
  "כוכב יעקב",
  "כפר אדומים",
  "כפר האורנים",
  "כרם רעים",
  "מבוא חורון",
  "מגרון",
  "מכמש",
  "מעוז צור",
  "מלאכי השלום",
  "מעלה לבונה",
  "מצפה דני",
  "מצפה חגית",
  "מצפה יריחו",
  "מתתיהו",
  "נווה ארז - כפר חקלאי קהילתי",
  "נוה צוף",
  "נופי פרת",
  "נחליאל",
  "נילי",
  "נריה",
  "נעלה",
  "סנה",
  "עדי עד",
  "עטרת",
  "עלי",
  "עמונה",
  "עמיחי",
  "ענתות",
  "עפרה",
  "פסגות",
  "קידה",
  "רימונים",
  "שבות רחל",
  "שילה",
  "שכונת מצפה כרמים",
  "תל ציון",
] as const;

export const PROPERTY_TYPES = [
  "apartment",
  "garden_apartment",
  "house",
  "unit",
] as const;

export type ListingStatus =
  | "pending"
  | "active"
  | "rejected"
  | "expired"
  | "removed";

export type ListingSummary = {
  id: string;
  slug: string;
  title: string;
  locality: string;
  propertyType: (typeof PROPERTY_TYPES)[number];
  rooms: number;
  price: number;
  builtArea: number | null;
  availableFrom: string | null;
  status: ListingStatus;
  featured: boolean;
  imageUrl?: string;
};

export type ListingFilters = {
  locality?: string;
  propertyType?: ListingSummary["propertyType"];
  minRooms?: number;
  maxPrice?: number;
};

const israeliPhone = /^(?:\+972|0)(?:[23489]|5[0-9]|7[2-9])[-\s]?\d{3}[-\s]?\d{4}$/;

export const listingSubmissionSchema = z.object({
  title: z.string().trim().min(8).max(90),
  locality: z.enum(LOCALITIES),
  propertyType: z.enum(PROPERTY_TYPES),
  rooms: z.coerce.number().min(1).max(15),
  price: z.coerce.number().int().min(500).max(50_000),
  builtArea: z.preprocess((value) => value === "" || value == null ? undefined : value, z.coerce.number().int().min(10).max(2_000).optional()),
  availableFrom: z.preprocess((value) => value === "" || value == null ? undefined : value, z.iso.date().optional()),
  description: z.string().trim().min(20).max(2_000),
  contactName: z.string().trim().min(2).max(80),
  contactPhone: z.string().trim().regex(israeliPhone),
  contactEmail: z.preprocess((value) => value === "" || value == null ? undefined : value, z.email().optional()),
  consent: z.literal(true),
});

export const searchRequestSchema = z.object({
  localities: z.array(z.enum(LOCALITIES)).min(1),
  minRooms: z.coerce.number().min(1).max(15),
  maxPrice: z.coerce.number().int().min(500).max(50_000),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(israeliPhone),
  consent: z.literal(true),
});

export function filterListings(
  listings: ListingSummary[],
  filters: ListingFilters,
): ListingSummary[] {
  return listings.filter((listing) => {
    if (listing.status !== "active") return false;
    if (filters.locality && listing.locality !== filters.locality) return false;
    if (
      filters.propertyType &&
      listing.propertyType !== filters.propertyType
    ) {
      return false;
    }
    if (filters.minRooms && listing.rooms < filters.minRooms) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    return true;
  });
}
