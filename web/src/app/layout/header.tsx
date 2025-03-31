import Link from 'next/link'
import { Presence } from './presence'
import { createClient } from '@/utils/supabase/server'
import { Login } from './login'
import { Settings } from './settings'

const Header = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    // error,
  } = await supabase.auth.getUser()

  return (
    <header>
      <Presence user={user} />
      {process.env.NODE_ENV === 'development' ? process.env.NODE_ENV : 'Kennerspiel'}
      {user?.email === undefined && (
        <>
          {' [ '}
          <Login />
          {' | '}
          <Link href="/account/register">Register</Link>
          {' ] '}
        </>
      )}
      {user?.email !== undefined && user?.is_anonymous === true && (
        <>
          {' [ '}
          <Link href="/instance/">Instances</Link>
          {' | '}
          <Settings />
          {' ] '}
        </>
      )}
      {user?.email !== undefined && user?.is_anonymous === false && (
        <>
          {' [ '}
          {user?.email}
          {' | '}
          <Link href="/instance/">Instances</Link>
          {' | '}
          <Settings />
          {' ] '}
        </>
      )}
    </header>
  )
}
export default Header
