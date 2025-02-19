'use client'

import { createInstance, FormState } from './actions'
import { redirect, RedirectType } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { useEffect, useState, useActionState } from 'react'

type Params = {
  user: User | null
}

export const CreateButton = ({ user }: Params) => {
  const [{ error, id }, formAction, isPending] = useActionState(createInstance, {} as FormState)
  const [color, setColor] = useState('#000000')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!error) return
    setMessage(error.message)
    setColor('#FF0000')
  }, [error])

  useEffect(() => {
    if (id) {
      redirect(`/instance/${id}`, RedirectType.push)
    }
  }, [id])

  return (
    <form action={formAction}>
      <button type="submit" disabled={user === null || isPending}>
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
