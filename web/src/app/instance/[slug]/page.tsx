'use server'

import { createClient } from '@/utils/supabase/server'
import { ClientPresenter } from './clientPresenter'
import { InstanceContextProvider } from '@/context/InstanceContext'

type InstanceParams = {
  params: {
    slug: string
  }
}

const InstancePage = async ({ params: { slug } }: InstanceParams) => {
  const supabase = createClient()
  const { data: instance, error } = await supabase.from('instance').select('*').eq('id', slug).limit(1).single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (instance === null) {
    return <pre>{JSON.stringify(error, undefined, 2)}</pre>
  }

  return (
    <InstanceContextProvider instance={instance} user={user}>
      <ClientPresenter params={{ slug }} />
    </InstanceContextProvider>
  )
}

export default InstancePage
