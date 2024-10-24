
create policy "Profiles are editable by owner"
on public.profile
as permissive
for all
to authenticated, anon
using (
  (select auth.uid()) = id
);
