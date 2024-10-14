'use server'

import { createClient } from '@/utils/supabase/server'
import { CreateButton } from './createButton'
import { InstancesList } from './instancesList'

const InstancePage = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <>
      <section>
        <InstancesList />
      </section>
      <section>
        <CreateButton user={user} />
      </section>
    </>
  )
}

export default InstancePage
