import '@/interface-adapters/validation-schemas/auth'
import { getInjection } from '~/di/container'

export async function signOutController() {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signOut()
}
