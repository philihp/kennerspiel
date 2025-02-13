'use server'

import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'

export type FormState = { error?: PostgrestError; id?: string }

export const createInstance = async (prevState: FormState, formData: FormData): Promise<FormState> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('instance').insert([{}]).select()
  if (error) {
    console.error(`createInstance ${error.code} ${error.message}`)
    return { error }
  }
  return { id: data?.[0]?.id }
}
