import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ChangePassword } from './changePassword'

const ChangePasswordPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/account/login')
  if (user.is_anonymous) redirect('/account/confirmEmail')

  return (
    <>
      <h1>Change Password</h1>
      <ChangePassword />
    </>
  )
}

export default ChangePasswordPage
