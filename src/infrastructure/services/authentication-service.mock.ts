import { injectable } from 'inversify'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { AuthError } from '@/entities/errors/auth'
import { User } from '@/entities/models/users'

@injectable()
export class MockAuthenticationService implements IAuthenticationService {
  private _users: User[]
  private _passwords: Record<string, string>
  private _currentUser: User | null

  constructor() {
    this._users = [
      {
        id: '1',
        email: 'one@bife.sh',
      },
      {
        id: '2',
        email: 'two@bife.sh',
      },
      {
        id: '3',
        email: 'three@bife.sh',
      },
    ]
    this._passwords = {
      '1': 'onepassword',
      '2': 'twopassword',
      '3': 'threepassword',
    }
    this._currentUser = null
  }

  getUser(): Promise<User> {
    if (this._currentUser) {
      return Promise.resolve(this._currentUser)
    }

    return Promise.resolve(this._users[0])
    // throw new AuthError('Not authenticated', 400, {})
  }

  signInWithProvider(provider: string): Promise<{ url: string }> {
    throw new Error('Method not implemented.')
  }

  signInWithPassword(
    email: string,
    password: string,
    _: string
  ): Promise<void> {
    const user = this._users.find((user) => user.email === email)
    if (!user || this._passwords[user.id] !== password) {
      throw new AuthError('Invalid credentials', 400, {})
    }
    this._currentUser = user
    return Promise.resolve()
  }

  signUp(email: string, password: string, tsToken: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  resetPassword(password: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  forgotPassword(email: string, tsToken: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
