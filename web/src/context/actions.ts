'use server'

import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'
import { isEmpty } from 'ramda'
import { nowInSeconds, stampCommand, usesTimestamps } from '@/mcp/engine'

export const serverMove = async (
  instanceId: string,
  newCommands: string[]
): Promise<{ error: PostgrestError | null; commands: string[] | undefined }> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: null, commands: undefined }

  // one profile can hold more than one seat in an instance, so do not expect a single row
  const { data: seats, error: checkError } = await supabase
    .from('entrant')
    .select('color')
    .eq('profile_id', user.id)
    .eq('instance_id', instanceId)
  if (checkError || isEmpty(seats ?? [])) {
    console.error(`ERROR: Checking instance ${instanceId} for entrant ${user.id}`, checkError)
    return { error: checkError, commands: undefined }
  }

  // TODO: check that it is players turn from one of seats[].color, oh god does this mean playing the commands?

  // in a variant with timestamps, the server stamps the new last command with the time now
  const lastIndex = newCommands.length - 1
  const commands =
    usesTimestamps(newCommands) && lastIndex >= 2
      ? newCommands.map((c, i) => (i === lastIndex ? stampCommand(c, nowInSeconds()) : c))
      : newCommands

  const { error: updateError } = await supabase
    .from('instance')
    .update({ commands, updated_at: new Date().toISOString() })
    .eq('id', instanceId)

  if (updateError) {
    console.error(updateError)
    return { error: updateError, commands: undefined }
  }

  const { data: instance, error } = await supabase
    .from('instance')
    .select('commands, entrant(id)')
    .eq('id', instanceId)
    .single()

  return { error, commands: instance?.commands }
}
