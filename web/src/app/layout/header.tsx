import Link from 'next/link'
import { Presence } from './presence'
import { AuthError, User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

const Header = async () => {
  const supabase = createClient()

  let user: User | null = null
  let error: AuthError | null = null

  const userRes = await supabase.auth.getUser()
  user = userRes.data?.user
  error = userRes.error

  return (
    <header>
      <Presence />
      {process.env.NODE_ENV === 'development' ? process.env.NODE_ENV : 'Kennerspiel'}
      {user?.email === undefined && (
        <>
          &nbsp;[&nbsp;
          <Link href="/account/connect">Connect</Link>
          &nbsp;]
        </>
      )}
      {user?.email !== undefined && user?.is_anonymous === true && (
        <>
          &nbsp;[&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Link href="/account/settings">Settings⚠️</Link> ]
        </>
      )}
      {user?.email !== undefined && user?.is_anonymous === false && (
        <>
          &nbsp;[&nbsp;
          {user?.email}
          &nbsp;|&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Link href="/account/settings">Settings</Link> ]
        </>
      )}
    </header>
  )
}
export default Header
