'use server'

import { createClient } from '@/utils/supabase/server'
import { CreateButton } from './createButton'
import { PublicInstances } from './publicInstances'
import { YourInstances } from './yourInstances'

const InstancePage = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <>
      <section>
        <h1>Public Instances</h1>
        <PublicInstances />
      </section>
      <section>
        <h1>Your Instances</h1>
        <YourInstances user={user} />
      </section>
      <section>
        <CreateButton user={user} />
      </section>
    </>
  )
}

export default InstancePage
