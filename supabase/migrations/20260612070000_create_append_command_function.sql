-- Atomically append one command to an instance, but only if the caller's view
-- of the game is still current (compare-and-swap on the command count). Zero
-- rows returned means someone else moved first; re-read and re-validate.
--
-- security invoker (the default): callers going through PostgREST are still
-- bound by the instance RLS policies; the MCP server calls this with the
-- service role after validating seat, turn, and move legality itself.
create or replace function public.append_command(
  p_instance_id uuid,
  p_expected_count int,
  p_command text
) returns setof public.instance
language sql
as $$
  update public.instance
  set commands = commands || p_command,
      updated_at = now()
  where id = p_instance_id
    and cardinality(commands) = p_expected_count
  returning *;
$$;
