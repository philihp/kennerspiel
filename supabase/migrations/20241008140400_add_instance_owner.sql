alter table public.instance
  add column owner_id uuid not null default auth.uid() references auth.users(id);
