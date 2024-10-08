create table public.instance (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  commands text[] not null
);

alter table public.instance enable row level security;

create policy "Instances are viewable by everyone"
on public.instance for select
to authenticated, anon
using ( true );
