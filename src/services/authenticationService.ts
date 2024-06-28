import { type Provider, SupabaseClient } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'

export class AuthenticationService {
  private _supabase: SupabaseClient
  private _providers: Provider[] = ['github', 'google']

  constructor() {
    this._supabase = createClient()
  }

  async signInWithProvider(provider: string) {
    if (!this._providers.some((p) => p === provider)) {
      throw new Error('Provider not supported')
    }

    const redirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/callback'
        : 'https://bife.sh/api/auth/callback'

    const { data, error } = await this._supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      throw error
    }

    return data
  }

  async signInWithPassword(email: string, password: string, tsToken: string) {
    const { error } = await this._supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: tsToken },
    })

    if (error) {
      return {
        errors: { email: error.message, password: error.message },
      }
    }
  }

  async signUp(email: string, password: string, tsToken: string) {
    const { error } = await this._supabase.auth.signUp({
      email,
      password,
      options: { captchaToken: tsToken },
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
  }

  async resetPassword(password: string) {
    const { error } = await this._supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      throw new Error('Cannot reset password: ' + error.message)
    }
  }

  async forgotPassword(email: string, tsToken: string) {
    const redirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/reset-password'
        : 'https://bife.sh/api/auth/reset-password'

    const { error } = await this._supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
      captchaToken: tsToken,
    })

    if (error) {
      throw new Error('Unable to request password reset: ' + error.message)
    }
  }
}
