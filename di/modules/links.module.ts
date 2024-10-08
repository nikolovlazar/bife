import { ContainerModule, interfaces } from 'inversify'

import { ILinksRepository } from '@/application/repositories/links-repository.interface'

import { LinksRepository } from '@/infrastructure/repositories/links-repository'
import { MockLinksRepository } from '@/infrastructure/repositories/links-repository.mock'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === 'test') {
    bind<ILinksRepository>(DI_SYMBOLS.ILinksRepository).to(MockLinksRepository)
  } else {
    bind<ILinksRepository>(DI_SYMBOLS.ILinksRepository).to(LinksRepository)
  }
}

export const LinksModule = new ContainerModule(initializeModule)
