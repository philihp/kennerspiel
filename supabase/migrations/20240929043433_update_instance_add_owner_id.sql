alter table public.instance
add column owner_id uuid references auth.users(id) default auth.uid();
