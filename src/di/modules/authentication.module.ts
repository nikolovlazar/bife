import { ContainerModule, interfaces } from 'inversify'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { AuthenticationService } from '@/infrastructure/services/authentication-service'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
    AuthenticationService
  )
}

export const AuthenticationModule = new ContainerModule(initializeModule)
