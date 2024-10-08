create table public.profile (
  id uuid not null primary key references auth.users on delete cascade,
  email text NOT NULL
);

alter table public.profile enable row level security;

create policy "Profiles are viewable by everyone"
on public.profile for select
to authenticated, anon
using ( true );
