import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { allowedRedirectUris, isKnownClientId, resourceIdentifier } from '@/oauth/config'
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

const validate = (params: AuthorizeParams): { error: string } | { ok: true } => {
  if (params.response_type !== 'code') return { error: 'Only response_type=code is supported.' }
  if (!params.client_id || !isKnownClientId(params.client_id)) return { error: 'Unknown client_id.' }
  if (!params.redirect_uri || !allowedRedirectUris().includes(params.redirect_uri))
    return { error: 'redirect_uri is not allow-listed for this client.' }
  if (!params.code_challenge) return { error: 'Missing PKCE code_challenge (S256 required).' }
  if (params.code_challenge_method && params.code_challenge_method !== 'S256')
    return { error: 'Only code_challenge_method=S256 is supported.' }
  if (params.resource && params.resource.replace(/\/$/, '') !== resourceIdentifier())
    return { error: 'resource indicator does not match this server.' }
  return { ok: true }
}

const Authorize = async ({ searchParams }: { searchParams: Promise<AuthorizeParams> }) => {
  const params = await searchParams
  const check = validate(params)
  if ('error' in check) return renderError(check.error)

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

  return (
    <>
      <h1>Authorize MCP access</h1>
      <p>
        An MCP client wants to play Ora et Labora on your behalf as <strong>{user.email}</strong>.
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
