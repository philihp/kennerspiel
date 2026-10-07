'use client'

import { useRef, useState } from 'react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { captchaToken, resetCaptcha } from '@/utils/captcha'

import { reset } from './actions'

const ResetPage = () => {
  const [disabled, setDisabled] = useState(false)
  const [color, setColor] = useState('#000000')
  const [response, setResponse] = useState('')
  const turnstile = useRef<TurnstileInstance>(undefined)

  const resetAndReturn = async (formData: FormData) => {
    setResponse('')
    setDisabled(true)
    const error = await reset(formData, await captchaToken(turnstile))
    resetCaptcha(turnstile)
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
    <form action={resetAndReturn}>
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
            ref={turnstile}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            options={{
              action: 'reset',
              theme: 'light',
              size: 'normal',
            }}
          />
        </>
      )}
      <br />
      <button className="primary" type="submit" disabled={disabled}>
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
