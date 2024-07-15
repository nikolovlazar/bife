import { injectable } from 'inversify'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { User } from '@/entities/models/users'

@injectable()
export class MockAuthenticationService implements IAuthenticationService {
  getUser(): Promise<User> {
    return Promise.resolve({ id: 'test-lazar' })
  }
  signInWithProvider(provider: string): Promise<{ url: string }> {
    throw new Error('Method not implemented.')
  }
  signInWithPassword(
    email: string,
    password: string,
    tsToken: string
  ): Promise<void> {
    throw new Error('Method not implemented.')
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
