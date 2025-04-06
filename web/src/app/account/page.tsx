import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import LogoutButton from './logoutButton'
import Link from 'next/link'

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
      <p>
        User
        <br />
        <code>{user?.id}</code>
      </p>
      <p>
        Created
        <br />
        {user?.created_at}
      </p>
      <p>
        Last signed in at
        <br />
        {user?.last_sign_in_at}
      </p>
      <ul>
        <li>
          <Link href="/account/confirmEmail">Confirm Email</Link>
        </li>
        <li>
          <Link href="/account/changePassword">Change Password</Link>
        </li>
        <li>
          <Link href="/account/debug">Debug</Link>
        </li>
      </ul>
      <h2>Logout</h2>
      <LogoutButton anonymous={user.is_anonymous} verified={user.email_confirmed_at} />
    </>
  )
}

export default SettingsPage
