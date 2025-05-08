import * as flags from '../../../flags'
import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'

// This function handles the authorization check for you
export const GET = createFlagsDiscoveryEndpoint(async (request) => {
  // your previous logic in here to gather your feature flags
  const apiData = await getProviderData(flags)

  // return the ApiData directly, without a NextResponse.json object.
  return apiData
})
