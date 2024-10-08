create policy "anyone can receive broadcast"
on "realtime"."messages"
for select
to authenticated, anon
using (
  realtime.messages.extension in ('broadcast')
);

create policy "anyone can send broadcast on topic"
on "realtime"."messages"
for insert
to authenticated, anon
with check (
  realtime.messages.extension in ('broadcast')
);

create policy "anyone can listen to presence in topic"
on "realtime"."messages"
for select
to authenticated, anon
using (
  realtime.messages.extension in ('presence')
);

create policy "anyone can track presence on topic"
on "realtime"."messages"
for insert
to authenticated, anon
with check (
  realtime.messages.extension in ('presence')
);
