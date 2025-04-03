'use server'

import { createClient } from '@/utils/supabase/server'

export const changePassword = async (formData: FormData) => {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string
  if (password !== confirm) {
    return 'Passwords do not match'
  }
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return error?.message
  }
}
