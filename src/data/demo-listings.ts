import type { ListingSummary } from "@/lib/listings";

export const demoListings: ListingSummary[] = [
  { id: "demo-shilo", slug: "dira-4-shilo", title: "דירת 4 חדרים בשילה", locality: "שילה", propertyType: "apartment", rooms: 4, price: 4800, builtArea: 112, availableFrom: "2026-08-15", status: "active", featured: true },
  { id: "demo-ofra", slug: "unit-2-5-ofra", title: "יחידת דיור מוארת בעפרה", locality: "עפרה", propertyType: "unit", rooms: 2.5, price: 3300, builtArea: 58, availableFrom: "2026-09-01", status: "active", featured: false },
  { id: "demo-rehelim", slug: "house-5-rehelim", title: "בית משפחתי עם חצר ברחלים", locality: "רחלים", propertyType: "house", rooms: 5, price: 5900, builtArea: 138, availableFrom: "2026-08-20", status: "active", featured: false },
];
