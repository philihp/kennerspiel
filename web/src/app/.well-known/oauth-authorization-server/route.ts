import { NextResponse } from 'next/server'
import { issuer, SCOPE } from '@/oauth/config'

// RFC 8414 OAuth 2.0 Authorization Server Metadata. Claude.ai's MCP connector
// reads this to discover the authorize and token endpoints.
export const GET = () => {
  const iss = issuer()
  return NextResponse.json(
    {
      issuer: iss,
      authorization_endpoint: `${iss}/authorize`,
      token_endpoint: `${iss}/token`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
      scopes_supported: [SCOPE],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
