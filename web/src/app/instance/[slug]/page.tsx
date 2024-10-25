'use server'

import { createClient } from '@/utils/supabase/server'
import { InstanceContextProvider } from '@/context/InstanceContext'
import { Board } from './board'

type InstanceParams = {
  params: {
    slug: string
  }
}

const InstancePage = async ({ params: { slug } }: InstanceParams) => {
  const supabase = createClient()
  const { data, error } = await supabase.from('instance').select('*, entrant (*)').eq('id', slug).limit(1).single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (data === null) {
    return <pre>{JSON.stringify(error, undefined, 2)}</pre>
  }

  // pull out entrants so nobody accidentally uses it
  const { entrant, ...instance } = data

  return (
    <InstanceContextProvider instance={instance} entrants={entrant} user={user}>
      <Board />
    </InstanceContextProvider>
  )
}

export default InstancePage
