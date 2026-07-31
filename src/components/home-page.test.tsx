import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/components/home-page";
import type { ListingSummary } from "@/lib/listings";

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
];

describe("HomePage", () => {
  it("prioritizes rentals and offers a simple publishing path", () => {
    render(<HomePage listings={listings} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "מוצאים בית להשכרה בבנימין",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "פרסום מודעה בחינם" }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pathname: "/publish" }),
      ]),
    );
    expect(
      screen.getAllByRole("link", { name: "דירת 4 חדרים בשילה" }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pathname: "/rentals/dira-4-shilo" }),
      ]),
    );
  });
});
