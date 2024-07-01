import { redirect } from 'next/navigation'
import { createServerActionProcedure } from 'zsa'

import { ServiceLocator } from '@/services/serviceLocator'

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )

    try {
      const user = await authenticationService.getUser()
      return { user }
    } catch (err) {
      redirect('/signin')
    }
  }
)
