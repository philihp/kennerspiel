'use client';

import { revalidatePath } from "next/cache";
import { logoff } from "./actions";

const LogoffButton = () => {

  const logoffAndReturn = async (_formData: FormData) => {
    await logoff()
    revalidatePath('/account/settings')
  }

  return <form>
    <button formAction={logoffAndReturn}>Logoff</button>
  </form>
}

export default LogoffButton
