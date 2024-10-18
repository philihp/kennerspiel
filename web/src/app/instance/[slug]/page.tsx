'use server'

import { createClient } from '@/utils/supabase/server'
import Presenter from './presenter'
import { ServerUser } from './serverUser'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

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
    <div>
      <Presenter user={user} params={{ slug }} commands={commands} />
    </div >
  )
}

export default InstancePage
