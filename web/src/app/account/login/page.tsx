'use client';

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'

import { login } from './actions'

const Login = () => {
  const [response, setResponse] = useState<string>('')
  const [captchaToken, setCaptchaToken] = useState<string>('')

  const loginAndReturn = async (formData: FormData) => {
    const error = await login(formData, captchaToken)
    if (error) {
      setResponse(error)
      return;
    }
    redirect('/')
  }

  return (
    <>
      <h1>Login</h1>
      <p>Login to access your hangar.</p>
      <form onSubmit={() => setResponse('')}>
        <label htmlFor="email">Email:</label><br />
        <input id="email" name="email" type="email" required /><br />
        <label htmlFor="password">Password:</label><br />
        <input id="password" name="password" type="password" required /><br />
        <button formAction={loginAndReturn}>Log in</button>
        {
          response && <>
            <svg height="10" width="20">
              <circle cx="10" cy="5" r="5" fill="#FF0000" />
            </svg>
            {response}
          </>
        }
        <div>
          <a href="reset">Forgot Password</a>
        </div>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
          onSuccess={setCaptchaToken}
          options={{
            action: 'login',
            theme: 'light',
            size: 'normal'
          }}
        />
      </form>
    </>
  )
}

export default Login