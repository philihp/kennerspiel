import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import ChangePassword from './changePassword'
import { LinkEmail } from './linkEmail'
import DisconnectButton from './disconnectButton'

const SettingsPage = async () => {
  const t = await getTranslations('app/account/settings')

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
      <h1>{t('settings')}</h1>
      {user.is_anonymous && (
        <>
          <LinkEmail />
        </>
      )}
      {!user.is_anonymous && user.email_confirmed_at && <ChangePassword />}
      <h2>{t('disconnect')}</h2>
      <DisconnectButton />
    </>
  )
}

export default SettingsPage
