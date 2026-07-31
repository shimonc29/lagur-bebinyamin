import { isAdminKeyValid, moderationSchema } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

function authorized(request: Request) {
  return isAdminKeyValid(request.headers.get("x-admin-key") ?? "", process.env.ADMIN_ACCESS_KEY);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("listings")
      .select("id,title,locality,price,rooms,status,created_at,contact_name,contact_phone")
      .order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return Response.json({ listings: data });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = moderationSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });
  try {
    const supabase = createSupabaseAdmin();
    const updates = parsed.data.status === "active"
      ? { status: "active", approved_at: new Date().toISOString() }
      : { status: parsed.data.status };
    const { error } = await supabase.from("listings").update(updates).eq("id", parsed.data.id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
