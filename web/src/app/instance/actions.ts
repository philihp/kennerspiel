import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'

export const createInstance = async (formData: FormData) => {
  'use server'

  console.log(`creating ${JSON.stringify(formData)}`)
  const supabase = createClient()

  const { data, error } = await supabase.from('instance').insert([{}]).select()
  return { message: JSON.stringify(data), error }
}
