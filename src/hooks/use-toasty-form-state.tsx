import { useFormState } from 'react-dom'

import type { GenericFormState } from '@/utils/types'

export function useGenericFormState(
  action: (
    state: GenericFormState,
    payload: FormData
  ) => GenericFormState | Promise<GenericFormState>,
  initialState: Awaited<GenericFormState>,
  permalink?: string
): [GenericFormState, (payload: FormData) => void] {
  const [state, formAction] = useFormState<GenericFormState, FormData>(
    action,
    initialState,
    permalink
  )
  return [state, formAction]
}
