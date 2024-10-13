'use server'

import { createClient } from '@/utils/supabase/server'

export const createInstance = async (formData: FormData) => {
  const supabase = createClient()
  const { data, error } = await supabase.from('instance').insert([{}]).select()
  if (error === null) {
    console.log({ redirect: `/instance/${data?.[0]?.id}` })
  }
}
