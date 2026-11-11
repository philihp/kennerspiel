-- Unix timestamps (seconds) used by the game engine as pcg step distances.
-- Each command that uses the randomizer takes the next timestamp from this
-- list when the game is replayed. Commands that do not use the randomizer
-- take none, so this list is usually shorter than commands.
alter table public.instance
  add column timestamps bigint[] not null default '{}';

-- append_command: optionally also append the timestamp the new command used
drop function if exists public.append_command(uuid, int, text);
create or replace function public.append_command(
  p_instance_id uuid,
  p_expected_count int,
  p_command text,
  p_timestamp bigint default null
) returns setof public.instance
language sql
as $$
  update public.instance
  set commands = commands || p_command,
      timestamps = case when p_timestamp is null then timestamps else timestamps || p_timestamp end,
      updated_at = now()
  where id = p_instance_id
    and cardinality(commands) = p_expected_count
  returning *;
$$;

-- pop_command: optionally also cut the timestamps down to p_keep_timestamps,
-- for when the removed command had used one
drop function if exists public.pop_command(uuid, int);
create or replace function public.pop_command(
  p_instance_id uuid,
  p_expected_count int,
  p_keep_timestamps int default null
) returns setof public.instance
language sql
as $$
  update public.instance
  set commands = commands[1:cardinality(commands)-1],
      timestamps = case
        when p_keep_timestamps is null then timestamps
        else timestamps[1:p_keep_timestamps]
      end,
      updated_at = now()
  where id = p_instance_id
    and cardinality(commands) = p_expected_count
    and cardinality(commands) > 2
  returning *;
$$;
