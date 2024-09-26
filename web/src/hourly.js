import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const execute = async () => {
  if (!supabaseUrl) return console.log('MISSING SUPABASE_URL')
  if (!supabaseKey) return console.log('MISSING SUPABASE_KEY')
  const supabase = createClient(supabaseUrl, supabaseKey)
  const result = await supabase.from('state').select('*', { count: 'exact', head: true })
  console.log(result)
}

execute()
