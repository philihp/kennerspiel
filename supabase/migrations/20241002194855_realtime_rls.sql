create policy "anyone can send or receive on topic for broadcast"
on "realtime"."messages"
for all
to authenticated, anon
using (
  realtime.messages.extension = 'broadcast'
);

create policy "anyone can send or receive on topic for presence"
on "realtime"."messages"
for all
to authenticated, anon
using (
  realtime.messages.extension = 'presence'
);
