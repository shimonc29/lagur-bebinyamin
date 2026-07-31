create extension if not exists pgcrypto;

create type public.listing_status as enum ('pending', 'active', 'rejected', 'expired', 'removed');
create type public.property_type as enum ('apartment', 'garden_apartment', 'house', 'unit');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status public.listing_status not null default 'pending',
  title text not null check (char_length(title) between 8 and 90),
  locality text not null,
  property_type public.property_type not null,
  rooms numeric(3,1) not null check (rooms between 1 and 15),
  price integer not null check (price between 500 and 50000),
  built_area integer not null check (built_area between 10 and 2000),
  available_from date not null,
  description text not null check (char_length(description) between 20 and 2000),
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null,
  management_token_hash text not null unique,
  consent_at timestamptz not null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  position smallint not null default 0 check (position between 0 and 9),
  created_at timestamptz not null default now()
);

create table public.search_requests (
  id uuid primary key default gen_random_uuid(),
  localities text[] not null check (cardinality(localities) > 0),
  min_rooms numeric(3,1) not null,
  max_price integer not null,
  name text not null,
  phone text not null,
  consent_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index listings_public_feed_idx on public.listings(status, created_at desc);
create index listings_filter_idx on public.listings(locality, property_type, rooms, price);
create index search_requests_active_idx on public.search_requests(active, created_at desc);

alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.search_requests enable row level security;
alter table public.listing_reports enable row level security;

create policy "public can read active listings"
on public.listings for select
using (status = 'active');

create policy "public can read images of active listings"
on public.listing_images for select
using (exists (
  select 1 from public.listings
  where listings.id = listing_images.listing_id
  and listings.status = 'active'
));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "public can read approved listing images"
on storage.objects for select
using (bucket_id = 'listing-images');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();
