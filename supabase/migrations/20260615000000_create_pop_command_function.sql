-- Atomically remove the last command from an instance, but only if the
-- caller's view of the game is still current (compare-and-swap on the command
-- count). Zero rows returned means someone else moved or undid first; re-read
-- and re-validate.
--
-- Refuses to pop below 2 commands so CONFIG and START are never removed by an
-- undo; that floor is the lobby/setup boundary. The MCP server additionally
-- self-enforces that the agent only undoes its own moves.
create or replace function public.pop_command(
  p_instance_id uuid,
  p_expected_count int
) returns setof public.instance
language sql
as $$
  update public.instance
  set commands = commands[1:cardinality(commands)-1],
      updated_at = now()
  where id = p_instance_id
    and cardinality(commands) = p_expected_count
    and cardinality(commands) > 2
  returning *;
$$;
