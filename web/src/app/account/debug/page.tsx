import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const DebugPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/account/login')
  if (user.is_anonymous) redirect('/account/confirmEmail')

  return (
    <>
      <pre>{JSON.stringify(user, undefined, 2)}</pre>
    </>
  )
}

export default DebugPage
