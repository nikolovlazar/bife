'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZSAError, createServerAction } from 'zsa'

import { getInjection } from '@/di/container'
import {
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInWithPasswordInputSchema,
  signInWithProviderInputSchema,
  signUpInputSchema,
  signUpOutputSchema,
} from '@/interface-adapters/validation-schemas/auth'

export const signInWithPassword = createServerAction()
  .input(signInWithPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = getInjection('IAuthenticationService')

    try {
      await authenticationService.signInWithPassword(
        input.email,
        input.password,
        input.tsToken
      )
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    redirect('/app/collections')
  })

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
