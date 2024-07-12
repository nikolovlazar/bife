import { redirect } from 'next/navigation'
import { createServerActionProcedure } from 'zsa'

import { getInjection } from '@/di/container'

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    const authenticationService = getInjection('IAuthenticationService')
    try {
      const user = await authenticationService.getUser()
      return { user }
    } catch (err) {
      redirect('/signin')
    }
  }
)
