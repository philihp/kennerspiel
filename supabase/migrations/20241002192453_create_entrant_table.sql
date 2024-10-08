create table public.entrant (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  instance_id uuid references public.instance(id) on delete cascade
);

alter table public.entrant enable row level security;

create policy "Entrants are viewable by everyone"
on public.entrant for select
to authenticated, anon
using ( true );
