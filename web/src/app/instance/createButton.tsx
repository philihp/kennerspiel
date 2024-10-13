'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createInstance, FormState } from './actions'
import { redirect } from 'next/navigation'

export const CreateButton = () => {
  const [state, formAction] = useFormState(createInstance, {} as FormState)
  const { pending } = useFormStatus()
  if (state?.id) {
    redirect(`/instance/${state?.id}`)
  }
  return (
    <form action={formAction}>
      <button type="submit" aria-disabled={pending}>
        Create Instance
      </button>
    </form>
  )
}
