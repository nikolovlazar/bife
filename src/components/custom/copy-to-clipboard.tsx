'use client'

import { Check, ClipboardIcon } from 'lucide-react'
import { useState } from 'react'

import { Button, type ButtonProps } from '../ui/button'

export function CopyToClipboard({
  text,
  ...props
}: ButtonProps & { text: string }) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')
  const { onClick, children, ...rest } = props
  return (
    <Button
      variant="ghost"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setState('copied')
        setTimeout(() => {
          setState('idle')
        }, 2000)
      }}
      {...rest}
    >
      {state === 'idle' ? (
        <ClipboardIcon className="w-4 h-4" />
      ) : (
        <Check className="w-4 h-4" />
      )}
    </Button>
  )
}
