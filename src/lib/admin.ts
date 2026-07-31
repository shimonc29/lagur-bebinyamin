import { timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const moderationSchema = z.object({
  id: z.uuid(),
  status: z.enum(["active", "rejected", "removed"]),
});

export function isAdminKeyValid(provided: string, configured: string | undefined) {
  if (!provided || !configured) return false;
  const providedBuffer = Buffer.from(provided);
  const configuredBuffer = Buffer.from(configured);
  if (providedBuffer.length !== configuredBuffer.length) return false;
  return timingSafeEqual(providedBuffer, configuredBuffer);
}
