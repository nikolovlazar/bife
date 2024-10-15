'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { AuthenticationError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { forgotPasswordController } from '@/interface-adapters/controllers/forgot-password.controller'
import { resetPasswordController } from '@/interface-adapters/controllers/reset-password.controller'
import { signInWithPasswordController } from '@/interface-adapters/controllers/sign-in-with-password.controller'
import { signInWithProviderController } from '@/interface-adapters/controllers/sign-in-with-provider.controller'
import { signUpController } from '@/interface-adapters/controllers/sign-up.controller'
import {
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInWithPasswordInput,
  SignUpInput,
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

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get('provider') as string
  let url: string = ''

  try {
    const data = await signInWithProviderController({
      provider: provider as 'google' | 'github',
    })
    url = data.url
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof AuthenticationError) {
      throw new AuthenticationError(err.message)
    }
    throw err
  }

  revalidatePath('/', 'layout')
  redirect(url)
}

export async function signUp(input: SignUpInput) {
  try {
    await signUpController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      return { error: err.message }
    }
    if (err instanceof AuthenticationError) {
      return { error: err.message }
    }
    throw err
  }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function resetPassword(input: ResetPasswordInput) {
  try {
    await resetPasswordController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      return { error: err.message }
    }
    if (err instanceof AuthenticationError) {
      return { error: err.message }
    }
    throw err
  }
  redirect('/signin')
}

export async function forgotPassword(input: ForgotPasswordInput) {
  try {
    await forgotPasswordController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      return { error: err.message }
    }
    if (err instanceof AuthenticationError) {
      return { error: err.message }
    }
    throw err
  }
  return {
    success: true,
    message: 'Password reset request submitted successfully',
  }
}
