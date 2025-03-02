'use client'

import { disconnect } from './actions'
import { useSupabaseContext } from '@/context/SupabaseContext'

const DisconnectButton = () => {
  const { redirectTo } = useSupabaseContext()

  const disconnectAndReturn = async (_formData: FormData) => {
    await disconnect(redirectTo)
  }

  return (
    <form>
      <button formAction={disconnectAndReturn}>Disconnect</button>
    </form>
  )
}

export default DisconnectButton
