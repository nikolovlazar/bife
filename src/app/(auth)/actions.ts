'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZSAError } from 'zsa'

import {
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInWithPasswordInputSchema,
  signInWithProviderInputSchema,
  signUpInputSchema,
  signUpOutputSchema,
} from '../_lib/validation-schemas/auth'
import { baseProcedure } from '../_lib/zsa-procedures'

import { AuthenticationService } from '@/services/authenticationService'
import { ServiceLocator } from '@/services/serviceLocator'
import { AuthError } from '@/shared/errors/authError'

export const signInWithPass = baseProcedure
  .createServerAction()
  .input(signInWithPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    console.log('SIGN IN WITH PASS')
    const authenticationService = ServiceLocator.getService(
      AuthenticationService.name
    )

    try {
      await authenticationService.signInWithPassword(
        input.email,
        input.password,
        input.tsToken
      )

      // TODO: redirect throws, so get it out and redirect only if service returns a value
      // https://www.youtube.com/watch?v=rKzKE1jFEPI&lc=Ugx66i1bTDg4aglIQx94AaABAg <- highlighted comment
      redirect('/app/collections')
    } catch (err) {
      if (err instanceof AuthError) {
        // TODO: report to Sentry
        throw new ZSAError('ERROR', err)
      }
    }
  })

export const signInWithPassword = baseProcedure
  .createServerAction()
  .input(signInWithPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    console.log('SIGN IN WITH PASSWORD')
    const authenticationService = ServiceLocator.getService(
      AuthenticationService.name
    )

    try {
      await authenticationService.signInWithPassword(
        input.email,
        input.password,
        input.tsToken
      )

      redirect('/app/collections')
    } catch (err) {
      if (err instanceof AuthError) {
        // TODO: report to Sentry
        throw new ZSAError('ERROR', err)
      }
    }
  })

export const signInWithProvider = baseProcedure
  .createServerAction()
  .input(signInWithProviderInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = ServiceLocator.getService(
      AuthenticationService.name
    )

    const data = await authenticationService.signInWithProvider(input.provider)
    revalidatePath('/', 'layout')
    redirect(data.url)
  })

export const signUp = baseProcedure
  .createServerAction()
  .input(signUpInputSchema, { type: 'formData' })
  .output(signUpOutputSchema)
  .handler(async ({ input }) => {
    const authenticationService = ServiceLocator.getService(
      AuthenticationService.name
    )
    const res = await authenticationService.signUp(
      input.email,
      input.password,
      input.tsToken
    )

    if (res && res.errors) {
      return res
    }

    revalidatePath('/', 'layout')
    redirect('/')
  })

export const resetPassword = baseProcedure
  .createServerAction()
  .input(resetPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = ServiceLocator.getService(
      AuthenticationService.name
    )
    await authenticationService.resetPassword(input.password)
    redirect('/signin')
  })

export const forgotPassword = baseProcedure
  .createServerAction()
  .input(forgotPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input }) => {
    const authenticationService = ServiceLocator.getService(
      AuthenticationService.name
    )
    await authenticationService.forgotPassword(input.email, input.tsToken)
    return {
      success: true,
      message: 'Password reset request submitted successfully',
    }
  })
