'use client'

import { useState, useRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

import { reset } from './actions'

const ResetPage = () => {
  const [disabled, setDisabled] = useState(false)
  const [color, setColor] = useState('#000000')
  const [response, setResponse] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const ref = useRef<TurnstileInstance>(null)

  const resetAndReturn = async (formData: FormData) => {
    const { error } = await reset(formData, captchaToken)
    if (error) {
      setDisabled(false)
      setResponse(error.message ?? 'Unknown error, check frontend console log')
      ref.current?.reset()
      setColor('#FF0000')
      return
    }
    setDisabled(false)
  }

  const handleEmailChange = () => {
    setDisabled(false)
  }

  return (
    <form
      onSubmit={() => {
        setDisabled(true)
        setResponse('')
      }}
    >
      <h1>Forgot Password</h1>
      <p>Forgot your password? Let&apos;s verify your email to reset it.</p>
      <label htmlFor="email">Email:</label>
      <br />
      <input id="email" name="email" type="email" required onChange={handleEmailChange} />
      <br />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <br />
          <Turnstile
            ref={ref}
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
        Re&apos;verify Email
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
