'use server'

import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'

const supabase = createClient()

export const serverMove = async (
  instanceId: string,
  newCommands: string[]
): Promise<{ error: PostgrestError | null; commands: string[] | undefined }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: null, commands: undefined }

  const { data: entrant, error: checkError } = await supabase
    .from('entrant')
    .select('color')
    .eq('profile_id', user.id)
    .eq('instance_id', instanceId)
    .maybeSingle()
  if (!entrant || checkError) {
    console.error(`ERROR: Checking instance ${instanceId} for entrant ${user.id}`, checkError)
    return { error: checkError, commands: undefined }
  }

  // TODO: check that it is players turn from entrant.color, oh god does this mean playing the commands?

  const { error: updateError } = await supabase
    .from('instance')
    .update({ commands: newCommands, updated_at: new Date().toISOString() })
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
