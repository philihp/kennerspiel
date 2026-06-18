import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const INSTANCE_PATH_RE = /^\/instance\/([^/]+)\/?$/

// MCP clients negotiate the streamable-http transport using one of: a Bearer
// token in Authorization, a JSON-RPC POST body, or an SSE-flavored Accept
// header. None of those shapes match an ordinary browser visit to the HTML
// instance page, so we rewrite the request to the /mcp sub-route. That lets a
// user paste plain https://kennerspiel.com/instance/<uuid> into Claude / GPT
// and have it discovered as an MCP endpoint without a /mcp suffix.
const isMcpShapedRequest = (request: NextRequest): boolean => {
  const authz = request.headers.get('authorization')
  if (authz && authz.toLowerCase().startsWith('bearer ')) return true
  const accept = request.headers.get('accept') ?? ''
  if (accept.includes('text/event-stream')) return true
  if (request.method === 'POST') {
    const ct = request.headers.get('content-type') ?? ''
    if (ct.includes('application/json')) return true
  }
  if (request.method === 'OPTIONS') {
    const acrh = request.headers.get('access-control-request-headers') ?? ''
    if (acrh.toLowerCase().includes('authorization')) return true
  }
  return false
}

export async function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(INSTANCE_PATH_RE)
  if (match && UUID_RE.test(match[1]) && isMcpShapedRequest(request)) {
    const url = request.nextUrl.clone()
    url.pathname = `/instance/${match[1]}/mcp`
    return NextResponse.rewrite(url)
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/mcp (MCP requests carry a bearer token, not Supabase auth cookies)
     * - instance/<uuid>/mcp (per-instance MCP endpoint, same reason)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|api/mcp|instance/[^/]+/mcp|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
