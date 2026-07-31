import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = { title: "כתבות ומדריכים" };
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  return (
    <><SiteHeader /><main className="page-shell"><div className="container">
      <p className="eyebrow">להכיר את בנימין</p><h1 className="page-title">כתבות ומדריכים</h1>
      <p className="page-intro">מדריכים לשוכרים ולמשכירים, סיפורים מהיישובים ומידע שימושי על החיים בבנימין.</p>
      {articles.length > 0 ? <div className="article-grid">{articles.map((article) =>
        <article className="article-card" key={article.id}>
          <p className="eyebrow">{article.published_at ? new Date(article.published_at).toLocaleDateString("he-IL") : "כתבה"}</p>
          <h2>{article.title}</h2><p>{article.excerpt}</p>
          <Link className="text-link" href={`/articles/${article.slug}`}>לקריאת הכתבה ←</Link>
        </article>)}</div> : <div className="form-card"><h2>הכתבות הראשונות בדרך</h2><p>כתבות שיפורסמו בממשק האדמין יופיעו כאן.</p></div>}
    </div></main></>
  );
}
