import { ContainerModule, interfaces } from 'inversify'

import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { AuthenticationService } from '@/infrastructure/services/authentication-service'

import { DI_TYPES } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<IAuthenticationService>(DI_TYPES.AuthenticationService).toDynamicValue(
    () => new AuthenticationService()
  )
}

export const AuthenticationModule = new ContainerModule(initializeModule)
