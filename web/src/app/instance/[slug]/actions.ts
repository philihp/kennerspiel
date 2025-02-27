'use server'

import { Enums, Tables } from '@/supabase.types'
import { createClient } from '@/utils/supabase/server'

const sleep = (durationMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, durationMs))
}

export const join = async (
  instanceId: string,
  color?: Enums<'color'>
): Promise<[Tables<'entrant'>[], Tables<'instance'> | undefined]> => {
  const supabase = await createClient()

  // if no user, then just bail
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return [[], undefined]

  // if no instance, bail
  const { data: instance, error: selectError } = await supabase
    .from('instance')
    .select('*, entrant(*)')
    .eq('id', instanceId)
    .single()
  if (!instance || selectError) {
    console.error(selectError)
    return [[], undefined]
  }

  // if theres already a color, bail
  if (color) {
    const { data: entrant, error: checkError } = await supabase
      .from('entrant')
      .select()
      .eq('instance_id', instance?.id)
      .eq('color', color)
      .maybeSingle()
    if (entrant) {
      console.error(`ERROR: ${entrant?.instance_id}:${entrant?.color} already has ${entrant?.profile_id} `)
      return [[], undefined]
    } else if (checkError) {
      console.error(checkError)
      return [[], undefined]
    }

    // otherwise update this instance+profile with the color
    const { data, error: upsertError } = await supabase
      .from('entrant')
      .upsert(
        { instance_id: instance?.id, profile_id: user.id, color, updated_at: new Date().toISOString() },
        { onConflict: 'instance_id, profile_id' }
      )
      .select()
    if (upsertError) {
      console.error(upsertError)
      return [[], undefined]
    }
    console.log('upsert ', data)
  } else {
    const { data: entrant, error: deleteError } = await supabase
      .from('entrant')
      .delete()
      .eq('instance_id', instance?.id)
      .eq('profile_id', user.id)
      .select()
    if (deleteError) {
      console.error(deleteError)
      return [[], undefined]
    }
    console.log('delete ', entrant)
  }

  const { data: updatedInstance, error: refreshError } = await supabase
    .from('instance')
    .select('*, entrant(*)')
    .eq('id', instanceId)
    .single()
  if (refreshError) {
    console.error(refreshError)
    return [[], undefined]
  }

  if (updatedInstance.commands.length) {
    const players = Math.max(updatedInstance.entrant.length, 1)
    const oldConfig = instance.commands[0].split(' ')
    config(instance.id, `CONFIG ${players} ${oldConfig[2]} ${oldConfig[3]}`)
  }

  const { entrant, ...shallowInstance } = updatedInstance
  return [entrant, shallowInstance]
}

export const toggleHidden = async (instanceId: string, hidden: boolean): Promise<Tables<'instance'> | undefined> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('ERROR: toggleHidden has no user')
    return
  }
  const { data, error } = await supabase
    .from('instance')
    .update({ hidden, updated_at: new Date().toISOString() })
    .eq('id', instanceId)
    .select()
    .single()
  if (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return
  }
  return data
}

export const config = async (instanceId: string, configString: string) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('ERROR: config has no user')
    return
  }
  const { data, error } = await supabase
    .from('instance')
    .update({ commands: [configString], updated_at: new Date().toISOString() })
    .eq('id', instanceId)
    .select()
    .single()
  if (error) {
    console.error(error)
    return
  }
  return data
}

export const start = async (instanceId: string) => {
  const supabase = await createClient()
  const { data: instance } = await supabase
    .from('instance')
    .select('commands, entrant(id)')
    .eq('id', instanceId)
    .single()
  if (instance?.commands?.length !== 1) {
    console.error(`ERROR: cannot START instance it should have exactly one CONFIG command ${instanceId}`)
    return
  }
  if (instance?.entrant?.length === 0) {
    console.error(`ERROR: cannot START instance because no entrants ${instanceId}`)
    return
  }

  const seed = (Math.random() * 100000) | 0

  const { data: entrants } = await supabase.from('entrant').select('color').eq('instance_id', instanceId)
  const colors = (entrants ?? []).map((entrant) => entrant.color[0]?.toUpperCase()).join(' ')

  const updateSet = {
    commands: [instance.commands[0], `START ${seed} ${colors}`],
    updated_at: new Date().toISOString(),
  }
  const { error: startError } = await supabase.from('instance').update(updateSet).eq('id', instanceId)

  if (startError) {
    console.error(`ERROR: cannot START because ${startError}`)
  }
}
