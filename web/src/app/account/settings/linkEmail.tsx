'use client'

import { useState } from "react"
import Dot from "./dot"
import { linkEmail } from "./actions"

export const LinkEmail = () => {

  const [response, setResponse] = useState('')
  const [color, setColor] = useState('#000000')

  const linkEmailAndReturn = async (formData: FormData) => {
    const error = await linkEmail(formData)
    if (error) {
      setResponse(error)
      setColor('#FF0000')
      return
    }
    setColor('#00AF00')
    setResponse('Check your email for a confirmation.')
  }

  return <>
    <h2>⚠️ Link Email</h2>
    <p>You will lose access to any games when you close your browser. To prevent this, link an email. Or don&apos;t, but that&apos;s on you.</p>
    <form>
      <label htmlFor="email">Email:</label><br />
      <input id="email" name="email" type="email" placeholder="you@example.com" required /><br />
      <button formAction={linkEmailAndReturn}>Connect</button>
    </form>
    <p>
      {response && <Dot color={color} response={response} />}
    </p>
  </>
}
