'use server'

import { createClient } from '@/utils/supabase/server'

export const confirmEmail = async (formData: FormData) => {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.updateUser({ email })

  if (authError || !user) {
    return authError?.message
  }

  const { error: profError } = await supabase.from('profile').upsert({ id: user?.id, email })
  if (profError) {
    await supabase.auth.signOut({ scope: 'local' })
    return profError?.message
  }
}
