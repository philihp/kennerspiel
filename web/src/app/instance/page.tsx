import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

const PrivatePage = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  return (
    <section>
      <p>Hello {data.user.email}, these are the instances you can see</p>
    </section>
  )
}

export default PrivatePage
