create table state (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  updated_at timestamptz,
  command text not null,
  json jsonb not null
);

alter table state enable row level security;

create policy "States are viewable by everyone"
on state for select
to authenticated, anon
using ( true );
