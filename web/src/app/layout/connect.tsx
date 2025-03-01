'use client'

import { useSupabaseContext } from '@/context/SupabaseContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Connect = () => {
  const pathName = usePathname()
  const { setRedirectTo } = useSupabaseContext()

  const handleClick = () => {
    // this makes navigation a little less deterministic, but i think it's somewhat intuitive
    // to have this be a tiny bit of modal behavior handled by the client
    setRedirectTo(pathName)
  }

  return (
    <Link href={{ pathname: '/account/connect' }} onClick={handleClick}>
      Connect
    </Link>
  )
}
