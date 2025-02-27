import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const execute = async () => {
  if (!supabaseUrl) return console.error('Please add the SUPABASE_URL to Github variables')
  if (!supabaseKey) return console.error('Please add the SUPABASE_KEY to Github secrets')
  const supabase = createClient(supabaseUrl, supabaseKey)
  const result = await supabase.from('instance').select('*', { count: 'exact', head: true })
  console.log(result)
}

execute()
