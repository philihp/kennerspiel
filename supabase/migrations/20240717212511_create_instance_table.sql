create table public.instance (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  updated_at timestamptz,
  commands text[] not null
);

alter table public.instance enable row level security;

create policy "Instances are viewable by everyone"
on public.instance for select
to authenticated, anon
using ( true );
