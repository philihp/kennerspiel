import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ConfirmForm } from './confirmForm'

const ConfirmEmailPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/account/login')
  }

  return (
    <>
      <h1>Confirm Email</h1>
      <p>
        <strong>Email:</strong>
        {user?.email}
        <br />
        <strong>Confirmed:</strong>
        {user?.confirmed_at}
        {user?.email_change_sent_at}
      </p>
      {!user.is_anonymous && (
        <>
          If we have the wrong email, or you just want to change it, what should it be?
          <br />
          <br />
          <ConfirmForm />
        </>
      )}
    </>
  )
}

export default ConfirmEmailPage
