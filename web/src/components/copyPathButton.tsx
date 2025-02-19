import { ReactNode, useState } from 'react'

export interface CopyPathButtonProps {
  path: string
}

export const CopyPathButton = ({ path }: CopyPathButtonProps) => {
  const [message, setMessage] = useState('Copy to Clipboard')
  const [disabled, setDisabled] = useState(false)
  return (
    <button
      type="button"
      style={{}}
      onClick={(e) => {
        e.preventDefault()
        const baseURL = URL.parse(window.location.href)!
        const targetURL = URL.parse(path, baseURL)!
        navigator.clipboard.writeText(targetURL.toString())
        setMessage('Copied!')
        setDisabled(true)
      }}
      disabled={disabled}
    >
      {message}
    </button>
  )
}
