'use client';

import { revalidatePath } from "next/cache";
import { disconnect } from "./actions";

const DisconnectButton = () => {

  const disconnectAndReturn = async (_formData: FormData) => {
    await disconnect()
    revalidatePath('/account/settings')
  }

  return <form>
    <button formAction={disconnectAndReturn}>Disconnect</button>
  </form>
}

export default DisconnectButton
