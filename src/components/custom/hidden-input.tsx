import { forwardRef } from 'react'

export const HiddenInput = forwardRef<HTMLInputElement>(
  (props: Partial<HTMLInputElement>, ref) => {
    return (
      <input
        ref={ref}
        name={props.name}
        readOnly
        type="text"
        hidden
        aria-hidden
        aria-readonly
        value={props.value}
        className="hidden"
      />
    )
  }
)

HiddenInput.displayName = 'HiddenInput'
