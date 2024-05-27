'use server'

import { redirect } from 'next/navigation'

import { sso, scopes } from './sso'

export const register = async (formData: FormData) => {
  redirect(sso.getRedirectUrl('state', scopes))
}
