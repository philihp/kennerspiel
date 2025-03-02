import Link from 'next/link'
import { Presence } from './presence'
import { createClient } from '@/utils/supabase/server'
import { Connect } from './connect'
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
          &nbsp;[&nbsp;
          <Connect />
          &nbsp;]
        </>
      )}
      {user?.email !== undefined && user?.is_anonymous === true && (
        <>
          &nbsp;[&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Settings />
        </>
      )}
      {user?.email !== undefined && user?.is_anonymous === false && (
        <>
          &nbsp;[&nbsp;
          {user?.email}
          &nbsp;|&nbsp;
          <Link href="/instance/">Instances</Link>
          &nbsp;|&nbsp;
          <Settings />
        </>
      )}
    </header>
  )
}
export default Header
