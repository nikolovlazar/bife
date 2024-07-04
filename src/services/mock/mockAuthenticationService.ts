import { wait } from '@/utils/wait'

import { AuthError } from '@/shared/errors/authErrors'

export class MockAuthenticationService {
  private _providers: string[] = ['github', 'google']
  private _user: { id: string; role?: string } | undefined
  private _users: {
    id: string
    role?: string
    email: string
    password: string
  }[]

  constructor() {
    this._users = []
  }

  async getUser() {
    if (!this._user) {
      // TODO: check if not logged in throws exception
      throw new AuthError('User not logged in', 400, {})
    }

    return {
      id: this._user.id,
      role: this._user.role,
    }
  }

  async signInWithProvider(provider: string) {
    throw new Error('signInWithProvider cannot be mocked')
  }

  async signInWithPassword(email: string, password: string, tsToken: string) {
    throw new Error('method not mocked yet')
  }

  async signUp(email: string, password: string, tsToken: string) {
    throw new Error('method not mocked yet')
  }

  async resetPassword(password: string) {
    throw new Error('method not mocked yet')
  }

  async forgotPassword(email: string, tsToken: string) {
    throw new Error('method not mocked yet')
  }
}
