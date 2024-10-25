'use server'

import { Enums } from '@/supabase.types'
import { createClient } from '@/utils/supabase/server'

export const join = async (instanceId: string, color: Enums<'color'>) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  const { data: instance, error: selectError } = await supabase
    .from('instance')
    .select('*, entrant(*)')
    .eq('id', instanceId)
    .single()
  if (!instance) {
    console.error(selectError)
    return
  }

  const { data: entrant, error: checkError } = await supabase
    .from('entrant')
    .select()
    .eq('instance_id', instance?.id)
    .eq('color', color)
    .maybeSingle()
  if (entrant) {
    console.error(`ERROR: ${entrant?.instance_id}:${entrant?.color} already has ${entrant?.profile_id} `)
    return
  } else if (checkError) {
    console.error(checkError)
    return
  }

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

  if (instance.commands.length) {
    const { data: newEntrant, error: refreshError } = await supabase
      .from('instance')
      .select('*, entrant(*)')
      .eq('id', instanceId)
      .single()
    if (refreshError) {
      console.error(refreshError)
      return
    }
    const config = instance.commands[0].split(' ')
    configureInstance(instance.id, `CONFIG ${newEntrant.entrant.length} ${config[2]} ${config[3]}`)
  }
}

export const toggleHidden = async (instanceId: string, hidden: boolean) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('ERROR: toggleHidden has no user')
    return
  }

  const { error } = await supabase
    .from('instance')
    .update({
      hidden,
      updated_at: new Date().toISOString(),
    })
    .eq('id', instanceId)
  if (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }
}

export const configureInstance = async (instanceId: string, configString: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('ERROR: configureInstance has no user')
    return
  }
  await supabase
    .from('instance')
    .update({ commands: [configString] })
    .eq('id', instanceId)
}
