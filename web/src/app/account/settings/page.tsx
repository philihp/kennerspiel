import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import ChangePassword from './changePassword'
import { LinkEmail } from './linkEmail'
import DisconnectButton from './disconnectButton'
import { useSupabaseContext } from '@/context/SupabaseContext'

const SettingsPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/account/connect')
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
      <h2>Disconnect</h2>
      <DisconnectButton />
    </>
  )
}

export default SettingsPage
