import { InputParseError } from '@/entities/errors/common'

import {
  ForgotPasswordInput,
  forgotPasswordInputSchema,
} from '@/interface-adapters/validation-schemas/auth'
import { getInjection } from '~/di/container'

export async function forgotPasswordController(input: ForgotPasswordInput) {
  const { data, error: inputParseError } =
    forgotPasswordInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.forgotPassword(data.email, data.tsToken)
}
