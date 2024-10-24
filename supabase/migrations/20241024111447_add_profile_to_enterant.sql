alter table public.entrant
add column profile_id uuid references public.profile(id) on delete cascade;
