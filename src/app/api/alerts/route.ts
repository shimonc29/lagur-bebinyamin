import { searchRequestSchema } from "@/lib/listings";
import { notifyAboutSearchRequest } from "@/lib/notifications";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = searchRequestSchema.safeParse({
    localities: form.getAll("localities"), minRooms: form.get("minRooms"),
    maxPrice: form.get("maxPrice"), name: form.get("name"), phone: form.get("phone"),
    consent: form.get("consent") === "true",
  });
  if (!parsed.success) return Response.json({ error: "invalid_submission" }, { status: 400 });
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("search_requests").insert({
      localities: parsed.data.localities, min_rooms: parsed.data.minRooms,
      max_price: parsed.data.maxPrice, name: parsed.data.name, phone: parsed.data.phone,
      consent_at: new Date().toISOString(),
    }).select("id").single();
    if (error) throw error;
    await notifyAboutSearchRequest({ ...parsed.data, id: data.id });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
