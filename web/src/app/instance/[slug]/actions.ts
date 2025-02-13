'use server'

import { Enums } from '@/supabase.types'
import { createClient } from '@/utils/supabase/server'

// const sleep = (durationMs: number) => {
//   return new Promise((resolve) => setTimeout(resolve, durationMs))
// }

export const join = async (instanceId: string, color: Enums<'color'>) => {
  const supabase = await createClient()
  console.log('JOIN()...', color)
  // await sleep(500)

  // if no user, then just bail
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  // if no instance, bail
  const { data: instance, error: selectError } = await supabase
    .from('instance')
    .select('*, entrant(*)')
    .eq('id', instanceId)
    .single()
  if (!instance || selectError) {
    console.error(selectError)
    return
  }

  // if theres already a color, bail
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

  // otherwise update this instance+profile with the color
  const { data, error: upsertError } = await supabase
    .from('entrant')
    .upsert(
      { instance_id: instance?.id, profile_id: user.id, color, updated_at: new Date().toISOString() },
      { onConflict: 'instance_id, profile_id' }
    )
  if (upsertError) {
    console.error(upsertError)
    return
  }

  console.log('updated ', data)

  // if (instance.commands.length) {
  //   const { data: newEntrant, error: refreshError } = await supabase
  //     .from('instance')
  //     .select('*, entrant(*)')
  //     .eq('id', instanceId)
  //     .single()
  //   if (refreshError) {
  //     console.error(refreshError)
  //     return
  //   }
  //   const players = Math.max(newEntrant.entrant.length, 1)
  //   const oldConfig = instance.commands[0].split(' ')
  //   config(instance.id, `CONFIG ${players} ${oldConfig[2]} ${oldConfig[3]}`)
  // }
}

export const toggleHidden = async (instanceId: string, hidden: boolean) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('ERROR: toggleHidden has no user')
    return
  }

  const { error } = await supabase
    .from('instance')
    .update({ hidden, updated_at: new Date().toISOString() })
    .eq('id', instanceId)
  if (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }
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
  await supabase
    .from('instance')
    .update({ commands: [configString] })
    .eq('id', instanceId)
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
