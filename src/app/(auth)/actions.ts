'use server'

import { Provider } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from './validationSchemas'
import { createClient } from '@/utils/supabase/server'

const externalProviders = ['google', 'github']
export async function signin(formData: FormData) {
  const formValues = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    provider: formData.get('provider')?.toString(),
    tsToken: formData.get('tsToken')?.toString(),
  }

  const supabase = createClient()

  if (formValues.provider && externalProviders.includes(formValues.provider)) {
    const redirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/callback'
        : 'https://bife.sh/api/auth/callback'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: formValues.provider as Provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')
    redirect(data.url)
  }

  const validation = signinSchema.safeParse(formValues)

  if (!validation.success) {
    return {
      errors: {
        email: validation.error.formErrors.fieldErrors.email?.[0],
        password: validation.error.formErrors.fieldErrors.password?.[0],
      },
    }
  }

  const values = validation.data

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
    options: { captchaToken: formValues.tsToken },
  })

  if (error) {
    return {
      errors: { email: error.message, password: error.message },
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const formValues = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
    tsToken: formData.get('tsToken')?.toString(),
  }

  const validation = signupSchema.safeParse(formValues)

  if (!validation.success) {
    return {
      errors: {
        email: validation.error.formErrors.fieldErrors.email?.[0],
        password: validation.error.formErrors.fieldErrors.password?.[0],
        confirmPassword:
          validation.error.formErrors.fieldErrors.confirmPassword?.[0],
      },
    }
  }

  const supabase = createClient()

  const values = validation.data

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: { captchaToken: formValues.tsToken },
  })

  if (error) {
    return {
      errors: {
        email: error.message,
        password: error.message,
        confirmPassword: error.message,
      },
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const formValues = {
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
    tsToken: formData.get('tsToken')?.toString(),
  }

  const validation = resetPasswordSchema.safeParse(formValues)

  if (!validation.success) {
    return {
      errors: {
        password: validation.error.formErrors.fieldErrors.password?.[0],
        confirmPassword:
          validation.error.formErrors.fieldErrors.confirmPassword?.[0],
      },
    }
  }

  const supabase = createClient()

  const values = validation.data

  const { error } = await supabase.auth.updateUser({
    password: values.password,
  })

  if (error) {
    return {
      errors: {
        password: error.message,
        confirmPassword: error.message,
      },
    }
  }

  redirect('/signin')
}

export async function forgotPassword(formData: FormData) {
  const formValues = {
    email: formData.get('email')?.toString(),
    tsToken: formData.get('tsToken')?.toString(),
  }

  const validation = forgotPasswordSchema.safeParse(formValues)

  if (!validation.success) {
    return {
      errors: {
        email: validation.error.formErrors.fieldErrors.email?.[0],
      },
    }
  }

  const supabase = createClient()

  const values = validation.data

  const redirectTo =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/auth/reset-password'
      : 'https://bife.sh/api/auth/reset-password'

  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo,
    captchaToken: formValues.tsToken,
  })

  if (error) {
    return {
      errors: {
        email: error.message,
      },
    }
  }

  return {
    success: true,
    message: 'Password reset request submitted successfully',
  }
}
