import { describe, expect, it } from "vitest";
import {
  filterListings,
  listingSubmissionSchema,
  searchRequestSchema,
  type ListingSummary,
} from "@/lib/listings";

const listings: ListingSummary[] = [
  {
    id: "1",
    slug: "dira-4-shilo",
    title: "דירת 4 חדרים בשילה",
    locality: "שילה",
    propertyType: "apartment",
    rooms: 4,
    price: 4_800,
    builtArea: 112,
    availableFrom: "2026-08-15",
    status: "active",
    featured: false,
  },
  {
    id: "2",
    slug: "unit-ofra",
    title: "יחידת דיור בעפרה",
    locality: "עפרה",
    propertyType: "unit",
    rooms: 2.5,
    price: 3_300,
    builtArea: 58,
    availableFrom: "2026-09-01",
    status: "active",
    featured: true,
  },
  {
    id: "3",
    slug: "pending-eli",
    title: "דירה ממתינה בעלי",
    locality: "עלי",
    propertyType: "apartment",
    rooms: 3,
    price: 4_000,
    builtArea: 80,
    availableFrom: "2026-10-01",
    status: "pending",
    featured: false,
  },
];

describe("filterListings", () => {
  it("never returns listings that are not active", () => {
    expect(filterListings(listings, {})).toHaveLength(2);
  });

  it("filters by locality, rooms and price range", () => {
    expect(
      filterListings(listings, {
        locality: "שילה",
        minRooms: 4,
        maxPrice: 5_000,
      }),
    ).toEqual([listings[0]]);
  });
});

describe("listingSubmissionSchema", () => {
  it("accepts a complete rental listing submission", () => {
    const result = listingSubmissionSchema.safeParse({
      title: "דירת גן משפחתית בשילה",
      locality: "שילה",
      propertyType: "garden_apartment",
      rooms: 4,
      price: 5_200,
      builtArea: 118,
      availableFrom: "2026-09-01",
      description: "דירה מוארת עם חצר פרטית גדולה ונוף פתוח.",
      contactName: "ישראל ישראלי",
      contactPhone: "0501234567",
      contactEmail: "owner@example.com",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid contact details and missing consent", () => {
    const result = listingSubmissionSchema.safeParse({
      title: "דירה",
      locality: "שילה",
      propertyType: "apartment",
      rooms: 4,
      price: 5_200,
      builtArea: 118,
      availableFrom: "2026-09-01",
      description: "קצר",
      contactName: "א",
      contactPhone: "123",
      contactEmail: "not-an-email",
      consent: false,
    });

    expect(result.success).toBe(false);
  });
});

describe("searchRequestSchema", () => {
  it("requires at least one locality and a valid Israeli phone number", () => {
    const result = searchRequestSchema.safeParse({
      localities: [],
      minRooms: 3,
      maxPrice: 5_000,
      name: "רות כהן",
      phone: "123",
      consent: true,
    });

    expect(result.success).toBe(false);
  });
});
