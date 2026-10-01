import { createClient } from '@/utils/supabase/server'
import { InstanceContextProvider } from '@/context/InstanceContext'
import { Board } from './board'
import { irelandFlag } from '../../flags'

type InstanceViewProps = { id: string; isometric: boolean }

export const InstanceView = async ({ id, isometric }: InstanceViewProps) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('instance').select('*, entrant(*)').eq('id', id).limit(1).single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (data === null) {
    return <pre>{JSON.stringify(error, undefined, 2)}</pre>
  }

  // pull out entrants so nobody accidentally uses it
  const { entrant, ...instance } = data

  const ireland = await irelandFlag()

  return (
    <InstanceContextProvider
      flags={{
        ireland,
        isometric,
      }}
      instance={instance}
      entrants={entrant}
      user={user}
    >
      <Board />
    </InstanceContextProvider>
  )
}
