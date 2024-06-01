import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

const PrivatePage = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  return <p>Hello {data.user.email}</p>
}

export default PrivatePage
