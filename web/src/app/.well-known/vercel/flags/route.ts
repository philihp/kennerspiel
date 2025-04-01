import { verifyAccess, type ApiData } from 'flags'
import { getProviderData } from 'flags/next'
import { NextResponse, type NextRequest } from 'next/server'
import * as flags from '../../../flags'

//   return NextResponse.json<ApiData>({
//     definitions: {
//       ireland: {
//         description: 'Allow Ireland Variant',
//         origin: 'https://example.com/#new-feature',
//         options: [
//           { value: false, label: 'Locked' },
//           { value: true, label: 'Unlocked' },
//         ],
//       },
//     },
//   })
// }

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  const providerData = getProviderData(flags)
  return NextResponse.json<ApiData>(providerData)
}
