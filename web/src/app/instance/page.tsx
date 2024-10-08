import { createClient } from '@/utils/supabase/server'
import { CreateButton } from './createButton'
import { InstancesList } from './instancesList'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const InstancePage = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from('instance').select()

  const createInstance = async (formData: FormData) => {
    'use server'
    const supabase = createClient()
    const { data, error } = await supabase.from('instance').insert([{}]).select()
    const id = data?.[0]?.id
    if (error === undefined) redirect(`/instance/${id}`)
  }

  return (
    <>
      <section>
        <b>{error && JSON.stringify(error)}</b>
      </section>
      <section>{data && <InstancesList instances={data ?? []} />}</section>
      <section>
        <form action={createInstance}>
          <CreateButton />
        </form>
      </section>
    </>
  )
}

export default InstancePage
