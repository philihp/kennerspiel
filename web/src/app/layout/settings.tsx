'use client'

import { useSupabaseContext } from '@/context/SupabaseContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Settings = () => {
  const pathName = usePathname()
  const { setRedirectTo } = useSupabaseContext()

  const handleClick = () => {
    // this makes navigation a little less deterministic, but i think it's somewhat intuitive
    // because going to the settings is usually with some sort of modal task, and i imagine
    // once the user accomplishes that they usually want to go back
    setRedirectTo(pathName)
  }

  return (
    <Link href={{ pathname: '/account' }} onClick={handleClick}>
      Settings
    </Link>
  )
}
