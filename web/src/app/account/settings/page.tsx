import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import { logoff } from './actions'

import ChangePassword from './changePassword'

const SettingsPage = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/account/login')
  }

  return (
    <>
      <h1>Settings</h1>

      <ChangePassword />

      <h2>Logoff</h2>
      <form>
        <button formAction={logoff}>Logoff</button>
      </form>
      {/* <pre>{JSON.stringify(data?.user, undefined, 2)}</pre> */}
    </>
  )
}

export default SettingsPage
