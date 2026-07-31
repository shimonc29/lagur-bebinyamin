import { describe, expect, it } from "vitest";
import { isAdminKeyValid, moderationSchema } from "@/lib/admin";

describe("isAdminKeyValid", () => {
  it("accepts an exact configured key and rejects empty input", () => {
    expect(isAdminKeyValid("pilot-secret", "pilot-secret")).toBe(true);
    expect(isAdminKeyValid("", "pilot-secret")).toBe(false);
  });
});

describe("moderationSchema", () => {
  it("allows only supported moderation transitions", () => {
    expect(moderationSchema.safeParse({ id: crypto.randomUUID(), status: "active" }).success).toBe(true);
    expect(moderationSchema.safeParse({ id: crypto.randomUUID(), status: "deleted" }).success).toBe(false);
  });
});
