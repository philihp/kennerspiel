'use server'

import { createClient } from '@/utils/supabase/server'

export const login = async (formData: FormData, captchaToken: string) => {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: `${formData.get('email')}`,
    password: `${formData.get('password')}`,
    options: { captchaToken },
  })

  return error?.message
}
