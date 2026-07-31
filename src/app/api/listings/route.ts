import { randomBytes, createHash } from "node:crypto";
import { listingSubmissionSchema } from "@/lib/listings";
import { notifyAboutListing } from "@/lib/notifications";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = listingSubmissionSchema.safeParse({
    title: form.get("title"), locality: form.get("locality"), propertyType: form.get("propertyType"),
    rooms: form.get("rooms"), price: form.get("price"), builtArea: form.get("builtArea"),
    availableFrom: form.get("availableFrom"), description: form.get("description"),
    contactName: form.get("contactName"), contactPhone: form.get("contactPhone"),
    contactEmail: form.get("contactEmail"), consent: form.get("consent") === "true",
  });
  if (!parsed.success) return Response.json({ error: "invalid_submission" }, { status: 400 });

  try {
    const supabase = createSupabaseAdmin();
    const managementToken = randomBytes(32).toString("base64url");
    const managementTokenHash = createHash("sha256").update(managementToken).digest("hex");
    const slug = `${parsed.data.locality}-${Date.now()}`.replace(/\s+/g, "-").toLowerCase();
    const { data, error } = await supabase.from("listings").insert({
      slug, status: "pending", title: parsed.data.title, locality: parsed.data.locality,
      property_type: parsed.data.propertyType, rooms: parsed.data.rooms, price: parsed.data.price,
      built_area: parsed.data.builtArea, available_from: parsed.data.availableFrom,
      description: parsed.data.description, contact_name: parsed.data.contactName,
      contact_phone: parsed.data.contactPhone, contact_email: parsed.data.contactEmail,
      consent_at: new Date().toISOString(), management_token_hash: managementTokenHash,
    }).select("id").single();
    if (error) throw error;
    await notifyAboutListing({ ...parsed.data, id: data.id });
    return Response.json({ id: data.id, managementToken }, { status: 201 });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
