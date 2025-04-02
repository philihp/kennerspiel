'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

import { register } from './actions'

const RegisterPage = () => {
  const [disabled, setDisabled] = useState(false)
  const [color, setColor] = useState('#000000')
  const [response, setResponse] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const signupAndReturn = async (formData: FormData) => {
    const error = await register(formData, captchaToken)
    if (error) {
      setDisabled(false)
      setResponse(error)
      setColor('#FF0000')
      return
    }

    setResponse('A perfect time to check your email inbox.')
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
      <h1>Register</h1>
      <p>Create an account to join an instance. </p>
      <label htmlFor="email">Email:</label>
      <br />
      <input id="email" name="email" type="email" required onChange={handleEmailChange} autoComplete="email" />
      <br />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <br />
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setCaptchaToken}
            options={{
              action: 'register',
              theme: 'light',
              size: 'normal',
            }}
          />
        </>
      )}
      <br />
      <button className="primary" formAction={signupAndReturn} disabled={disabled}>
        Register
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

export default RegisterPage
