import { createClient } from '@supabase/supabase-js'
import { Database } from '@/supabase.types'

// Unlike client.ts/server.ts, this client authenticates with the service-role
// key and bypasses RLS. It must only ever be imported from server-side code
// that enforces its own authorization (see src/mcp/tools).
export const createServiceClient = () =>
  createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
