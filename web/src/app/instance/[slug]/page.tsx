'use server'

import { createClient } from '@/utils/supabase/server'
import { InstanceContextProvider, useInstanceContext } from '@/context/InstanceContext'
import { Board } from './board'
import { irelandFlag } from '../../flags'
type InstanceParams = { params: Promise<{ slug: string }> }

const InstancePage = async (props: InstanceParams) => {
  const params = await props.params

  const { slug } = params

  const supabase = await createClient()
  const { data, error } = await supabase.from('instance').select('*, entrant(*)').eq('id', slug).limit(1).single()
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
      }}
      instance={instance}
      entrants={entrant}
      user={user}
    >
      <Board />
    </InstanceContextProvider>
  )
}

export default InstancePage
