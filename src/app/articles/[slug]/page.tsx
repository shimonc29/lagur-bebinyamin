import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticle } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  return (
    <><SiteHeader /><main className="page-shell"><article className="container narrow article-page">
      <p className="eyebrow">{article.published_at ? new Date(article.published_at).toLocaleDateString("he-IL") : "כתבה"}</p>
      <h1 className="page-title">{article.title}</h1><p className="page-intro">{article.excerpt}</p>
      <div className="article-content">{String(article.content).split(/\n+/).filter(Boolean).map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}</div>
    </article></main></>
  );
}
