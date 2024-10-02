create policy "Allow delete and update on owned rows"
on public.instance
as permissive
for all
to authenticated, anon
using (
  (( SELECT auth.uid() AS uid) = owner_id)
)
