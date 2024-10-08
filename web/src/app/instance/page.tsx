import { createClient } from '@/utils/supabase/server'
import { CreateButton } from './createButton'
import { InstancesList } from './instancesList'
import { revalidatePath } from 'next/cache'

const InstancePage = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from('instance').select()

  const createInstance = async (formData: FormData) => {
    'use server'
    const supabase = createClient()
    // const { data: user } = await supabase.auth.getUser()
    // console.log({ user })
    const { data, error } = await supabase.from('instance').insert([{}]).select()
    console.log({ data, error })

    // redirect(`/instance/${data}`)
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
