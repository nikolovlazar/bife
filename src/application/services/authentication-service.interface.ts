import { User } from '@/entities/models/users'

export interface IAuthenticationService {
  getUser(): Promise<User>
  signInWithProvider(provider: string): Promise<{ url: string }>
  signInWithPassword(
    email: string,
    password: string,
    tsToken: string
  ): Promise<void>
  signOut(): Promise<void>
  signUp(email: string, password: string, tsToken: string): Promise<void>
  resetPassword(password: string): Promise<void>
  forgotPassword(email: string, tsToken: string): Promise<void>
  exchangeCodeForSession(code: string): Promise<void>
}
