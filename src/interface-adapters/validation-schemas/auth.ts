import { z } from 'zod'

export const signInWithPasswordFormSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export type SignInWithPasswordForm = z.infer<
  typeof signInWithPasswordFormSchema
>

export const signInWithPasswordInputSchema = signInWithPasswordFormSchema.merge(
  z.object({
    tsToken: z.string(),
  })
)

export type SignInWithPasswordInput = z.infer<
  typeof signInWithPasswordInputSchema
>

export const signInWithProviderInputSchema = z.object({
  provider: z.string().min(1),
})

export type SignInWithProviderInput = z.infer<
  typeof signInWithProviderInputSchema
>

export const signUpOutputSchema = z.object({
  errors: z
    .object({
      email: z.string().optional(),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .optional(),
  success: z.boolean().optional(),
})

export type SignUpOutput = z.infer<typeof signUpOutputSchema>

export const signUpFormSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export type SignUpForm = z.infer<typeof signUpFormSchema>

export const signUpInputSchema = signUpFormSchema
  .merge(
    z.object({
      tsToken: z.string(),
    })
  )
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

export type SignUpInput = z.infer<typeof signUpInputSchema>

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

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>

export const forgotPasswordInputSchema = z.object({
  email: z.string().email('Invalid email'),
  tsToken: z.string(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>
