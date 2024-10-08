alter table public.instance
alter column commands set default array[]::text[];
