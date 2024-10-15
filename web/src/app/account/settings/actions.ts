'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const disconnect = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) {
    return error?.message
  }
  redirect('/')
}

export const changePassword = async (formData: FormData) => {
  const supabase = createClient()
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

export const linkEmail = async (formData: FormData) => {
  console.log('creating client')
  const supabase = createClient()
  console.log({ supabase })

  console.log('getting email')
  const email = formData.get('email') as string
  console.log({ email })

  console.log('updating user')
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ email })
  console.log({ user, error })

  if (error) {
    console.log('returning ', error?.message)
    return error?.message
  }
}
