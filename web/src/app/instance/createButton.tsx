'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createInstance, FormState } from './actions'
import { redirect, RedirectType } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

type Params = {
  user: User | null
}

export const CreateButton = ({ user }: Params) => {
  const [{ error, id }, formAction, pending] = useFormState(createInstance, {} as FormState)
  const [color, setColor] = useState('#000000')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!error) return
    setMessage(error.message)
    setColor('#FF0000')
  }, [error])

  if (id) {
    redirect(`/instance/${id}`, RedirectType.push)
  }

  return (
    <form action={formAction}>
      <button type="submit" disabled={user === null || pending}>
        Create Instance
      </button>
      {error && (
        <>
          <svg height="10" width="20">
            <circle cx="10" cy="5" r="5" fill={color} />
          </svg>
          {message}
        </>
      )}
    </form>
  )
}
