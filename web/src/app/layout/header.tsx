import Link from "next/link"
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

const Header = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.email ?? undefined
  return <header>

    Kennerspiel
    {!userId &&
      <>
        &nbsp;[&nbsp;
        <Link href="/account/login">Login</Link>
        &nbsp;|&nbsp;
        <Link href="/account/register">Register</Link>
        &nbsp;]
      </>}
    {userId &&
      <>
        &nbsp;[&nbsp;
        {userId}
        &nbsp;|&nbsp;
        <Link href="/instances/">Instances</Link>
        &nbsp;|&nbsp;
        <Link href="/account/settings">Settings</Link> ]
      </>}
  </header>
}
export default Header
