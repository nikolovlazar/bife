'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInInputSchema,
  signUpInputSchema,
} from '../_lib/validation-schemas/auth'
import { baseProcedure } from '../_lib/zsa-procedures'

export const signIn = baseProcedure
  .createServerAction()
  .input(signInInputSchema, { type: 'formData' })
  .handler(async ({ input, ctx }) => {
    const { authenticationService } = ctx

    if (input.provider !== null) {
      const data = await authenticationService.signInWithProvider(
        input.provider
      )
      revalidatePath('/', 'layout')
      redirect(data.url)
    }

    await authenticationService.signInWithPassword(
      input.email,
      input.password,
      input.tsToken
    )

    revalidatePath('/', 'layout')
    redirect('/')
  })

export const signUp = baseProcedure
  .createServerAction()
  .input(signUpInputSchema, { type: 'formData' })
  .handler(async ({ input, ctx }) => {
    await ctx.authenticationService.signUp(
      input.email,
      input.password,
      input.tsToken
    )

    revalidatePath('/', 'layout')
    redirect('/')
  })

export const resetPassword = baseProcedure
  .createServerAction()
  .input(resetPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input, ctx }) => {
    await ctx.authenticationService.resetPassword(input.password)
    redirect('/signin')
  })

export const forgotPassword = baseProcedure
  .createServerAction()
  .input(forgotPasswordInputSchema, { type: 'formData' })
  .handler(async ({ input, ctx }) => {
    await ctx.authenticationService.forgotPassword(input.email, input.tsToken)
    return {
      success: true,
      message: 'Password reset request submitted successfully',
    }
  })
