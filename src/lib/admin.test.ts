import { describe, expect, it } from "vitest";
import { adminDeleteSchema, adminUpdateSchema, isAdminKeyValid } from "@/lib/admin";

describe("isAdminKeyValid", () => {
  it("accepts an exact configured key and rejects empty input", () => {
    expect(isAdminKeyValid("pilot-secret", "pilot-secret")).toBe(true);
    expect(isAdminKeyValid("", "pilot-secret")).toBe(false);
  });
});

describe("admin schemas", () => {
  it("validates listing moderation and alert activation", () => {
    const id = crypto.randomUUID();
    expect(adminUpdateSchema.safeParse({ target: "listing", id, status: "active" }).success).toBe(true);
    expect(adminUpdateSchema.safeParse({ target: "search_request", id, active: false }).success).toBe(true);
    expect(adminUpdateSchema.safeParse({ target: "listing", id, status: "deleted" }).success).toBe(false);
    expect(adminDeleteSchema.safeParse({ target: "listing", id }).success).toBe(true);
  });
});
