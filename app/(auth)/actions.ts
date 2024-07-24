'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZSAError, createServerAction } from 'zsa'

import { AuthenticationError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { getInjection } from '@/di/container'
import { signInWithPasswordController } from '@/interface-adapters/controllers/sign-in-with-password.controller'
import {
  SignInWithPasswordInput,
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInWithProviderInputSchema,
  signUpInputSchema,
  signUpOutputSchema,
} from '@/interface-adapters/validation-schemas/auth'

export const signInWithPassword = async (input: SignInWithPasswordInput) => {
  try {
    await signInWithPasswordController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof AuthenticationError) {
      throw new AuthenticationError(err.message)
    }
    throw err
  }

  redirect('/app/collections')
}

export const signInWithProvider = createServerAction()
  .input(signInWithProviderInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = getInjection('IAuthenticationService')
    const data = await authenticationService.signInWithProvider(input.provider)
    revalidatePath('/', 'layout')
    redirect(data.url)
  })

export const signUp = createServerAction()
  .input(signUpInputSchema, { type: 'formData' })
  .output(signUpOutputSchema)
  .handler(async ({ input }) => {
    const authenticationService = getInjection('IAuthenticationService')
    try {
      await authenticationService.signUp(
        input.email,
        input.password,
        input.tsToken
      )
    } catch (err) {
      // TODO: report to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  })

export const resetPassword = createServerAction()
  .input(resetPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = getInjection('IAuthenticationService')
    try {
      await authenticationService.resetPassword(input.password)
    } catch (err) {
      // TODO: report to Sentry
      throw new ZSAError('ERROR', err)
    }

    redirect('/signin')
  })

export const forgotPassword = createServerAction()
  .input(forgotPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = getInjection('IAuthenticationService')
    try {
      await authenticationService.forgotPassword(input.email, input.tsToken)
    } catch (err) {
      // TODO: report to Sentry
      throw new ZSAError('ERROR', err)
    }

    return {
      success: true,
      message: 'Password reset request submitted successfully',
    }
  })
