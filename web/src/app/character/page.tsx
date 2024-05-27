import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { register } from './actions'

const CharacterPage = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error: authError } = await supabase.auth.getUser()
  if (authError || !data?.user) {
    redirect('/')
  }

  const { data: characters, status, statusText, error } = await supabase.from('character').select()

  return <>
    <h1>Characters</h1>
    <ul>
      {characters?.map(c => <li key={`character-${c.id}`}>
        {
          JSON.stringify(c)
        }
      </li>)}
    </ul >
    {
      error && <>
        <strong>{status}: {statusText}</strong >
        <br />
        <em>{error.code}: {error.message}</em>
      </>
    }
    <form>
      <button formAction={register}>Add Character</button>
    </form>
  </>
}
export default CharacterPage