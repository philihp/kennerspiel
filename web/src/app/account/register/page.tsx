'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { captchaToken, resetCaptcha } from '@/utils/captcha'

import { emailUsed, register } from './actions'
import { CheckCircle2, XCircle } from 'lucide-react'
import { match } from 'ts-pattern'

const green = '#ccebc5'
const red = '#ffcfb3'

const RegisterPage = () => {
  const [disabled, setDisabled] = useState(false)
  const [color, setColor] = useState('#000000')
  const [response, setResponse] = useState('')
  const turnstile = useRef<TurnstileInstance>(undefined)
  const [email, setEmail] = useState<string>('')
  const [valid, setValid] = useState<undefined | boolean>(undefined)

  useEffect(() => {
    let handle: NodeJS.Timeout
    if (email === '') setValid(undefined)
    else {
      handle = setTimeout(async () => {
        setValid(await emailUsed(email))
      }, 250)
    }
    return () => {
      clearTimeout(handle)
    }
  }, [email])

  const info = {
    disabled,
    email,
    valid,
  }

  const signupAndReturn = async (formData: FormData) => {
    setResponse('')
    setDisabled(true)
    const error = await register(formData, await captchaToken(turnstile))
    resetCaptcha(turnstile)
    if (error) {
      setDisabled(false)
      setResponse(error)
      setColor('#FF0000')
      return
    }

    setResponse('A perfect time to check your email inbox.')
    setColor('#00AF00')
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!e.target.value.match(mailformat)) {
      // if the email is not valid
      setValid(undefined)
    } else {
      // if this is hypothetically a valid email
      setEmail(e.target.value)
      setDisabled(false)
    }
  }

  return (
    <form action={signupAndReturn}>
      <h1>Register</h1>
      <p>Create an account to create or join an instance. </p>
      <label htmlFor="email">Email:</label>
      <br />
      <input id="email" name="email" type="email" required onChange={handleEmailChange} autoComplete="email" />
      {match(valid)
        .with(true, () => <XCircle fill={red} size={18} />)
        .with(false, () => <CheckCircle2 fill={green} size={18} />)
        .otherwise(() => (
          <></>
        ))}
      <br />
      <label htmlFor="password">Password:</label>
      <br />
      <input id="password" name="password" type="password" required autoComplete="new-password" />
      <br />
      <label htmlFor="confirm">Confirm:</label>
      <br />
      <input id="confirm" name="confirm" type="password" required autoComplete="new-password" />
      <br />
      <br />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <br />
          <Turnstile
            ref={turnstile}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            options={{
              action: 'register',
              theme: 'light',
              size: 'normal',
            }}
          />
        </>
      )}
      <br />
      <button className="primary" type="submit" disabled={disabled}>
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
