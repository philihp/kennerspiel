'use client'

import { useState, useRef } from 'react'
import { redirect } from 'next/navigation'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

import { login } from './actions'
import { useSupabaseContext } from '@/context/SupabaseContext'
import Link from 'next/link'

const Login = () => {
  const { redirectTo } = useSupabaseContext()
  const [response, setResponse] = useState<string>('')
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const ref = useRef<TurnstileInstance>(null)

  const handleLogin = async (formData: FormData) => {
    const error = await login(formData, captchaToken)
    if (error) {
      setResponse(error)
      ref.current?.reset()
      return
    }
    redirect(redirectTo)
  }

  // const handleSkip = async (formData: FormData) => {
  //   const error = await skip(formData, captchaToken)
  //   if (error) {
  //     setResponse(error)
  //     return
  //   }
  //   redirect(redirectTo)
  // }

  return (
    <>
      <h1>Login</h1>
      <p>
        Reconnect to your account to resume gameplay from another device, or{' '}
        <Link href="/account/register">register a new account</Link>.
      </p>
      <form onSubmit={() => setResponse('')}>
        <label htmlFor="email">Email:</label>
        <br />
        <input id="email" name="email" type="email" autoComplete="email" />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input id="password" name="password" type="password" autoComplete="current-password" />
        <div>
          <a href="reset">Forgot Password</a>
        </div>
        <br />
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <>
            <Turnstile
              ref={ref}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setCaptchaToken}
              options={{
                action: 'login',
                theme: 'light',
                size: 'normal',
              }}
            />
            <br />
          </>
        )}
        <button className="primary" formAction={handleLogin}>
          Login
        </button>
        {response && (
          <>
            <svg height="10" width="20">
              <circle cx="10" cy="5" r="5" fill="#FF0000" />
            </svg>
            {response}
          </>
        )}
      </form>
    </>
  )
}

export default Login
