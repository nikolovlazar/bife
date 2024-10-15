import { InputParseError } from '@/entities/errors/common'

import {
  SignUpInput,
  signUpInputSchema,
} from '@/interface-adapters/validation-schemas/auth'
import { getInjection } from '~/di/container'

export async function signUpController(input: SignUpInput) {
  const { data, error: inputParseError } = signUpInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signUp(data.email, data.password, data.tsToken)
}
