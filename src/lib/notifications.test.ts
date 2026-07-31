import { describe, expect, it } from "vitest";
import { buildListingNotification } from "@/lib/notifications";

describe("buildListingNotification", () => {
  it("creates a concise Hebrew notification without exposing the management token", () => {
    const message = buildListingNotification({
      title: "דירת 4 חדרים בשילה",
      locality: "שילה",
      price: 4800,
      contactName: "ישראל",
      contactPhone: "0501234567",
    });

    expect(message).toContain("מודעה חדשה ממתינה לאישור");
    expect(message).toContain("₪4,800");
    expect(message).not.toContain("token");
  });
});
