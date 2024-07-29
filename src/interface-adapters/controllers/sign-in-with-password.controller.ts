import { InputParseError } from '@/entities/errors/common'

import {
  SignInWithPasswordInput,
  signInWithPasswordInputSchema,
} from '../validation-schemas/auth'

import { getInjection } from '~/di/container'

export async function signInWithPasswordController(
  input: SignInWithPasswordInput
): Promise<void> {
  const { data, error: inputParseError } =
    signInWithPasswordInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    data.email,
    data.password,
    data.tsToken
  )
}
