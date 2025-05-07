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
        <strong>Current Confirmed Email:</strong>
        {user?.email}
        <br />
        <strong>Confirmed:</strong>
        {user?.confirmed_at}
      </p>
      {user?.new_email && (
        <p>
          <strong>Proposed New Email:</strong>
          {user?.new_email}
          <br />
          <strong>Proposed Change</strong>
          {user?.email_change_sent_at}
        </p>
      )}
      {user.is_anonymous && (
        <p>You are logged in anonymously. Registering a recovery email will prevent you from getting locked out.</p>
      )}
      {!user.is_anonymous && (
        <>
          <p>If we have the wrong email, or you just want to change it, what should it be?</p>
          <ConfirmForm />
        </>
      )}
    </>
  )
}

export default ConfirmEmailPage
