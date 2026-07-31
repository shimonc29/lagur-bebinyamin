import { articleDeleteSchema, articleInputSchema, articleStatusSchema, articleUpdateSchema, createArticleSlug } from "@/lib/articles";
import { isAdminKeyValid } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

function authorized(request: Request) {
  return isAdminKeyValid(request.headers.get("x-admin-key") ?? "", process.env.ADMIN_ACCESS_KEY);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  if (error) return Response.json({ error: "articles_table_unavailable" }, { status: 503 });
  return Response.json({ articles: data });
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = articleInputSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("articles")
    .insert({ ...parsed.data, slug: createArticleSlug(parsed.data.title), status: "draft" }).select("*").single();
  if (error) return Response.json({ error: "service_unavailable" }, { status: 503 });
  return Response.json({ article: data }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = articleUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });
  const { id, ...updates } = parsed.data;
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("articles").update(updates).eq("id", id).select("*").single();
  if (error) return Response.json({ error: "service_unavailable" }, { status: 503 });
  return Response.json({ article: data });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = articleStatusSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });
  const updates = parsed.data.status === "published"
    ? { status: "published", published_at: new Date().toISOString() }
    : { status: "draft", published_at: null };
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("articles").update(updates).eq("id", parsed.data.id).select("*").single();
  if (error) return Response.json({ error: "service_unavailable" }, { status: 503 });
  return Response.json({ article: data });
}

export async function DELETE(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = articleDeleteSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("articles").delete().eq("id", parsed.data.id);
  if (error) return Response.json({ error: "service_unavailable" }, { status: 503 });
  return Response.json({ ok: true });
}
