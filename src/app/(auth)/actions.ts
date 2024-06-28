'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInWithPasswordInputSchema,
  signInWithPasswordOutputSchema,
  signInWithProviderInputSchema,
  signUpInputSchema,
} from '../_lib/validation-schemas/auth'
import { baseProcedure } from '../_lib/zsa-procedures'

export const signInWithPassword = baseProcedure
  .createServerAction()
  .input(signInWithPasswordInputSchema, { type: 'formData' })
  .output(signInWithPasswordOutputSchema)
  .handler(async ({ input, ctx }) => {
    const { authenticationService } = ctx

    const res = await authenticationService.signInWithPassword(
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

export const signInWithProvider = baseProcedure
  .createServerAction()
  .input(signInWithProviderInputSchema, { type: 'formData' })
  .handler(async ({ input, ctx }) => {
    const { authenticationService } = ctx

    const data = await authenticationService.signInWithProvider(input.provider)
    revalidatePath('/', 'layout')
    redirect(data.url)
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
