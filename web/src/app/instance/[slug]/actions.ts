'use server'

import { Enums } from '@/supabase.types'
import { createClient } from '@/utils/supabase/server'

export const join = async (instanceId: string, color: Enums<'color'>) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  const { data: instance, error: selectError } = await supabase.from('instance').select().eq('id', instanceId).single()
  if (!instance) {
    console.error(selectError)
    return
  }

  const { data: entrant, error: checkError } = await supabase
    .from('entrant')
    .select()
    .eq('instance_id', instance?.id)
    .eq('profile_id', user.id)
    .eq('color', color)
    .maybeSingle()
  if (entrant) {
    console.error(`ERROR: ${entrant?.instance_id}:${entrant?.color} already has ${entrant?.profile_id} `)
    return
  } else if (checkError) {
    console.error(checkError)
    return
  }

  console.log({ instance_id: instance?.id, profile_id: user.id, color }, { onConflict: 'instance_id, profile_id' })
  const { error: upsertError } = await supabase
    .from('entrant')
    .upsert(
      { instance_id: instance?.id, profile_id: user.id, color, updated_at: new Date().toISOString() },
      { onConflict: 'instance_id, profile_id' }
    )
  if (upsertError) {
    console.error(upsertError)
    return
  }
}

export const toggleHidden = async (instanceId: string, hidden: boolean) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: instance } = await supabase.from('instance').select().eq('id', instanceId).limit(1).single()
  if (instance?.owner_id !== user.id) {
    console.error(`INSTANCE ${instance?.id} OWNER IS ${instance?.owner_id} AND NOT ${user.id}`)
    return
  }
  const { error } = await supabase
    .from('instance')
    .update({
      hidden,
      updated_at: new Date().toISOString(),
    })
    .eq('id', instance.id)
  console.log(`SET HIDDEN ${hidden}\n${JSON.stringify(error, undefined, 2)}`)
}
