'use client'

import { useFormStatus } from 'react-dom'

export const CreateButton = () => {
  const { pending, data, method, action } = useFormStatus()
  return (
    <button type="submit" aria-disabled={pending}>
      Create Instance
    </button>
  )
}
