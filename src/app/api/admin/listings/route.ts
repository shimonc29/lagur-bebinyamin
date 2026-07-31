import { adminDeleteSchema, adminUpdateSchema, isAdminKeyValid } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

function authorized(request: Request) {
  return isAdminKeyValid(request.headers.get("x-admin-key") ?? "", process.env.ADMIN_ACCESS_KEY);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });

  try {
    const supabase = createSupabaseAdmin();
    const [listingsResult, alertsResult] = await Promise.all([
      supabase.from("listings")
        .select("id,slug,status,title,locality,property_type,rooms,price,built_area,available_from,description,contact_name,contact_phone,contact_email,created_at,approved_at")
        .order("created_at", { ascending: false }).limit(200),
      supabase.from("search_requests")
        .select("id,localities,min_rooms,max_price,name,phone,active,created_at")
        .order("created_at", { ascending: false }).limit(500),
    ]);

    if (listingsResult.error) throw listingsResult.error;
    if (alertsResult.error) throw alertsResult.error;
    return Response.json({ listings: listingsResult.data, alerts: alertsResult.data });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = adminUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });

  try {
    const supabase = createSupabaseAdmin();
    if (parsed.data.target === "listing") {
      const updates = parsed.data.status === "active"
        ? { status: "active", approved_at: new Date().toISOString() }
        : { status: parsed.data.status };
      const { error } = await supabase.from("listings").update(updates).eq("id", parsed.data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("search_requests")
        .update({ active: parsed.data.active }).eq("id", parsed.data.id);
      if (error) throw error;
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = adminDeleteSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });

  try {
    const supabase = createSupabaseAdmin();
    const table = parsed.data.target === "listing" ? "listings" : "search_requests";
    const { error } = await supabase.from(table).delete().eq("id", parsed.data.id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
