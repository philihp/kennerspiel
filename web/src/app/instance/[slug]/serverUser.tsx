'use server'

import { createClient } from "@/utils/supabase/server"

export const ServerUser = async ({ callback }: { callback: (s: any) => void }) => {
  const supabase = createClient()
  const user = await supabase.auth.getUser();
  console.log('getuser on server', { callback })
  callback('GOT THE USER')
  return JSON.stringify(user)
}
