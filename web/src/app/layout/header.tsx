import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Presence } from './presence'
import { FlagValues } from '@vercel/flags/react'

const Header = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.email ?? undefined
  return (
    <header>
      <Presence />
      Kennerspiel
      {!userId && (
        <>
          &nbsp;[&nbsp;
          <Link href="/account/login">Login</Link>
          &nbsp;|&nbsp;
          <Link href="/account/register">Register</Link>
          &nbsp;]
        </>
      )}
      {userId && (
        <>
          &nbsp;[&nbsp;
          {userId}
          &nbsp;|&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Link href="/account/settings">Settings</Link> ]

          <FlagValues values={{ pretzel: true }} />
        </>
      )}
    </header>
  )
}
export default Header
