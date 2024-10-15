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
      Kennerspiel
      {(user?.is_anonymous && <i>Guest</i>) ?? user?.email ?? undefined}
      {user?.email === undefined && (
        <>
          &nbsp;[&nbsp;
          <Link href="/account/connect">Connect</Link>
          &nbsp;]
        </>
      )}
      {user?.is_anonymous && (
        <>
          &nbsp;|&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Link href="/account/settings">Settings⚠️</Link> ]
        </>
      )}
      {user?.is_anonymous === false && user?.email !== undefined && (
        <>
          &nbsp;[&nbsp;
          {user?.email}
          &nbsp;|&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Link href="/account/settings">Settings</Link> ]
        </>
      )}
      <pre>{JSON.stringify({ user, error }, undefined, 2)}</pre>
    </header>
  )
}
export default Header
