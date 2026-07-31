import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const articleInputSchema = z.object({
  title: z.string().trim().min(5).max(120),
  excerpt: z.string().trim().min(20).max(300),
  content: z.string().trim().min(50).max(20_000),
});

export const articleUpdateSchema = articleInputSchema.extend({ id: z.uuid() });
export const articleStatusSchema = z.object({ id: z.uuid(), status: z.enum(["draft", "published"]) });
export const articleDeleteSchema = z.object({ id: z.uuid() });

export function createArticleSlug(title: string) {
  const base = title.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").toLowerCase();
  return `${base || "article"}-${Date.now()}`;
}

export async function getPublishedArticles() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("articles")
      .select("id,slug,title,excerpt,published_at").eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch { return []; }
}

export async function getPublishedArticle(slug: string) {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("articles")
      .select("id,slug,title,excerpt,content,published_at")
      .eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    return data;
  } catch { return null; }
}
