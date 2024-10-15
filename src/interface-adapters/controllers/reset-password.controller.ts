import { InputParseError } from '@/entities/errors/common'

import {
  ResetPasswordInput,
  resetPasswordInputSchema,
} from '@/interface-adapters/validation-schemas/auth'
import { getInjection } from '~/di/container'

export async function resetPasswordController(input: ResetPasswordInput) {
  const { data, error: inputParseError } =
    resetPasswordInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.resetPassword(data.password)
}
