create table instance (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  updated_at timestamptz,
  state_id bigint
);

alter table instance enable row level security;

create policy "Instances are viewable by everyone"
on instance for select
to authenticated, anon
using ( true );
