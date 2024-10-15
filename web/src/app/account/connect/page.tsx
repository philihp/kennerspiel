'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'

import { login, loginAnonymous } from './actions'

const Connect = () => {
  const [response, setResponse] = useState<string>('')
  const [captchaToken, setCaptchaToken] = useState<string>('')

  const loginAndReturn = async (formData: FormData) => {
    const error = await login(formData, captchaToken)
    if (error) {
      setResponse(error)
      return
    }
    redirect('/instance')
  }

  const loginAsGuest = async (formData: FormData) => {
    const error = await loginAnonymous(formData, captchaToken)
    if (error) {
      setResponse(error)
      return
    }
    redirect('/instance')
  }

  return (
    <>
      <h1>Connect</h1>
      <p>Connect to be able to resume games or automatically save new ones. You can play without connecting, but you&apos;ll lose your games if you close your browser.</p>
      <form onSubmit={() => setResponse('')}>
        <label htmlFor="email">Email:</label>
        <br />
        <input id="email" name="email" type="email" />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input id="password" name="password" type="password" />
        <br />
        <button formAction={loginAsGuest}>Skip</button>
        {' '}
        <button formAction={loginAndReturn}>Login</button>{response && (
          <>
            <svg height="10" width="20">
              <circle cx="10" cy="5" r="5" fill="#FF0000" />
            </svg>
            {response}
          </>
        )}
        <div>
          <a href="reset">Forgot Password</a>
        </div>
      </form>
      <hr />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={setCaptchaToken}
          options={{
            action: 'login',
            theme: 'light',
            size: 'normal',
          }}
        />
      )}
    </>
  )
}

export default Connect
