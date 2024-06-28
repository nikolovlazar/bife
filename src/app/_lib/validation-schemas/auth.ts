import { z } from 'zod'

export const signInWithPasswordOutputSchema = z.object({
  errors: z
    .object({
      email: z.string().optional(),
      password: z.string().optional(),
    })
    .optional(),
})

export const signInWithPasswordFormSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export const signInWithPasswordInputSchema = signInWithPasswordFormSchema.merge(
  z.object({
    tsToken: z.string(),
  })
)

export const signInWithProviderInputSchema = z.object({
  provider: z.string().min(1),
})

export const signUpInputSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    tsToken: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['password'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

export const resetPasswordInputSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['password'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

export const forgotPasswordInputSchema = z.object({
  email: z.string().email('Invalid email'),
  tsToken: z.string(),
})
