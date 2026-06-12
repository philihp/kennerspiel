import { protectedResourceHandler, metadataCorsOptionsRequestHandler } from 'mcp-handler'
import { issuer, resourceIdentifier } from '@/oauth/config'

// RFC 9728 Protected Resource Metadata. Points MCP clients at our
// authorization server when they receive a 401 from /api/mcp.
export const GET = (req: Request) =>
  protectedResourceHandler({ authServerUrls: [issuer()], resourceUrl: resourceIdentifier() })(req)

export const OPTIONS = metadataCorsOptionsRequestHandler()
