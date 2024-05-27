'use client';

import { useState } from "react";

import { changePassword } from './actions'
import Dot from './dot'

const ChangePassword = () => {
  const [response, setResponse] = useState('')
  const [color, setColor] = useState('#000000')

  const changePasswordAndReturn = async (formData: FormData) => {
    const error = await changePassword(formData)
    if (error) {
      setResponse(error)
      setColor('#FF0000')
      return
    }

    setColor('#00AF00')
    setResponse('Password changed')
  }

  return <>
    <h2>Change Password</h2>
    <form>
      <label htmlFor="password">New Password:</label><br />
      <input id="password" name="password" type="password" required /><br />
      <label htmlFor="confirm">Confirm Password:</label><br />
      <input id="confirm" name="confirm" type="password" required /><br />
      <button formAction={changePasswordAndReturn}>Change Password</button>
    </form>
    <p>
      {response &&
        <Dot color={color} response={response} />
      }
    </p>
  </>
}

export default ChangePassword