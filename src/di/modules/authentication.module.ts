import { ContainerModule, interfaces } from 'inversify'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { AuthenticationService } from '@/infrastructure/services/authentication-service'
import { MockAuthenticationService } from '@/infrastructure/services/authentication-service.mock'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === 'test') {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      MockAuthenticationService
    )
  } else {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationService
    )
  }
}

export const AuthenticationModule = new ContainerModule(initializeModule)
