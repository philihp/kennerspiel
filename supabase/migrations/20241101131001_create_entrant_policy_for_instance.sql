create policy "Instances are editable by entrant"
on "public"."instance"
as permissive
for all
to anon, authenticated
using (
  id in (
    select instance_id
    from entrant
    where profile_id = (select auth.uid())
  )
)
