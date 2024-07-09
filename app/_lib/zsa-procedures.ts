import { redirect } from 'next/navigation'
import { createServerActionProcedure } from 'zsa'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { inject } from '@/di/container'
import { DI_TYPES } from '@/di/types'

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    const authenticationService = inject<IAuthenticationService>(
      DI_TYPES.AuthenticationService
    )

    try {
      const user = await authenticationService.getUser()
      return { user }
    } catch (err) {
      redirect('/signin')
    }
  }
)
