'use client'

import { useState } from 'react'
import Dot from '../../../components/dot'
import { confirmEmail } from './actions'

export const ConfirmForm = () => {
  const [response, setResponse] = useState('')
  const [color, setColor] = useState('#000000')

  const confirmEmailAndReturn = async (formData: FormData) => {
    const error = await confirmEmail(formData)
    if (error) {
      setResponse(error)
      setColor('#FF0000')
      return
    }
    setColor('#00AF00')
    setResponse('Check your email for a confirmation.')
  }

  return (
    <>
      <form>
        <label htmlFor="email">Email:</label>
        <br />
        <input id="email" name="email" type="email" required />
        <br />
        <button formAction={confirmEmailAndReturn}>Connect</button>
      </form>
      <p>{response && <Dot color={color} response={response} />}</p>
    </>
  )
}
