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
