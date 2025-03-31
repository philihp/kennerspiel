import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import ChangePassword from './changePassword'
import { LinkEmail } from './linkEmail'
import LogoutButton from './logoutButton'

const SettingsPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/account/login')
  }

  return (
    <>
      <h1>Settings</h1>
      {user.is_anonymous && (
        <>
          <LinkEmail />
        </>
      )}
      {!user.is_anonymous && user.email_confirmed_at && <ChangePassword />}
      <h2>Logout</h2>
      <LogoutButton anonymous={user.is_anonymous} verified={user.email_confirmed_at} />
    </>
  )
}

export default SettingsPage
