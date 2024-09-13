import { injectable } from 'inversify'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/entities/errors/auth'
import { User } from '@/entities/models/users'

@injectable()
export class MockAuthenticationService implements IAuthenticationService {
  private _users: User[]
  private _passwords: Record<string, string>
  private _currentUser: User | undefined

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
    this._currentUser = undefined
  }

  getUser(): Promise<User> {
    if (this._currentUser) {
      return Promise.resolve(this._currentUser)
    }

    throw new UnauthenticatedError('Not authenticated')
  }

  signInWithProvider(_: string): Promise<{ url: string }> {
    throw new Error('Method not implemented.')
  }

  signInWithPassword(
    email: string,
    password: string,
    _: string
  ): Promise<void> {
    const user = this._users.find((user) => user.email === email)
    if (!user || this._passwords[user.id] !== password) {
      throw new AuthenticationError('Invalid credentials')
    }

    this._currentUser = user
    return Promise.resolve()
  }

  signOut(): Promise<void> {
    this._currentUser = undefined
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
