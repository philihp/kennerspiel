'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

import { reset } from './actions'

const ResetPage = () => {
  const [disabled, setDisabled] = useState(false)
  const [color, setColor] = useState('#000000')
  const [response, setResponse] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string>('')

  const resetAndReturn = async (formData: FormData) => {
    const error = await reset(formData, captchaToken)
    if (error) {
      setDisabled(false)
      setResponse(error)
      setColor('#FF0000')
      return
    }

    setResponse('Check your email for a link.')
    setColor('#00AF00')
  }

  const handleEmailChange = () => {
    setDisabled(false)
  }

  return (
    <form
      onSubmit={() => {
        setResponse('')
        setDisabled(true)
      }}
    >
      <h1>Reset Password</h1>
      <p>Forgot your password? Let&apos;s verify your email to reset it.</p>
      <label htmlFor="email">Email:</label>
      <br />
      <input id="email" name="email" type="email" required onChange={handleEmailChange} />
      <br />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <br />
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setCaptchaToken}
            options={{
              action: 'reset',
              theme: 'light',
              size: 'normal',
            }}
          />
        </>
      )}
      <br />
      <button className="primary" formAction={resetAndReturn} disabled={disabled}>
        Re-verify Email
      </button>
      {response && (
        <>
          <svg height="10" width="20">
            <circle cx="10" cy="5" r="5" fill={color} />
          </svg>
          {response}
        </>
      )}
    </form>
  )
}

export default ResetPage
