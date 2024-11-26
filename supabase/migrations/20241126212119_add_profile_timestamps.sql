alter table public.profile
add column updated_at timestamptz not null default now();

alter table public.profile
add column created_at timestamptz not null default now();
