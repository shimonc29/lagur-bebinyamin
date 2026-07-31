create type public.article_status as enum ('draft', 'published');

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status public.article_status not null default 'draft',
  title text not null check (char_length(title) between 5 and 120),
  excerpt text not null check (char_length(excerpt) between 20 and 300),
  content text not null check (char_length(content) between 50 and 20000),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_public_idx on public.articles(status, published_at desc);
alter table public.articles enable row level security;

create policy "public can read published articles"
on public.articles for select
using (status = 'published');

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();
