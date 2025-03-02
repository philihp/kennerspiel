import { ClipboardCopy } from 'lucide-react'
import { useState } from 'react'

export interface CopyPathButtonProps {
  path: string
}

export const CopyPathButton = ({ path }: CopyPathButtonProps) => {
  const [message, setMessage] = useState('Copy')
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
      {message} <ClipboardCopy size={12} />
    </button>
  )
}
