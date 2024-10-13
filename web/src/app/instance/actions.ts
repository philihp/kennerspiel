'use server'

import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'

export type FormState = {
  error?: PostgrestError
  id?: string
}

export const createInstance = async (prevState: FormState, formData: FormData): Promise<FormState> => {
  const supabase = createClient()
  const { data, error } = await supabase.from('instance').insert([{}]).select()
  if (error) return { error }
  return { id: data?.[0]?.id }
}
