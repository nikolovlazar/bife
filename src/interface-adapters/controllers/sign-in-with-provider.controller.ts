import { InputParseError } from '@/entities/errors/common'

import {
  SignInWithProviderInput,
  signInWithProviderInputSchema,
} from '../validation-schemas/auth'

import { getInjection } from '~/di/container'

export async function signInWithProviderController(
  input: SignInWithProviderInput
): Promise<{ url: string }> {
  const { data, error: inputParseError } =
    signInWithProviderInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.message)
  }

  const authenticationService = getInjection('IAuthenticationService')
  const userData = await authenticationService.signInWithProvider(data.provider)
  return userData
}
