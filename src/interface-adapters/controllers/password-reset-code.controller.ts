import { InputParseError } from '@/entities/errors/common'

import '@/interface-adapters/validation-schemas/auth'
import { getInjection } from '~/di/container'

export async function passwordResetCodeController(input: {
  code: string | null
}) {
  if (!input.code) {
    throw new InputParseError('Missing code. Cannot exchange code for session.')
  }

  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.exchangeCodeForSession(input.code)
}
