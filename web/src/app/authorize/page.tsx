import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { isAllowedResource } from '@/oauth/config'
import { findClient } from '@/oauth/store'
import { approve } from './actions'

type AuthorizeParams = {
  response_type?: string
  client_id?: string
  redirect_uri?: string
  scope?: string
  state?: string
  code_challenge?: string
  code_challenge_method?: string
  resource?: string
}

const renderError = (message: string) => (
  <>
    <h1>Authorization error</h1>
    <p>{message}</p>
  </>
)

const Authorize = async ({ searchParams }: { searchParams: Promise<AuthorizeParams> }) => {
  const params = await searchParams

  if (params.response_type !== 'code') return renderError('Only response_type=code is supported.')
  if (!params.client_id) return renderError('Missing client_id.')
  const client = await findClient(params.client_id)
  if (!client) return renderError('Unknown client_id.')
  if (!params.redirect_uri || !client.redirectUris.includes(params.redirect_uri))
    return renderError('redirect_uri is not registered for this client.')
  if (!params.code_challenge) return renderError('Missing PKCE code_challenge (S256 required).')
  if (params.code_challenge_method && params.code_challenge_method !== 'S256')
    return renderError('Only code_challenge_method=S256 is supported.')
  if (params.resource && !isAllowedResource(params.resource))
    return renderError('resource indicator does not match this server.')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    const here = new URL('/authorize', 'https://placeholder.local')
    for (const [k, v] of Object.entries(params)) if (v) here.searchParams.set(k, v)
    redirect(`/account/login?next=${encodeURIComponent(here.pathname + here.search)}`)
  }

  // Make sure the profile row exists; tools rely on profile_id == auth user id.
  await supabase.from('profile').upsert({ id: user.id, email: user.email ?? '' })

  const clientLabel = client.clientName ?? 'An MCP client'

  return (
    <>
      <h1>Authorize MCP access</h1>
      <p>
        <strong>{clientLabel}</strong> wants to play Ora et Labora on your behalf as <strong>{user.email}</strong>.
      </p>
      <p>Granting access will let this client:</p>
      <ul>
        <li>List the games you are seated in</li>
        <li>Read the board state of those games</li>
        <li>Make moves in games where it is your turn</li>
      </ul>
      <form action={approve}>
        {Object.entries(params).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
        <button className="primary" type="submit">
          Authorize
        </button>
      </form>
    </>
  )
}

export default Authorize
