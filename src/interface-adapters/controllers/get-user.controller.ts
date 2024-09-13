import { UnauthenticatedError } from '@/entities/errors/auth'
import { User } from '@/entities/models/users'

import { getInjection } from '~/di/container'

function presenter(user: User) {
  return {
    id: user.id,
    email: user.email,
  }
}

export async function getUserController(): Promise<User> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()
  if (user) {
    return presenter(user)
  }
  throw new UnauthenticatedError('No valid session')
}
