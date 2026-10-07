import { RefObject } from 'react'
import { TurnstileInstance } from '@marsidev/react-turnstile'

// Wait until the widget has a token. A password manager can submit the form
// before the widget is solved, and an empty token always fails. With no widget
// (no site key), there is no token to send.
export const captchaToken = (turnstile: RefObject<TurnstileInstance | undefined>): Promise<string | undefined> =>
  turnstile.current?.getResponsePromise().catch(() => undefined) ?? Promise.resolve(undefined)

// A Turnstile token is good for one verification only, so get a new one after
// each attempt. Otherwise a retry after a failed attempt sends a spent token.
export const resetCaptcha = (turnstile: RefObject<TurnstileInstance | undefined>): void => turnstile.current?.reset()
