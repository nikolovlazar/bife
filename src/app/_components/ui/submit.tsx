'use client'

import { LoaderCircleIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { useFormStatus } from 'react-dom'

import { cn } from '@/app/_lib/utils'

import { Button, ButtonProps } from './button'

export const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { pending } = useFormStatus()
    return (
      <Button
        disabled={pending}
        className={cn(className)}
        {...props}
        ref={ref}
        type="submit"
      >
        {pending && <LoaderCircleIcon className="mr-2 animate-spin" />}
        {children}
      </Button>
    )
  }
)

SubmitButton.displayName = 'SubmitButton'
