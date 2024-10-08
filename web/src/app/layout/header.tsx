import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

const Header = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.email ?? undefined
  return (
    <header>
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
        </>
      )}
    </header>
  )
}
export default Header
