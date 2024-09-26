create table entrant (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  updated_at timestamptz,
  instance_id bigint
);

alter table entrant enable row level security;

create policy "Entrants are viewable by everyone"
on entrant for select
to authenticated, anon
using ( true );
