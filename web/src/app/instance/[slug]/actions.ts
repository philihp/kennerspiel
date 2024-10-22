'use server'

import { EngineColor } from '@/types'
import { createClient } from '@/utils/supabase/server'

export const join = async (instanceId: string, color: EngineColor) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  console.log('joined', user.id, color, instanceId)
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
    })
    .eq('id', instance.id)
}
