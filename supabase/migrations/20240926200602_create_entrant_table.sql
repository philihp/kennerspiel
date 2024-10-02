create table public.entrant (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  updated_at timestamptz,
  instance_id bigint references public.instance(id) on delete cascade
);

alter table public.entrant enable row level security;

create policy "Entrants are viewable by everyone"
on public.entrant for select
to authenticated, anon
using ( true );
