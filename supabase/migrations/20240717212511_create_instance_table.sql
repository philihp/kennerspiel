create table public.instance (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  --owner_id uuid references auth.users(id) default auth.uid(),
  commands text[] not null
);

alter table public.instance enable row level security;

create policy "Instances are viewable by everyone"
on public.instance for select
to authenticated, anon
using ( true );

-- create policy "Allow delete and update on owned rows"
-- on public.instance
-- as permissive
-- for all
-- to authenticated, anon
-- using (
--   (( SELECT auth.uid() AS uid) = owner_id)
-- )
