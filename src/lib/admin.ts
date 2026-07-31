import { timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const adminUpdateSchema = z.discriminatedUnion("target", [
  z.object({
    target: z.literal("listing"),
    id: z.uuid(),
    status: z.enum(["active", "rejected", "removed"]),
  }),
  z.object({
    target: z.literal("search_request"),
    id: z.uuid(),
    active: z.boolean(),
  }),
]);

export const adminDeleteSchema = z.object({
  target: z.enum(["listing", "search_request"]),
  id: z.uuid(),
});

export function isAdminKeyValid(provided: string, configured: string | undefined) {
  if (!provided || !configured) return false;
  const providedBuffer = Buffer.from(provided);
  const configuredBuffer = Buffer.from(configured);
  if (providedBuffer.length !== configuredBuffer.length) return false;
  return timingSafeEqual(providedBuffer, configuredBuffer);
}
