import { type Provider } from '@supabase/supabase-js'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { AuthError } from '@/entities/errors/auth'

import { createClient } from '@/infrastructure/utils/supabase/server'

export class AuthenticationService implements IAuthenticationService {
  private _providers: Provider[] = ['github', 'google']

  constructor() {}

  async getUser() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      // TODO: check if not logged in throws exception
      throw new AuthError(error.message, error.status, {
        cause: error.cause,
      })
    }

    return {
      id: data.user.id,
      email: data.user.email,
    }
  }

  async signInWithProvider(provider: string) {
    if (!this._providers.some((p) => p === provider)) {
      throw new Error('Provider not supported')
    }

    const redirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/callback'
        : 'https://bife.sh/api/auth/callback'

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      throw new AuthError(error.message, error.status, { cause: error.cause })
    }

    return data
  }

  async signInWithPassword(email: string, password: string, tsToken: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: tsToken },
    })

    if (error) {
      throw new AuthError(error.message, error.status, { cause: error.cause })
    }
  }

  async signUp(email: string, password: string, tsToken: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { captchaToken: tsToken },
    })

    if (error) {
      throw new AuthError(error.message, error.status, { cause: error.cause })
    }
  }

  async resetPassword(password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      throw new AuthError(error.message, error.status, { cause: error.cause })
    }
  }

  async forgotPassword(email: string, tsToken: string) {
    const redirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/reset-password'
        : 'https://bife.sh/api/auth/reset-password'

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
      captchaToken: tsToken,
    })

    if (error) {
      throw new AuthError(error.message, error.status, { cause: error.cause })
    }
  }
}
