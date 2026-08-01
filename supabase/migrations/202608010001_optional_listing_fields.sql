alter table public.listings
  alter column built_area drop not null,
  alter column available_from drop not null,
  alter column contact_email drop not null;
