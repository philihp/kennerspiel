'use server'

import { createClient } from '@/utils/supabase/server'

export const register = async (formData: FormData, captchaToken: string) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
    },
  })

  if (authError || !user) return authError?.message

  const { error: profError } = await supabase.from('profile').upsert({ id: user?.id, email })
  if (profError) {
    await supabase.auth.signOut({ scope: 'local' })
    return profError?.message
  }

  return {
    user,
  }
}
