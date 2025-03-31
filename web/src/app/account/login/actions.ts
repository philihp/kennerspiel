'use server'

import { createClient } from '@/utils/supabase/server'
import { randomUUID } from 'crypto'

export const login = async (formData: FormData, captchaToken: string) => {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  if (!email) return 'Missing an email address'
  if (!password) return 'Blank passwords are bad passwords'
  const {
    error: authError,
    data: { user },
  } = await supabase.auth.signInWithPassword({ email: `${email}`, password: `${password}`, options: { captchaToken } })
  if (authError || !user) return authError?.message
  const { error: profError } = await supabase
    .from('profile')
    .upsert({ id: user?.id, email, updated_at: new Date().toISOString() })
  if (profError) {
    await supabase.auth.signOut({ scope: 'local' })
    return profError?.message
  }
}

// export const skip = async (formData: FormData, captchaToken: string) => {
//   const supabase = await createClient()
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.signInAnonymously({ options: { captchaToken } })

//   if (authError || !user) return authError?.message
//   const { error: profError } = await supabase.from('profile').upsert({ id: user?.id, email: randomUUID() })
//   if (profError) {
//     await supabase.auth.signOut({ scope: 'local' })
//     return profError?.message
//   }
// }
