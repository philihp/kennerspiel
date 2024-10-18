'use server'

import { createClient } from '@/utils/supabase/server'
import { ClientPresenter } from './clientPresenter'
import { InstanceContextProvider } from '@/context/InstanceContext'
import { SupabaseContextProvider } from '@/context/SupabaseContext'

type InstanceParams = {
  params: {
    slug: string
  }
}

type Instance = {
  commands: string[]
}

const InstancePage = async ({ params: { slug } }: InstanceParams) => {
  const supabase = createClient()
  const { data: instance } = await supabase.from('instance').select('*').limit(1).single<Instance>()
  const commands = instance?.commands ?? []
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <SupabaseContextProvider>
      <InstanceContextProvider commands={commands} user={user}>
        <ClientPresenter params={{ slug }} />
      </InstanceContextProvider>
    </SupabaseContextProvider>
  )
}

export default InstancePage
