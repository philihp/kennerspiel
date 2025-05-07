'use server'

import { createClient } from '@/utils/supabase/server'

export const emailUsed = async (email: string) =>
  (await (await createClient()).from('profile').select('count').eq('email', email).maybeSingle()).data?.count !== 0

export const register = async (formData: FormData, captchaToken: string) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (password !== confirm) {
    return { message: 'Passwords do not match.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signUp({ email, password, options: { captchaToken } })

  if (authError || !user) {
    return authError
  }

  const { error: profError } = await supabase.from('profile').upsert({ id: user?.id, email })
  if (profError) {
    await supabase.auth.signOut({ scope: 'local' })
    return profError
  }
}
