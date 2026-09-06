'use server'

import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Supabase discards a redirect_to that it cannot parse, so this must carry a
// scheme. Prefer the configured site URL, and fall back to the proxied request
// headers, because `host` alone says nothing about http vs https.
const origin = async (): Promise<string> => {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (site) return site.replace(/\/$/, '')
  const headersList = await headers()
  const host = headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${host}`
}

export const reset = async (formData: FormData, captchaToken: string) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(`${formData.get('email')}`, {
    redirectTo: `${await origin()}/account/changePassword`,
    captchaToken,
  })

  return error?.message
}
