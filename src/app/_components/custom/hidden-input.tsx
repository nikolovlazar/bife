import { forwardRef } from 'react'

export const HiddenInput = forwardRef<HTMLInputElement>(
  (props: Partial<HTMLInputElement>, ref) => {
    return (
      <input
        ref={ref}
        readOnly
        type="text"
        hidden
        aria-hidden
        aria-readonly
        className="hidden"
        {...props}
      />
    )
  }
)

HiddenInput.displayName = 'HiddenInput'
