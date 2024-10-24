
create policy "Entrants are editable by profile"
on public.entrant
as permissive
for all
to authenticated, anon
using (
  (select auth.uid()) = profile_id
);
