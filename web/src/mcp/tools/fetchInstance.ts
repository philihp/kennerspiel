import { SupabaseClient } from '@supabase/supabase-js'
import { Database, Tables } from '@/supabase.types'
import { createServiceClient } from '@/utils/supabase/service'

type FetchedInstance = {
  supabase: SupabaseClient<Database>
  instance: Tables<'instance'>
  entrants: Tables<'entrant'>[]
  me?: Tables<'entrant'>
}

export const fetchInstance = async (
  userId: string,
  instanceId: string
): Promise<FetchedInstance | { error: string }> => {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('instance').select('*, entrant(*)').eq('id', instanceId).single()
  if (error || data === null) return { error: `Failed to fetch instance ${instanceId}: ${error?.message}` }
  const { entrant: entrants, ...instance } = data
  const me = entrants.find((entrant) => entrant.profile_id === userId)
  return { supabase, instance, entrants, me }
}
