-- Relax entrant uniqueness so one profile can hold multiple seats (colors) in
-- the same instance. The MCP server uses this for AI agents that play multiple
-- colors in one game. The web join flow still enforces one-seat-per-profile in
-- application code.
--
-- The real game-rules invariant is one color per instance; switch the unique
-- constraint over to (instance_id, color).

do $$
declare
  dup_count integer;
begin
  select count(*) into dup_count
  from (
    select instance_id, color
    from public.entrant
    where color is not null
    group by instance_id, color
    having count(*) > 1
  ) d;
  if dup_count > 0 then
    raise exception 'entrant has % (instance_id, color) duplicates; refusing to add unique constraint', dup_count;
  end if;
end $$;

alter table public.entrant
  drop constraint entrant_instance_id_profile_id_key;

alter table public.entrant
  add constraint entrant_instance_id_color_key unique (instance_id, color);

create index if not exists entrant_instance_profile_idx
  on public.entrant (instance_id, profile_id);
