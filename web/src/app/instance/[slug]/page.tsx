'use server'

import { createClient } from '@/utils/supabase/server'
import { ClientPresenter } from './clientPresenter'
import { InstanceContextProvider } from '@/context/InstanceContext'
import { SupabaseContextProvider } from '@/context/SupabaseContext'
import { Instance } from '@/types'

type InstanceParams = {
  params: {
    slug: string
  }
}


const InstancePage = async ({ params: { slug } }: InstanceParams) => {
  const supabase = createClient()
  const { data: instance, error } = await supabase.from('instance').select('*').limit(1).single<Instance>()
  // TODO: this needs to select by the ID
  const commands = instance?.commands ?? []
  const { data: { user } } = await supabase.auth.getUser()

  if (instance === null) {
    return <pre>{JSON.stringify(error, undefined, 2)}</pre>
  }

  return (
    <SupabaseContextProvider>
      <InstanceContextProvider instance={instance} user={user}>
        <ClientPresenter params={{ slug }} />
      </InstanceContextProvider>
    </SupabaseContextProvider>
  )
}

export default InstancePage
