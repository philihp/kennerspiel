
create policy "Instances are editable by owner"
on public.instance
as permissive
for all
to authenticated, anon
using (
  (select auth.uid()) = owner_id
);
