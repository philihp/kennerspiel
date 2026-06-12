'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { allowedRedirectUris, isKnownClientId, resourceIdentifier, SCOPE } from '@/oauth/config'
import { issueAuthorizationCode } from '@/oauth/store'

const fail = (redirectUri: string | null, state: string | null, error: string, description: string): never => {
  if (!redirectUri) throw new Error(`${error}: ${description}`)
  const url = new URL(redirectUri)
  url.searchParams.set('error', error)
  url.searchParams.set('error_description', description)
  if (state) url.searchParams.set('state', state)
  redirect(url.toString())
}

export const approve = async (formData: FormData) => {
  const responseType = String(formData.get('response_type') ?? '')
  const clientId = String(formData.get('client_id') ?? '')
  const redirectUri = String(formData.get('redirect_uri') ?? '')
  const state = (formData.get('state') as string | null) ?? null
  const codeChallenge = String(formData.get('code_challenge') ?? '')
  const codeChallengeMethod = String(formData.get('code_challenge_method') ?? 'S256')
  const resource = (formData.get('resource') as string | null) ?? null
  const scope = String(formData.get('scope') ?? SCOPE)

  if (!redirectUri || !allowedRedirectUris().includes(redirectUri))
    fail(null, state, 'invalid_request', 'redirect_uri is not allow-listed')
  if (responseType !== 'code') fail(redirectUri, state, 'unsupported_response_type', 'Only code is supported')
  if (!isKnownClientId(clientId)) fail(redirectUri, state, 'unauthorized_client', 'Unknown client_id')
  if (!codeChallenge) fail(redirectUri, state, 'invalid_request', 'PKCE code_challenge is required')
  if (codeChallengeMethod !== 'S256')
    fail(redirectUri, state, 'invalid_request', 'Only code_challenge_method=S256 is supported')
  if (resource && resource.replace(/\/$/, '') !== resourceIdentifier())
    fail(redirectUri, state, 'invalid_target', 'resource does not match this server')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) fail(redirectUri, state, 'access_denied', 'User is not authenticated')

  const code = await issueAuthorizationCode({
    user_id: user!.id,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
    resource: resource ?? null,
  })

  const url = new URL(redirectUri)
  url.searchParams.set('code', code)
  if (state) url.searchParams.set('state', state)
  redirect(url.toString())
}
