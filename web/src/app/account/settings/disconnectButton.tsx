'use client'

import { revalidatePath } from 'next/cache'
import { disconnect } from './actions'
import { useSupabaseContext } from '@/context/SupabaseContext'

const DisconnectButton = () => {
  const { redirectTo } = useSupabaseContext()

  const disconnectAndReturn = async (_formData: FormData) => {
    await disconnect(redirectTo)
    revalidatePath('/account/settings')
  }

  return (
    <form>
      <pre>{JSON.stringify(redirectTo, undefined, 2)}</pre>

      <button formAction={disconnectAndReturn}>Disconnect</button>
    </form>
  )
}

export default DisconnectButton
