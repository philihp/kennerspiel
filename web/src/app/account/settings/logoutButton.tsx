'use client'

import { createClient } from '@/utils/supabase/client'
import { logout } from './actions'
import { useSupabaseContext } from '@/context/SupabaseContext'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'

interface LogoutButtonProps {
  anonymous?: boolean
  verified?: string
}

const LogoutButton = ({ anonymous = false, verified }: LogoutButtonProps) => {
  const [confirm, setConfirm] = useState(false)
  const { redirectTo } = useSupabaseContext()

  const logoutAndReturn = async (_formData: FormData) => {
    await logout(redirectTo)
  }
  return (
    <form>
      {anonymous && (
        <>
          <TriangleAlert size={24} />
          You will be unable to reconnect unless you add an email.
          <br />
          <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} /> I understand.
          <br />
        </>
      )}
      {!verified && <>Your email is unverified!</>}
      <button formAction={logoutAndReturn} disabled={anonymous && !confirm}>
        Logout
      </button>
    </form>
  )
}

export default LogoutButton
